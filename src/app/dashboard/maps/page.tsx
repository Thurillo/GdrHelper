"use client";

export default function MapsPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Mappe e Token</h2>
          <p>Gestione planimetrie e posizionamento tattico (Funzionalità Futura)</p>
        </div>
      </div>
      <div className="page-body">
        <div className="card" style={{ textAlign: "center", padding: "64px 24px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🗺</div>
          <h3 style={{ fontSize: "1.5rem", fontFamily: "'Cinzel', serif", color: "var(--primary)", marginBottom: "8px" }}>
            Sistema Mappe in Arrivo
          </h3>
          <p style={{ color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto" }}>
            Il sistema VTT per le mappe di battaglia con griglia, nebbia di guerra e token interattivi
            sarà implementato nella prossima fase di sviluppo.
          </p>
        </div>
      </div>
    </div>
  );
}
