"use client";

import { useState } from "react";
import { type InventoryItemView, toggleItemEquipped, deleteInventoryItem } from "@/app/actions/inventory";

const rarityBadge: Record<string, string> = {
  "Comune": "badge-green",
  "Non comune": "badge-gold",
  "Raro": "badge-purple",
  "Molto raro": "badge-red",
};

export default function InventoryClient({ initialItems }: { initialItems: InventoryItemView[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tutti");

  const types = ["Tutti", ...Array.from(new Set(initialItems.map((i) => i.type)))];
  
  const filtered = initialItems.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Tutti" || i.type === filter;
    return matchSearch && matchFilter;
  });

  const totalWeight = initialItems.reduce((acc, i) => acc + i.weight * i.quantity, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Inventario</h2>
          <p>Oggetti del gruppo — Peso totale: {totalWeight.toFixed(1)} kg</p>
        </div>
        <button id="add-item-btn" className="btn btn-primary">+ Aggiungi Oggetto</button>
      </div>

      <div className="page-body">
        {/* Filters */}
        <div className="card mb-4">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <div className="search-wrapper" style={{ flex: 1, minWidth: 200 }}>
              <span className="search-icon">🔍</span>
              <input
                id="inventory-search"
                className="search-input"
                placeholder="Cerca oggetto…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {types.map((t) => (
                <button
                  key={t}
                  id={`filter-${t}`}
                  onClick={() => setFilter(t)}
                  className="btn btn-sm"
                  style={{
                    background: filter === t ? "var(--primary-glow)" : "var(--bg-elevated)",
                    color: filter === t ? "var(--primary)" : "var(--text-secondary)",
                    border: filter === t ? "1px solid rgba(200,160,90,0.3)" : "1px solid var(--border)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Item table */}
        <div className="card">
          <div className="table-container">
            {initialItems.length === 0 ? (
               <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                 Nessun oggetto nell'inventario.
               </div>
            ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Equipaggiato</th>
                      <th>Nome Oggetto</th>
                      <th>Tipo</th>
                      <th>Rarità</th>
                      <th>Danno</th>
                      <th>Peso</th>
                      <th>Qtà</th>
                      <th>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <button
                            id={`equip-${item.id}`}
                            onClick={() => toggleItemEquipped(item.id, !item.equipped)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "1.1rem",
                            }}
                            title={item.equipped ? "Rimuovi equipaggiamento" : "Equipaggia"}
                          >
                            {item.equipped ? "🟡" : "⚪"}
                          </button>
                        </td>
                        <td style={{ fontWeight: 500 }}>{item.name}</td>
                        <td style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{item.type}</td>
                        <td>
                          <span className={`badge ${rarityBadge[item.rarity] || "badge-green"}`}>
                            {item.rarity}
                          </span>
                        </td>
                        <td style={{ color: "var(--text-secondary)", fontFamily: "monospace" }}>{item.damage}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{item.weight} kg</td>
                        <td>{item.quantity}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="btn btn-sm btn-secondary">✏</button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => {
                                if (confirm("Vuoi davvero eliminare questo oggetto?")) {
                                  deleteInventoryItem(item.id);
                                }
                              }}
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
