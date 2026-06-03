import { useState } from "react";
import { PHRASES } from "../data/phrases";
import { speakFr } from "../lib/tts";
import { gradeCard } from "../lib/storage";

// Coda demo di ripasso (in reale: frasi "due" dall'SRS)
const QUEUE = PHRASES.slice(0, 6);

const GRADES: { key: "again" | "hard" | "good" | "easy"; label: string; color: string }[] = [
  { key: "again", label: "Da rivedere", color: "#dc2626" },
  { key: "hard", label: "Difficile", color: "#d97706" },
  { key: "good", label: "Bene", color: "#16a34a" },
  { key: "easy", label: "Facile", color: "#0d9488" },
];

export default function Review() {
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (pos >= QUEUE.length) {
    return (
      <div style={{ textAlign: "center", paddingTop: 60 }}>
        <div style={{ fontSize: 64 }}>🎉</div>
        <div className="page-title">Ripasso completato!</div>
        <div className="page-sub">Hai consolidato {QUEUE.length} frasi. À demain !</div>
        <button className="cta" style={{ marginTop: 24 }} onClick={() => { setPos(0); setFlipped(false); }}>
          <span className="cta-emoji">🔁</span>
          <span className="cta-text">
            <strong>Ricomincia</strong>
            <span>Rivedi di nuovo la coda demo</span>
          </span>
          <span className="cta-arrow">›</span>
        </button>
      </div>
    );
  }

  const card = QUEUE[pos];

  const grade = (g: "again" | "hard" | "good" | "easy") => {
    gradeCard(card.id, g);
    setFlipped(false);
    setPos((p) => p + 1);
  };

  return (
    <>
      <div className="deck-progress">
        <span>Ripasso SRS</span>
        <span className="bar">
          <span style={{ width: `${(pos / QUEUE.length) * 100}%` }} />
        </span>
        <span>
          {pos}/{QUEUE.length}
        </span>
      </div>

      <div className="flashcard" onClick={() => setFlipped((f) => !f)}>
        {!flipped ? (
          <>
            <div className="front">{card.fr}</div>
            <div style={{ marginTop: 18, color: "var(--muted)", fontSize: 13 }}>
              Tocca per rivelare · 🔊
            </div>
            <button
              className="tbtn primary"
              style={{ marginTop: 18 }}
              onClick={(e) => {
                e.stopPropagation();
                speakFr(card.fr);
              }}
            >
              ▶
            </button>
          </>
        ) : (
          <>
            <div className="front">{card.it}</div>
            <div className="back">{card.fr}</div>
            {card.tip && <div className="shadow-tip" style={{ marginTop: 18 }}>💡 {card.tip}</div>}
          </>
        )}
      </div>

      {flipped && (
        <div className="grade-row">
          {GRADES.map((g) => (
            <button
              key={g.key}
              className="grade-btn"
              style={{ background: g.color }}
              onClick={() => grade(g.key)}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
