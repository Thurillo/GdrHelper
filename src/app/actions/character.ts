"use server";

import prisma from "@/lib/prisma";
import { getAuthSession } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCharacter(formData: FormData) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    throw new Error("Devi effettuare l'accesso per creare un personaggio");
  }

  const name = formData.get("name") as string;
  const race = formData.get("race") as string;
  const charClass = formData.get("charClass") as string;
  const level = parseInt(formData.get("level") as string) || 1;
  const maxHitPoints = parseInt(formData.get("maxHitPoints") as string) || 10;
  const armorClass = parseInt(formData.get("armorClass") as string) || 10;
  
  const strength = parseInt(formData.get("strength") as string) || 10;
  const dexterity = parseInt(formData.get("dexterity") as string) || 10;
  const constitution = parseInt(formData.get("constitution") as string) || 10;
  const intelligence = parseInt(formData.get("intelligence") as string) || 10;
  const wisdom = parseInt(formData.get("wisdom") as string) || 10;
  const charisma = parseInt(formData.get("charisma") as string) || 10;

  if (!name) {
    throw new Error("Il nome è obbligatorio");
  }

  const initiative = Math.floor((dexterity - 10) / 2);

  const character = await prisma.character.create({
    data: {
      userId: session.user.id,
      name,
      race,
      charClass,
      level,
      maxHitPoints,
      hitPoints: maxHitPoints, // starts with full HP
      armorClass,
      strength,
      dexterity,
      constitution,
      intelligence,
      wisdom,
      charisma,
      initiative,
    },
  });

  revalidatePath("/dashboard/characters");
  redirect("/dashboard/characters");
}

export async function deleteCharacter(id: string) {
  const session = await getAuthSession();
  if (!session?.user?.id) throw new Error("Non autorizzato");

  await prisma.character.deleteMany({
    where: {
      id,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard/characters");
}

export async function updateCharacterHp(id: string, newHp: number) {
  const session = await getAuthSession();
  if (!session?.user?.id) throw new Error("Non autorizzato");

  // Verify ownership or DM status - for now, just ownership
  const char = await prisma.character.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!char) throw new Error("Personaggio non trovato");

  // Clamp HP between 0 and maxHitPoints
  const clampedHp = Math.max(0, Math.min(char.maxHitPoints, newHp));

  await prisma.character.update({
    where: { id },
    data: { hitPoints: clampedHp },
  });

  revalidatePath("/dashboard/characters");
}
