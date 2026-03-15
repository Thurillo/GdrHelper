"use client";

import { useState } from "react";
import type { Character, Prisma } from "@prisma/client";
import { useEffect } from "react";
import Link from "next/link";
import { updateCharacterHp, deleteCharacter } from "@/app/actions/character";
import { useSocket } from "@/components/SocketProvider";

function mod(score: number) {
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
}

function hpPct(hp: number, max: number) {
  if (max === 0) return 0;
  return Math.max(0, Math.min(100, (hp / max) * 100));
}

function hpColor(hp: number, max: number) {
  if (max === 0) return "var(--danger)";
  const pct = hp / max;
  if (pct > 0.6) return "var(--success)";
  if (pct > 0.3) return "var(--primary)";
  return "var(--danger)";
}

export default function ClientCharacterView({
  characters: initialCharacters,
}: {
  characters: (Character & { race?: { name: string } | null })[];
}) {
  const [characters, setCharacters] = useState(initialCharacters);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialCharacters.length > 0 ? initialCharacters[0].id : null
  );

  const { socket, isConnected } = useSocket();

  useEffect(() => {
    setCharacters(initialCharacters);
  }, [initialCharacters]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit("join-campaign", "global");

    const handleHpUpdate = (data: { characterId: string; hitPoints: number }) => {
      setCharacters((prev) =>
        prev.map((c) => (c.id === data.characterId ? { ...c, hitPoints: data.hitPoints } : c))
      );
    };

    socket.on("hp-updated", handleHpUpdate);

    return () => {
      socket.off("hp-updated", handleHpUpdate);
      socket.emit("leave-campaign", "global");
    };
  }, [socket, isConnected]);

  const handleUpdateHp = async (id: string, newHp: number, maxHp: number) => {
    const clampedHp = Math.max(0, Math.min(maxHp, newHp));
    
    // Optimistic local update
    setCharacters((prev) => prev.map((c) => (c.id === id ? { ...c, hitPoints: clampedHp } : c)));
    
    // Broadcast via socket
    if (socket && isConnected) {
      socket.emit("update-hp", { campaignId: "global", characterId: id, hitPoints: clampedHp });
    }

    // Persist to DB
    await updateCharacterHp(id, clampedHp);
  };

  const selected = characters.find((c) => c.id === selectedId);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Personaggi</h2>
          <p>Gestione schede personaggio della campagna</p>
        </div>
        <Link href="/dashboard/characters/new" id="new-character-btn" className="btn btn-primary">
          + Nuovo Personaggio
        </Link>
      </div>

      <div className="page-body">
        {characters.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: 40 }}>
            <h3>Nessun personaggio trovato</h3>
            <p style={{ color: "var(--text-secondary)", marginTop: 8, marginBottom: 20 }}>
              Non hai ancora creato alcun personaggio.
            </p>
            <Link href="/dashboard/characters/new" className="btn btn-primary" style={{ display: "inline-block" }}>
              Crea il tuo primo personaggio
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
            {/* Character list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {characters.map((c) => (
                <button
                  key={c.id}
                  id={`char-${c.id}`}
                  onClick={() => setSelectedId(c.id)}
                  className="card"
                  style={{
                    cursor: "pointer",
                    border:
                      selected?.id === c.id
                        ? "1px solid var(--primary)"
                        : "1px solid var(--border)",
                    background:
                      selected?.id === c.id ? "var(--primary-glow)" : "var(--bg-card)",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{c.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: 2 }}>
                        {c.race?.name || "Umanoide"} {c.charClass || "Avventuriero"} Lv.{c.level}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "0.8rem", color: hpColor(c.hitPoints, c.maxHitPoints) }}>
                        {c.hitPoints}/{c.maxHitPoints}
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>HP</div>
                    </div>
                  </div>
                  <div className="hp-bar" style={{ marginTop: 8 }}>
                    <div
                      className="hp-bar-fill"
                      style={{
                        width: `${hpPct(c.hitPoints, c.maxHitPoints)}%`,
                        background: hpColor(c.hitPoints, c.maxHitPoints),
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Character Sheet */}
            {selected && (
              <div>
                <div className="card">
                  <div className="card-header">
                    <div>
                      <div className="card-title" style={{ fontSize: "1.3rem" }}>
                        {selected.name}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                        {selected.race?.name && <span className="badge badge-gold">{selected.race.name}</span>}
                        {selected.charClass && <span className="badge badge-purple">{selected.charClass}</span>}
                        <span className="badge badge-green">Livello {selected.level}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-sm btn-secondary">✏ Modifica</button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={async () => {
                          if (confirm("Sei sicuro di voler eliminare questo personaggio?")) {
                            await deleteCharacter(selected.id);
                            setSelectedId(null);
                          }
                        }}
                      >
                        🗑 Elimina
                      </button>
                    </div>
                  </div>

                  {/* Combat stats */}
                  <div className="grid-3" style={{ marginBottom: 20 }}>
                    <div className="card" style={{ textAlign: "center", padding: "16px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <button 
                          onClick={() => handleUpdateHp(selected.id, selected.hitPoints - 1, selected.maxHitPoints)}
                          className="btn btn-sm btn-danger" 
                          style={{ padding: "0 8px", fontSize: "1.2rem" }}>-</button>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                          {selected.hitPoints}/{selected.maxHitPoints}
                        </div>
                        <button 
                          onClick={() => handleUpdateHp(selected.id, selected.hitPoints + 1, selected.maxHitPoints)}
                          className="btn btn-sm btn-success" 
                          style={{ padding: "0 8px", fontSize: "1.2rem" }}>+</button>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", marginTop: 4 }}>
                        HP Attuali
                      </div>
                    </div>

                    {[
                      { label: "Classe Armatura", value: selected.armorClass },
                      { label: "Iniziativa", value: selected.initiative >= 0 ? `+${selected.initiative}` : selected.initiative },
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
                      { name: "FOR", value: selected.strength },
                      { name: "DES", value: selected.dexterity },
                      { name: "COS", value: selected.constitution },
                      { name: "INT", value: selected.intelligence },
                      { name: "SAG", value: selected.wisdom },
                      { name: "CAR", value: selected.charisma },
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
