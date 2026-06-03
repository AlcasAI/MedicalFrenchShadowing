import { useEffect, useRef, useState } from "react";
import { PHRASES } from "../data/phrases";
import { speakFrAsync, speakItAsync, stopSpeaking } from "../lib/tts";

// Quante volte ripetere ogni frase prima di passare alla successiva
const REPS_OPTIONS = [1, 2, 3, 5, 10];

// Pausa tra una ripetizione e l'altra (-1 = lunga quanto la frase, per ripetere a voce)
const PAUSE_OPTIONS: { label: string; ms: number }[] = [
  { label: "0s", ms: 0 },
  { label: "1s", ms: 1000 },
  { label: "2s", ms: 2000 },
  { label: "3s", ms: 3000 },
  { label: "come la frase", ms: -1 },
];

export default function Passive() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reps, setReps] = useState(3);
  const [pauseMs, setPauseMs] = useState(1000);
  const [loop, setLoop] = useState(true);
  const [showIt, setShowIt] = useState(true);
  const [readIt, setReadIt] = useState(true);
  const [repNow, setRepNow] = useState(0);
  const [phase, setPhase] = useState<"fr" | "it">("fr");

  // Refs per la sequenza asincrona (così i cambi di impostazione sono "live")
  const runIdRef = useRef(0);
  const repsRef = useRef(reps);
  const pauseRef = useRef(pauseMs);
  const loopRef = useRef(loop);
  const readItRef = useRef(readIt);
  const indexRef = useRef(index);
  const sleepTimer = useRef<number | null>(null);

  useEffect(() => { repsRef.current = reps; }, [reps]);
  useEffect(() => { pauseRef.current = pauseMs; }, [pauseMs]);
  useEffect(() => { loopRef.current = loop; }, [loop]);
  useEffect(() => { readItRef.current = readIt; }, [readIt]);
  useEffect(() => { indexRef.current = index; }, [index]);

  const sleep = (ms: number) =>
    new Promise<void>((res) => {
      sleepTimer.current = window.setTimeout(res, ms);
    });

  const stopSeq = () => {
    runIdRef.current++; // invalida qualunque sequenza in corso
    if (sleepTimer.current) window.clearTimeout(sleepTimer.current);
    stopSpeaking();
  };

  // Sequenza principale: parla -> attende fine reale -> ripete N volte -> frase dopo
  const runFrom = async (startIdx: number) => {
    runIdRef.current++;
    const myId = runIdRef.current;
    if (sleepTimer.current) window.clearTimeout(sleepTimer.current);
    stopSpeaking();

    const alive = () => myId === runIdRef.current;
    let idx = startIdx;

    while (alive()) {
      setIndex(idx);
      indexRef.current = idx;
      const phrase = PHRASES[idx];
      const totalReps = repsRef.current;

      setPhase("fr");
      for (let r = 1; r <= totalReps; r++) {
        if (!alive()) return;
        setRepNow(r);
        // ⏳ aspetta che la frase sia DAVVERO finita prima di proseguire
        await speakFrAsync(phrase.fr, { rate: 0.92 });
        if (!alive()) return;

        if (r < totalReps) {
          const base = pauseRef.current;
          const pause =
            base < 0 ? Math.min(6000, Math.max(1500, phrase.fr.length * 60)) : base;
          if (pause > 0) {
            await sleep(pause);
            if (!alive()) return;
          }
        }
      }

      // 🇮🇹 a fine giro, leggi la traduzione italiana prima di cambiare frase
      if (readItRef.current) {
        if (!alive()) return;
        setPhase("it");
        await sleep(500);
        if (!alive()) return;
        await speakItAsync(phrase.it, { rate: 1 });
        if (!alive()) return;
      }

      // breve stacco tra una frase e la successiva
      await sleep(800);
      if (!alive()) return;

      idx++;
      if (idx >= PHRASES.length) {
        if (loopRef.current) {
          idx = 0;
        } else {
          setPlaying(false);
          setRepNow(0);
          return;
        }
      }
    }
  };

  const start = () => {
    setPlaying(true);
    runFrom(indexRef.current);
  };
  const pause = () => {
    setPlaying(false);
    setRepNow(0);
    setPhase("fr");
    stopSeq();
  };
  const toggle = () => (playing ? pause() : start());

  const goto = (newIdx: number) => {
    const i = (newIdx + PHRASES.length) % PHRASES.length;
    setIndex(i);
    indexRef.current = i;
    setRepNow(0);
    setPhase("fr");
    if (playing) runFrom(i);
    else stopSeq();
  };

  // stop pulito quando si esce dalla schermata
  useEffect(() => () => stopSeq(), []);

  const phrase = PHRASES[index];

  return (
    <div className="passive">
      <div className="passive-head">
        <div className="passive-brand">🎧 Modalità passiva</div>
        <div className="passive-sub">
          {phrase.specialty} · {phrase.level}
        </div>
      </div>

      <div className="passive-now">
        <div className="pfr">{phrase.fr}</div>
        {showIt && (
          <div className={"pit" + (phase === "it" ? " pit-active" : "")}>{phrase.it}</div>
        )}
        <div className="passive-rep">
          {!playing
            ? "⏸ In pausa"
            : phase === "it"
            ? "🇮🇹 Traduzione"
            : `🔊 Ripetizione ${repNow}/${reps}`}{" "}
          · frase {index + 1}/{PHRASES.length}
        </div>
      </div>

      <div className="passive-controls">
        <button className="tbtn" onClick={() => goto(index - 1)} aria-label="Precedente">
          ⏮
        </button>
        <button className="tbtn primary" onClick={toggle} aria-label="Play/Pausa">
          {playing ? "⏸" : "▶"}
        </button>
        <button className="tbtn" onClick={() => goto(index + 1)} aria-label="Successiva">
          ⏭
        </button>
      </div>

      <div className="passive-settings">
        <div className="ps-row">
          <span className="ps-label">🔁 Ripetizioni per frase</span>
          <div className="chips">
            {REPS_OPTIONS.map((n) => (
              <button
                key={n}
                className={"toggle" + (reps === n ? " on" : "")}
                onClick={() => setReps(n)}
              >
                {n}×
              </button>
            ))}
          </div>
        </div>

        <div className="ps-row">
          <span className="ps-label">⏸ Pausa tra ripetizioni</span>
          <div className="chips">
            {PAUSE_OPTIONS.map((p) => (
              <button
                key={p.label}
                className={"toggle" + (pauseMs === p.ms ? " on" : "")}
                onClick={() => setPauseMs(p.ms)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ps-toggles">
          <button
            className={"toggle" + (readIt ? " on" : "")}
            onClick={() => setReadIt((v) => !v)}
          >
            🔊 Leggi traduzione IT a fine giro
          </button>
          <button
            className={"toggle" + (loop ? " on" : "")}
            onClick={() => setLoop((v) => !v)}
          >
            🔁 Loop playlist
          </button>
          <button
            className={"toggle" + (showIt ? " on" : "")}
            onClick={() => setShowIt((v) => !v)}
          >
            🇮🇹 Mostra traduzione
          </button>
        </div>
      </div>
    </div>
  );
}
