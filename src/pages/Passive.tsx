import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PHRASES } from "../data/phrases";
import { speakFr, stopSpeaking } from "../lib/tts";

type Mode = "FR" | "FR+IT" | "FR×2";

export default function Passive() {
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [mode, setMode] = useState<Mode>("FR+IT");
  const timer = useRef<number | null>(null);

  const phrase = PHRASES[i];

  const clear = () => {
    if (timer.current) window.clearTimeout(timer.current);
    stopSpeaking();
  };

  // Catena di riproduzione passiva continua
  useEffect(() => {
    if (!playing) {
      clear();
      return;
    }
    // sequenza in base alla modalità
    const playFr2 = () =>
      speakFr(phrase.fr, { rate: 0.85, onEnd: () => scheduleNext() });
    const scheduleNext = () => {
      timer.current = window.setTimeout(() => setI((x) => (x + 1) % PHRASES.length), 700);
    };

    speakFr(phrase.fr, {
      rate: 0.9,
      onEnd: () => {
        if (mode === "FR×2") {
          timer.current = window.setTimeout(playFr2, 500);
        } else {
          scheduleNext();
        }
      },
    });

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, playing, mode]);

  const close = () => {
    clear();
    nav("/");
  };

  return (
    <div className="passive">
      <button className="close" onClick={close}>
        ✕ Chiudi
      </button>

      <div className="passive-now">
        <div style={{ opacity: 0.6, fontSize: 13, marginBottom: 18 }}>
          🎧 Modalità passiva · {phrase.specialty} · {phrase.level}
        </div>
        <div className="pfr">{phrase.fr}</div>
        {mode === "FR+IT" && <div className="pit">{phrase.it}</div>}
        <div style={{ opacity: 0.5, marginTop: 24, fontSize: 13 }}>
          {i + 1} / {PHRASES.length}
        </div>
      </div>

      <div className="passive-mode">
        {(["FR", "FR+IT", "FR×2"] as Mode[]).map((m) => (
          <button
            key={m}
            className={"toggle" + (mode === m ? " on" : "")}
            onClick={() => setMode(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="passive-controls">
        <button className="tbtn" onClick={() => setI((x) => (x - 1 + PHRASES.length) % PHRASES.length)}>
          ⏮
        </button>
        <button className="tbtn primary" onClick={() => setPlaying((p) => !p)}>
          {playing ? "⏸" : "▶"}
        </button>
        <button className="tbtn" onClick={() => setI((x) => (x + 1) % PHRASES.length)}>
          ⏭
        </button>
      </div>

      <div style={{ textAlign: "center", opacity: 0.5, fontSize: 12 }}>
        Riproduzione continua · ideale a schermo spento (in auto / in corsia)
      </div>
    </div>
  );
}
