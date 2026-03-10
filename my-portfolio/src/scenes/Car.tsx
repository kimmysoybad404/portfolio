import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface CarProps {
  onPositionChange?: (position: THREE.Vector3, rotation: number) => void;
  onNearTopic?: (topicId: string | null) => void;
  topicZones?: { id: string; position: [number, number, number]; radius: number }[];
}

export default function Car({ onPositionChange, onNearTopic, topicZones = [] }: CarProps) {
  const carRef = useRef<THREE.Group>(null);
  const keys = useRef<Record<string, boolean>>({});
  const velocity = useRef(0);
  const rotation = useRef(0);
  const nearTopic = useRef<string | null>(null);

  // Try to load GLB, fallback to box car
  let gltf: any = null;
  try {
    gltf = useGLTF("/Models/sedan-sports.glb");
  } catch {}

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      e.preventDefault();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!carRef.current) return;

    const maxSpeed = 12;
    const acceleration = 15;
    const friction = 8;
    const turnSpeed = 2.2;

    const forward =
      keys.current["ArrowUp"] || keys.current["KeyW"];
    const backward =
      keys.current["ArrowDown"] || keys.current["KeyS"];
    const left =
      keys.current["ArrowLeft"] || keys.current["KeyA"];
    const right =
      keys.current["ArrowRight"] || keys.current["KeyD"];

    if (forward) {
      velocity.current = Math.min(velocity.current + acceleration * delta, maxSpeed);
    } else if (backward) {
      velocity.current = Math.max(velocity.current - acceleration * delta, -maxSpeed * 0.5);
    } else {
      velocity.current *= 1 - friction * delta;
      if (Math.abs(velocity.current) < 0.01) velocity.current = 0;
    }

    if (Math.abs(velocity.current) > 0.1) {
      const turnDir = velocity.current > 0 ? 1 : -1;
      if (left) rotation.current += turnSpeed * delta * turnDir;
      if (right) rotation.current -= turnSpeed * delta * turnDir;
    }

    carRef.current.rotation.y = rotation.current;

    const moveX = Math.sin(rotation.current) * velocity.current * delta;
    const moveZ = Math.cos(rotation.current) * velocity.current * delta;

    const newX = carRef.current.position.x + moveX;
    const newZ = carRef.current.position.z + moveZ;

    // World boundary
    const boundary = 45;
    carRef.current.position.x = Math.max(-boundary, Math.min(boundary, newX));
    carRef.current.position.z = Math.max(-boundary, Math.min(boundary, newZ));

    // Camera follow
    const idealOffset = new THREE.Vector3(
      -Math.sin(rotation.current) * 8,
      4,
      -Math.cos(rotation.current) * 8
    );
    const idealPosition = carRef.current.position.clone().add(idealOffset);
    state.camera.position.lerp(idealPosition, 0.08);
    state.camera.lookAt(
      carRef.current.position.x,
      carRef.current.position.y + 1,
      carRef.current.position.z
    );

    // Report position
    if (onPositionChange) {
      onPositionChange(carRef.current.position.clone(), rotation.current);
    }

    // Check topic proximity
    let foundTopic: string | null = null;
    for (const zone of topicZones) {
      const dx = carRef.current.position.x - zone.position[0];
      const dz = carRef.current.position.z - zone.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < zone.radius) {
        foundTopic = zone.id;
        break;
      }
    }
    if (foundTopic !== nearTopic.current) {
      nearTopic.current = foundTopic;
      onNearTopic?.(foundTopic);
    }
  });

  return (
    <group ref={carRef} position={[0, 0.3, 0]}>
      {gltf ? (
        <primitive object={gltf.scene} scale={[0.6, 0.6, 0.6]} />
      ) : (
        // Fallback box car
        <group>
          {/* Body */}
          <mesh position={[0, 0.35, 0]} castShadow>
            <boxGeometry args={[1.8, 0.55, 4]} />
            <meshStandardMaterial color="#e63946" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Cabin */}
          <mesh position={[0, 0.82, -0.2]} castShadow>
            <boxGeometry args={[1.5, 0.5, 2.2]} />
            <meshStandardMaterial color="#c1121f" metalness={0.4} roughness={0.4} />
          </mesh>
          {/* Windows */}
          <mesh position={[0, 0.86, 0.72]}>
            <boxGeometry args={[1.3, 0.35, 0.05]} />
            <meshStandardMaterial color="#90e0ef" transparent opacity={0.6} metalness={0.1} roughness={0} />
          </mesh>
          <mesh position={[0, 0.86, -1.12]}>
            <boxGeometry args={[1.3, 0.35, 0.05]} />
            <meshStandardMaterial color="#90e0ef" transparent opacity={0.6} metalness={0.1} roughness={0} />
          </mesh>
          {/* Wheels */}
          {[[-0.95, 0, 1.2], [0.95, 0, 1.2], [-0.95, 0, -1.2], [0.95, 0, -1.2]].map(([x, y, z], i) => (
            <mesh key={i} position={[x, y, z] as [number,number,number]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
              <meshStandardMaterial color="#1a1a2e" metalness={0.2} roughness={0.9} />
            </mesh>
          ))}
          {/* Headlights */}
          <mesh position={[0.55, 0.35, 2.01]}>
            <boxGeometry args={[0.3, 0.15, 0.05]} />
            <meshStandardMaterial color="#ffd60a" emissive="#ffd60a" emissiveIntensity={1} />
          </mesh>
          <mesh position={[-0.55, 0.35, 2.01]}>
            <boxGeometry args={[0.3, 0.15, 0.05]} />
            <meshStandardMaterial color="#ffd60a" emissive="#ffd60a" emissiveIntensity={1} />
          </mesh>
        </group>
      )}
    </group>
  );
}
