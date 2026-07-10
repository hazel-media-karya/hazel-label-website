"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type FitPreference = "slim" | "regular" | "relaxed";

type BodyMeasurements = {
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

export default function GLBBodyAvatar({ body, fit, recommendedSize }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [renderError, setRenderError] = useState("");

  const dimensions = useMemo(() => {
    const chest = toNumber(body.chest);
    const waist = toNumber(body.waist);
    const neck = toNumber(body.neck);
    const arm = toNumber(body.armCircumference);
    const sleeve = toNumber(body.sleeveLength);
    const backLength = toNumber(body.backLength);

    const fitEase = fit === "slim" ? 1 : fit === "relaxed" ? 1.12 : 1.06;

    return {
      chest,
      waist,
      neck,
      arm,
      sleeve,
      chestScale: clamp((chest / 92) * fitEase, 0.82, 1.35),
      waistScale: clamp((waist / 82) * fitEase, 0.78, 1.32),
      neckScale: clamp(neck / 38, 0.82, 1.25),
      armScale: clamp(arm / 30, 0.78, 1.35),
      sleeveScale: clamp(sleeve / 24, 0.75, 1.35),
      torsoScale: clamp(backLength / 64, 0.85, 1.25),
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
    camera.position.set(0, 1.35, 3.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.cursor = "grab";
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 1.4;
    controls.maxDistance = 6;
    controls.target.set(0, 1.05, 0);

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
    let frame = 0;

    loader.load(
      "/models/hazel-mannequin-lowpoly.glb",
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, -1.15, 0);
        model.scale.setScalar(2.15);

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

          const name = normalizeName(object.name);

          if (name.includes("chest") || name.includes("upperbody")) {
            object.scale.x *= dimensions.chestScale;
            object.scale.z *= dimensions.chestScale;
          }

          if (name.includes("waist") || name.includes("hip") || name.includes("pelvis")) {
            object.scale.x *= dimensions.waistScale;
            object.scale.z *= dimensions.waistScale;
          }

          if (name.includes("torso") || name.includes("body")) {
            object.scale.y *= dimensions.torsoScale;
          }

          if (name.includes("neck")) {
            object.scale.x *= dimensions.neckScale;
            object.scale.z *= dimensions.neckScale;
          }

          if (name.includes("arm")) {
            object.scale.x *= dimensions.armScale;
            object.scale.z *= dimensions.armScale;
            object.scale.y *= dimensions.sleeveScale;
          }

          if (object.morphTargetDictionary && object.morphTargetInfluences) {
            const morphs = object.morphTargetDictionary;

            if (morphs.chest !== undefined) {
              object.morphTargetInfluences[morphs.chest] =
                clamp((dimensions.chestScale - 1) * 1.8, -0.5, 0.8);
            }

            if (morphs.waist !== undefined) {
              object.morphTargetInfluences[morphs.waist] =
                clamp((dimensions.waistScale - 1) * 1.8, -0.5, 0.8);
            }

            if (morphs.arm !== undefined) {
              object.morphTargetInfluences[morphs.arm] =
                clamp((dimensions.armScale - 1) * 1.8, -0.5, 0.8);
            }
          }
        });

        avatarRoot.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = THREE.MathUtils.degToRad(camera.fov);
        const distance = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.18;

        camera.position.set(center.x, center.y + size.y * 0.08, center.z + distance);
        camera.near = 0.01;
        camera.far = Math.max(100, distance * 10);
        camera.updateProjectionMatrix();

        controls.target.set(center.x, center.y + size.y * 0.08, center.z);
        controls.update();
      },
      undefined,
      () => {
        setRenderError(
          "File /public/models/hazel-mannequin-lowpoly.glb belum ditemukan. Upload file GLB mannequin dulu."
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

      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
    };
  }, [dimensions]);

  return (
    <div className="mt-4 overflow-hidden rounded-[28px] border border-white/10 bg-black/60">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#d8b36d]">
            Human Mannequin GLB
          </p>
          <p className="mt-1 text-[11px] text-zinc-500">
            Drag to rotate · Scroll to zoom · Right click disabled
          </p>
        </div>

        <div className="rounded-full border border-[#d8b36d]/40 bg-[#d8b36d]/10 px-4 py-2 text-xs font-semibold text-[#f1d7a2]">
          Size {recommendedSize}
        </div>
      </div>

      <div className="relative">
        <div ref={mountRef} className="h-[480px] w-full" />

        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-xs leading-6 text-zinc-300">
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
