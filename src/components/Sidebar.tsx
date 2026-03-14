"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", icon: "🏠", label: "Dashboard" },
  { href: "/dashboard/campaigns", icon: "🗺", label: "Campagne" },
  { href: "/dashboard/characters", icon: "🧙", label: "Personaggi" },
  { href: "/dashboard/inventory", icon: "🎒", label: "Inventario" },
  { href: "/dashboard/compendium", icon: "📖", label: "Compendio" },
];

const dmItems = [
  { href: "/dashboard/players", icon: "🗝", label: "Giocatori" },
  { href: "/dashboard/maps", icon: "🗺", label: "Mappe" },
  { href: "/dashboard/loot", icon: "💎", label: "Loot" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>⚔ GdrHelper</h1>
        <p>Virtual Tabletop</p>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Navigazione</span>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? "active" : ""}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        <span className="nav-section-label">Dungeon Master</span>
        {dmItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item ${pathname === item.href ? "active" : ""}`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          id="logout-btn"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="nav-item w-full"
          style={{ color: "var(--danger)" }}
        >
          <span>⏻</span>
          <span>Esci</span>
        </button>
      </div>
    </aside>
  );
}
