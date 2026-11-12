import { LabelPair, LabelType, Question } from '../types';

export const LABEL_PAIRS: Record<LabelType, LabelPair> = {
  A: {
    type: 'A',
    left: 'Nunca',
    right: 'Siempre'
  },
  B: {
    type: 'B',
    left: 'Muy poco parecido a mí',
    right: 'Me describe perfectamente'
  },
  C: {
    type: 'C',
    left: 'No suelo actuar así',
    right: 'Actúo así casi siempre'
  },
  D: {
    type: 'D',
    left: 'Totalmente en desacuerdo',
    right: 'Totalmente de acuerdo'
  },
  E: {
    type: 'E',
    left: 'Ni de broma',
    right: '100% yo'
  },
  F: {
    type: 'F',
    left: 'Jamás haría eso',
    right: 'Lo hago constantemente'
  }
};

// 18 statements thoroughly mixed and balanced across Asertivo (6), Pasivo (6), and Agresivo (6)
export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'Si en un trabajo de grupo me cargan con casi todo el trabajo a mí, suelo decir algo a mis compañeros/as antes de terminar haciéndolo solo/a.',
    style: 'asertivo',
    labelType: 'C',
    subtraits: { liderazgo: 20, seguridad: 25, autocontrol: 15 }
  },
  {
    id: 2,
    text: 'He respondido "no pasa nada", cuando sí pasaba algo y bastante.',
    style: 'pasivo',
    labelType: 'F',
    subtraits: { autocontrol: 10, seguridad: -20, empatia: 10 }
  },
  {
    id: 3,
    text: 'Cuando un compañero o amigo me corrige en alto delante de toda la clase, me genera una rabia tremenda.',
    style: 'agresivo',
    labelType: 'B',
    subtraits: { autocontrol: -25, seguridad: 10 }
  },
  {
    id: 4,
    text: 'Antes de enfadarme intento pensar si la otra persona puede tener una explicación razonable.',
    style: 'asertivo',
    labelType: 'D',
    subtraits: { empatia: 30, autocontrol: 25 }
  },
  {
    id: 5,
    text: 'Si me dejan en visto en medio de una discusión, le peto a mensajes hasta que me responda por narices.',
    style: 'agresivo',
    labelType: 'E',
    subtraits: { autocontrol: -30, liderazgo: 15 }
  },
  {
    id: 6,
    text: 'Cuando alguien se me cuela en la fila del Onda, la Roma, el Soho o del pub que sea, no digo nada y me aguanto.',
    style: 'pasivo',
    labelType: 'A',
    subtraits: { seguridad: -25, autocontrol: 15 }
  },
  {
    id: 7,
    text: 'Cuando no me apetece el plan del grupo de WhatsApp, lo digo claramente sin inventarme excusas raras.',
    style: 'asertivo',
    labelType: 'C',
    subtraits: { seguridad: 25, liderazgo: 15 }
  },
  {
    id: 8,
    text: 'Si en plena partida online un colega falla una jugada to\' fácil, se me escapa un "¿bobo o qué?" o "¿pero tú eres tonto?".',
    style: 'agresivo',
    labelType: 'A',
    subtraits: { autocontrol: -25, empatia: -15 }
  },
  {
    id: 9,
    text: 'Si pido un durum solo carne con patatas y Coca-Cola y me traen un durum vegetal con falafel y SIN BEBIDA, prefiero comérmelo antes que reclamar porque me da vergüenza.',
    style: 'pasivo',
    labelType: 'B',
    subtraits: { seguridad: -30, liderazgo: -20 }
  },
  {
    id: 10,
    text: 'Si un amigo hace una broma que me sienta mal, se lo digo a solas, con calma y sin guardar rencor.',
    style: 'asertivo',
    labelType: 'D',
    subtraits: { empatia: 25, autocontrol: 25, seguridad: 15 }
  },
  {
    id: 11,
    text: 'Si he quedado con un amigo en la plaza de España y tarda más de 15 minutos para luego decirme que no viene, lo mínimo que hago es gritarle por el móvil.',
    style: 'agresivo',
    labelType: 'E',
    subtraits: { autocontrol: -30, liderazgo: 15 }
  },
  {
    id: 12,
    text: 'Prefiero que elijan siempre los demás qué película ver o a dónde salir, aunque el plan me aburra totalmente.',
    style: 'pasivo',
    labelType: 'A',
    subtraits: { liderazgo: -25, seguridad: -20, empatia: 15 }
  },
  {
    id: 13,
    text: 'Cuando ni de coña estoy de acuerdo con la nota que me han puesto, pido hablar con el profesor y lo argumento con calma.',
    style: 'asertivo',
    labelType: 'D',
    subtraits: { liderazgo: 25, seguridad: 25, autocontrol: 20 }
  },
  {
    id: 14,
    text: 'En una discusión, cuando creo que tengo razón, interrumpo y subo la voz hasta que me dejan terminar.',
    style: 'agresivo',
    labelType: 'C',
    subtraits: { liderazgo: 25, autocontrol: -25, empatia: -20 }
  },
  {
    id: 15,
    text: 'Si alguien me pide dinero o apuntes y no quiero dárselos, acabo cediendo porque no sé decir que "no" sin sentir culpa.',
    style: 'pasivo',
    labelType: 'B',
    subtraits: { seguridad: -25, liderazgo: -15, empatia: 20 }
  },
  {
    id: 16,
    text: 'Cuando noto mal rollo en mi grupo de amigos, soy yo quien propone hablarlo claro antes de que la bola crezca.',
    style: 'asertivo',
    labelType: 'E',
    subtraits: { liderazgo: 30, empatia: 20, seguridad: 20 }
  },
  {
    id: 17,
    text: 'En una discusión de pareja o con alguien cercano, soy capaz de sacar cosas de hace meses para ganar la discusión yo.',
    style: 'agresivo',
    labelType: 'F',
    subtraits: { liderazgo: 20, empatia: -25, autocontrol: -20 }
  },
  {
    id: 18,
    text: 'Cuando salimos de fiesta o de party sigo la corriente del plan que decidan los demás aunque a mí me apetezca otra cosa.',
    style: 'pasivo',
    labelType: 'A',
    subtraits: { liderazgo: -20, seguridad: -20, autocontrol: 10 }
  }
];
