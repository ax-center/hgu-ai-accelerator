"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

function Coin() {
  const group = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const texture = useLoader(THREE.TextureLoader, "/HGUlogo-cropped.png");
  const motion = useRef({ dragging: false, lastX: 0, lastY: 0, rotX: THREE.MathUtils.degToRad(-8), rotY: THREE.MathUtils.degToRad(20), velocityX: 0, velocityY: 0, parallaxX: 0, parallaxY: 0, resumeAt: 0 });
  const segments = useMemo(() => typeof window !== "undefined" && window.innerWidth < 720 ? 64 : 128, []);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.center.set(.5, .5);
    texture.rotation = Math.PI / 2;
    texture.repeat.set(1, 1);
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
  }, [gl, texture]);

  useEffect(() => {
    const canvas = gl.domElement;
    const state = motion.current;
    const down = (event: PointerEvent) => { state.dragging = true; state.lastX = event.clientX; state.lastY = event.clientY; state.resumeAt = performance.now() + 1800; canvas.setPointerCapture?.(event.pointerId); canvas.style.cursor = "grabbing"; };
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect(); state.parallaxY = ((event.clientX - rect.left) / rect.width - .5) * THREE.MathUtils.degToRad(5); state.parallaxX = ((event.clientY - rect.top) / rect.height - .5) * THREE.MathUtils.degToRad(5);
      if (!state.dragging) return;
      const dx = event.clientX - state.lastX; const dy = event.clientY - state.lastY; state.lastX = event.clientX; state.lastY = event.clientY;
      state.velocityY = dx * .006; state.velocityX = dy * .0035; state.rotY += state.velocityY; state.rotX = THREE.MathUtils.clamp(state.rotX + state.velocityX, -.48, .48); state.resumeAt = performance.now() + 1800;
    };
    const up = (event: PointerEvent) => { state.dragging = false; state.resumeAt = performance.now() + 1800; canvas.releasePointerCapture?.(event.pointerId); canvas.style.cursor = "grab"; };
    const leave = () => { if (!state.dragging) { state.parallaxX = 0; state.parallaxY = 0; } };
    canvas.style.cursor = "grab"; canvas.style.touchAction = "none"; canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move); canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up); canvas.addEventListener("pointerleave", leave);
    return () => { canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up); canvas.removeEventListener("pointerleave", leave); };
  }, [gl]);

  useFrame((_, delta) => {
    const node = group.current; if (!node) return; const state = motion.current; const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!state.dragging) {
      const friction = Math.pow(.91, delta * 60); state.velocityX *= friction; state.velocityY *= friction; state.rotX = THREE.MathUtils.clamp(state.rotX + state.velocityX, -.48, .48); state.rotY += state.velocityY;
      if (!reduced && performance.now() > state.resumeAt && Math.abs(state.velocityY) < .001) state.rotY += delta * .08;
    }
    const ease = 1 - Math.pow(.001, delta); node.rotation.x = THREE.MathUtils.lerp(node.rotation.x, state.rotX + (reduced ? 0 : state.parallaxX), ease); node.rotation.y = THREE.MathUtils.lerp(node.rotation.y, state.rotY + (reduced ? 0 : state.parallaxY), ease);
  });

  return <group ref={group} rotation={[THREE.MathUtils.degToRad(-8), THREE.MathUtils.degToRad(20), 0]}>
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[2, 2, .2, segments, 1, false]} />
      <meshPhysicalMaterial attach="material-0" color="#07366d" metalness={.58} roughness={.3} clearcoat={.45} clearcoatRoughness={.32} />
      <meshPhysicalMaterial attach="material-1" map={texture} transparent alphaTest={.5} metalness={.05} roughness={.5} />
      <meshPhysicalMaterial attach="material-2" map={texture} transparent alphaTest={.5} metalness={.05} roughness={.5} />
    </mesh>
  </group>;
}

export default function HeroCoin() {
  return <div className="hero-coin" aria-label="드래그하여 회전할 수 있는 한동대학교 AI 혁신센터 3D 로고">
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, .15, 9], fov: 38 }} shadows gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <ambientLight intensity={1.15} />
      <hemisphereLight args={["#dceeff", "#071d35", 1.25]} />
      <directionalLight position={[4, 5, 6]} intensity={2.8} color="#ffffff" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 1, 3]} intensity={1.25} color="#4ca7e8" />
      <Coin />
    </Canvas>
    <p>DRAG TO ROTATE</p>
  </div>;
}
