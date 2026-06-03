// Tassonomia e schema dati per il catalogo di frasi mediche.
// Due assi: SPECIALITÀ (dominio clinico) × FASE (momento della visita).

export type Level = "B2" | "C1" | "C2";

// Registro linguistico: rivolto al paziente vs linguaggio tecnico (referto/colleghi)
export type Register = "paziente" | "tecnico";

export type Specialty =
  | "Anamnesi generale"
  | "Urgenze/Rianimazione"
  | "Cardiologia"
  | "Radiologia/Imaging"
  | "Pneumologia"
  | "Gastroenterologia"
  | "Neurologia"
  | "Nefrologia"
  | "Endocrinologia"
  | "Infettivologia"
  | "Ginecologia/Ostetricia"
  | "Pediatria"
  | "Ortopedia/Traumatologia"
  | "Dermatologia"
  | "Psichiatria"
  | "Oncologia"
  | "Chirurgia generale"
  | "Geriatria"
  | "Urologia"
  | "Otorinolaringoiatria"
  | "Reumatologia"
  | "Ematologia"
  | "Oftalmologia"
  | "Anestesia"
  | "Medicina interna"
  | "Allergologia"
  | "Chirurgia vascolare"
  | "Cure palliative"
  | "Fisiatria/Riabilitazione"
  | "Odontoiatria";

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
  { name: "Pneumologia", emoji: "🫁", color: "#0891b2" },
  { name: "Gastroenterologia", emoji: "🍽️", color: "#ca8a04" },
  { name: "Neurologia", emoji: "🧠", color: "#4f46e5" },
  { name: "Nefrologia", emoji: "🫘", color: "#0e7490" },
  { name: "Endocrinologia", emoji: "🦋", color: "#c026d3" },
  { name: "Infettivologia", emoji: "🦠", color: "#16a34a" },
  { name: "Ginecologia/Ostetricia", emoji: "🤰", color: "#e11d48" },
  { name: "Pediatria", emoji: "🧸", color: "#f59e0b" },
  { name: "Ortopedia/Traumatologia", emoji: "🦴", color: "#64748b" },
  { name: "Dermatologia", emoji: "🧴", color: "#ea580c" },
  { name: "Psichiatria", emoji: "🛋️", color: "#6366f1" },
  { name: "Oncologia", emoji: "🎗️", color: "#9333ea" },
  { name: "Chirurgia generale", emoji: "🔪", color: "#334155" },
  { name: "Geriatria", emoji: "👴", color: "#a16207" },
  { name: "Urologia", emoji: "💧", color: "#0284c7" },
  { name: "Otorinolaringoiatria", emoji: "👂", color: "#0f766e" },
  { name: "Reumatologia", emoji: "🖐️", color: "#be123c" },
  { name: "Ematologia", emoji: "🩸", color: "#b91c1c" },
  { name: "Oftalmologia", emoji: "👁️", color: "#1d4ed8" },
  { name: "Anestesia", emoji: "💉", color: "#8b5cf6" },
  { name: "Medicina interna", emoji: "🩺", color: "#115e59" },
  { name: "Allergologia", emoji: "🤧", color: "#65a30d" },
  { name: "Chirurgia vascolare", emoji: "🫀", color: "#be185d" },
  { name: "Cure palliative", emoji: "🕊️", color: "#6b7280" },
  { name: "Fisiatria/Riabilitazione", emoji: "🦽", color: "#0e7490" },
  { name: "Odontoiatria", emoji: "🦷", color: "#0369a1" },
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
