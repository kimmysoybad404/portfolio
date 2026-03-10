import { Suspense, useState, useCallback, type JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import Car from "./Car";
import Environment from "./Environment";
import { IconType } from 'react-icons';
import { SiFlutter, SiUnity, SiNodedotjs, SiTypescript, SiRoblox, SiFirebase, SiArduino, SiCsswizardry } from 'react-icons/si';
import { FaUserShield } from 'react-icons/fa'; // A general security icon
import { RiLineFill,RiMailFill,RiGithubFill } from 'react-icons/ri';
import { TbBoxPadding } from "react-icons/tb";
import { MdPadding } from "react-icons/md";

export interface SkillConfig {
  name: string;
  Icon: IconType; // This tells TypeScript it's a valid React Icon component
}

// eslint-disable-next-line react-refresh/only-export-components
export const mySkills: SkillConfig[] = [
  { name: "Flutter", Icon: SiFlutter },
  { name: "Unity", Icon: SiUnity },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "Roblox Studio", Icon: SiRoblox },
  { name: "Firebase", Icon: SiFirebase },
  { name: "Arduino", Icon: SiArduino },
  { name: "Cybersecurity", Icon: FaUserShield }, // General icon since no specific brand logo fits well
];

// ── Topic data ────────────────────────────────────────────────────────────────
const TOPICS = [
  { id: "about", label: "About Me", emoji: "👤", position: [-22, 0, -22] as [number, number, number], color: "#ff6b6b", accent: "#ff8e53", desc: "Learn about who I am" },
  { id: "projects", label: "Projects", emoji: "🚀", position: [22, 0, -22] as [number, number, number], color: "#4ecdc4", accent: "#44cf6c", desc: "See what I've built" },
  { id: "skills", label: "Skills", emoji: "⚡", position: [-22, 0, 22] as [number, number, number], color: "#a29bfe", accent: "#6c5ce7", desc: "Technologies I work with" },
  { id: "contact", label: "Contact", emoji: "✉️", position: [22, 0, 22] as [number, number, number], color: "#ffd93d", accent: "#ff6b6b", desc: "Get in touch with me" },
];

const TOPIC_ZONES = TOPICS.map(t => ({ id: t.id, position: t.position, radius: 7 }));

// ── TopicBuilding: lives INSIDE Canvas, so only 3D objects + <Html> ───────────
function TopicBuilding({ t, near }: { t: typeof TOPICS[0]; near: boolean }) {
  return (
    <group position={t.position}>
      {/* platform */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[5, 5.5, 0.2, 32]} />
        <meshStandardMaterial color={t.color} metalness={0.4} roughness={0.5} transparent opacity={0.8} />
      </mesh>

      {/*
        <Html> is the ONLY valid bridge from 3D space → DOM.
        ✅ No style= prop on <Html> itself.
        ✅ All style props go on the <div> inside.
      */}
      <Html position={[0, 5, 0]} center distanceFactor={18}>
        <div style={{
          pointerEvents: "none",
          background: near ? `linear-gradient(135deg,${t.color}cc,${t.accent}cc)` : "rgba(10,10,26,0.82)",
          border: `2px solid ${t.color}`,
          borderRadius: 12,
          padding: "8px 16px",
          color: "#fff",
          fontSize: 14,
          fontFamily: "'Courier New',monospace",
          fontWeight: 700,
          letterSpacing: 2,
          whiteSpace: "nowrap",
          textAlign: "center",
          backdropFilter: "blur(8px)",
          boxShadow: near ? `0 0 20px ${t.color}88` : "none",
          transform: `scale(${near ? 1.1 : 1})`,
          transition: "all 0.3s ease",
        }}>
          <span style={{ marginRight: 6 }}>{t.emoji}</span>
          {t.label}
        </div>
      </Html>

      <pointLight position={[0, 6, 0]} color={t.color} intensity={near ? 8 : 2} distance={near ? 20 : 10} />
    </group>
  );
}

// ── CanvasFallback: invisible mesh used as Suspense fallback inside Canvas ─────
// Must be a valid Three.js object — NOT a <div> or any HTML element
// function CanvasFallback() {
//   return (
//     <mesh visible={false}>
//       <boxGeometry args={[0,0,0]} />
//       <meshBasicMaterial />
//     </mesh>
//   );
// }

// ══════════════════════════════════════════════════════════════════════════════
// Everything below is PURE DOM — no R3F/drei hooks, no Canvas context
// ══════════════════════════════════════════════════════════════════════════════

function LoadingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  // ✅ Pure DOM. Animations are defined in index.css (no <style> tag here)
  return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0a1a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1000, fontFamily: "'Courier New',monospace", color: "#fff" }}>
      <div style={{ fontSize: 52, marginBottom: 20, animation: "spin 2s linear infinite", display: "inline-block" }}>🚗</div>
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 5, marginBottom: 28, color: "#4ecdc4" }}>LOADING WORLD</div>
      <div style={{ width: 220, height: 4, background: "#1a1a2e", borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: 80, background: "linear-gradient(90deg,transparent,#4ecdc4,#a29bfe,transparent)", animation: "barSweep 1.2s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

// Modal content — plain React JSX, never touches Canvas
const MODAL_CONTENT: Record<string, JSX.Element> = {
  about: (
    <div>
      <h2 style={{ color: "#ff6b6b", margin: "0 0 12px" }}>👤 About Me</h2>
      <p style={{ lineHeight: "1.6" }}>
        I am <strong>Kitticheat Suttipipat</strong>, a Computer Engineering student
        passionate about bridging the gap between interactive 3D environments and
        robust backend systems.
      </p>
      <p style={{ color: "#aaa", fontSize: 13, marginTop: 12, lineHeight: "1.5" }}>
        I specialize in <strong>Backend Development</strong> for mobile applications
        and building immersive games using <strong>Unity</strong> and <strong>Roblox Studio</strong>.
        I enjoy solving complex architectural challenges—from Smart Home AI integrations
        to disaster-response SOS systems.
      </p>

      {/* --- The skills list with icons --- */}
      <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {mySkills.map(({ name, Icon }) => (
          <span key={name} style={{
            display: "flex",       // Required to align icon and text
            alignItems: "center",  // Vertical center alignment
            gap: 6,                 // Spacing between icon and text
            background: "#ff6b6b22",
            border: "1px solid #ff6b6b88",
            borderRadius: 6,
            padding: "6px 14px",   // Slightly increased padding
            fontSize: 12,
            color: "#ff6b6b",
            fontWeight: 600
          }}>
            {/* Render the icon component with theme color and size */}
            <Icon style={{ fontSize: "16px", color: "#ff6b6b" }} />
            {name}
          </span>
        ))}
      </div>
    </div>
  ),
  projects: (
    <div>
      <h2 style={{ color: "#4ecdc4", margin: "0 0 12px" }}>🚀 Projects</h2>
      {[
        {
          name: "SOS Disaster Chatbot",
          desc: "A real-time emergency reporting system designed for disaster situations with database integration.",
          tech: "Node.js · React · Database Design",
          link: "https://github.com/kimmysoybad404/Soschatbotsystem",
          type: "GitHub"
        },
        {
          name: "Smart Home AI System",
          desc: "Voice-command integrated AI for home automation, focusing on seamless backend connectivity.",
          tech: "Python · Backend · IoT",
          link: "https://github.com/KitticheatS", // Fallback to your profile
          type: "GitHub"
        },
        {
          name: "[Beta] Clean The World 🗑️♻️",
          desc: "A stylized game focusing on environmental cleanup mechanics and economy systems.",
          tech: "Lua · Roblox Studio",
          link: "https://www.roblox.com/games/90224023204473/Clean-The-World",
          type: "Roblox"
        },
        {
          name: "Detect the Scammer for Brainrots",
          desc: "An educational game designed to teach children how to identify and avoid online scammers.",
          tech: "Lua · Roblox Studio",
          link: "https://www.roblox.com/games/117904033620959/Detect-the-Scammer",
          type: "Roblox"
        }
      ].map(p => (
        <div key={p.name} style={{ background: "#4ecdc411", border: "1px solid #4ecdc433", borderRadius: 12, padding: "14px", marginBottom: 12, position: "relative" }}>
          <div style={{ fontWeight: 700, color: "#4ecdc4", fontSize: 16 }}>{p.name}</div>
          <div style={{ fontSize: 13, color: "#ccc", margin: "6px 0" }}>{p.desc}</div>
          <div style={{ fontSize: 11, color: "#4ecdc4", opacity: 0.8, fontFamily: "monospace", marginBottom: 10 }}>{p.tech}</div>

          <a
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              fontSize: 11,
              color: "#fff",
              background: p.type === "Roblox" ? "#ff000033" : "#4ecdc433", // Red tint for Roblox, Cyan for GitHub
              padding: "6px 12px",
              borderRadius: 6,
              textDecoration: "none",
              border: `1px solid ${p.type === "Roblox" ? "#ff000066" : "#4ecdc466"}`,
              transition: "all 0.2s ease",
              fontWeight: 600
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = p.type === "Roblox" ? "#ff000066" : "#4ecdc466";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = p.type === "Roblox" ? "#ff000033" : "#4ecdc433";
            }}
          >
            View on {p.type} →
          </a>
        </div>
      ))}
    </div>
  ),
  skills: (
    <div>
      <h2 style={{ color: "#a29bfe", margin: "0 0 12px" }}>⚡ Skills & Stats</h2>
      {[
        {
          cat: "Frontend & Game Dev",
          items: [
            { name: "React", lv: 85 },
            { name: "Three.js", lv: 70 },
            { name: "Unity", lv: 10 },
            { name: "Flutter", lv: 80 }
          ]
        },
        {
          cat: "Backend & Systems",
          items: [
            { name: "Node.js", lv: 90 },
            { name: "Python", lv: 85 },
            { name: "PostgreSQL", lv: 80 },
            { name: "Arduino", lv: 90 }
          ]
        },
        {
          cat: "Tools",
          items: [
            { name: "Git", lv: 90 },
            { name: "Docker", lv: 60 },
            { name: "Figma", lv: 70 },
            { name: "Roblox Studio", lv: 95 }
          ]
        }
      ].map(g => (
        <div key={g.cat} style={{ marginBottom: 20 }}>
          <div style={{ color: "#a29bfe", fontSize: 12, fontWeight: 700, marginBottom: 10, letterSpacing: 2 }}>
            {g.cat.toUpperCase()}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {g.items.map(s => (
              <div key={s.name} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: "#fff", fontWeight: 500 }}>{s.name}</span>

                  {/* --- LV PERCENTAGE COLOR --- */}
                  <span style={{
                    color: s.lv > 60 ? "#4ecdc4" : "#ff6b6b",           // Vibrant Cyan
                    fontWeight: "900",
                    fontFamily: "monospace",
                    textShadow: "0 0 8px rgba(78, 205, 196, 0.5)" // Neon glow
                  }}>
                    {s.lv}%
                  </span>
                </div>

                {/* Progress Bar Container */}
                <div style={{ width: "100%", height: "8px", background: "rgba(255, 255, 255, 0.05)", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(162, 155, 254, 0.2)" }}>

                  {/* --- PROGRESS BAR COLOR --- */}
                  <div style={{
                    width: `${s.lv}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, #6c5ce7, #a29bfe, #4ecdc4)`, // Multi-color shift
                    borderRadius: "4px",
                    boxShadow: "0 0 15px rgba(162, 155, 254, 0.6)",
                    transition: "width 1s ease-out" // Makes it feel like it's loading
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Optional: Extra Engineering Stats */}
      <div style={{ marginTop: 20, padding: "12px", background: "rgba(162, 155, 254, 0.05)", borderRadius: "10px", border: "1px dashed #a29bfe44" }}>
        <div style={{ fontSize: 10, color: "#a29bfe", marginBottom: 8 }}>SYSTEM ARCHITECTURE STATUS</div>
        <div style={{ fontSize: 12, color: "#fff", fontFamily: "monospace" }}>
          {'>'} Languages: Thai (Native), English (Fluent)<br />
          {'>'} Specialization: Backend & Frontend Systems<br />
        </div>
      </div>
    </div>
  ),
  contact: (
    <div>
      <h2 style={{ color: "#ffd93d", margin: "0 0 12px" }}>✉️ Contact</h2>
      <p style={{ color: "#ccc", fontSize: 14, marginBottom: 16 }}>Let's build something amazing together.</p>
      {[{ icon: <RiMailFill style={{ color: "#ea4335", fontSize: "24px" }} />, label: "Email", value: "kimmysoybad@gmail.com" },
      { icon: <RiGithubFill style={{ color: "#fff", fontSize: "24px" }} />, label: "GitHub", value: "github.com/kimmysoybad404" },
      {icon: <RiLineFill style={{ color: "#06C755", fontSize: "30px" }} />, label: "Line", value: "kimmykimmy01" },
      
      ].map(c => (
        <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #ffffff11" }}>
          <span style={{ fontSize: 20 }}>{c.icon}</span>
          <div>
            <div style={{ fontSize: 11, color: "#888", letterSpacing: 1 }}>{c.label.toUpperCase()}</div>
            <div style={{ color: "#ffd93d", fontSize: 13 }}>{c.value}</div>
          </div>
        </div>
      ))}
    </div>
  ),
};

function HUD({ nearId, onOpen }: { nearId: string | null; onOpen: (id: string) => void }) {
  const t = TOPICS.find(x => x.id === nearId) ?? null;
  // ✅ No <style> tag. Animations reference keyframes defined in index.css
  return (
    <>
      {/* Controls bar */}
      <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10, fontFamily: "'Courier New',monospace" }}>
        {["W ↑", "A ←", "S ↓", "D →"].map(k => (
          <div key={k} style={{ background: "rgba(10,10,26,0.75)", border: "1px solid #ffffff33", borderRadius: 8, padding: "6px 12px", color: "#888", fontSize: 12, backdropFilter: "blur(8px)" }}>{k}</div>
        ))}
        <div style={{ background: "rgba(10,10,26,0.75)", border: "1px solid #ffffff22", borderRadius: 8, padding: "6px 12px", color: "#555", fontSize: 12, marginLeft: 4 }}>DRIVE TO EXPLORE</div>
      </div>

      {/* Topic side card */}
      {t && (
        <div style={{ position: "fixed", top: "50%", right: 32, transform: "translateY(-50%)", zIndex: 20, animation: "fadeSlide 0.35s ease" }}>
          <div style={{ background: "rgba(8,8,20,0.95)", border: `2px solid ${t.color}`, borderRadius: 16, padding: "20px 24px", color: "#fff", fontFamily: "'Courier New',monospace", minWidth: 220, backdropFilter: "blur(16px)", boxShadow: `0 0 40px ${t.color}44` }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{t.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: t.color, marginBottom: 4 }}>{t.label}</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>{t.desc}</div>
            <button
              onClick={() => onOpen(t.id)}
              style={{ background: `linear-gradient(135deg,${t.color},${t.accent})`, border: "none", borderRadius: 8, padding: "10px 20px", color: "#fff", fontFamily: "'Courier New',monospace", fontWeight: 700, fontSize: 12, letterSpacing: 2, cursor: "pointer", width: "100%" }}
            >ENTER →</button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ position: "fixed", top: 24, right: 24, zIndex: 10, display: "flex", flexDirection: "column", gap: 6, fontFamily: "'Courier New',monospace" }}>
        {TOPICS.map(x => (
          <div key={x.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: nearId === x.id ? `${x.color}22` : "rgba(10,10,26,0.6)", border: `1px solid ${nearId === x.id ? x.color : "#ffffff15"}`, borderRadius: 8, backdropFilter: "blur(8px)", transition: "all 0.3s" }}>
            <span style={{ fontSize: 13 }}>{x.emoji}</span>
            <span style={{ fontSize: 11, color: nearId === x.id ? x.color : "#555", letterSpacing: 1 }}>{x.label.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function InfoModal({ topicId, onClose }: { topicId: string; onClose: () => void }) {
  const t = TOPICS.find(x => x.id === topicId);
  if (!t) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", animation: "fadeIn 0.2s ease" }} onClick={onClose}>
      <div style={{ background: "rgba(8,8,20,0.97)", border: `2px solid ${t.color}`, borderRadius: 20, padding: 32, maxWidth: 480, width: "90vw", maxHeight: "50vh", overflowY: "auto", fontFamily: "'Courier New',monospace", color: "#fff", boxShadow: `0 0 60px ${t.color}55`, animation: "slideUp 0.3s ease", position: "relative" }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: `1px solid ${t.color}66`, borderRadius: 8, color: "#888", cursor: "pointer", padding: "4px 10px", fontFamily: "'Courier New',monospace", fontSize: 12 }}>✕ CLOSE</button>
        {MODAL_CONTENT[topicId]}
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function PortfolioScene() {
  const [nearId, setNearId] = useState<string | null>(null);
  const [modalId, setModalId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const handleCreated = useCallback(() => {
    setTimeout(() => setLoaded(true), 500);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0a0a1a", position: "relative" }}>

      {/* 1. DOM Overlays (UI) */}
      <LoadingOverlay visible={!loaded} />

      <div style={{ position: "fixed", top: 24, left: 28, zIndex: 10, fontFamily: "'Courier New',monospace", background: "black", pointerEvents: "none",borderRadius: 10,padding: 20 }}>
        <div style={{ fontSize: 40, letterSpacing: 4, color: "#4ecdc4", marginBottom: 2 }}>▶ MY PORTFOLIO</div>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>Explore my experience</div>
      </div>

      <HUD nearId={nearId} onOpen={setModalId} />
      {modalId && <InfoModal topicId={modalId} onClose={() => setModalId(null)} />}

      {/* 2. The 3D Scene */}
      <Canvas
        shadows
        camera={{ position: [0, 6, 14], fov: 60 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        onCreated={handleCreated}
        style={{ position: "absolute", inset: 0 }}
      >
        <Suspense fallback={null}>
          <Environment />
          {TOPICS.map(t => (
            <TopicBuilding key={t.id} t={t} near={nearId === t.id} />
          ))}
          <Car topicZones={TOPIC_ZONES} onNearTopic={setNearId} />


        </Suspense>
      </Canvas>
    </div>
  );
}
