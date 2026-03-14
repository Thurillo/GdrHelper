"use client";

import { useState } from "react";
import DiceRoller from "@/components/DiceRoller";

const mockStats = [
  { icon: "🧙", label: "Personaggi", value: "4", color: "#c8a05a" },
  { icon: "🗺", label: "Campagne", value: "2", color: "#7c5cbf" },
  { icon: "📖", label: "Voci Compendio", value: "128", color: "#4caf7d" },
  { icon: "🎒", label: "Oggetti", value: "45", color: "#e05252" },
];

const mockCharacters = [
  { name: "Aeron il Grigio", class: "Mago", level: 8, hp: 34, maxHp: 42, race: "Elfo" },
  { name: "Brandor", class: "Guerriero", level: 7, hp: 72, maxHp: 72, race: "Umano" },
  { name: "Lira Vantemoore", class: "Ladra", level: 7, hp: 45, maxHp: 52, race: "Halfling" },
  { name: "Thorn", class: "Chierico", level: 8, hp: 10, maxHp: 58, race: "Nano" },
];

function hpClass(hp: number, max: number) {
  const pct = hp / max;
  if (pct > 0.6) return "hp-high";
  if (pct > 0.3) return "hp-mid";
  return "hp-low";
}

export default function DashboardPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Benvenuto, Dungeon Master</p>
        </div>
        <button id="new-session-btn" className="btn btn-primary">
          ▶ Inizia Sessione
        </button>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="grid-4 mb-4">
          {mockStats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: `${s.color}20` }}>
                <span style={{ fontSize: "1.4rem" }}>{s.icon}</span>
              </div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: 20 }}>
          {/* Party overview */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Gruppo Attivo</div>
                <div className="card-subtitle">Stato HP in tempo reale</div>
              </div>
              <a href="/dashboard/characters" className="btn btn-sm btn-secondary">
                Gestisci
              </a>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mockCharacters.map((c) => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: "var(--bg-elevated)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  >
                    🧙
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{c.name}</span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                        {c.hp}/{c.maxHp} HP
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 2, alignItems: "center" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {c.race} {c.class} Lv.{c.level}
                      </span>
                    </div>
                    <div className="hp-bar">
                      <div
                        className={`hp-bar-fill ${hpClass(c.hp, c.maxHp)}`}
                        style={{ width: `${(c.hp / c.maxHp) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dice Roller */}
          <DiceRoller />
        </div>

        {/* Quick actions */}
        <div className="card mt-4">
          <div className="card-title mb-4">Azioni Rapide DM</div>
          <div className="grid-4">
            {[
              { icon: "💎", label: "Genera Loot", href: "/dashboard/loot" },
              { icon: "📖", label: "Cerca Compendio", href: "/dashboard/compendium" },
              { icon: "🧙", label: "Nuovo Personaggio", href: "/dashboard/characters/new" },
              { icon: "🗺", label: "Carica Mappa", href: "/dashboard/maps" },
            ].map((a) => (
              <a
                key={a.label}
                href={a.href}
                className="card"
                style={{ textAlign: "center", cursor: "pointer", textDecoration: "none" }}
              >
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>{a.icon}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  {a.label}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
