"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

type FitPreference = "slim" | "regular" | "relaxed";

type BodyMeasurements = {
  height: string;
  weight: string;
  chest: string;
  waist: string;
  frontLength: string;
  armCircumference: string;
  sleeveLength: string;
  neck: string;
  backLength: string;
  pocketLength: string;
};

type Props = {
  body: BodyMeasurements;
  fit: FitPreference;
  recommendedSize: string;
};

type AvatarDimensions = {
  height: number;
  weight: number;
  chest: number;
  waist: number;
  neck: number;
  arm: number;
  sleeve: number;
  heightScale: number;
  massScale: number;
  chestScale: number;
  waistScale: number;
  neckScale: number;
  armScale: number;
  sleeveScale: number;
  torsoScale: number;
  bodyWidthScale: number;
};

type OriginalTransform = {
  scale: THREE.Vector3;
  position: THREE.Vector3;
};

const BASE_MODEL_SCALE = 2.15;

function toNumber(value: string) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getObjectPath(object: THREE.Object3D) {
  const names: string[] = [];
  let current: THREE.Object3D | null = object;

  while (current) {
    if (current.name) names.push(current.name);
    current = current.parent;
  }

  return normalizeName(names.join("-"));
}

function includesAny(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

function captureOriginalTransforms(
  object: THREE.Object3D,
  originals: Map<string, OriginalTransform>
) {
  object.traverse((child) => {
    originals.set(child.uuid, {
      scale: child.scale.clone(),
      position: child.position.clone(),
    });
  });
}

function getMorphAmount(value: number, baseline: number, maxValue: number) {
  if (!Number.isFinite(value)) return 0;
  return clamp((value - baseline) / (maxValue - baseline), 0, 1);
}

function getBodyMassAmount(heightCm: number, weightKg: number) {
  const heightM = heightCm / 100;
  if (!heightM || !weightKg) return 0;

  const bmi = weightKg / (heightM * heightM);

  return clamp((bmi - 20) / (32 - 20), 0, 1);
}

function getBellyDominance(chest: number, waist: number) {
  if (!Number.isFinite(chest) || !Number.isFinite(waist)) return 0;

  // Jika perut lebih besar dari dada:
  // selisih 10 cm = mulai buncit
  // selisih 25 cm ke atas = buncit kuat
  return clamp((waist - chest) / 25, 0, 1);
}









function applyMorphTargets(mesh: THREE.Mesh, dimensions: AvatarDimensions) {
  if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;

  mesh.morphTargetInfluences.fill(0);

  const bodyMass = getBodyMassAmount(dimensions.height, dimensions.weight);
  const bellyDominance = getBellyDominance(dimensions.chest, dimensions.waist);

  const chestFromMeasure = getMorphAmount(dimensions.chest, 86, 112);
  const bellyFromMeasure = getMorphAmount(dimensions.waist, 74, 112);
  const armFromMeasure = getMorphAmount(dimensions.arm, 26, 42);
  const neckFromMeasure = getMorphAmount(dimensions.neck, 34, 46);

  const chestAmount = clamp(Math.max(chestFromMeasure * 0.85, bodyMass * 0.25), 0, 1);

  // Kunci revisi:
  // kalau waist > chest, belly dipaksa dominan.
  // Angka bisa sampai 1.25 agar shape key belly terasa lebih keluar.
  const bellyAmount = clamp(
    Math.max(
      bellyFromMeasure * 0.45,
      bellyDominance * 1.25,
      bodyMass * 0.35
    ),
    0,
    1.25
  );

  const armAmount = clamp(Math.max(armFromMeasure * 0.80, bodyMass * 0.25), 0, 1);
  const neckAmount = clamp(Math.max(neckFromMeasure * 0.65, bodyMass * 0.15), 0, 1);
  const bodyMassAmount = clamp(bodyMass * 0.80, 0, 1);

  Object.entries(mesh.morphTargetDictionary).forEach(([name, index]) => {
    const morphName = normalizeName(name);

    if (includesAny(morphName, ["chest", "dada", "upperbody", "rib"])) {
      mesh.morphTargetInfluences![index] = chestAmount;
    }

    if (includesAny(morphName, ["waist", "perut", "belly", "abdomen", "stomach"])) {
      mesh.morphTargetInfluences![index] = bellyAmount;
    }

    if (includesAny(morphName, ["arm", "lengan", "bicep", "upperarm"])) {
      mesh.morphTargetInfluences![index] = armAmount;
    }

    if (includesAny(morphName, ["neck", "leher"])) {
      mesh.morphTargetInfluences![index] = neckAmount;
    }

    if (includesAny(morphName, ["bodymass", "body_mass", "body", "mass", "weight", "berat"])) {
      mesh.morphTargetInfluences![index] = bodyMassAmount;
    }
  });
}

const BMI_FRONT_SIGN = 1;

function smoothStep(edge0: number, edge1: number, value: number) {
  if (edge0 === edge1) return 1;

  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function bellCurve(value: number, center: number, width: number) {
  const distance = (value - center) / width;
  return Math.exp(-0.5 * distance * distance);
}

function getBmiAmount(heightCm: number, weightKg: number) {
  const heightM = heightCm / 100;
  if (!heightM || !weightKg) return 0;

  const bmi = weightKg / (heightM * heightM);

  // 21 = normal, 35 = sudah harus terlihat besar.
  return clamp((bmi - 21) / (35 - 21), 0, 1);
}

function applyBmiVertexDeformation(mesh: THREE.Mesh, dimensions: AvatarDimensions) {
  const geometry = mesh.geometry as THREE.BufferGeometry;
  const position = geometry.getAttribute("position") as THREE.BufferAttribute | undefined;

  if (!position) return;

  if (!geometry.userData.hazelOriginalPositions) {
    const clonedGeometry = geometry.clone();
    mesh.geometry = clonedGeometry;

    const clonedPosition = clonedGeometry.getAttribute("position") as THREE.BufferAttribute;
    const originalPositions = new Float32Array(clonedPosition.array as ArrayLike<number>);

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let minZ = Infinity;
    let maxZ = -Infinity;

    for (let i = 0; i < clonedPosition.count; i += 1) {
      const x = originalPositions[i * 3];
      const y = originalPositions[i * 3 + 1];
      const z = originalPositions[i * 3 + 2];

      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z);
    }

    clonedGeometry.userData.hazelOriginalPositions = originalPositions;
    clonedGeometry.userData.hazelBounds = {
      minX,
      maxX,
      minY,
      maxY,
      minZ,
      maxZ,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      centerZ: (minZ + maxZ) / 2,
      width: maxX - minX || 1,
      height: maxY - minY || 1,
      depth: maxZ - minZ || 1,
    };
  }

  const activeGeometry = mesh.geometry as THREE.BufferGeometry;
  const activePosition = activeGeometry.getAttribute("position") as THREE.BufferAttribute;
  const originalPositions = activeGeometry.userData.hazelOriginalPositions as Float32Array;
  const bounds = activeGeometry.userData.hazelBounds as {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
    centerX: number;
    centerY: number;
    centerZ: number;
    width: number;
    height: number;
    depth: number;
  };

  const height = dimensions.height || 170;
  const weight = dimensions.weight || 65;
  const mass = getBmiAmount(height, weight);

  // Untuk data 167 cm / 98 kg, mass hampir 1.
  // Jadi torso, perut, paha, dan lengan harus terlihat jauh lebih besar.
  for (let i = 0; i < activePosition.count; i += 1) {
    const ox = originalPositions[i * 3];
    const oy = originalPositions[i * 3 + 1];
    const oz = originalPositions[i * 3 + 2];

    const yNorm = (oy - bounds.minY) / bounds.height;
    const xNorm = (ox - bounds.centerX) / (bounds.width / 2);
    const zNorm = (oz - bounds.centerZ) / (bounds.depth / 2);
    const sideAbs = Math.abs(xNorm);

    let x = ox;
    let y = oy;
    let z = oz;

    // Lock kepala/wajah agar tidak ikut gendut.
    const headLock = yNorm > 0.74;

    if (!headLock) {
      const torsoBand = bellCurve(yNorm, 0.52, 0.16);
      const bellyBand = bellCurve(yNorm, 0.43, 0.11);
      const hipBand = bellCurve(yNorm, 0.33, 0.10);
      const thighBand = bellCurve(yNorm, 0.20, 0.11);
      const armBand =
        smoothStep(0.36, 0.48, yNorm) *
        (1 - smoothStep(0.68, 0.78, yNorm)) *
        smoothStep(0.38, 0.72, sideAbs);

      // Global body mass, tapi hanya area badan.
      const bodyWidthScale =
        1 +
        mass *
          (
            torsoBand * 0.28 +
            bellyBand * 0.36 +
            hipBand * 0.22 +
            thighBand * 0.16 +
            armBand * 0.20
          );

      const bodyDepthScale =
        1 +
        mass *
          (
            torsoBand * 0.30 +
            bellyBand * 0.58 +
            hipBand * 0.22 +
            thighBand * 0.12 +
            armBand * 0.14
          );

      x = bounds.centerX + (x - bounds.centerX) * bodyWidthScale;
      z = bounds.centerZ + (z - bounds.centerZ) * bodyDepthScale;

      // Dorong perut ke depan supaya tidak hanya melebar.
      const frontMask = clamp((BMI_FRONT_SIGN * zNorm + 0.2) / 1.2, 0, 1);
      const bellyForward = mass * bellyBand * frontMask * bounds.depth * 0.28;
      z += BMI_FRONT_SIGN * bellyForward;

      // Sedikit isi ke pinggang bawah/paha.
      const lowerBodyWidth = mass * (hipBand * 0.10 + thighBand * 0.10);
      x = bounds.centerX + (x - bounds.centerX) * (1 + lowerBodyWidth);
    }

    activePosition.setXYZ(i, x, y, z);
  }

  activePosition.needsUpdate = true;
  activeGeometry.computeVertexNormals();
  activeGeometry.computeBoundingSphere();
}

function applyMeasurementTransforms(
  object: THREE.Object3D,
  originalsOrDimensions: unknown,
  maybeDimensions?: AvatarDimensions
) {
  const dimensions = (maybeDimensions ?? originalsOrDimensions) as AvatarDimensions;

  if (!object.userData.baseScale) {
    object.userData.baseScale = object.scale.clone();
  }

  const baseScale = object.userData.baseScale as THREE.Vector3;

  const height = dimensions.height || 170;

  // Tinggi tetap scale vertikal.
  const heightScale = clamp(height / 170, 0.78, 1.22);

  // Lebar/tebal tubuh tidak lagi hanya global scale.
  // Body mass sekarang dibentuk langsung pada vertex area torso, belly, hip, thigh, arm.
  object.scale.set(
    baseScale.x,
    baseScale.y * heightScale,
    baseScale.z
  );

  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      applyBmiVertexDeformation(child, dimensions);
    }
  });
}

function fitCameraToModel(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  model: THREE.Object3D
) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const distance = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 0.68;

  const targetY = center.y + size.y * 0.12;

  camera.position.set(center.x, targetY, center.z + distance);
  camera.near = 0.01;
  camera.far = Math.max(100, distance * 12);
  camera.updateProjectionMatrix();

  controls.target.set(center.x, targetY, center.z);
  controls.minDistance = Math.max(0.65, distance * 0.42);
  controls.maxDistance = Math.max(4.5, distance * 2.4);
  controls.update();
}

export default function GLBBodyAvatar({ body, fit, recommendedSize }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<THREE.Object3D | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const originalsRef = useRef<Map<string, OriginalTransform>>(new Map());

  const [renderError, setRenderError] = useState("");

  const dimensions = useMemo<AvatarDimensions>(() => {
    const height = toNumber(body.height);
    const weight = toNumber(body.weight);
    const chest = toNumber(body.chest);
    const waist = toNumber(body.waist);
    const neck = toNumber(body.neck);
    const arm = toNumber(body.armCircumference);
    const sleeve = toNumber(body.sleeveLength);
    const backLength = toNumber(body.backLength);

    const fitEase = fit === "slim" ? 0.98 : fit === "relaxed" ? 1.06 : 1.02;
    const bmi =
      height > 0 && weight > 0 ? weight / Math.pow(height / 100, 2) : 22;

    // Natural mannequin scaling:
    // jangan terlalu ekstrem agar model tidak terlihat gepeng/stretching.
    const heightScale = clamp(height / 170, 0.92, 1.1);
    const massScale = clamp(1 + (bmi - 22) * 0.012, 0.92, 1.16);
    const chestScale = clamp((chest / 92) * fitEase, 0.9, 1.14);
    const waistScale = clamp((waist / 82) * fitEase, 0.9, 1.16);
    const neckScale = clamp(neck / 38, 0.9, 1.12);
    const armScale = clamp(arm / 30, 0.9, 1.15);
    const sleeveScale = clamp(sleeve / 24, 0.9, 1.14);
    const torsoScale = clamp(backLength / 64, 0.94, 1.1);

    const bodyWidthScale = clamp(
      massScale,
      0.92,
      1.16
    );

    return {
      height,
      weight,
      chest,
      waist,
      neck,
      arm,
      sleeve,
      heightScale,
      massScale,
      chestScale,
      waistScale,
      neckScale,
      armScale,
      sleeveScale,
      torsoScale,
      bodyWidthScale,
    };
  }, [body, fit]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    setRenderError("");
    mount.innerHTML = "";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030303");

    const width = mount.clientWidth || 720;
    const height = mount.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 3.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("contextmenu", (event) =>
      event.preventDefault()
    );
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 0.75;
    controls.maxDistance = 4.5;
    controls.target.set(0, 1.05, 0);
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight("#ffffff", 1.4));

    const keyLight = new THREE.DirectionalLight("#ffffff", 2.4);
    keyLight.position.set(3, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight("#d8b36d", 1.6);
    rimLight.position.set(-4, 2.5, -4);
    scene.add(rimLight);

    const grid = new THREE.GridHelper(6, 12, "#d8b36d", "#2a2a2a");
    grid.position.y = -1.65;
    const gridMaterial = grid.material as THREE.Material;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.18;
    scene.add(grid);

    const avatarRoot = new THREE.Group();
    scene.add(avatarRoot);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    let frame = 0;

    loader.load(
      "/models/hazel-mannequin-lowpoly.glb",
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -1.15, 0);

        model.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;

          object.castShadow = false;
          object.receiveShadow = false;

          const material = object.material;

          if (Array.isArray(material)) {
            material.forEach((item) => {
              item.side = THREE.DoubleSide;
              item.needsUpdate = true;
            });
          } else {
            material.side = THREE.DoubleSide;
            material.needsUpdate = true;
          }
        });

        originalsRef.current.clear();
        captureOriginalTransforms(model, originalsRef.current);

        modelRef.current = model;
        applyMeasurementTransforms(model, originalsRef.current, dimensions);

        avatarRoot.add(model);

        if (cameraRef.current && controlsRef.current) {
          fitCameraToModel(cameraRef.current, controlsRef.current, model);
        }
      },
      undefined,
      () => {
        setRenderError(
          "File /public/models/hazel-mannequin-lowpoly.glb belum ditemukan atau gagal dibaca."
        );
      }
    );

    const resizeObserver = new ResizeObserver(() => {
      const currentMount = mountRef.current;
      if (!currentMount) return;

      const newWidth = currentMount.clientWidth || 720;
      const newHeight = currentMount.clientHeight || 480;

      renderer.setSize(newWidth, newHeight, false);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    });

    resizeObserver.observe(mount);

    function animate() {
      controls.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      controls.dispose();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
          object.geometry.dispose();

          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();

      modelRef.current = null;
      controlsRef.current = null;
      cameraRef.current = null;
      originalsRef.current.clear();

      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    const model = modelRef.current;
    const controls = controlsRef.current;
    const camera = cameraRef.current;

    if (!model || !controls || !camera) return;

    applyMeasurementTransforms(model, originalsRef.current, dimensions);
    fitCameraToModel(camera, controls, model);
  }, [dimensions]);

  return (
    <div className="mt-4 overflow-hidden rounded-[28px] border border-white/10 bg-black/60">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#d8b36d]">
            Human Mannequin GLB
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">
            Drag to rotate · Scroll to zoom · Body follows measurement input
          </p>
        </div>

        <div className="rounded-full border border-[#d8b36d]/40 bg-[#d8b36d]/10 px-4 py-2 text-xs font-semibold text-[#f1d7a2]">
          Size {recommendedSize}
        </div>
      </div>

      <div className="relative">
        <div ref={mountRef} className="h-[480px] w-full" />

        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-xs leading-6 text-zinc-300">
          <p>Tinggi: {dimensions.height} cm</p>
          <p>Berat: {dimensions.weight} kg</p>
          <p>Dada: {dimensions.chest} cm</p>
          <p>Perut: {dimensions.waist} cm</p>
          <p>Leher: {dimensions.neck} cm</p>
          <p>Lengan: {dimensions.arm} cm</p>
          <p>Size: {recommendedSize}</p>
        </div>

        {renderError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/85 p-8 text-center text-sm leading-7 text-[#f1d7a2]">
            {renderError}
          </div>
        ) : null}
      </div>
    </div>
  );
}
