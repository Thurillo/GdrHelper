"use client";

import { useState } from "react";

const mockCampaigns = [
  {
    id: "1",
    name: "La Mano dei Destini",
    system: "D&D 5e",
    players: 4,
    sessions: 12,
    status: "Attiva",
    description: "Un'epica saga che attraversa il continente di Faerûn, dove gli eroi devono fermare l'ascesa di un lich oscuro.",
    lastSession: "2026-03-10",
  },
  {
    id: "2",
    name: "I Segreti di Saltmarsh",
    system: "D&D 5e",
    players: 3,
    sessions: 5,
    status: "Pausa",
    description: "Avventura marinara nei pressi della città di Saltmarsh. I personaggi indagano misteri costieri e pirati.",
    lastSession: "2026-02-28",
  },
];

export default function CampaignsPage() {
  const [selected, setSelected] = useState(mockCampaigns[0]);
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Campagne</h2>
          <p>Gestione delle campagne di gioco</p>
        </div>
        <button
          id="new-campaign-btn"
          className="btn btn-primary"
          onClick={() => setShowNew(true)}
        >
          + Nuova Campagna
        </button>
      </div>

      <div className="page-body">
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
          {/* Campaign list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {mockCampaigns.map((c) => (
              <button
                key={c.id}
                id={`campaign-${c.id}`}
                onClick={() => setSelected(c)}
                className="card"
                style={{
                  cursor: "pointer",
                  textAlign: "left",
                  border:
                    selected.id === c.id
                      ? "1px solid var(--primary)"
                      : "1px solid var(--border)",
                  background:
                    selected.id === c.id
                      ? "var(--primary-glow)"
                      : "var(--bg-card)",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.name}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="badge badge-gold">{c.system}</span>
                  <span
                    className={`badge ${c.status === "Attiva" ? "badge-green" : "badge-gold"}`}
                  >
                    {c.status}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginTop: 8,
                  }}
                >
                  👥 {c.players} giocatori · 📅 {c.sessions} sessioni
                </div>
              </button>
            ))}

            <button
              className="card"
              style={{
                cursor: "pointer",
                textAlign: "center",
                borderStyle: "dashed",
                color: "var(--text-muted)",
                padding: 16,
              }}
              onClick={() => setShowNew(true)}
            >
              + Nuova campagna
            </button>
          </div>

          {/* Campaign detail */}
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header">
                <div>
                  <h3
                    style={{
                      fontSize: "1.4rem",
                      fontFamily: "'Cinzel', serif",
                      marginBottom: 8,
                    }}
                  >
                    {selected.name}
                  </h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span className="badge badge-gold">{selected.system}</span>
                    <span
                      className={`badge ${
                        selected.status === "Attiva" ? "badge-green" : "badge-gold"
                      }`}
                    >
                      {selected.status}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-sm btn-secondary">✏ Modifica</button>
                </div>
              </div>

              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                {selected.description}
              </p>

              <div className="grid-3">
                {[
                  { label: "Giocatori", value: selected.players, icon: "👥" },
                  { label: "Sessioni", value: selected.sessions, icon: "📅" },
                  {
                    label: "Ultima sessione",
                    value: new Date(selected.lastSession).toLocaleDateString("it-IT"),
                    icon: "🗓",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="card"
                    style={{ textAlign: "center", padding: "14px 10px" }}
                  >
                    <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontWeight: 700 }}>{s.value}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="card">
              <div className="card-title mb-4">Strumenti Campagna</div>
              <div className="grid-4">
                {[
                  { icon: "🧙", label: "Personaggi", href: "/dashboard/characters" },
                  { icon: "🎒", label: "Inventario", href: "/dashboard/inventory" },
                  { icon: "📖", label: "Compendio", href: "/dashboard/compendium" },
                  { icon: "💎", label: "Genera Loot", href: "/dashboard/loot" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="card"
                    style={{ textAlign: "center", textDecoration: "none", padding: 16 }}
                  >
                    <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>{l.icon}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {l.label}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* New Campaign modal placeholder */}
        {showNew && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowNew(false)}
          >
            <div
              className="card"
              style={{ width: 480, maxWidth: "90vw", padding: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontFamily: "'Cinzel', serif", marginBottom: 20 }}>Nuova Campagna</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Nome Campagna</label>
                  <input id="campaign-name-input" className="form-input" placeholder="Es. La Caduta dell'Impero" />
                </div>
                <div className="form-group">
                  <label className="form-label">Sistema di Gioco</label>
                  <select id="campaign-system-select" className="form-select">
                    <option value="dnd5e">D&D 5e</option>
                    <option value="pathfinder">Pathfinder 2e</option>
                    <option value="custom">Personalizzato</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Descrizione</label>
                  <textarea id="campaign-description" className="form-textarea" placeholder="Descrivi la tua campagna…" />
                </div>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button className="btn btn-secondary" onClick={() => setShowNew(false)}>Annulla</button>
                  <button id="create-campaign-btn" className="btn btn-primary">Crea Campagna</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
