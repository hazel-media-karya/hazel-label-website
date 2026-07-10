"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type FitPreference = "slim" | "regular" | "relaxed";
type ViewMode = "front" | "side" | "back";

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

function createTorsoGeometry(
  shoulderWidth: number,
  waistWidth: number,
  height: number,
  depth: number
) {
  const topY = height / 2;
  const bottomY = -height / 2;
  const frontZ = depth / 2;
  const backZ = -depth / 2;

  const vertices = new Float32Array([
    -shoulderWidth / 2, topY, frontZ,
    shoulderWidth / 2, topY, frontZ,
    waistWidth / 2, bottomY, frontZ,
    -waistWidth / 2, bottomY, frontZ,

    -shoulderWidth / 2, topY, backZ,
    shoulderWidth / 2, topY, backZ,
    waistWidth / 2, bottomY, backZ,
    -waistWidth / 2, bottomY, backZ,
  ]);

  const indices = [
    0, 1, 2, 0, 2, 3,
    5, 4, 7, 5, 7, 6,
    4, 0, 3, 4, 3, 7,
    1, 5, 6, 1, 6, 2,
    4, 5, 1, 4, 1, 0,
    3, 2, 6, 3, 6, 7,
  ];

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

function makeLabel(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.roundRect(8, 18, 496, 92, 24);
  ctx.fill();

  ctx.strokeStyle = "rgba(216,179,109,0.7)";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#f1d7a2";
  ctx.font = "bold 34px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.55, 0.38, 1);

  return sprite;
}

function addLine(
  group: THREE.Group,
  start: THREE.Vector3,
  end: THREE.Vector3,
  color = "#d8b36d"
) {
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const material = new THREE.LineBasicMaterial({ color });
  const line = new THREE.Line(geometry, material);
  group.add(line);
}

export default function LowPolyBodyAvatar({
  body,
  fit,
  recommendedSize,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [view, setView] = useState<ViewMode>("front");

  const dimensions = useMemo(() => {
    const chest = toNumber(body.chest);
    const waist = toNumber(body.waist);
    const backLength = toNumber(body.backLength);
    const frontLength = toNumber(body.frontLength);
    const sleeveLength = toNumber(body.sleeveLength);
    const armCircumference = toNumber(body.armCircumference);
    const neck = toNumber(body.neck);
    const pocketLength = toNumber(body.pocketLength);

    const fitEase = fit === "slim" ? 1.02 : fit === "relaxed" ? 1.14 : 1.08;

    return {
      chestWidth: clamp((chest / 100) * 2.15 * fitEase, 1.55, 2.75),
      waistWidth: clamp((waist / 100) * 1.92 * fitEase, 1.25, 2.45),
      torsoHeight: clamp((backLength / 64) * 3.05, 2.45, 3.65),
      frontLength: clamp((frontLength / 58) * 2.85, 2.2, 3.45),
      sleeveLength: clamp((sleeveLength / 24) * 1.25, 0.8, 1.75),
      armRadius: clamp((armCircumference / 30) * 0.18, 0.13, 0.3),
      neckRadius: clamp((neck / 38) * 0.24, 0.18, 0.32),
      pocketHeight: clamp((pocketLength / 18) * 0.5, 0.32, 0.78),
      chest,
      waist,
      neck,
      sleeveLengthRaw: sleeveLength,
      pocketLength,
    };
  }, [body, fit]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#030303");

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.2, 8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const ambientLight = new THREE.AmbientLight("#ffffff", 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#ffffff", 2.2);
    keyLight.position.set(3, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight("#d8b36d", 1.2);
    rimLight.position.set(-4, 2, -3);
    scene.add(rimLight);

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: "#d8b36d",
      roughness: 0.65,
      metalness: 0.05,
      flatShading: true,
    });

    const jerseyMaterial = new THREE.MeshStandardMaterial({
      color: "#171717",
      roughness: 0.55,
      metalness: 0.08,
      flatShading: true,
    });

    const darkMaterial = new THREE.MeshStandardMaterial({
      color: "#202026",
      roughness: 0.7,
      metalness: 0.04,
      flatShading: true,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: "#d8b36d",
      roughness: 0.55,
      metalness: 0.12,
      flatShading: true,
    });

    const torsoGeometry = createTorsoGeometry(
      dimensions.chestWidth,
      dimensions.waistWidth,
      dimensions.torsoHeight,
      0.75
    );

    const torso = new THREE.Mesh(torsoGeometry, jerseyMaterial);
    torso.position.y = 0;
    group.add(torso);

    const torsoEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(torsoGeometry),
      new THREE.LineBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.22,
      })
    );
    group.add(torsoEdges);

    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(
        dimensions.neckRadius,
        dimensions.neckRadius * 0.9,
        0.42,
        8
      ),
      bodyMaterial
    );
    neck.position.y = dimensions.torsoHeight / 2 + 0.16;
    group.add(neck);

    const head = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.48, 0),
      bodyMaterial
    );
    head.position.y = dimensions.torsoHeight / 2 + 0.82;
    group.add(head);

    const shoulderBar = new THREE.Mesh(
      new THREE.BoxGeometry(dimensions.chestWidth + 0.35, 0.18, 0.82, 1, 1, 1),
      darkMaterial
    );
    shoulderBar.position.y = dimensions.torsoHeight / 2 - 0.08;
    group.add(shoulderBar);

    const leftArm = new THREE.Mesh(
      new THREE.CylinderGeometry(
        dimensions.armRadius,
        dimensions.armRadius * 0.9,
        dimensions.sleeveLength,
        8
      ),
      darkMaterial
    );
    leftArm.rotation.z = -0.28;
    leftArm.position.set(
      -(dimensions.chestWidth / 2 + dimensions.armRadius + 0.12),
      dimensions.torsoHeight / 2 - dimensions.sleeveLength / 2 - 0.18,
      0
    );
    group.add(leftArm);

    const rightArm = new THREE.Mesh(
      new THREE.CylinderGeometry(
        dimensions.armRadius,
        dimensions.armRadius * 0.9,
        dimensions.sleeveLength,
        8
      ),
      darkMaterial
    );
    rightArm.rotation.z = 0.28;
    rightArm.position.set(
      dimensions.chestWidth / 2 + dimensions.armRadius + 0.12,
      dimensions.torsoHeight / 2 - dimensions.sleeveLength / 2 - 0.18,
      0
    );
    group.add(rightArm);

    const leftSleeve = new THREE.Mesh(
      new THREE.CylinderGeometry(
        dimensions.armRadius * 1.08,
        dimensions.armRadius,
        dimensions.sleeveLength * 0.55,
        8
      ),
      jerseyMaterial
    );
    leftSleeve.rotation.z = -0.28;
    leftSleeve.position.copy(leftArm.position);
    leftSleeve.position.y += dimensions.sleeveLength * 0.18;
    group.add(leftSleeve);

    const rightSleeve = new THREE.Mesh(
      new THREE.CylinderGeometry(
        dimensions.armRadius * 1.08,
        dimensions.armRadius,
        dimensions.sleeveLength * 0.55,
        8
      ),
      jerseyMaterial
    );
    rightSleeve.rotation.z = 0.28;
    rightSleeve.position.copy(rightArm.position);
    rightSleeve.position.y += dimensions.sleeveLength * 0.18;
    group.add(rightSleeve);

    const pocket = new THREE.Mesh(
      new THREE.BoxGeometry(
        Math.max(0.8, dimensions.waistWidth * 0.72),
        dimensions.pocketHeight,
        0.08
      ),
      goldMaterial
    );
    pocket.position.set(0, -dimensions.torsoHeight / 2 + 0.48, -0.43);
    group.add(pocket);

    const frontPanel = new THREE.Mesh(
      new THREE.BoxGeometry(dimensions.chestWidth * 0.34, dimensions.frontLength, 0.04),
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.08,
        roughness: 0.8,
        flatShading: true,
      })
    );
    frontPanel.position.set(0, -0.15, 0.405);
    group.add(frontPanel);

    addLine(
      group,
      new THREE.Vector3(-dimensions.chestWidth / 2, 0.62, 0.52),
      new THREE.Vector3(dimensions.chestWidth / 2, 0.62, 0.52)
    );

    addLine(
      group,
      new THREE.Vector3(-dimensions.waistWidth / 2, -1.05, 0.52),
      new THREE.Vector3(dimensions.waistWidth / 2, -1.05, 0.52)
    );

    addLine(
      group,
      new THREE.Vector3(dimensions.chestWidth / 2 + 0.55, dimensions.torsoHeight / 2, 0.12),
      new THREE.Vector3(dimensions.chestWidth / 2 + 0.55, -dimensions.torsoHeight / 2, 0.12)
    );

    const chestLabel = makeLabel(`Dada ${dimensions.chest} cm`);
    if (chestLabel) {
      chestLabel.position.set(0, 0.95, 0.9);
      group.add(chestLabel);
    }

    const waistLabel = makeLabel(`Perut ${dimensions.waist} cm`);
    if (waistLabel) {
      waistLabel.position.set(0, -1.35, 0.9);
      group.add(waistLabel);
    }

    const sizeLabel = makeLabel(`Size ${recommendedSize}`);
    if (sizeLabel) {
      sizeLabel.position.set(0, -2.25, 0.9);
      sizeLabel.scale.set(1.35, 0.34, 1);
      group.add(sizeLabel);
    }

    group.position.y = -0.15;

    const targetRotation =
      view === "front" ? 0 : view === "side" ? -Math.PI / 2 : Math.PI;

    function resize() {
      const currentMount = mountRef.current;

      if (!currentMount) {
        return;
      }

      const width = currentMount.clientWidth || 600;
      const height = currentMount.clientHeight || 520;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    let animationFrame = 0;

    function animate() {
      group.rotation.y += (targetRotation - group.rotation.y) * 0.08;
      group.rotation.x = -0.04;

      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Line) {
          object.geometry.dispose();

          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }

        if (object instanceof THREE.Sprite) {
          if (object.material.map) {
            object.material.map.dispose();
          }
          object.material.dispose();
        }
      });

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [dimensions, view, recommendedSize]);

  return (
    <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-black/60">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <p className="text-xs uppercase tracking-[0.3em] text-[#d8b36d]">
          Low-Poly 3D Avatar
        </p>

        <div className="flex gap-2">
          {(["front", "side", "back"] as ViewMode[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setView(item)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize transition ${
                view === item
                  ? "border-[#d8b36d] bg-[#d8b36d] text-black"
                  : "border-white/15 text-zinc-300 hover:bg-white/10"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div ref={mountRef} className="h-[560px] w-full" />
    </div>
  );
}
