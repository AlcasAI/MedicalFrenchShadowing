import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PHRASES } from "../data/phrases";
import { speakFr, stopSpeaking, voiceStatus } from "../lib/tts";
import { toggleMastered, getProgress } from "../lib/storage";

// Barre della waveform finta (altezze pseudo-casuali ma stabili)
const BARS = Array.from({ length: 32 }, (_, i) => 14 + ((i * 37) % 42));

export default function Shadowing() {
  const [params] = useSearchParams();
  const startId = params.get("id");

  // Deck: se arrivo da una frase specifica parto da quella
  const deck = useMemo(() => PHRASES, []);
  const startIndex = Math.max(0, deck.findIndex((p) => p.id === startId));
  const [index, setIndex] = useState(startIndex === -1 ? 0 : startIndex);

  const [playing, setPlaying] = useState(false);
  const [showIt, setShowIt] = useState(false);
  const [loop, setLoop] = useState(false);
  const [gap, setGap] = useState(true);
  const [slow, setSlow] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mastered, setMastered] = useState<string[]>(getProgress().masteredIds);
  const [audioNote, setAudioNote] = useState<string | null>(null);

  const phrase = deck[index];
  const gapTimer = useRef<number | null>(null);

  // Diagnostica audio (TTS segnaposto): avvisa se manca la voce francese
  useEffect(() => {
    voiceStatus().then((s) => {
      if (s === "no-french")
        setAudioNote("Nessuna voce francese installata sul dispositivo: senti la voce di sistema.");
      else if (s === "none")
        setAudioNote("Il dispositivo non ha voci vocali installate: l'audio è simulato (ritmo loop/gap ok).");
      else if (s === "unsupported")
        setAudioNote("Questo browser non supporta la sintesi vocale: prova con Chrome o Safari.");
      else setAudioNote(null);
    });
  }, []);

  const stopAll = () => {
    stopSpeaking();
    if (gapTimer.current) window.clearTimeout(gapTimer.current);
    setPlaying(false);
  };

  // Ferma l'audio quando cambio frase o smonto
  useEffect(() => () => stopAll(), []);
  useEffect(() => {
    stopAll();
    setShowIt(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const play = () => {
    setPlaying(true);
    speakFr(phrase.fr, {
      rate: slow ? 0.7 : 1,
      onEnd: () => {
        if (gap) {
          // pausa "shadow": tempo per ripetere ad alta voce
          const pause = Math.max(1500, phrase.fr.length * 60);
          gapTimer.current = window.setTimeout(() => {
            if (loop) play();
            else setPlaying(false);
          }, pause);
        } else if (loop) {
          play();
        } else {
          setPlaying(false);
        }
      },
    });
  };

  const onPlayPause = () => (playing ? stopAll() : play());

  const next = () => setIndex((i) => (i + 1) % deck.length);
  const prev = () => setIndex((i) => (i - 1 + deck.length) % deck.length);

  const onMaster = () => setMastered(toggleMastered(phrase.id).masteredIds);
  const isMastered = mastered.includes(phrase.id);

  return (
    <>
      <div className="deck-progress">
        <span>
          {index + 1}/{deck.length}
        </span>
        <span className="bar">
          <span style={{ width: `${((index + 1) / deck.length) * 100}%` }} />
        </span>
        <span className={`level-tag level-${phrase.level}`}>{phrase.level}</span>
      </div>

      <div className="shadow-stage">
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
          {phrase.specialty}
        </div>
        <div className="shadow-fr">{phrase.fr}</div>
        {phrase.ipa && <div className="shadow-ipa">/{phrase.ipa}/</div>}
        <div className="shadow-it">{showIt ? phrase.it : "·····"}</div>

        <div className={"waveform" + (playing ? " playing" : "")}>
          {BARS.map((h, i) => (
            <i key={i} style={{ height: h, animationDelay: `${(i % 8) * 0.08}s` }} />
          ))}
        </div>

        <div className="transport">
          <button className="tbtn" onClick={prev} aria-label="Precedente">
            ⏮
          </button>
          <button className="tbtn primary" onClick={onPlayPause} aria-label="Play">
            {playing ? "⏸" : "▶"}
          </button>
          <button className="tbtn" onClick={next} aria-label="Successiva">
            ⏭
          </button>
          <button
            className={"tbtn rec" + (recording ? " on" : "")}
            onClick={() => setRecording((r) => !r)}
            aria-label="Registra"
          >
            ●
          </button>
        </div>

        <div className="opts-row">
          <button className={"toggle" + (loop ? " on" : "")} onClick={() => setLoop((v) => !v)}>
            🔁 Loop
          </button>
          <button className={"toggle" + (gap ? " on" : "")} onClick={() => setGap((v) => !v)}>
            ⏸ Gap (ripeti)
          </button>
          <button className={"toggle" + (slow ? " on" : "")} onClick={() => setSlow((v) => !v)}>
            🐢 {slow ? "0.7×" : "1×"}
          </button>
          <button className={"toggle" + (showIt ? " on" : "")} onClick={() => setShowIt((v) => !v)}>
            🇮🇹 Traduzione
          </button>
        </div>

        {phrase.tip && <div className="shadow-tip">💡 {phrase.tip}</div>}
      </div>

      <button
        className="cta"
        style={{ marginTop: 14 }}
        onClick={onMaster}
      >
        <span className="cta-emoji">{isMastered ? "✅" : "⭐"}</span>
        <span className="cta-text">
          <strong>{isMastered ? "Padroneggiata" : "Segna come padroneggiata"}</strong>
          <span>Entra nel ciclo di ripasso SRS</span>
        </span>
        <span className="cta-arrow">›</span>
      </button>

      {recording && (
        <div className="banner">🔴 Registrazione (demo) · qui apparirà il confronto di pronuncia</div>
      )}

      {audioNote && <div className="banner">🔈 {audioNote}</div>}
    </>
  );
}
