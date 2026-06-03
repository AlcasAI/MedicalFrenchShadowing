// Wrapper TTS per il PROTOTIPO.
// Usa la Web Speech API del browser con voce francese come segnaposto.
// Nella versione reale verrà sostituito da audio pre-generato (file mp3).

export function ttsAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function allVoices(): SpeechSynthesisVoice[] {
  return ttsAvailable() ? window.speechSynthesis.getVoices() : [];
}

function pickFrenchVoice(): SpeechSynthesisVoice | null {
  const voices = allVoices();
  return (
    voices.find((v) => v.lang?.toLowerCase().startsWith("fr-fr")) ??
    voices.find((v) => v.lang?.toLowerCase().startsWith("fr")) ??
    null
  );
}

// Le voci spesso si popolano in modo asincrono: attende che siano pronte.
function voicesReady(): Promise<void> {
  return new Promise((resolve) => {
    if (!ttsAvailable() || allVoices().length > 0) return resolve();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    window.speechSynthesis.addEventListener("voiceschanged", finish, { once: true });
    // Fallback: non aspettare all'infinito
    window.setTimeout(finish, 1200);
  });
}

// Stato voci per la UI: "ready" | "no-french" | "none" | "unsupported"
export async function voiceStatus(): Promise<"french" | "no-french" | "none" | "unsupported"> {
  if (!ttsAvailable()) return "unsupported";
  await voicesReady();
  if (allVoices().length === 0) return "none";
  return pickFrenchVoice() ? "french" : "no-french";
}

export interface SpeakOptions {
  rate?: number; // 0.5 - 1.0 per lo shadowing
  onEnd?: () => void;
  onStart?: () => void;
}

// Workaround noto di Chrome: la sintesi si "addormenta", va tenuta sveglia.
let keepAlive: number | null = null;
function startKeepAlive() {
  stopKeepAlive();
  keepAlive = window.setInterval(() => {
    if (ttsAvailable() && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 5000);
}
function stopKeepAlive() {
  if (keepAlive !== null) {
    window.clearInterval(keepAlive);
    keepAlive = null;
  }
}

export function speakFr(text: string, opts: SpeakOptions = {}): void {
  // Fallback se il TTS non è disponibile: simula la durata dell'audio
  const simulate = () => {
    opts.onStart?.();
    const ms = Math.min(6000, Math.max(1200, text.length * 55));
    window.setTimeout(() => opts.onEnd?.(), ms);
  };

  if (!ttsAvailable()) return simulate();

  voicesReady().then(() => {
    // Se non c'è alcuna voce installata nel sistema, simula (così loop/gap funzionano)
    if (allVoices().length === 0) return simulate();

    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    const voice = pickFrenchVoice();
    if (voice) u.voice = voice; // se manca FR usa la voce di default del sistema
    u.rate = opts.rate ?? 1;
    u.pitch = 1;
    u.volume = 1;

    u.onstart = () => {
      startKeepAlive();
      opts.onStart?.();
    };
    const done = () => {
      stopKeepAlive();
      opts.onEnd?.();
    };
    u.onend = done;
    u.onerror = done;

    window.speechSynthesis.speak(u);
  });
}

export function stopSpeaking(): void {
  if (ttsAvailable()) window.speechSynthesis.cancel();
  stopKeepAlive();
}

// Tocca le voci il prima possibile (alcuni browser le caricano solo dopo getVoices)
if (ttsAvailable()) {
  allVoices();
  window.speechSynthesis.addEventListener("voiceschanged", () => allVoices());
}
