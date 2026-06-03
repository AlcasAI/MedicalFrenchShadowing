// Storage locale (localStorage) per il prototipo: progressi, SRS, impostazioni.

export interface SrsState {
  // mappa id frase -> stato di ripasso semplificato (box di Leitner)
  [phraseId: string]: { box: number; lastSeen: number; due: number };
}

export interface ProgressState {
  masteredIds: string[];
  listeningMinutes: number;
  streak: number;
  lastActiveDay: string; // YYYY-MM-DD
}

const KEYS = {
  srs: "mfs.srs",
  progress: "mfs.progress",
  settings: "mfs.settings",
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function getProgress(): ProgressState {
  return read<ProgressState>(KEYS.progress, {
    masteredIds: [],
    listeningMinutes: 0,
    streak: 1,
    lastActiveDay: new Date().toISOString().slice(0, 10),
  });
}

export function setProgress(p: ProgressState): void {
  write(KEYS.progress, p);
}

export function toggleMastered(id: string): ProgressState {
  const p = getProgress();
  const set = new Set(p.masteredIds);
  if (set.has(id)) set.delete(id);
  else set.add(id);
  p.masteredIds = [...set];
  setProgress(p);
  return p;
}

export function getSrs(): SrsState {
  return read<SrsState>(KEYS.srs, {});
}

export function gradeCard(id: string, grade: "again" | "hard" | "good" | "easy"): SrsState {
  const srs = getSrs();
  const prev = srs[id]?.box ?? 0;
  const boxMap = { again: 0, hard: Math.max(0, prev), good: prev + 1, easy: prev + 2 };
  const box = Math.min(5, boxMap[grade]);
  const intervalsDays = [0, 1, 3, 7, 16, 35];
  srs[id] = {
    box,
    lastSeen: Date.now(),
    due: Date.now() + intervalsDays[box] * 86400000,
  };
  write(KEYS.srs, srs);
  return srs;
}
