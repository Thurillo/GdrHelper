"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PlayersPage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text || "Errore durante la creazione");
        return;
      }

      setSuccess(`Account per ${name} creato con successo!`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("USER");
      setShowModal(false);
      fetchUsers(); // Refresh list
    } catch (err) {
      setError("Errore di rete");
    }
  };

  if (!isAdmin) {
    return (
      <div className="page-body mt-6">
        <div className="card text-center" style={{ padding: 40 }}>
          <div style={{ fontSize: "3rem", color: "var(--danger)" }}>🚫</div>
          <h3 className="mt-4" style={{ color: "var(--text-primary)" }}>Accesso Negato</h3>
          <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
            Solo i Dungeon Master (Admin) possono gestire gli account dei giocatori.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Gestione Giocatori</h2>
          <p>Crea e gestisci gli account di accesso per i tuoi party</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nuovo Account
        </button>
      </div>

      <div className="page-body">
        <div className="card">
          {loading ? (
            <div style={{ padding: 20, textAlign: "center", color: "var(--text-secondary)" }}>
              Caricamento account...
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nome Utente</th>
                    <th>Email</th>
                    <th>Ruolo</th>
                    <th>Creato il</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", padding: "30px 0" }}>
                        Nessun utente trovato
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{u.email}</td>
                        <td>
                          <span className={`badge ${u.role === "ADMIN" ? "badge-gold" : "badge-purple"}`}>
                            {u.role === "ADMIN" ? "Dungeon Master" : "Giocatore"}
                          </span>
                        </td>
                        <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                          {new Date(u.createdAt).toLocaleDateString("it-IT")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Creazione Utente */}
        {showModal && (
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
            onClick={() => setShowModal(false)}
          >
            <div
              className="card"
              style={{ width: "100%", maxWidth: 450, padding: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.4rem", marginBottom: 6 }}>
                Crea Nuovo Account
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: 24 }}>
                Genera le credenziali che il giocatore userà per accedere.
              </p>

              <form onSubmit={handleCreateUser} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {error && <div style={{ color: "var(--danger)", fontSize: "0.85rem", padding: "8px", background: "rgba(224,82,82,0.1)", borderRadius: 6 }}>{error}</div>}
                
                <div className="form-group">
                  <label className="form-label">Nome Giocatore</label>
                  <input required className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Es. Mario Rossi" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email di Accesso</label>
                  <input type="email" required className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="giocatore@email.it" />
                </div>

                <div className="form-group">
                  <label className="form-label">Password Provvisoria</label>
                  <input type="password" required minLength={6} className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimo 6 caratteri" />
                </div>

                <div className="form-group">
                  <label className="form-label">Ruolo Account</label>
                  <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="USER">Giocatore (USER)</option>
                    <option value="ADMIN">Dungeon Master (ADMIN)</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 12, justifyContent: "flex-end" }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Annulla
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Crea Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
