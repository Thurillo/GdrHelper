"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenziali non valide. Riprova.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <h1>⚔ GdrHelper</h1>
          <p>Virtual Tabletop per Dungeon Master</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="dm@dungeonmaster.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{error}</p>
          )}

          <button
            id="login-btn"
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
            style={{ justifyContent: "center", marginTop: "8px" }}
          >
            {loading ? "Accesso in corso…" : "Accedi"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          GdrHelper — Strumento per Dungeon Master
        </p>
      </div>
    </div>
  );
}
