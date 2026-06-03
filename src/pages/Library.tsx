import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PHRASES, SPECIALTIES, LEVELS, type Level, type Specialty } from "../data/phrases";

export default function Library() {
  const nav = useNavigate();
  const [level, setLevel] = useState<Level | "Tutti">("Tutti");
  const [spec, setSpec] = useState<Specialty | null>(null);

  const filtered = useMemo(
    () =>
      PHRASES.filter(
        (p) =>
          (level === "Tutti" || p.level === level) &&
          (spec === null || p.specialty === spec)
      ),
    [level, spec]
  );

  return (
    <>
      <div className="page-title">Libreria</div>
      <div className="page-sub">Frasi e dialoghi per livello e specialità</div>

      <div className="section-title">Specialità</div>
      <div className="spec-grid">
        {SPECIALTIES.map((s) => (
          <button
            key={s.name}
            className="spec-card"
            style={{ background: s.color, outline: spec === s.name ? "3px solid #0f172a" : "none" }}
            onClick={() => setSpec(spec === s.name ? null : s.name)}
          >
            <div className="se">{s.emoji}</div>
            <div>
              <div className="sn">{s.name}</div>
              <div className="sc">
                {PHRASES.filter((p) => p.specialty === s.name).length} frasi
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="section-title">Livello</div>
      <div className="chips">
        <button
          className={"chip" + (level === "Tutti" ? " active" : "")}
          onClick={() => setLevel("Tutti")}
        >
          Tutti
        </button>
        {LEVELS.map((l) => (
          <button
            key={l}
            className={"chip" + (level === l ? " active" : "")}
            onClick={() => setLevel(l)}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="section-title">
        {filtered.length} frasi {spec ? `· ${spec}` : ""}
      </div>
      {filtered.map((p) => (
        <button
          key={p.id}
          className="phrase-row"
          onClick={() => nav(`/shadowing?id=${p.id}`)}
        >
          <div style={{ flex: 1 }}>
            <div className="pr-fr">{p.fr}</div>
            <div className="pr-it">{p.it}</div>
            <div className="pr-meta">
              <span className={`level-tag level-${p.level}`}>{p.level}</span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>{p.specialty}</span>
            </div>
          </div>
          <span style={{ color: "var(--teal)", fontSize: 22 }}>▶</span>
        </button>
      ))}
    </>
  );
}
