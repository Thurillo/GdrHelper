import DiceRoller from "@/components/DiceRoller";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import PartyOverviewClient from "./PartyOverviewClient";

function hpClass(hp: number, max: number) {
  if (max === 0) return "hp-low";
  const pct = hp / max;
  if (pct > 0.6) return "hp-high";
  if (pct > 0.3) return "hp-mid";
  return "hp-low";
}

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch real data counts
  const [characterCount, campaignCount, manualEntryCount, itemCount] = await Promise.all([
    prisma.character.count({ where: { userId: session.user.id } }),
    prisma.campaignUser.count({ where: { userId: session.user.id } }),
    prisma.manualEntry.count(),
    prisma.item.count()
  ]);

  const stats = [
    { icon: "🧙", label: "Personaggi", value: characterCount.toString(), color: "#c8a05a" },
    { icon: "🗺", label: "Campagne", value: campaignCount.toString(), color: "#7c5cbf" },
    { icon: "📖", label: "Voci Compendio", value: manualEntryCount.toString(), color: "#4caf7d" },
    { icon: "🎒", label: "Oggetti Globali", value: itemCount.toString(), color: "#e05252" },
  ];

  // Fetch up to 4 characters for the active party overview
  const characters = await prisma.character.findMany({
    where: { userId: session.user.id },
    take: 4,
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Benvenuto, {session.user.name || "Dungeon Master"}</p>
        </div>
        <button id="new-session-btn" className="btn btn-primary">
          ▶ Inizia Sessione
        </button>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="grid-4 mb-4">
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: `${s.color}20` }}>
                <span style={{ fontSize: "1.4rem" }}>{s.icon}</span>
              </div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: 20 }}>
          {/* Party overview */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">I Tuoi Personaggi</div>
                <div className="card-subtitle">Stato HP in tempo reale</div>
              </div>
              <Link href="/dashboard/characters" className="btn btn-sm btn-secondary">
                Gestisci
              </Link>
            </div>

            <PartyOverviewClient initialCharacters={characters} />
          </div>

          {/* Dice Roller */}
          <DiceRoller />
        </div>

        {/* Quick actions */}
        <div className="card mt-4">
          <div className="card-title mb-4">Azioni Rapide</div>
          <div className="grid-4">
            {[
              { icon: "💎", label: "Gestisci Inventario", href: "/dashboard/inventory" },
              { icon: "📖", label: "Cerca Compendio", href: "/dashboard/compendium" },
              { icon: "🧙", label: "Nuovo Personaggio", href: "/dashboard/characters/new" },
              { icon: "🗺", label: "Campagne", href: "/dashboard/campaigns" },
            ].map((a) => (
              <a
                key={a.label}
                href={a.href}
                className="card"
                style={{ textAlign: "center", cursor: "pointer", textDecoration: "none" }}
              >
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>{a.icon}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  {a.label}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
