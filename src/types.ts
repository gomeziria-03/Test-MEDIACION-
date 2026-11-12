export type CommunicationStyle = 'asertivo' | 'pasivo' | 'agresivo';

export type Gender = 'hombre' | 'mujer' | 'otro';

export type LabelType = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface LabelPair {
  type: LabelType;
  left: string;
  right: string;
}

export interface Question {
  id: number;
  text: string;
  style: CommunicationStyle;
  labelType: LabelType;
  // Subtraits influenced by high scores on this statement
  subtraits: {
    liderazgo?: number;
    empatia?: number;
    autocontrol?: number; // negative if impulse
    seguridad?: number;
  };
}

export interface Character {
  id: string;
  name: string;
  universe?: string;
  gender: 'masculino' | 'femenino';
  style: CommunicationStyle;
  trait: string; // e.g. "Líder", "Humilde", "Arrogante"
  humorExplanation: string; // "Si los Vengadores no saben qué hacer..."
  justification: string; // Detailed score justification
  stats: {
    liderazgo: number;
    empatia: number;
    autocontrol: number;
    seguridad: number;
  };
  themeColor: string;
  image?: string;
  iconName?: string;
  tagline?: string;
}

export interface UserStats {
  liderazgo: number;
  empatia: number;
  autocontrol: number;
  seguridad: number;
  impulsividad: number; // 100 - autocontrol
  autoestima: number; // correlated with seguridad
}

export interface StyleScores {
  asertivo: number;
  pasivo: number;
  agresivo: number;
}

export interface StylePercentages {
  asertivo: number;
  pasivo: number;
  agresivo: number;
}

export interface CharacterMatch {
  character: Character;
  compatibility: number; // e.g. 92%
  rank: 1 | 2 | 3;
}

export interface TestResult {
  predominantStyle: CommunicationStyle;
  percentages: StylePercentages;
  rawScores: StyleScores;
  userStats: UserStats;
  topCharacters: CharacterMatch[];
  explanation: {
    title: string;
    text: string;
    strengths: string;
    improvements: string;
  };
  gender: Gender;
}
