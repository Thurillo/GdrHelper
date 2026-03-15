import { createCharacter } from "@/app/actions/character";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewCharacterPage() {
  // Fetch all races and their subraces from DB
  const races = await prisma.race.findMany({
    include: { subraces: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Nuovo Personaggio</h2>
          <p>Crea la tua scheda avventuriero (D&D 5e)</p>
        </div>
        <Link href="/dashboard/characters" className="btn btn-secondary">
          Annulla
        </Link>
      </div>

      <div className="page-body">
        <div className="card" style={{ maxWidth: 800, margin: "0 auto" }}>
          <form action={createCharacter} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* INFORMAZIONI BASE */}
            <div>
              <h3 style={{ marginBottom: 16 }}>Informazioni Base</h3>
              <div className="grid-3">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="name" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Nome *</label>
                  <input type="text" id="name" name="name" required className="form-input" placeholder="Es. Aeron il Grigio" />
                </div>

                {/* RAZZA DROPDOWN */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="raceId" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Razza</label>
                  {races.length > 0 ? (
                    <select id="raceId" name="raceId" className="form-input">
                      <option value="">— Scegli una razza —</option>
                      {races.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input type="text" id="race" name="race" className="form-input" placeholder="Es. Elfo" />
                  )}
                </div>

                {/* SOTTORAZZA DROPDOWN (shown only if races exist) */}
                {races.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label htmlFor="subraceId" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Sottorazza</label>
                    <select id="subraceId" name="subraceId" className="form-input">
                      <option value="">— Scegli una sottorazza —</option>
                      {races.flatMap((r) =>
                        r.subraces.map((s) => (
                          <option key={s.id} value={s.id}>{r.name} — {s.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                )}

                {/* CLASSE */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="charClass" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Classe</label>
                  <select id="charClass" name="charClass" className="form-input">
                    <option value="">— Scegli una classe —</option>
                    {[
                      "Barbaro", "Bardo", "Chierico", "Druido",
                      "Guerriero", "Ladro", "Mago", "Monaco",
                      "Paladino", "Ranger", "Stregone", "Warlock",
                    ].map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <hr style={{ borderColor: "var(--border)", opacity: 0.5 }} />

            {/* COMBAT STATS */}
            <div>
              <h3 style={{ marginBottom: 16 }}>Statistiche di Combattimento</h3>
              <div className="grid-3">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="level" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Livello</label>
                  <input type="number" id="level" name="level" min="1" max="20" defaultValue="1" className="form-input" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="maxHitPoints" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Punti Ferita Massimi</label>
                  <input type="number" id="maxHitPoints" name="maxHitPoints" min="1" defaultValue="10" className="form-input" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="armorClass" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Classe Armatura (CA)</label>
                  <input type="number" id="armorClass" name="armorClass" min="1" defaultValue="10" className="form-input" />
                </div>
              </div>
            </div>

            <hr style={{ borderColor: "var(--border)", opacity: 0.5 }} />

            {/* ABILITY SCORES */}
            <div>
              <h3 style={{ marginBottom: 16 }}>Caratteristiche Base</h3>
              <div className="grid-3">
                {[
                  { id: "strength", label: "Forza (FOR)", name: "strength" },
                  { id: "dexterity", label: "Destrezza (DES)", name: "dexterity" },
                  { id: "constitution", label: "Costituzione (COS)", name: "constitution" },
                  { id: "intelligence", label: "Intelligenza (INT)", name: "intelligence" },
                  { id: "wisdom", label: "Saggezza (SAG)", name: "wisdom" },
                  { id: "charisma", label: "Carisma (CAR)", name: "charisma" },
                ].map((stat) => (
                  <div key={stat.id} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label htmlFor={stat.id} style={{ fontSize: "0.85rem", fontWeight: 500 }}>{stat.label}</label>
                    <input type="number" id={stat.id} name={stat.name} min="1" max="30" defaultValue="10" className="form-input" />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <button type="submit" className="btn btn-primary" style={{ padding: "12px 32px", fontSize: "1.1rem" }}>
                Salva Personaggio
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
