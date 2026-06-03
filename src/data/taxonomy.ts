// Tassonomia e schema dati per il catalogo di frasi mediche.
// Due assi: SPECIALITÀ (dominio clinico) × FASE (momento della visita).

export type Level = "B2" | "C1" | "C2";

// Registro linguistico: rivolto al paziente vs linguaggio tecnico (referto/colleghi)
export type Register = "paziente" | "tecnico";

export type Specialty =
  | "Anamnesi generale"
  | "Urgenze/Rianimazione"
  | "Cardiologia"
  | "Radiologia/Imaging";

export type Phase =
  | "Anamnesi"
  | "Esame obiettivo"
  | "Comunicazione"
  | "Refertazione laboratorio"
  | "Imaging — Radiografia"
  | "Imaging — TC"
  | "Imaging — Ecografia"
  | "Imaging — RM"
  | "Terapia/Prescrizione"
  | "Dimissione/Follow-up";

export interface Phrase {
  id: string;
  fr: string;
  it: string;
  level: Level;
  specialty: Specialty;
  phase: Phase;
  register: Register;
  ipa?: string;
  tip?: string;
}

export const LEVELS: Level[] = ["B2", "C1", "C2"];

export const SPECIALTIES: { name: Specialty; emoji: string; color: string }[] = [
  { name: "Anamnesi generale", emoji: "🗣️", color: "#0d9488" },
  { name: "Urgenze/Rianimazione", emoji: "🚑", color: "#dc2626" },
  { name: "Cardiologia", emoji: "❤️", color: "#db2777" },
  { name: "Radiologia/Imaging", emoji: "🩻", color: "#7c3aed" },
];

export const PHASES: { name: Phase; emoji: string }[] = [
  { name: "Anamnesi", emoji: "🗣️" },
  { name: "Esame obiettivo", emoji: "🩺" },
  { name: "Comunicazione", emoji: "💬" },
  { name: "Refertazione laboratorio", emoji: "🧪" },
  { name: "Imaging — Radiografia", emoji: "🩻" },
  { name: "Imaging — TC", emoji: "🖥️" },
  { name: "Imaging — Ecografia", emoji: "🔊" },
  { name: "Imaging — RM", emoji: "🧲" },
  { name: "Terapia/Prescrizione", emoji: "💊" },
  { name: "Dimissione/Follow-up", emoji: "🏥" },
];
