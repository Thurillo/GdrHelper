"use client";

import { useState } from "react";

const DICE = [4, 6, 8, 10, 12, 20, 100];

interface RollResult {
  dice: string;
  rolls: number[];
  total: number;
  modifier: number;
}

export default function DiceRoller() {
  const [modifier, setModifier] = useState(0);
  const [result, setResult] = useState<RollResult | null>(null);
  const [count, setCount] = useState(1);

  const roll = (sides: number) => {
    const rolls = Array.from({ length: count }, () => Math.ceil(Math.random() * sides));
    const total = rolls.reduce((a, b) => a + b, 0) + modifier;
    setResult({ dice: `${count}d${sides}`, rolls, total, modifier });
  };

  return (
    <div className="card">
      <div className="card-title mb-4">🎲 Lancio Dadi</div>

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

      <div className="dice-grid">
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

      <div className="dice-result">
        {result ? (
          <>
            <div className="dice-result-number">{result.total}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              {result.dice}
              {result.modifier !== 0 && ` ${result.modifier > 0 ? "+" : ""}${result.modifier}`}
              {" → "}[{result.rolls.join(", ")}]
            </div>
          </>
        ) : (
          <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Seleziona un dado per lanciare
          </div>
        )}
      </div>
    </div>
  );
}
