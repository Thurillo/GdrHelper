"use client";

import { useState, useEffect } from "react";
import { useSocket } from "./SocketProvider";

const DICE = [4, 6, 8, 10, 12, 20, 100];

interface RollResult {
  id?: string;
  diceType: string;
  rolls: number[];
  total: number;
  modifier: number;
  characterName: string;
  timestamp?: string;
}

export default function DiceRoller({ campaignId = "global" }: { campaignId?: string }) {
  const [modifier, setModifier] = useState(0);
  const [count, setCount] = useState(1);
  const [history, setHistory] = useState<RollResult[]>([]);
  
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join room
    socket.emit("join-campaign", campaignId);

    // Listen to rolls
    const handleDiceRolled = (data: any) => {
      setHistory((prev) => {
        const newHistory = [
          {
            id: data.timestamp + Math.random().toString(),
            diceType: data.diceType,
            rolls: data.originalResult || [],
            total: data.total,
            modifier: data.modifier,
            characterName: data.characterName,
            timestamp: new Date(data.timestamp).toLocaleTimeString(),
          },
          ...prev,
        ];
        // Keep only last 10 rolls
        return newHistory.slice(0, 10);
      });
    };

    socket.on("dice-rolled", handleDiceRolled);

    return () => {
      socket.off("dice-rolled", handleDiceRolled);
      socket.emit("leave-campaign", campaignId);
    };
  }, [socket, isConnected, campaignId]);

  const roll = (sides: number) => {
    const rolls = Array.from({ length: count }, () => Math.ceil(Math.random() * sides));
    const total = rolls.reduce((a, b) => a + b, 0) + modifier;
    const diceType = `${count}d${sides}`;
    
    // Add local optimistic result or just wait for socket? We add it via socket so everyone gets it
    if (socket && isConnected) {
      socket.emit("roll-dice", {
        campaignId,
        characterName: "DM/Giocatore", // For MVP, we pass a generic name
        diceType,
        originalResult: rolls,
        total,
        modifier,
        type: "standard"
      });
    } else {
      // Fallback if no socket connection
      setHistory(prev => [
        {
          id: Date.now().toString(),
          diceType,
          rolls,
          total,
          modifier,
          characterName: "Locale",
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev
      ].slice(0, 10));
    }
  };

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="card-header" style={{ borderBottom: "1px solid var(--border)", paddingBottom: 12, marginBottom: 16 }}>
        <div className="card-title">🎲 Lancio Dadi</div>
        {isConnected ? (
          <span className="badge badge-green" style={{ fontSize: "0.6rem" }}>Online</span>
        ) : (
          <span className="badge badge-red" style={{ fontSize: "0.6rem" }}>Offline</span>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Num. Dadi</label>
          <input
            type="number"
            className="form-input"
            value={count}
            min={1}
            max={20}
            id="dice-count"
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label">Modificatore</label>
          <input
            type="number"
            className="form-input"
            value={modifier}
            id="dice-modifier"
            onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="dice-grid" style={{ marginBottom: 20 }}>
        {DICE.map((d) => (
          <button
            key={d}
            id={`roll-d${d}`}
            className="dice-btn"
            onClick={() => roll(d)}
          >
            d{d}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", minHeight: 120 }}>
        <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
          Cronologia Lanci
        </div>
        
        {history.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {history.map((h, i) => (
              <div 
                key={h.id || i} 
                style={{ 
                  background: i === 0 ? "var(--primary-glow)" : "var(--bg-elevated)", 
                  padding: "8px 12px", 
                  borderRadius: 6,
                  border: i === 0 ? "1px solid rgba(200,160,90,0.3)" : "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: 2 }}>
                    <strong>{h.characterName}</strong> ha lanciato {h.diceType}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    Risultati: [{h.rolls.join(", ")}] {h.modifier !== 0 ? (h.modifier > 0 ? `+${h.modifier}` : h.modifier) : ""}
                  </div>
                </div>
                <div style={{ fontSize: "1.4rem", fontWeight: "bold", color: i === 0 ? "var(--primary)" : "var(--text-primary)" }}>
                  {h.total}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem", textAlign: "center", padding: 20, background: "var(--bg-elevated)", borderRadius: 8 }}>
            Nessun lancio recente
          </div>
        )}
      </div>
    </div>
  );
}
