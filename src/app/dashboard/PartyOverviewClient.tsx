"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSocket } from "@/components/SocketProvider";

function hpClass(hp: number, max: number) {
  if (max === 0) return "hp-low";
  const pct = hp / max;
  if (pct > 0.6) return "hp-high";
  if (pct > 0.3) return "hp-mid";
  return "hp-low";
}

export default function PartyOverviewClient({
  initialCharacters,
}: {
  initialCharacters: any[];
}) {
  const [characters, setCharacters] = useState(initialCharacters);
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

  if (characters.length === 0) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "var(--text-secondary)" }}>
        Nessun personaggio trovato. <Link href="/dashboard/characters/new" style={{ color: "var(--primary)" }}>Creane uno</Link>.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {characters.map((c) => (
        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                {c.hitPoints}/{c.maxHitPoints} HP
              </span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 2, alignItems: "center" }}>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                {c.race || "Umanoide"} {c.charClass || "Avventuriero"} Lv.{c.level}
              </span>
            </div>
            <div className="hp-bar">
              <div
                className={`hp-bar-fill ${hpClass(c.hitPoints, c.maxHitPoints)}`}
                style={{ width: `${Math.max(0, Math.min(100, (c.hitPoints / (c.maxHitPoints || 1)) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
