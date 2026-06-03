// Wrapper TTS per il PROTOTIPO.
// Usa la Web Speech API del browser con voce francese come segnaposto.
// Nella versione reale verrà sostituito da audio pre-generato (file mp3).

let cachedFrVoice: SpeechSynthesisVoice | null = null;

function pickFrenchVoice(): SpeechSynthesisVoice | null {
  if (cachedFrVoice) return cachedFrVoice;
  const voices = window.speechSynthesis?.getVoices() ?? [];
  const fr =
    voices.find((v) => v.lang?.toLowerCase().startsWith("fr-fr")) ??
    voices.find((v) => v.lang?.toLowerCase().startsWith("fr"));
  cachedFrVoice = fr ?? null;
  return cachedFrVoice;
}

export function ttsAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export interface SpeakOptions {
  rate?: number; // 0.5 - 1.0 per lo shadowing
  onEnd?: () => void;
  onStart?: () => void;
}

export function speakFr(text: string, opts: SpeakOptions = {}): void {
  if (!ttsAvailable()) {
    // Fallback: simula la durata dell'audio
    opts.onStart?.();
    const ms = Math.min(6000, Math.max(1200, text.length * 55));
    window.setTimeout(() => opts.onEnd?.(), ms);
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";
  const voice = pickFrenchVoice();
  if (voice) u.voice = voice;
  u.rate = opts.rate ?? 1;
  u.pitch = 1;
  if (opts.onStart) u.onstart = () => opts.onStart?.();
  if (opts.onEnd) u.onend = () => opts.onEnd?.();
  window.speechSynthesis.speak(u);
}

export function stopSpeaking(): void {
  if (ttsAvailable()) window.speechSynthesis.cancel();
}

// Pre-carica le voci (alcuni browser le popolano in modo asincrono)
if (ttsAvailable()) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedFrVoice = null;
    pickFrenchVoice();
  };
}
