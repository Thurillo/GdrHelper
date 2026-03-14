"use client";

export default function LootPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Generatore Bottino</h2>
          <p>Tabelle del bottino magico e casuale (Funzionalità Futura)</p>
        </div>
      </div>
      <div className="page-body">
        <div className="card" style={{ textAlign: "center", padding: "64px 24px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "16px" }}>💎</div>
          <h3 style={{ fontSize: "1.5rem", fontFamily: "'Cinzel', serif", color: "var(--primary)", marginBottom: "8px" }}>
            Generatore Loot
          </h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto" }}>
            L'integrazione con il compendio per l'assegnazione rapida del bottino ai giocatori
            verrà aggiunta in una patch successiva.
          </p>
        </div>
      </div>
    </div>
  );
}
