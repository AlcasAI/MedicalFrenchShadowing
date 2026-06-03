import { PHRASES, LEVELS } from "../data/all";
import { getProgress } from "../lib/storage";

const WEEK = [
  { d: "Lun", v: 18 },
  { d: "Mar", v: 25 },
  { d: "Mer", v: 12 },
  { d: "Gio", v: 30 },
  { d: "Ven", v: 22 },
  { d: "Sab", v: 40 },
  { d: "Dom", v: 15 },
];

export default function Progress() {
  const p = getProgress();
  const max = Math.max(...WEEK.map((w) => w.v));

  return (
    <>
      <div className="page-title">Progressi</div>
      <div className="page-sub">Il tuo cammino verso il C2</div>

      <div className="stat-grid" style={{ marginTop: 16 }}>
        <div className="stat-card">
          <div className="big">🔥 {p.streak}</div>
          <div className="lbl">giorni consecutivi</div>
        </div>
        <div className="stat-card">
          <div className="big">{p.masteredIds.length}</div>
          <div className="lbl">frasi padroneggiate</div>
        </div>
        <div className="stat-card">
          <div className="big">C1+</div>
          <div className="lbl">livello stimato</div>
        </div>
        <div className="stat-card">
          <div className="big">{Math.round(p.listeningMinutes) || 162}′</div>
          <div className="lbl">ascolto totale</div>
        </div>
      </div>

      <div className="section-title">Minuti di ascolto · ultima settimana</div>
      <div className="card">
        <div className="barchart">
          {WEEK.map((w) => (
            <div className="col" key={w.d}>
              <i style={{ height: `${(w.v / max) * 100}%` }} />
              <span>{w.d}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section-title">Distribuzione per livello</div>
      <div className="card">
        {LEVELS.map((l) => {
          const total = PHRASES.filter((ph) => ph.level === l).length;
          const done = PHRASES.filter(
            (ph) => ph.level === l && p.masteredIds.includes(ph.id)
          ).length;
          const pct = total ? (done / total) * 100 : 0;
          return (
            <div key={l} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ fontWeight: 700 }}>
                  <span className={`level-tag level-${l}`}>{l}</span>
                </span>
                <span style={{ color: "var(--muted)" }}>
                  {done}/{total} frasi
                </span>
              </div>
              <div className="bar" style={{ height: 8, background: "var(--line)", borderRadius: 999, overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: `${pct}%`, background: "var(--teal)" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="banner">📈 Dati dimostrativi · nel prodotto reale rifletteranno l'uso effettivo</div>
    </>
  );
}
