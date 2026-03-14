"use client";

import { useState } from "react";

const mockItems = [
  { id: "1", name: "Spada Lunga +1", type: "Arma", rarity: "Non comune", weight: 3, quantity: 1, equipped: true, damage: "1d8+1" },
  { id: "2", name: "Pozione di Guarigione", type: "Pozione", rarity: "Comune", weight: 0.5, quantity: 3, equipped: false, damage: "2d4+2" },
  { id: "3", name: "Armatura a Scaglie", type: "Armatura", rarity: "Comune", weight: 45, quantity: 1, equipped: true, damage: "—" },
  { id: "4", name: "Corda (15m)", type: "Strumento", rarity: "Comune", weight: 5, quantity: 1, equipped: false, damage: "—" },
  { id: "5", name: "Mantello dell'Elfo", type: "Oggetto Magico", rarity: "Non comune", weight: 1, quantity: 1, equipped: false, damage: "—" },
  { id: "6", name: "Libro degli Incantesimi", type: "Strumento", rarity: "Comune", weight: 3, quantity: 1, equipped: true, damage: "—" },
];

const rarityBadge: Record<string, string> = {
  "Comune": "badge-green",
  "Non comune": "badge-gold",
  "Raro": "badge-purple",
  "Molto raro": "badge-red",
};

export default function InventoryPage() {
  const [items, setItems] = useState(mockItems);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tutti");

  const types = ["Tutti", ...Array.from(new Set(mockItems.map((i) => i.type)))];
  const filtered = items.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Tutti" || i.type === filter;
    return matchSearch && matchFilter;
  });

  const totalWeight = items.reduce((acc, i) => acc + i.weight * i.quantity, 0);

  const toggleEquipped = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, equipped: !i.equipped } : i))
    );
  };

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
                        onClick={() => toggleEquipped(item.id)}
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
                        <button className="btn btn-sm btn-danger">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
