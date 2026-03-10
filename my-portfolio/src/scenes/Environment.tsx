import { useRef } from "react";
import { Sky, Stars, Cloud } from "@react-three/drei";
import * as THREE from "three";

export default function Environment() {
  const sunRef = useRef<THREE.DirectionalLight>(null);

  return (
    <>
      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0.6}
        azimuth={0.25}
        turbidity={8}
        rayleigh={0.5}
      />

      {/* Stars visible at horizon */}
      <Stars radius={200} depth={60} count={3000} factor={4} fade speed={0.3} />

      {/* Clouds */}
      <Cloud position={[-20, 18, -30]} speed={0.1} opacity={0.4} scale={1.5} />
      <Cloud position={[30, 22, -50]} speed={0.08} opacity={0.3} scale={2} />
      <Cloud position={[10, 20, 40]} speed={0.12} opacity={0.35} scale={1.2} />

      {/* Lighting */}
      <ambientLight intensity={0.5} color="#b8d4f0" />
      <directionalLight
        ref={sunRef}
        position={[50, 80, 30]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={200}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        color="#fff5e0"
      />
      <hemisphereLight args={["#87CEEB", "#4a7c59", 0.4]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[200, 200, 40, 40]} />
        <meshStandardMaterial color="#3a7d44" roughness={0.95} metalness={0} />
      </mesh>

      {/* Roads */}
      <Roads />

      {/* Decorative trees */}
      <Trees />
      <Trees />
      <Trees />

      {/* Decorative buildings far away */}
      <BackgroundForest />
    </>
  );
}

const forestData = Array.from({ length: 150 }).map(() => {
  const sideX = Math.random() > 0.5 ? 1 : -1;
  const sideZ = Math.random() > 0.5 ? 1 : -1;
  
  // Trees are usually thinner and shorter than buildings
  const treeHeight = 3 + Math.random() * 4; 
  const treeColor = Math.random() > 0.5 ? "#2d6a4f" : "#40916c";

  return {
    pos: [
      (15 + Math.random() * 120) * sideX, // X
      0,                                  // Y (Base of the trunk)
      (15 + Math.random() * 120) * sideZ  // Z
    ] as [number, number, number],
    height: treeHeight,
    color: treeColor,
  };
});

function Roads() {
  return (
    <group>
      {/* Main cross road - X axis */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[200, 8]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.9} />
      </mesh>
      {/* Main cross road - Z axis */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[8, 200]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.9} />
      </mesh>
      {/* Road markings - dashes on X road */}
      {[-40, -20, 0, 20, 40].map((x, i) => (
        <mesh key={`rx-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, 0]}>
          <planeGeometry args={[3.5, 0.3]} />
          <meshStandardMaterial color="#f5f5dc" />
        </mesh>
      ))}
      {/* Road markings - dashes on Z road */}
      {[-40, -20, 0, 20, 40].map((z, i) => (
        <mesh key={`rz-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, z]}>
          <planeGeometry args={[0.3, 3.5]} />
          <meshStandardMaterial color="#f5f5dc" />
        </mesh>
      ))}
    </group>
  );
}

function Trees() {
  const positions: [number, number, number][] = [
    [-15, 0, -15], [15, 0, -15], [-15, 0, 15], [15, 0, 15],
    [-25, 0, 5], [25, 0, -8], [-8, 0, 30], [20, 0, 28],
    [-30, 0, -20], [30, 0, 20], [-35, 0, 10], [35, 0, -12],
    [-12, 0, -35], [18, 0, -32], [-28, 0, 35], [32, 0, 30],
  ];

  return (
    <group>
      {positions.map(([x, y, z], i) => {
        const height = 2.5 + Math.sin(i * 3.7) * 1.2;
        const color = i % 3 === 0 ? "#2d6a4f" : i % 3 === 1 ? "#40916c" : "#52b788";
        return (
          <group key={i} position={[x, y, z]}>
            {/* Trunk */}
            <mesh position={[0, height * 0.3, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.18, height * 0.6, 6]} />
              <meshStandardMaterial color="#6b3f1f" roughness={1} />
            </mesh>
            {/* Foliage layers */}
            <mesh position={[0, height * 0.75, 0]} castShadow>
              <coneGeometry args={[0.9, height * 0.6, 7]} />
              <meshStandardMaterial color={color} roughness={0.9} />
            </mesh>
            <mesh position={[0, height * 0.95, 0]} castShadow>
              <coneGeometry args={[0.65, height * 0.45, 7]} />
              <meshStandardMaterial color={color} roughness={0.9} />
            </mesh>
            <mesh position={[0, height * 1.12, 0]} castShadow>
              <coneGeometry args={[0.4, height * 0.3, 7]} />
              <meshStandardMaterial color={color} roughness={0.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function BackgroundForest() {
  return (
    <group>
      {forestData.map((tree, i) => (
        <group key={i} position={tree.pos}>
          {/* Trunk */}
          <mesh position={[0, tree.height * 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.15, tree.height * 0.6, 6]} />
            <meshStandardMaterial color="#5d4037" roughness={1} />
          </mesh>

          {/* Foliage (3 Layers) */}
          <mesh position={[0, tree.height * 0.75, 0]} castShadow>
            <coneGeometry args={[0.8, tree.height * 0.7, 7]} />
            <meshStandardMaterial color={tree.color} flatShading />
          </mesh>
          <mesh position={[0, tree.height * 1.0, 0]} castShadow>
            <coneGeometry args={[0.6, tree.height * 0.5, 7]} />
            <meshStandardMaterial color={tree.color} flatShading />
          </mesh>
          <mesh position={[0, tree.height * 1.2, 0]} castShadow>
            <coneGeometry args={[0.4, tree.height * 0.4, 7]} />
            <meshStandardMaterial color={tree.color} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

