// PortfolioScene.tsx — Solar System Portfolio
// RULE: <Canvas> may only contain Three.js objects (mesh, group, lights, etc.)
// RULE: HTML elements must NEVER appear inside <Canvas>
// RULE: DOM overlays live OUTSIDE <Canvas> as siblings

import { Suspense, useState, useRef, useMemo, type JSX } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';
import { RiLineFill, RiMailFill, RiGithubFill } from 'react-icons/ri';
import { mySkills } from './skills';

// ── Modal content (pure DOM — never touches Canvas) ───────────────────────────
const MODAL_CONTENT: Record<string, JSX.Element> = {
  about: (
    <div>
      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, padding: 4, background: 'rgba(255,107,107,0.07)', borderRadius: 12, border: '1px solid #ff6b6b22' }}>
        {['About Me', 'Education'].map((tab, i) => (
          <button
            key={tab}
            id={`tab-btn-${i}`}
            onClick={() => {
              document.getElementById('tab-about')!.style.display = i === 0 ? 'block' : 'none';
              document.getElementById('tab-edu')!.style.display   = i === 1 ? 'block' : 'none';
              document.querySelectorAll('[id^="tab-btn-"]').forEach((el, j) => {
                const btn = el as HTMLButtonElement;
                btn.style.background = j === i ? '#ff6b6b' : 'transparent';
                btn.style.color      = j === i ? '#ffffff' : '#ff6b6b66';
                btn.style.boxShadow  = j === i ? '0 0 18px #ff6b6b55' : 'none';
              });
            }}
            style={{
              flex: 1,
              background: i === 0 ? '#ff6b6b' : 'transparent',
              border: 'none',
              borderRadius: 9,
              color: i === 0 ? '#ffffff' : '#ff6b6b66',
              cursor: 'pointer',
              fontFamily: "'Orbitron', monospace",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: 2,
              padding: '10px 0',
              transition: 'all 0.2s',
              boxShadow: i === 0 ? '0 0 18px #ff6b6b55' : 'none',
            }}
          >{tab.toUpperCase()}</button>
        ))}
      </div>

      {/* ── Tab: About ── */}
      <div id="tab-about">
        <h2 style={{ color: '#ff6b6b', margin: '0 0 12px' }}>👤 About Me</h2>
        <p style={{ lineHeight: '1.6' }}>
          I am <strong>Kitticheat Suttipipat</strong>, a Computer Engineering student
          passionate about bridging the gap between interactive 3D environments and
          robust backend systems.
        </p>
        <p style={{ color: '#aaa', fontSize: 13, marginTop: 12, lineHeight: '1.5' }}>
          I specialise in <strong>Backend Development</strong> for mobile applications
          and building immersive games using <strong>Unity</strong> and <strong>Roblox Studio</strong>.
          I enjoy solving complex architectural challenges — from Smart Home AI integrations
          to disaster-response SOS systems.
        </p>
        <div style={{ fontSize: 11, color: '#ff6b6b', letterSpacing: 2, fontWeight: 700, margin: '20px 0 10px' }}>TECH STACK</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {mySkills.map(({ name, Icon }) => (
            <span key={name} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#ff6b6b22', border: '1px solid #ff6b6b88',
              borderRadius: 6, padding: '6px 14px', fontSize: 12,
              color: '#ff6b6b', fontWeight: 600,
            }}>
              <Icon style={{ fontSize: '16px', color: '#ff6b6b' }} />
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── Tab: Education (hidden by default) ── */}
      <div id="tab-edu" style={{ display: 'none' }}>
        <h2 style={{ color: '#ff6b6b', margin: '0 0 16px' }}>🎓 Education</h2>

        {/* University */}
        <div style={{ background: '#ff6b6b0e', border: '1px solid #ff6b6b33', borderRadius: 12, padding: '16px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>🎓</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#ff6b6b', fontSize: 14 }}>Mae Fah Luang University</div>
              <div style={{ fontSize: 10, color: '#ff6b6b99', letterSpacing: 2, marginTop: 2 }}>MFU · CHIANG RAI, THAILAND</div>
            </div>
            <span style={{ fontSize: 10, background: '#ffd93d18', border: '1px solid #ffd93d44', borderRadius: 20, padding: '4px 10px', color: '#ffd93d', whiteSpace: 'nowrap' }}>
              Studying
            </span>
          </div>
          <div style={{ height: '1px', background: '#ff6b6b22', margin: '10px 0' }} />
          <div style={{ fontSize: 12, color: '#ccc', marginBottom: 6 }}>
            <span style={{ color: '#ff6b6b88' }}>School of · </span>Applied Digital Technology (ADT)
          </div>
          <div style={{ fontSize: 12, color: '#ccc', marginBottom: 10 }}>
            <span style={{ color: '#ff6b6b88' }}>Bachelor's Degree in · </span>Computer Engineering (CE)
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 11, background: '#ff6b6b18', border: '1px solid #ff6b6b33', borderRadius: 6, padding: '3px 10px', color: '#ff6b6b', fontFamily: 'monospace' }}>2566</span>
            <span style={{ fontSize: 11, color: '#555', alignSelf: 'center' }}>→</span>
            <span style={{ fontSize: 11, background: '#ff6b6b18', border: '1px solid #ff6b6b33', borderRadius: 6, padding: '3px 10px', color: '#ff6b6b', fontFamily: 'monospace' }}>now</span>
          </div>
        </div>

        {/* High School */}
        <div style={{ background: '#4ecdc40a', border: '1px solid #4ecdc422', borderRadius: 12, padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>🏫</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#4ecdc4', fontSize: 14 }}>Visuttharangsi School</div>
              <div style={{ fontSize: 10, color: '#4ecdc488', letterSpacing: 2, marginTop: 2 }}>VS</div>
            </div>
            <span style={{ fontSize: 10, background: '#4ecdc418', border: '1px solid #4ecdc444', borderRadius: 20, padding: '4px 10px', color: '#4ecdc4', whiteSpace: 'nowrap' }}>
              Graduated
            </span>
          </div>
          <div style={{ height: '1px', background: '#4ecdc422', margin: '10px 0' }} />
          <div style={{ fontSize: 12, color: '#ccc', marginBottom: 10 }}>
            <span style={{ color: '#4ecdc488' }}>study plan · </span>Science-Computers (Sci-Com)
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 11, background: '#4ecdc418', border: '1px solid #4ecdc433', borderRadius: 6, padding: '3px 10px', color: '#4ecdc4', fontFamily: 'monospace' }}>Graduated 2565</span>
          </div>
        </div>
      </div>
    </div>
  ),

  projects: (
    <div>
      <h2 style={{ color: '#4ecdc4', margin: '0 0 12px' }}>🚀 Projects</h2>
      {[
        { name: 'SOS Disaster Chatbot', desc: 'A real-time emergency reporting system designed for disaster situations with database integration.', tech: 'Node.js · React · Database Design', link: 'https://github.com/kimmysoybad404/Soschatbotsystem', type: 'GitHub' },
        { name: 'Smart Home AI System', desc: 'Voice-command integrated AI for home automation, focusing on seamless backend connectivity.', tech: 'Python · Backend · IoT', link: 'https://github.com/KitticheatS', type: 'GitHub' },
        { name: '[Beta] Clean The World 🗑️♻️', desc: 'A stylized game focusing on environmental cleanup mechanics and economy systems.', tech: 'Lua · Roblox Studio', link: 'https://www.roblox.com/games/90224023204473/Clean-The-World', type: 'Roblox' },
        { name: 'Detect the Scammer for Brainrots', desc: 'An educational game designed to teach children how to identify and avoid online scammers.', tech: 'Lua · Roblox Studio', link: 'https://www.roblox.com/games/117904033620959/Detect-the-Scammer', type: 'Roblox' },
      ].map(p => (
        <div key={p.name} style={{ background: '#4ecdc411', border: '1px solid #4ecdc433', borderRadius: 12, padding: 14, marginBottom: 12 }}>
          <div style={{ fontWeight: 700, color: '#4ecdc4', fontSize: 16 }}>{p.name}</div>
          <div style={{ fontSize: 13, color: '#ccc', margin: '6px 0' }}>{p.desc}</div>
          <div style={{ fontSize: 11, color: '#4ecdc4', opacity: 0.8, fontFamily: 'monospace', marginBottom: 10 }}>{p.tech}</div>
          <a href={p.link} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-block', fontSize: 11, color: '#fff',
            background: p.type === 'Roblox' ? '#ff000033' : '#4ecdc433',
            padding: '6px 12px', borderRadius: 6, textDecoration: 'none',
            border: `1px solid ${p.type === 'Roblox' ? '#ff000066' : '#4ecdc466'}`,
            fontWeight: 600,
          }}>View on {p.type} →</a>
        </div>
      ))}
    </div>
  ),

  skills: (
    <div>
      <h2 style={{ color: '#a29bfe', margin: '0 0 12px' }}>⚡ Skills & Stats</h2>
      {[
        { cat: 'Frontend & Game Dev', items: [{ name: 'React', lv: 85 }, { name: 'Three.js', lv: 70 }, { name: 'Unity', lv: 10 }, { name: 'Flutter', lv: 80 }] },
        { cat: 'Backend & Systems',   items: [{ name: 'Node.js', lv: 90 }, { name: 'Python', lv: 85 }, { name: 'PostgreSQL', lv: 80 }, { name: 'Arduino', lv: 90 }] },
        { cat: 'Tools',               items: [{ name: 'Git', lv: 90 }, { name: 'Docker', lv: 60 }, { name: 'Figma', lv: 70 }, { name: 'Roblox Studio', lv: 95 }] },
      ].map(g => (
        <div key={g.cat} style={{ marginBottom: 20 }}>
          <div style={{ color: '#a29bfe', fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>{g.cat.toUpperCase()}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {g.items.map(s => (
              <div key={s.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{s.name}</span>
                  <span style={{ color: s.lv > 60 ? '#4ecdc4' : '#ff6b6b', fontWeight: 900, fontFamily: 'monospace' }}>{s.lv}%</span>
                </div>
                <div style={{ width: '100%', height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(162,155,254,0.2)' }}>
                  <div style={{ width: `${s.lv}%`, height: '100%', background: 'linear-gradient(90deg,#6c5ce7,#a29bfe,#4ecdc4)', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ marginTop: 20, padding: 12, background: 'rgba(162,155,254,0.05)', borderRadius: 10, border: '1px dashed #a29bfe44' }}>
        <div style={{ fontSize: 10, color: '#a29bfe', marginBottom: 8 }}>SYSTEM ARCHITECTURE STATUS</div>
        <div style={{ fontSize: 12, color: '#fff', fontFamily: 'monospace' }}>
          {'>'} Languages: Thai (Native), English (Fluent)<br />
          {'>'} Specialization: Backend & Frontend Systems
        </div>
      </div>
    </div>
  ),

  contact: (
    <div>
      <h2 style={{ color: '#ffd93d', margin: '0 0 12px' }}>✉️ Contact</h2>
      <p style={{ color: '#ccc', fontSize: 14, marginBottom: 16 }}>Let's build something amazing together.</p>
      {[
        { icon: <RiMailFill style={{ color: '#ea4335', fontSize: 24 }} />,  label: 'Email',  value: 'kimmysoybad@gmail.com' },
        { icon: <RiGithubFill style={{ color: '#fff', fontSize: 24 }} />,   label: 'GitHub', value: 'github.com/kimmysoybad404' },
        { icon: <RiLineFill style={{ color: '#06C755', fontSize: 30 }} />,  label: 'Line',   value: 'kimmykimmy01' },
      ].map(c => (
        <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #ffffff11' }}>
          <span>{c.icon}</span>
          <div>
            <div style={{ fontSize: 11, color: '#888', letterSpacing: 1 }}>{c.label.toUpperCase()}</div>
            <div style={{ color: '#ffd93d', fontSize: 13 }}>{c.value}</div>
          </div>
        </div>
      ))}
    </div>
  ),
};

// ── Emoji sprite texture ─────────────────────────────────────────────────────
function makeEmojiTexture(emoji: string): THREE.CanvasTexture {
  const size = 256;
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.font = `${Math.floor(size * 0.7)}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size / 2 + 8);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

// ── EmojiSprite: always faces camera ─────────────────────────────────────────
function EmojiSprite({ emoji, size }: { emoji: string; size: number }) {
  const texture = useMemo(() => makeEmojiTexture(emoji), [emoji]);
  const s = size * 1.6;
  return (
    // position at center — sprite always faces camera, sits on top via depthTest=false
    <sprite position={[0, 0, size * 0.9]} scale={[s, s, s]}>
      <spriteMaterial map={texture} transparent depthTest={false} sizeAttenuation />
    </sprite>
  );

}

// ── Planet data ───────────────────────────────────────────────────────────────
const PLANETS = [
  { id: 'about',    label: 'ABOUT ME', emoji: '👤', orbitRadius: 7,  speed: 0.3,  size: 0.6,  color: '#ff6b6b', emissive: '#cc2222', startAngle: 0.5 },
  { id: 'projects', label: 'PROJECTS', emoji: '🚀', orbitRadius: 12, speed: 0.18, size: 0.75, color: '#4ecdc4', emissive: '#1a7a60', startAngle: 2.1 },
  { id: 'skills',   label: 'SKILLS',   emoji: '⚡', orbitRadius: 17, speed: 0.12, size: 0.65, color: '#a29bfe', emissive: '#5540cc', startAngle: 4.2 },
  { id: 'contact',  label: 'CONTACT',  emoji: '📱', orbitRadius: 22, speed: 0.08, size: 0.55, color: '#ffd93d', emissive: '#cc9900', startAngle: 1.0 },
];
type PlanetData = typeof PLANETS[0];

// ── Sun ───────────────────────────────────────────────────────────────────────
function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.1;
      meshRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.03);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 1.2 + 1) * 0.05);
    }
  });

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.4, 32, 32]} />
        <meshStandardMaterial color="#ff9020" emissive="#ff6000" emissiveIntensity={0.4} transparent opacity={0.15} />
      </mesh>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshStandardMaterial color="#ffe080" emissive="#ff8800" emissiveIntensity={1.2} roughness={0.4} metalness={0.1} />
      </mesh>
      <pointLight color="#fff5c0" intensity={80} distance={80} decay={2} />
      <Billboard position={[0, 3.5, 0]}>
        <Text font="/fonts/Orbitron-Bold.ttf"fontSize={0.58} color="#ffffff" anchorX="center" anchorY="middle" letterSpacing={0.12}>
          KITTICHEAT SUTTIPIPAT
        </Text>
        <Text font="/fonts/Orbitron-Bold.ttf" position={[0, -0.7, 0]} fontSize={0.38} color="#aaaaaa" anchorX="center" anchorY="middle" letterSpacing={0.2}>
          FULLSTACK DEVELOPER
        </Text>
      </Billboard>
    </group>
  );
}

// ── Orbit ring ────────────────────────────────────────────────────────────────
function OrbitRing({ radius }: { radius: number }) {
  const line = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat  = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.08 });
    return new THREE.Line(geom, mat);
  }, [radius]);

  return <primitive object={line} />;
}

// ── Planet ────────────────────────────────────────────────────────────────────
function Planet({ planet, onSelect }: { planet: PlanetData; onSelect: (p: PlanetData) => void }) {
  const groupRef  = useRef<THREE.Group>(null);
  const meshRef   = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);



  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const angle = planet.startAngle + t * planet.speed;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle) * planet.orbitRadius;
      groupRef.current.position.z = Math.sin(angle) * planet.orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.4;
      meshRef.current.scale.setScalar(
        hovered ? 1.12 + Math.sin(t * 3) * 0.05 : 1 + Math.sin(t * 2 + planet.startAngle) * 0.04
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glow halo */}
      <mesh>
        <sphereGeometry args={[planet.size * 1.8, 16, 16]} />
        <meshStandardMaterial color={planet.color} emissive={planet.color} emissiveIntensity={hovered ? 0.6 : 0.2} transparent opacity={hovered ? 0.18 : 0.08} />
      </mesh>
      {/* Planet with emoji texture */}
      <mesh
        ref={meshRef}
        castShadow
        onPointerOver={() => { setHovered(true);  document.body.style.cursor = 'pointer'; }}
        onPointerOut={() =>  { setHovered(false); document.body.style.cursor = 'default'; }}
        onClick={() => onSelect(planet)}
      >
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.emissive}
          emissiveIntensity={hovered ? 0.6 : 0.25}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      <EmojiSprite emoji={planet.emoji} size={planet.size} />
      <pointLight color={planet.color} intensity={hovered ? 4 : 1.5} distance={6} decay={2} />
      <Billboard position={[0, planet.size + 0.7, 0]}>
        <Text  font="/fonts/Orbitron-Bold.ttf" fontSize={0.28} color={hovered ? '#ffffff' : planet.color} anchorX="center" anchorY="middle" letterSpacing={0.08}>
          {planet.label}
        </Text>
      </Billboard>
    </group>
  );
}

// ── Scene (Canvas-only) ───────────────────────────────────────────────────────
function Scene({ onSelect }: { onSelect: (p: PlanetData) => void }) {
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.04;
    state.camera.position.x = Math.sin(t) * 32;
    state.camera.position.z = Math.cos(t) * 32;
    state.camera.position.y = 14;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.15} color="#b0c8ff" />
      <Stars radius={120} depth={60} count={5000} factor={3} fade speed={0.5} />
      <Sun />
      {PLANETS.map(p => <OrbitRing key={`orbit-${p.id}`} radius={p.orbitRadius} />)}
      {PLANETS.map(p => <Planet key={p.id} planet={p} onSelect={onSelect} />)}
    </>
  );
}

// ── DOM: Modal ────────────────────────────────────────────────────────────────
function InfoModal({ planet, onClose }: { planet: PlanetData; onClose: () => void }) {
  const color = planet.color;
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', animation: 'fadeIn 0.2s ease' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'rgba(6,8,20,0.97)', border: `2px solid ${color}55`, borderRadius: 20, padding: 32, maxWidth: 480, width: '90vw', maxHeight: '75vh', overflowY: 'auto', fontFamily: "'Orbitron', monospace", color: '#fff', boxShadow: `0 0 60px ${color}33`, animation: 'slideUp 0.3s ease', position: 'relative' }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: `1px solid ${color}44`, borderRadius: 8, color: '#888', cursor: 'pointer', padding: '4px 10px', fontFamily: "'Orbitron', monospace", fontSize: 12 }}
        >✕ CLOSE</button>
        {MODAL_CONTENT[planet.id]}
      </div>
    </div>
  );
}

// ── DOM: Legend ───────────────────────────────────────────────────────────────
function Legend({ active }: { active: string | null }) {
  return (
    <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 6, fontFamily: "'Orbitron', monospace" }}>
      {PLANETS.map(p => (
        <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: active === p.id ? `${p.color}18` : 'rgba(6,8,20,0.7)', border: `1px solid ${active === p.id ? p.color : '#ffffff15'}`, borderRadius: 8, backdropFilter: 'blur(8px)', transition: 'all 0.3s' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, boxShadow: `0 0 6px ${p.color}` }} />
          <span style={{ fontSize: 11, color: active === p.id ? p.color : '#555', letterSpacing: 1 }}>{p.label.toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function PortfolioScene() {
  const [selected, setSelected] = useState<PlanetData | null>(null);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#03050f', position: 'relative' }}>

      {/* Title */}
      <div style={{ position: 'fixed', top: 24, left: 28, zIndex: 10, fontFamily: "'Orbitron', monospace", color: '#fff', pointerEvents: 'none' }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: '#4ecdc4', marginBottom: 2 }}>▶ MY PORTFOLIO</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>Explore my experience</div>
      </div>

      {/* Hint */}
      <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 10, fontFamily: "'Orbitron', monospace", fontSize: 12, color: 'rgba(255,255,255,0.25)', pointerEvents: 'none', letterSpacing: 2 }}>
        CLICK A PLANET TO EXPLORE
      </div>

      <Legend active={selected?.id ?? null} />
      {selected && <InfoModal planet={selected} onClose={() => setSelected(null)} />}

      {/* Canvas — 3D only */}
      <Canvas
        camera={{ position: [32, 14, 32], fov: 50 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <Scene onSelect={setSelected} />
        </Suspense>
      </Canvas>
    </div>
  );
}