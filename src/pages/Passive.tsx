import { useEffect, useMemo, useRef, useState } from "react";
import { SPECIALTIES, PHASES, LEVELS } from "../data/phrases";
import type { Level, Phase, Specialty, Phrase } from "../data/phrases";
import { GRAMMAR_RULES } from "../data/grammar";
import { speakFrAsync, speakItAsync, stopSpeaking } from "../lib/tts";

const REPS_OPTIONS = [1, 2, 3, 5, 10];
const PAUSE_OPTIONS: { label: string; ms: number }[] = [
  { label: "0s", ms: 0 },
  { label: "1s", ms: 1000 },
  { label: "2s", ms: 2000 },
  { label: "3s", ms: 3000 },
  { label: "come la frase", ms: -1 },
];

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export default function Passive() {
  // Catalogo caricato in modo asincrono (chunk separato)
  const [allPhrases, setAllPhrases] = useState<Phrase[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    import("../data/all").then((m) => {
      if (active) {
        setAllPhrases(m.PHRASES);
        setLoaded(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Filtri playlist (set vuoto = "tutte")
  const [selSpec, setSelSpec] = useState<Set<Specialty>>(new Set());
  const [selPhase, setSelPhase] = useState<Set<Phase>>(new Set());
  const [selLevel, setSelLevel] = useState<Set<Level>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Stato riproduzione
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reps, setReps] = useState(3);
  const [pauseMs, setPauseMs] = useState(1000);
  const [loop, setLoop] = useState(true);
  const [showIt, setShowIt] = useState(true);
  const [readIt, setReadIt] = useState(true);
  const [showGram, setShowGram] = useState(true);
  const [repNow, setRepNow] = useState(0);
  const [phase, setPhase] = useState<"fr" | "it">("fr");

  // Playlist filtrata
  const playlist = useMemo(
    () =>
      allPhrases.filter(
        (p) =>
          (selSpec.size === 0 || selSpec.has(p.specialty)) &&
          (selPhase.size === 0 || selPhase.has(p.phase)) &&
          (selLevel.size === 0 || selLevel.has(p.level))
      ),
    [allPhrases, selSpec, selPhase, selLevel]
  );

  // Refs per la sequenza asincrona (impostazioni "live")
  const runIdRef = useRef(0);
  const repsRef = useRef(reps);
  const pauseRef = useRef(pauseMs);
  const loopRef = useRef(loop);
  const readItRef = useRef(readIt);
  const indexRef = useRef(index);
  const playlistRef = useRef(playlist);
  const sleepTimer = useRef<number | null>(null);

  useEffect(() => { repsRef.current = reps; }, [reps]);
  useEffect(() => { pauseRef.current = pauseMs; }, [pauseMs]);
  useEffect(() => { loopRef.current = loop; }, [loop]);
  useEffect(() => { readItRef.current = readIt; }, [readIt]);
  useEffect(() => { indexRef.current = index; }, [index]);
  useEffect(() => { playlistRef.current = playlist; }, [playlist]);

  const sleep = (ms: number) =>
    new Promise<void>((res) => {
      sleepTimer.current = window.setTimeout(res, ms);
    });

  const stopSeq = () => {
    runIdRef.current++;
    if (sleepTimer.current) window.clearTimeout(sleepTimer.current);
    stopSpeaking();
  };

  // Quando cambia la playlist (filtri), ferma e riparti dall'inizio
  useEffect(() => {
    stopSeq();
    setPlaying(false);
    setIndex(0);
    indexRef.current = 0;
    setRepNow(0);
    setPhase("fr");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist]);

  const runFrom = async (startIdx: number) => {
    runIdRef.current++;
    const myId = runIdRef.current;
    if (sleepTimer.current) window.clearTimeout(sleepTimer.current);
    stopSpeaking();

    const alive = () => myId === runIdRef.current;
    let idx = startIdx;

    while (alive()) {
      const list = playlistRef.current;
      if (list.length === 0) return;
      if (idx >= list.length) idx = 0;

      setIndex(idx);
      indexRef.current = idx;
      const phr = list[idx];
      const totalReps = repsRef.current;

      setPhase("fr");
      for (let r = 1; r <= totalReps; r++) {
        if (!alive()) return;
        setRepNow(r);
        await speakFrAsync(phr.fr, { rate: 0.92 });
        if (!alive()) return;
        if (r < totalReps) {
          const base = pauseRef.current;
          const pause = base < 0 ? Math.min(6000, Math.max(1500, phr.fr.length * 60)) : base;
          if (pause > 0) {
            await sleep(pause);
            if (!alive()) return;
          }
        }
      }

      // 🇮🇹 traduzione italiana a fine giro
      if (readItRef.current) {
        if (!alive()) return;
        setPhase("it");
        await sleep(500);
        if (!alive()) return;
        await speakItAsync(phr.it, { rate: 1 });
        if (!alive()) return;
      }

      await sleep(800);
      if (!alive()) return;

      idx++;
      if (idx >= playlistRef.current.length) {
        if (loopRef.current) idx = 0;
        else {
          setPlaying(false);
          setRepNow(0);
          return;
        }
      }
    }
  };

  const start = () => {
    if (playlist.length === 0) return;
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
    const n = playlist.length;
    if (n === 0) return;
    const i = (newIdx + n) % n;
    setIndex(i);
    indexRef.current = i;
    setRepNow(0);
    setPhase("fr");
    if (playing) runFrom(i);
    else stopSeq();
  };

  useEffect(() => () => stopSeq(), []);

  const phr = playlist[index];

  return (
    <div className="passive">
      <div className="passive-head">
        <div className="passive-title">🎧 Medical French Shadowing</div>
        <div className="passive-tagline">Ascolto passivo · francese medico FR → IT</div>
        <div className="passive-sub">
          {phr ? `${phr.specialty} · ${phr.phase} · ${phr.level}` : "Nessuna frase selezionata"}
        </div>
      </div>

      <button className="playlist-btn" onClick={() => setShowFilters((v) => !v)}>
        🎛️ Playlist · {loaded ? `${playlist.length} frasi` : "…"} {showFilters ? "▲" : "▼"}
      </button>

      {showFilters && (
        <div className="filters-panel">
          <div className="ps-row">
            <span className="ps-label">Specialità <em>(vuoto = tutte)</em></span>
            <div className="chips">
              {SPECIALTIES.map((s) => (
                <button
                  key={s.name}
                  className={"toggle" + (selSpec.has(s.name) ? " on" : "")}
                  onClick={() => setSelSpec((p) => toggleInSet(p, s.name))}
                >
                  {s.emoji} {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="ps-row">
            <span className="ps-label">Fase della visita</span>
            <div className="chips">
              {PHASES.map((ph) => (
                <button
                  key={ph.name}
                  className={"toggle" + (selPhase.has(ph.name) ? " on" : "")}
                  onClick={() => setSelPhase((p) => toggleInSet(p, ph.name))}
                >
                  {ph.emoji} {ph.name}
                </button>
              ))}
            </div>
          </div>

          <div className="ps-row">
            <span className="ps-label">Livello</span>
            <div className="chips">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  className={"toggle" + (selLevel.has(l) ? " on" : "")}
                  onClick={() => setSelLevel((p) => toggleInSet(p, l))}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {(selSpec.size > 0 || selPhase.size > 0 || selLevel.size > 0) && (
            <button
              className="toggle"
              onClick={() => {
                setSelSpec(new Set());
                setSelPhase(new Set());
                setSelLevel(new Set());
              }}
            >
              ↺ Azzera filtri
            </button>
          )}
        </div>
      )}

      <div className="passive-now">
        {!loaded ? (
          <div className="pfr" style={{ fontSize: 18, opacity: 0.8 }}>
            Caricamento del catalogo…
          </div>
        ) : phr ? (
          <>
            <div className="pfr">{phr.fr}</div>
            {showIt && (
              <div className={"pit" + (phase === "it" ? " pit-active" : "")}>{phr.it}</div>
            )}
            <div className="passive-rep">
              {!playing
                ? "⏸ In pausa"
                : phase === "it"
                ? "🇮🇹 Traduzione"
                : `🔊 Ripetizione ${repNow}/${reps}`}{" "}
              · frase {index + 1}/{playlist.length}
            </div>
            {phr.grammar && showGram && (() => {
              const rule = GRAMMAR_RULES[phr.grammar];
              return (
                <div className="grammar-box">
                  <div className="grammar-title">📘 {rule.title}</div>
                  <div className="grammar-text">{rule.explanation}</div>
                  {phr.focus && <div className="grammar-focus">In questa frase: {phr.focus}</div>}
                  <div className="grammar-pattern">▸ {rule.pattern}</div>
                </div>
              );
            })()}
          </>
        ) : (
          <div className="pfr" style={{ fontSize: 18, opacity: 0.8 }}>
            Nessuna frase con questi filtri.<br />Modifica la playlist qui sopra.
          </div>
        )}
      </div>

      <div className="passive-controls">
        <button className="tbtn" onClick={() => goto(index - 1)} aria-label="Precedente">⏮</button>
        <button className="tbtn primary" onClick={toggle} aria-label="Play/Pausa" disabled={playlist.length === 0}>
          {playing ? "⏸" : "▶"}
        </button>
        <button className="tbtn" onClick={() => goto(index + 1)} aria-label="Successiva">⏭</button>
      </div>

      <div className="passive-settings">
        <div className="ps-row">
          <span className="ps-label">🔁 Ripetizioni per frase</span>
          <div className="chips">
            {REPS_OPTIONS.map((n) => (
              <button key={n} className={"toggle" + (reps === n ? " on" : "")} onClick={() => setReps(n)}>
                {n}×
              </button>
            ))}
          </div>
        </div>

        <div className="ps-row">
          <span className="ps-label">⏸ Pausa tra ripetizioni</span>
          <div className="chips">
            {PAUSE_OPTIONS.map((p) => (
              <button key={p.label} className={"toggle" + (pauseMs === p.ms ? " on" : "")} onClick={() => setPauseMs(p.ms)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ps-toggles">
          <button className={"toggle" + (readIt ? " on" : "")} onClick={() => setReadIt((v) => !v)}>
            🔊 Leggi traduzione IT a fine giro
          </button>
          <button className={"toggle" + (loop ? " on" : "")} onClick={() => setLoop((v) => !v)}>
            🔁 Loop playlist
          </button>
          <button className={"toggle" + (showIt ? " on" : "")} onClick={() => setShowIt((v) => !v)}>
            🇮🇹 Mostra traduzione
          </button>
          <button className={"toggle" + (showGram ? " on" : "")} onClick={() => setShowGram((v) => !v)}>
            📘 Mostra grammatica
          </button>
        </div>
      </div>
    </div>
  );
}
