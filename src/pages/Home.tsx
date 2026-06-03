import { Link } from "react-router-dom";
import { getProgress } from "../lib/storage";

export default function Home() {
  const p = getProgress();
  // Stima livello demo
  const levelPct = 62; // tra C1 e C2
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="page-title">Bonjour, Docteur 👋</div>
          <div className="page-sub">Pronto per il francese medico di oggi?</div>
        </div>
      </div>

      <div className="hero" style={{ marginTop: 18 }}>
        <h1>Obiettivo C2 · Francese medico</h1>
        <span className="level-pill">📊 Livello stimato · C1+</span>
        <div className="levelbar">
          <span style={{ width: `${levelPct}%` }} />
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="n">🔥 {p.streak}</div>
            <div className="l">giorni di fila</div>
          </div>
          <div className="hero-stat">
            <div className="n">{p.masteredIds.length}</div>
            <div className="l">frasi padroneggiate</div>
          </div>
          <div className="hero-stat">
            <div className="n">{Math.round(p.listeningMinutes)}′</div>
            <div className="l">ascolto totale</div>
          </div>
        </div>
      </div>

      <div className="section-title">Inizia subito</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Link className="cta" to="/shadowing">
          <span className="cta-emoji">🎙️</span>
          <span className="cta-text">
            <strong>Sessione di Shadowing</strong>
            <span>Ripeti dopo la voce nativa · 8 frasi</span>
          </span>
          <span className="cta-arrow">›</span>
        </Link>

        <Link className="cta" to="/review">
          <span className="cta-emoji">🔁</span>
          <span className="cta-text">
            <strong>Ripasso di oggi</strong>
            <span>5 frasi in scadenza (SRS)</span>
          </span>
          <span className="cta-arrow">›</span>
        </Link>

        <Link className="cta" to="/passive">
          <span className="cta-emoji">🎧</span>
          <span className="cta-text">
            <strong>Modalità passiva</strong>
            <span>Ascolto in sottofondo · mani libere</span>
          </span>
          <span className="cta-arrow">›</span>
        </Link>
      </div>

      <div className="section-title">Continua dove eri</div>
      <Link className="cta" to="/library">
        <span className="cta-emoji">🚑</span>
        <span className="cta-text">
          <strong>Urgences · C1</strong>
          <span>3 frasi rimanenti nell'unità</span>
        </span>
        <span className="cta-arrow">›</span>
      </Link>

      <div className="banner">
        🧪 Prototipo visivo · dati e voce sono dimostrativi (TTS del browser)
      </div>
    </>
  );
}
