"use client";

import { useState } from "react";
import type { CompendiumEntryView } from "@/app/actions/compendium";

const categories = [
  { key: "all", label: "Tutti", icon: "📚" },
  { key: "spell", label: "Incantesimi", icon: "✨" },
  { key: "item", label: "Oggetti", icon: "🗡" },
  { key: "monster", label: "Mostri", icon: "👹" },
  { key: "ability", label: "Abilità", icon: "⚡" },
  { key: "rule", label: "Regole", icon: "📜" },
];

const categoryBadge: Record<string, string> = {
  spell: "badge-purple",
  item: "badge-gold",
  monster: "badge-red",
  ability: "badge-green",
  rule: "badge-green",
  equipment: "badge-gold",
};

const categoryLabel: Record<string, string> = {
  spell: "Incantesimo",
  item: "Oggetto",
  monster: "Mostro",
  ability: "Abilità",
  rule: "Regola",
};

export default function CompendiumClient({ initialEntries }: { initialEntries: CompendiumEntryView[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedEntry, setSelectedEntry] = useState(initialEntries[0] || null);

  const filtered = initialEntries.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || e.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Compendio</h2>
          <p>Manuali, incantesimi, oggetti e regole</p>
        </div>
        <button id="upload-manual-btn" className="btn btn-primary">📄 Carica Manuale PDF</button>
      </div>

      <div className="page-body">
        {/* Search + category filter */}
        <div className="card mb-4">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div className="search-wrapper" style={{ flex: 1, minWidth: 240 }}>
              <span className="search-icon">🔍</span>
              <input
                id="compendium-search"
                className="search-input"
                placeholder="Cerca incantesimi, oggetti, mostri, regole…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {categories.map((c) => (
                <button
                  key={c.key}
                  id={`cat-${c.key}`}
                  onClick={() => setCategory(c.key)}
                  className="btn btn-sm"
                  style={{
                    background: category === c.key ? "var(--primary-glow)" : "var(--bg-elevated)",
                    color: category === c.key ? "var(--primary)" : "var(--text-secondary)",
                    border: category === c.key ? "1px solid rgba(200,160,90,0.3)" : "1px solid var(--border)",
                  }}
                >
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
          {/* Results list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4 }}>
              {filtered.length} risultat{filtered.length === 1 ? "o" : "i"}
            </div>
            {filtered.map((entry) => (
              <button
                key={entry.id}
                id={`entry-${entry.id}`}
                onClick={() => setSelectedEntry(entry)}
                className="card"
                style={{
                  cursor: "pointer",
                  textAlign: "left",
                  border:
                    selectedEntry?.id === entry.id
                      ? "1px solid var(--primary)"
                      : "1px solid var(--border)",
                  background:
                    selectedEntry?.id === entry.id
                      ? "var(--primary-glow)"
                      : "var(--bg-card)",
                  padding: "12px 14px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>{entry.title}</div>
                  <span className={`badge ${categoryBadge[entry.category]}`} style={{ fontSize: "0.65rem", marginLeft: 8, flexShrink: 0 }}>
                    {categoryLabel[entry.category]}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginTop: 4,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {entry.description}
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          {selectedEntry ? (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <h3 style={{ fontSize: "1.4rem", fontFamily: "'Cinzel', serif" }}>{selectedEntry.title}</h3>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <span className={`badge ${categoryBadge[selectedEntry.category]}`}>
                      {categoryLabel[selectedEntry.category]}
                    </span>
                    {selectedEntry.level !== null && (
                      <span className="badge badge-purple">Livello {selectedEntry.level}</span>
                    )}
                    {selectedEntry.rarity && (
                      <span className="badge badge-gold">{selectedEntry.rarity}</span>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{selectedEntry.page}</div>
              </div>

              <div
                style={{
                  lineHeight: 1.7,
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  background: "var(--bg-dark)",
                  borderRadius: 8,
                  padding: "16px",
                  border: "1px solid var(--border)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedEntry.description}
              </div>

              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                <button className="btn btn-secondary btn-sm">📋 Copia in chat</button>
                <button className="btn btn-secondary btn-sm">🎒 Aggiungi a inventario</button>
              </div>
            </div>
          ) : (
             <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, color: "var(--text-muted)" }}>
               Seleziona una voce o espandi la ricerca.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
