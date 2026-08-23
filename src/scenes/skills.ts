import type { IconType } from 'react-icons';
import { SiFlutter, SiUnity, SiNodedotjs, SiTypescript, SiRoblox, SiFirebase, SiArduino } from 'react-icons/si';
import { FaUserShield } from 'react-icons/fa';

export interface SkillConfig {
  name: string;
  Icon: IconType;
}

export const mySkills: SkillConfig[] = [
  { name: 'Flutter',       Icon: SiFlutter },
  { name: 'Unity',         Icon: SiUnity },
  { name: 'Node.js',       Icon: SiNodedotjs },
  { name: 'TypeScript',    Icon: SiTypescript },
  { name: 'Roblox Studio', Icon: SiRoblox },
  { name: 'Firebase',      Icon: SiFirebase },
  { name: 'Arduino',       Icon: SiArduino },
  { name: 'Cybersecurity', Icon: FaUserShield },
];