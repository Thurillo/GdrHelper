import { createCharacter } from "@/app/actions/character";
import Link from "next/link";

export default function NewCharacterPage() {
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
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="race" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Razza</label>
                  <input type="text" id="race" name="race" className="form-input" placeholder="Es. Elfo" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="charClass" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Classe</label>
                  <input type="text" id="charClass" name="charClass" className="form-input" placeholder="Es. Mago" />
                </div>
              </div>
            </div>

            <hr style={{ borderColor: "var(--border)", opacity: 0.5 }} />

            {/* COMBAT TIMECODE */}
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
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="strength" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Forza (FOR)</label>
                  <input type="number" id="strength" name="strength" min="1" max="30" defaultValue="10" className="form-input" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="dexterity" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Destrezza (DES)</label>
                  <input type="number" id="dexterity" name="dexterity" min="1" max="30" defaultValue="10" className="form-input" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="constitution" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Costituzione (COS)</label>
                  <input type="number" id="constitution" name="constitution" min="1" max="30" defaultValue="10" className="form-input" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="intelligence" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Intelligenza (INT)</label>
                  <input type="number" id="intelligence" name="intelligence" min="1" max="30" defaultValue="10" className="form-input" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="wisdom" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Saggezza (SAG)</label>
                  <input type="number" id="wisdom" name="wisdom" min="1" max="30" defaultValue="10" className="form-input" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label htmlFor="charisma" style={{ fontSize: "0.85rem", fontWeight: 500 }}>Carisma (CAR)</label>
                  <input type="number" id="charisma" name="charisma" min="1" max="30" defaultValue="10" className="form-input" />
                </div>
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
