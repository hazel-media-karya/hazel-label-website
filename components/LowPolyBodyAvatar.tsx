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

export default function LowPolyBodyAvatar({
  body,
  fit,
  recommendedSize,
}: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [view, setView] = useState<ViewMode>("front");
  const [renderError, setRenderError] = useState("");

  const dimensions = useMemo(() => {
    const chest = toNumber(body.chest);
    const waist = toNumber(body.waist);
    const backLength = toNumber(body.backLength);
    const sleeveLength = toNumber(body.sleeveLength);
    const armCircumference = toNumber(body.armCircumference);
    const neck = toNumber(body.neck);
    const pocketLength = toNumber(body.pocketLength);

    const ease = fit === "slim" ? 1.0 : fit === "relaxed" ? 1.14 : 1.07;

    return {
      chest,
      waist,
      neck,
      pocketLength,
      chestWidth: clamp((chest / 100) * 2.35 * ease, 1.5, 2.9),
      waistWidth: clamp((waist / 100) * 2.05 * ease, 1.2, 2.6),
      torsoHeight: clamp((backLength / 64) * 3.2, 2.5, 3.8),
      armRadius: clamp((armCircumference / 30) * 0.2, 0.13, 0.32),
      sleeveLength: clamp((sleeveLength / 24) * 1.25, 0.75, 1.8),
      neckRadius: clamp((neck / 38) * 0.24, 0.18, 0.34),
      pocketHeight: clamp((pocketLength / 18) * 0.5, 0.3, 0.8),
    };
  }, [body, fit]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    setRenderError("");
    mount.innerHTML = "";

    let renderer: THREE.WebGLRenderer | null = null;
    let frame = 0;

    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#030303");

      const width = mount.clientWidth || 720;
      const height = mount.clientHeight || 360;

      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 0.8, 7.5);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      mount.appendChild(renderer.domElement);

      const group = new THREE.Group();
      group.position.y = -0.25;
      scene.add(group);

      scene.add(new THREE.AmbientLight("#ffffff", 1.5));

      const keyLight = new THREE.DirectionalLight("#ffffff", 2.4);
      keyLight.position.set(3, 5, 6);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight("#d8b36d", 1.4);
      rimLight.position.set(-4, 2, -5);
      scene.add(rimLight);

      const skinMaterial = new THREE.MeshStandardMaterial({
        color: "#d8b36d",
        roughness: 0.55,
        metalness: 0.06,
        flatShading: true,
      });

      const jerseyMaterial = new THREE.MeshStandardMaterial({
        color: "#171717",
        roughness: 0.7,
        metalness: 0.04,
        flatShading: true,
      });

      const armMaterial = new THREE.MeshStandardMaterial({
        color: "#232329",
        roughness: 0.75,
        metalness: 0.03,
        flatShading: true,
      });

      const pocketMaterial = new THREE.MeshStandardMaterial({
        color: "#d8b36d",
        roughness: 0.6,
        metalness: 0.08,
        flatShading: true,
      });

      const torso = new THREE.Mesh(
        new THREE.BoxGeometry(
          dimensions.chestWidth,
          dimensions.torsoHeight,
          0.75,
          1,
          1,
          1
        ),
        jerseyMaterial
      );
      torso.scale.x = 1;
      group.add(torso);

      const waistTaper = new THREE.Mesh(
        new THREE.BoxGeometry(
          dimensions.waistWidth,
          dimensions.torsoHeight * 0.92,
          0.78,
          1,
          1,
          1
        ),
        jerseyMaterial
      );
      waistTaper.position.y = -0.12;
      waistTaper.scale.y = 1;
      group.add(waistTaper);

      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(
          dimensions.neckRadius,
          dimensions.neckRadius,
          0.38,
          8
        ),
        skinMaterial
      );
      neck.position.y = dimensions.torsoHeight / 2 + 0.15;
      group.add(neck);

      const head = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.48, 0),
        skinMaterial
      );
      head.position.y = dimensions.torsoHeight / 2 + 0.82;
      group.add(head);

      const shoulder = new THREE.Mesh(
        new THREE.BoxGeometry(dimensions.chestWidth + 0.45, 0.18, 0.85),
        armMaterial
      );
      shoulder.position.y = dimensions.torsoHeight / 2 - 0.1;
      group.add(shoulder);

      const leftArm = new THREE.Mesh(
        new THREE.CylinderGeometry(
          dimensions.armRadius,
          dimensions.armRadius * 0.92,
          dimensions.sleeveLength,
          8
        ),
        armMaterial
      );
      leftArm.rotation.z = -0.32;
      leftArm.position.set(
        -dimensions.chestWidth / 2 - 0.32,
        dimensions.torsoHeight / 2 - dimensions.sleeveLength / 2 - 0.22,
        0
      );
      group.add(leftArm);

      const rightArm = leftArm.clone();
      rightArm.rotation.z = 0.32;
      rightArm.position.x = dimensions.chestWidth / 2 + 0.32;
      group.add(rightArm);

      const pocket = new THREE.Mesh(
        new THREE.BoxGeometry(
          Math.max(0.75, dimensions.waistWidth * 0.68),
          dimensions.pocketHeight,
          0.09
        ),
        pocketMaterial
      );
      pocket.position.set(0, -dimensions.torsoHeight / 2 + 0.48, -0.43);
      group.add(pocket);

      const edgeMaterial = new THREE.LineBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 0.24,
      });

      group.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          const edges = new THREE.LineSegments(
            new THREE.EdgesGeometry(object.geometry),
            edgeMaterial
          );
          edges.position.copy(object.position);
          edges.rotation.copy(object.rotation);
          edges.scale.copy(object.scale);
          group.add(edges);
        }
      });

      const targetRotation =
        view === "front" ? 0 : view === "side" ? -Math.PI / 2 : Math.PI;

      const resizeObserver = new ResizeObserver(() => {
        const currentMount = mountRef.current;
        if (!currentMount || !renderer) return;

        const newWidth = currentMount.clientWidth || 720;
        const newHeight = currentMount.clientHeight || 360;

        renderer.setSize(newWidth, newHeight, false);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
      });

      resizeObserver.observe(mount);

      function animate() {
        group.rotation.y += (targetRotation - group.rotation.y) * 0.08;
        group.rotation.x = -0.03;

        renderer?.render(scene, camera);
        frame = requestAnimationFrame(animate);
      }

      animate();

      return () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();

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

        renderer?.dispose();

        if (mountRef.current) {
          mountRef.current.innerHTML = "";
        }
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to render 3D avatar.";
      setRenderError(message);
      console.error("Low-poly avatar render error:", message);
    }
  }, [dimensions, view, recommendedSize]);

  return (
    <div className="mt-4 overflow-hidden rounded-[28px] border border-white/10 bg-black/60">
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

      <div className="relative">
        <div ref={mountRef} className="h-[360px] w-full" />

        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-xs leading-6 text-zinc-300">
          <p>Dada: {dimensions.chest} cm</p>
          <p>Perut: {dimensions.waist} cm</p>
          <p>Leher: {dimensions.neck} cm</p>
          <p>Size: {recommendedSize}</p>
        </div>

        {renderError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-8 text-center text-sm leading-7 text-red-300">
            3D render error: {renderError}
          </div>
        ) : null}
      </div>
    </div>
  );
}
