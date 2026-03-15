"use server";

import prisma from "@/lib/prisma";
import { getAuthSession } from "@/auth";

export type CompendiumEntryView = {
  id: string;
  title: string;
  category: string;
  description: string;
  page: string | null;
  rarity: string | null;
  level: number | null;
};

export async function getCompendiumEntries(): Promise<CompendiumEntryView[]> {
  const session = await getAuthSession();
  if (!session?.user?.id) return [];

  // Fetch ManualEntries
  const manualEntries = await prisma.manualEntry.findMany({
    include: { manual: true },
    take: 100 // limit for MVP performance if large
  });

  // Fetch Spells
  const spells = await prisma.spell.findMany({
    take: 100
  });

  const views: CompendiumEntryView[] = [];

  for (const entry of manualEntries) {
    views.push({
      id: `me-${entry.id}`,
      title: entry.title,
      category: entry.category,
      description: entry.description,
      page: entry.pageRef || entry.manual.title,
      rarity: entry.category === "item" ? "Comune" : null, // Simplification for MVP
      level: null,
    });
  }

  for (const spell of spells) {
    views.push({
      id: `sp-${spell.id}`,
      title: spell.name,
      category: "spell",
      description: `Tempo di Lancio: ${spell.castingTime}\nGittata: ${spell.range}\nComponenti: ${spell.components}\nDurata: ${spell.duration}\n\n${spell.description}`,
      page: "Incantesimi",
      rarity: null,
      level: spell.level,
    });
  }

  // If DB is completely empty we can seed some mock objects for the MVP feel
  if (views.length === 0) {
    views.push(
      { id: "1", title: "Palla di Fuoco", category: "spell", description: "Una sfera di fiamma...", page: "PHB p.241", rarity: null, level: 3 },
      { id: "3", title: "Spada Lunga", category: "item", description: "Arma da mischia...", page: "PHB p.149", rarity: "Comune", level: null },
      { id: "4", title: "Goblin", category: "monster", description: "Piccola creatura...", page: "MM p.166", rarity: null, level: null },
      { id: "5", title: "Attacco Extra", category: "ability", description: "Attacca due volte.", page: "PHB p.72", rarity: null, level: null }
    );
  }

  // Sort them loosely alphabetically
  views.sort((a, b) => a.title.localeCompare(b.title));

  return views;
}
