import { CHARACTERS } from '../data/characters';
import { QUESTIONS } from '../data/questions';
import {
  Character,
  CharacterMatch,
  CommunicationStyle,
  Gender,
  StylePercentages,
  StyleScores,
  TestResult,
  UserStats
} from '../types';

export function calculateTestResults(
  answers: Record<number, number>,
  gender: Gender
): TestResult {
  // 1. Calculate raw style scores
  const rawScores: StyleScores = {
    asertivo: 0,
    pasivo: 0,
    agresivo: 0
  };

  // Subtraits accumulators
  let lidSum = 0;
  let empSum = 0;
  let autoSum = 0;
  let segSum = 0;

  QUESTIONS.forEach((q) => {
    const val = answers[q.id] ?? 50; // 0 to 100
    rawScores[q.style] += val;

    const normalizedFactor = (val - 50) / 50; // -1 to +1

    if (q.subtraits.liderazgo) {
      lidSum += q.subtraits.liderazgo * normalizedFactor;
    }
    if (q.subtraits.empatia) {
      empSum += q.subtraits.empatia * normalizedFactor;
    }
    if (q.subtraits.autocontrol) {
      autoSum += q.subtraits.autocontrol * normalizedFactor;
    }
    if (q.subtraits.seguridad) {
      segSum += q.subtraits.seguridad * normalizedFactor;
    }
  });

  // Calculate percentages (normalized to 100%)
  const total = rawScores.asertivo + rawScores.pasivo + rawScores.agresivo;
  let percentages: StylePercentages;

  if (total === 0) {
    percentages = { asertivo: 34, pasivo: 33, agresivo: 33 };
  } else {
    const rawAsertivo = (rawScores.asertivo / total) * 100;
    const rawPasivo = (rawScores.pasivo / total) * 100;
    const rawAgresivo = (rawScores.agresivo / total) * 100;

    let pAsertivo = Math.round(rawAsertivo);
    let pPasivo = Math.round(rawPasivo);
    let pAgresivo = 100 - (pAsertivo + pPasivo);

    // Guard against negative rounding artifact
    if (pAgresivo < 0) {
      pAgresivo = Math.round(rawAgresivo);
      pPasivo = 100 - (pAsertivo + pAgresivo);
    }

    percentages = {
      asertivo: pAsertivo,
      pasivo: pPasivo,
      agresivo: pAgresivo
    };
  }

  // Determine predominant style
  let predominantStyle: CommunicationStyle = 'asertivo';
  if (percentages.pasivo > percentages.asertivo && percentages.pasivo >= percentages.agresivo) {
    predominantStyle = 'pasivo';
  } else if (percentages.agresivo > percentages.asertivo && percentages.agresivo > percentages.pasivo) {
    predominantStyle = 'agresivo';
  }

  // Compute subrasgos (scale 20 - 95%)
  const clamp = (val: number, min = 15, max = 98) => Math.min(max, Math.max(min, Math.round(val)));

  // Bias based on communication style
  const styleLidBias = predominantStyle === 'agresivo' ? 15 : predominantStyle === 'asertivo' ? 10 : -15;
  const styleEmpBias = predominantStyle === 'asertivo' ? 15 : predominantStyle === 'pasivo' ? 10 : -20;
  const styleAutoBias = predominantStyle === 'asertivo' ? 15 : predominantStyle === 'pasivo' ? 5 : -25;
  const styleSegBias = predominantStyle === 'asertivo' ? 20 : predominantStyle === 'agresivo' ? 15 : -20;

  const userStats: UserStats = {
    liderazgo: clamp(55 + lidSum * 0.4 + styleLidBias),
    empatia: clamp(60 + empSum * 0.4 + styleEmpBias),
    autocontrol: clamp(55 + autoSum * 0.4 + styleAutoBias),
    seguridad: clamp(55 + segSum * 0.4 + styleSegBias),
    impulsividad: 0,
    autoestima: 0
  };
  userStats.impulsividad = clamp(100 - userStats.autocontrol);
  userStats.autoestima = clamp(userStats.seguridad);

  // 2. Filter character pool by gender
  let pool = CHARACTERS;
  if (gender === 'hombre') {
    pool = pool.filter((c) => c.gender === 'masculino');
  } else if (gender === 'mujer') {
    pool = pool.filter((c) => c.gender === 'femenino');
  } // if 'otro', use entire pool

  // 3. Match characters based on predominant style and subrasgos distance
  interface ScoredCharacter {
    character: Character;
    compatibility: number;
  }

  const scored: ScoredCharacter[] = pool.map((char) => {
    // Style affinity bonus: matching style gives heavy advantage
    const styleMatchBonus = char.style === predominantStyle ? 30 : -25;

    // Euclidean distance across 4 subrasgos
    const dLid = (userStats.liderazgo - char.stats.liderazgo) / 100;
    const dEmp = (userStats.empatia - char.stats.empatia) / 100;
    const dAuto = (userStats.autocontrol - char.stats.autocontrol) / 100;
    const dSeg = (userStats.seguridad - char.stats.seguridad) / 100;

    const distance = Math.sqrt(
      dLid * dLid * 1.2 +
      dEmp * dEmp * 1.3 +
      dAuto * dAuto * 1.2 +
      dSeg * dSeg * 1.3
    );

    // Map distance to a 0-100 scale
    // Base compatibility around 80-96% for best matches
    const baseSimilarity = Math.max(0, 1 - distance / 1.5) * 65;
    const rawCompat = Math.round(baseSimilarity + styleMatchBonus + 12);
    const compatibility = Math.min(96, Math.max(62, rawCompat));

    return {
      character: char,
      compatibility
    };
  });

  // Sort descending by compatibility
  scored.sort((a, b) => {
    if (b.compatibility !== a.compatibility) {
      return b.compatibility - a.compatibility;
    }
    // Prioritize exact style match if score ties
    if (a.character.style === predominantStyle && b.character.style !== predominantStyle) return -1;
    if (b.character.style === predominantStyle && a.character.style !== predominantStyle) return 1;
    return 0;
  });

  // Ensure top 3 have realistic progressive tiers (e.g. 94%, 89%, 84%)
  const topCharacters: CharacterMatch[] = scored.slice(0, 3).map((item, idx) => {
    let comp = item.compatibility;
    if (idx === 0) comp = Math.max(89, Math.min(97, comp));
    if (idx === 1) comp = Math.max(82, Math.min(comp - 3, 91));
    if (idx === 2) comp = Math.max(76, Math.min(comp - 3, 86));

    return {
      character: item.character,
      compatibility: comp,
      rank: (idx + 1) as 1 | 2 | 3
    };
  });

  // 4. Generate structured 80-120 words explanation
  const explanation = generateExplanation(predominantStyle, userStats, topCharacters);

  return {
    predominantStyle,
    percentages,
    rawScores,
    userStats,
    topCharacters,
    explanation,
    gender
  };
}

function generateExplanation(
  style: CommunicationStyle,
  stats: UserStats,
  topMatches: CharacterMatch[]
): { title: string; text: string; strengths: string; improvements: string } {
  const names = topMatches.map((m) => m.character.name).join(', ');
  const traits = topMatches.map((m) => `"${m.character.trait}"`).join(', ');

  if (style === 'asertivo') {
    return {
      title: 'Tu estilo comunicativo: Asertivo y equilibrado',
      text: `Tu forma de comunicarte se caracteriza por la claridad, el respeto hacia los demás y la defensa tranquila de tus propios derechos. Compartes afinidad con ${names} porque reflejas rasgos como ${traits}, combinando empatía (${stats.empatia}%) y autocontrol (${stats.autocontrol}%) para abordar discrepancias sin recurrir a la sumisión ni a la agresividad. Sabes poner límites respetando al prójimo.`,
      strengths: 'Capacidad para dialogar en momentos difíciles, honestidad sin rodeos dañinos y búsqueda de soluciones justas.',
      improvements: 'Recuerda que no todos procesan el conflicto a tu velocidad; dales margen a quienes les cuesta expresarse.'
    };
  }

  if (style === 'pasivo') {
    return {
      title: 'Tu estilo comunicativo: Prudente y considerado',
      text: `Tu comunicación tiende a priorizar la tranquilidad del grupo y evitar roces directos, cediendo a menudo para que no haya mal ambiente. Compartes rasgos esenciales con ${names} (${traits}): una gran sensibilidad y empatía (${stats.empatia}%), pero con una seguridad que a veces queda contenida por temor al conflicto o a la desaprobación ajena. Sueles guardarte tu opinión sincera.`,
      strengths: 'Elevada empatía, capacidad de escucha, paciencia y vocación natural para no encender discusiones innecesarias.',
      improvements: 'Aprender a decir "no" sin sentir culpa y expresar lo que sientes a tiempo antes de que la frustración se acumule.'
    };
  }

  // Agresivo
  return {
    title: 'Tu estilo comunicativo: Directo y enérgico',
    text: `Tu forma de relacionarte es tajante, vehemente y frontal cuando sientes que tienes razón o que se vulnera tu espacio. Muestras gran afinidad con ${names} por rasgos como ${traits}: un liderazgo y determinación muy marcados (${stats.liderazgo}%), aunque tu autocontrol (${stats.autocontrol}%) suele verse superado por la impulsividad del momento, elevando el tono o atacando para defenderte.`,
    strengths: 'Seguridad personal indudable, iniciativa para no callar ante lo que te parece mal y determinación absoluta.',
    improvements: 'Aprender a hacer pausas antes de responder y escuchar el punto de vista del otro sin convertir el diálogo en una batalla.'
  };
}
