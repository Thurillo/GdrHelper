"use client";

import { useState } from "react";

const mockCharacters = [
  {
    id: "1",
    name: "Aeron il Grigio",
    race: "Elfo",
    charClass: "Mago",
    level: 8,
    hp: 34,
    maxHp: 42,
    ac: 13,
    str: 8,
    dex: 16,
    con: 14,
    int: 18,
    wis: 12,
    cha: 10,
  },
  {
    id: "2",
    name: "Brandor",
    race: "Umano",
    charClass: "Guerriero",
    level: 7,
    hp: 72,
    maxHp: 72,
    ac: 18,
    str: 18,
    dex: 12,
    con: 16,
    int: 10,
    wis: 13,
    cha: 14,
  },
  {
    id: "3",
    name: "Lira Vantemoore",
    race: "Halfling",
    charClass: "Ladra",
    level: 7,
    hp: 45,
    maxHp: 52,
    ac: 15,
    str: 9,
    dex: 19,
    con: 13,
    int: 12,
    wis: 11,
    cha: 15,
  },
  {
    id: "4",
    name: "Thorn",
    race: "Nano",
    charClass: "Chierico",
    level: 8,
    hp: 10,
    maxHp: 58,
    ac: 16,
    str: 14,
    dex: 10,
    con: 16,
    int: 11,
    wis: 17,
    cha: 12,
  },
];

function mod(score: number) {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

function hpPct(hp: number, max: number) {
  return Math.max(0, Math.min(100, (hp / max) * 100));
}

function hpColor(hp: number, max: number) {
  const pct = hp / max;
  if (pct > 0.6) return "var(--success)";
  if (pct > 0.3) return "var(--primary)";
  return "var(--danger)";
}

export default function CharactersPage() {
  const [selected, setSelected] = useState(mockCharacters[0]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Personaggi</h2>
          <p>Gestione schede personaggio della campagna</p>
        </div>
        <a href="/dashboard/characters/new" id="new-character-btn" className="btn btn-primary">
          + Nuovo Personaggio
        </a>
      </div>

      <div className="page-body">
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
          {/* Character list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {mockCharacters.map((c) => (
              <button
                key={c.id}
                id={`char-${c.id}`}
                onClick={() => setSelected(c)}
                className="card"
                style={{
                  cursor: "pointer",
                  border:
                    selected.id === c.id
                      ? "1px solid var(--primary)"
                      : "1px solid var(--border)",
                  background:
                    selected.id === c.id ? "var(--primary-glow)" : "var(--bg-card)",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{c.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>
                      {c.race} {c.charClass} Lv.{c.level}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.8rem", color: hpColor(c.hp, c.maxHp) }}>
                      {c.hp}/{c.maxHp}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>HP</div>
                  </div>
                </div>
                <div
                  className="hp-bar"
                  style={{ marginTop: 8 }}
                >
                  <div
                    className="hp-bar-fill"
                    style={{
                      width: `${hpPct(c.hp, c.maxHp)}%`,
                      background: hpColor(c.hp, c.maxHp),
                    }}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Character Sheet */}
          <div>
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title" style={{ fontSize: "1.3rem" }}>
                    {selected.name}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <span className="badge badge-gold">{selected.race}</span>
                    <span className="badge badge-purple">{selected.charClass}</span>
                    <span className="badge badge-green">Livello {selected.level}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-sm btn-secondary">✏ Modifica</button>
                  <button className="btn btn-sm btn-danger">🗑 Elimina</button>
                </div>
              </div>

              {/* Combat stats */}
              <div className="grid-3" style={{ marginBottom: 20 }}>
                {[
                  { label: "HP Attuali", value: `${selected.hp}/${selected.maxHp}` },
                  { label: "Classe Armatura", value: selected.ac },
                  { label: "Iniziativa", value: `+${Math.floor((selected.dex - 10) / 2)}` },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="card"
                    style={{ textAlign: "center", padding: "16px 12px" }}
                  >
                    <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{s.value}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: 4 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ability scores */}
              <div style={{ marginBottom: 8 }}>
                <div
                  style={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--text-muted)",
                    marginBottom: 8,
                  }}
                >
                  Caratteristiche
                </div>
              </div>
              <div className="stat-block" style={{ marginBottom: 20 }}>
                {[
                  { name: "FOR", value: selected.str },
                  { name: "DES", value: selected.dex },
                  { name: "COS", value: selected.con },
                  { name: "INT", value: selected.int },
                  { name: "SAG", value: selected.wis },
                  { name: "CAR", value: selected.cha },
                ].map((s) => (
                  <div key={s.name} className="stat-box">
                    <div className="stat-name">{s.name}</div>
                    <div className="stat-score">{s.value}</div>
                    <div className="stat-mod">{mod(s.value)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
