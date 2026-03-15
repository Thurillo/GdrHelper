"use client";

import { useState } from "react";
import { createCampaign } from "@/app/actions/campaign";

// Props definition
type CampaignClientProps = {
  initialCampaigns: any[];
  gameSystems: any[];
};

export default function CampaignClient({ initialCampaigns, gameSystems }: CampaignClientProps) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [selected, setSelected] = useState(initialCampaigns[0] || null);
  const [showNew, setShowNew] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    try {
      await createCampaign(formData);
      // Let Server Action revalidate and refresh the page, 
      // but we can close the modal immediately.
      setShowNew(false);
      // Note: In Next.js, revalidatePath will trigger a re-fetch of the server component
      // and initialCampaigns will update, pushing new props to this component.
    } catch (err: any) {
      setError(err.message || "Errore durante la creazione");
    } finally {
      setIsPending(false);
    }
  }

  // Update selected if campaigns change and we have nothing selected
  if (!selected && campaigns.length > 0) {
    setSelected(campaigns[0]);
  }

  // Update state when props change
  if (initialCampaigns !== campaigns) {
    setCampaigns(initialCampaigns);
    if (selected) {
      const stillExists = initialCampaigns.find((c) => c.id === selected.id);
      setSelected(stillExists || initialCampaigns[0] || null);
    } else {
      setSelected(initialCampaigns[0] || null);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Campagne</h2>
          <p>Gestione delle campagne di gioco</p>
        </div>
        <button
          id="new-campaign-btn"
          className="btn btn-primary"
          onClick={() => setShowNew(true)}
        >
          + Nuova Campagna
        </button>
      </div>

      <div className="page-body">
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }}>
          {/* Campaign list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {campaigns.length === 0 && (
               <div style={{ color: "var(--text-muted)", padding: 16, textAlign: "center" }}>
                 Nessuna campagna trovata. Creane una nuova!
               </div>
            )}
            
            {campaigns.map((c) => (
              <button
                key={c.id}
                id={`campaign-${c.id}`}
                onClick={() => setSelected(c)}
                className="card"
                style={{
                  cursor: "pointer",
                  textAlign: "left",
                  border:
                    selected?.id === c.id
                      ? "1px solid var(--primary)"
                      : "1px solid var(--border)",
                  background:
                    selected?.id === c.id
                      ? "var(--primary-glow)"
                      : "var(--bg-card)",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{c.name}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  <span className="badge badge-gold">{c.system?.name || "Nuovo"}</span>
                  <span className="badge badge-green">Attiva</span>
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                  }}
                >
                  👥 {c.users?.length || 1} giocatori · 📅 {c.sessions?.length || 0} sessioni
                </div>
              </button>
            ))}

            <button
              className="card"
              style={{
                cursor: "pointer",
                textAlign: "center",
                borderStyle: "dashed",
                color: "var(--text-muted)",
                padding: 16,
                marginTop: campaigns.length > 0 ? 8 : 0,
              }}
              onClick={() => setShowNew(true)}
            >
              + Nuova campagna
            </button>
          </div>

          {/* Campaign detail */}
          {selected ? (
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header">
                <div>
                  <h3
                    style={{
                      fontSize: "1.4rem",
                      fontFamily: "'Cinzel', serif",
                      marginBottom: 8,
                    }}
                  >
                    {selected.name}
                  </h3>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span className="badge badge-gold">{selected.system?.name || "Sistema Sconosciuto"}</span>
                    <span className="badge badge-green">Attiva</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-sm btn-secondary">✏ Modifica</button>
                </div>
              </div>

              <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
                {selected.description}
              </p>

              <div className="grid-3">
                {[
                  { label: "Giocatori", value: selected.users?.length || 1, icon: "👥" },
                  { label: "Sessioni", value: selected.sessions?.length || 0, icon: "📅" },
                  {
                    label: "Creata il",
                    value: new Date(selected.createdAt).toLocaleDateString("it-IT"),
                    icon: "🗓",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="card"
                    style={{ textAlign: "center", padding: "14px 10px" }}
                  >
                    <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontWeight: 700 }}>{s.value}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="card">
              <div className="card-title mb-4">Strumenti Campagna</div>
              <div className="grid-4">
                {[
                  { icon: "🧙", label: "Personaggi", href: "/dashboard/characters" },
                  { icon: "🎒", label: "Inventario", href: "/dashboard/inventory" },
                  { icon: "📖", label: "Compendio", href: "/dashboard/compendium" },
                  { icon: "💎", label: "Genera Loot", href: "/dashboard/loot" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="card"
                    style={{ textAlign: "center", textDecoration: "none", padding: 16 }}
                  >
                    <div style={{ fontSize: "1.8rem", marginBottom: 6 }}>{l.icon}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {l.label}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          ) : (
             <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", minHeight: "400px" }}>
                Seleziona una campagna per visualizzarne i dettagli.
             </div>
          )}
        </div>

        {/* New Campaign modal placeholder */}
        {showNew && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowNew(false)}
          >
            <div
              className="card"
              style={{ width: 480, maxWidth: "90vw", padding: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontFamily: "'Cinzel', serif", marginBottom: 20 }}>Nuova Campagna</h3>
              
              {error && (
                <div style={{ color: "var(--warning)", padding: "10px", background: "rgba(255,0,0,0.1)", borderRadius: "4px", marginBottom: "16px" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleCreate}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Nome Campagna</label>
                    <input name="name" id="campaign-name-input" className="form-input" placeholder="Es. La Caduta dell'Impero" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sistema di Gioco</label>
                    <select name="systemId" id="campaign-system-select" className="form-select" required>
                      {gameSystems.map((sys: any) => (
                        <option key={sys.id} value={sys.id}>{sys.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Descrizione</label>
                    <textarea name="description" id="campaign-description" className="form-textarea" placeholder="Descrivi la tua campagna…" />
                  </div>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowNew(false)} disabled={isPending}>Annulla</button>
                    <button id="create-campaign-btn" type="submit" className="btn btn-primary" disabled={isPending}>
                      {isPending ? "Creazione..." : "Crea Campagna"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
