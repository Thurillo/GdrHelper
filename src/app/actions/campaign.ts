"use server";

import prisma from "@/lib/prisma";
import { getAuthSession } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getGameSystems() {
  let systems = await prisma.gameSystem.findMany();
  if (systems.length === 0) {
    const defaultSystem = await prisma.gameSystem.create({
      data: { name: "D&D 5e", description: "Dungeons & Dragons 5th Edition" }
    });
    // Create another popular standard system for choices
    const pathfinder = await prisma.gameSystem.create({
      data: { name: "Pathfinder 2e", description: "Pathfinder Second Edition" }
    });
    systems = [defaultSystem, pathfinder];
  }
  return systems;
}

export async function getCampaigns() {
  const session = await getAuthSession();
  if (!session?.user?.id) return [];
  return prisma.campaign.findMany({
    where: { users: { some: { userId: session.user.id } } },
    include: { system: true, users: true, sessions: true },
    orderBy: { updatedAt: "desc" }
  });
}

export async function createCampaign(formData: FormData) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    throw new Error("Devi effettuare l'accesso per creare una campagna");
  }

  const name = formData.get("name") as string;
  const systemId = formData.get("systemId") as string;
  const description = formData.get("description") as string;

  if (!name || !systemId) {
    throw new Error("Nome e sistema di gioco sono obbligatori");
  }

  // Create campaign
  const campaign = await prisma.campaign.create({
    data: {
      name,
      description,
      systemId,
      createdById: session.user.id,
      users: {
        create: {
          userId: session.user.id,
          role: "DM",
        }
      }
    },
  });

  revalidatePath("/dashboard/campaigns");
  return campaign;
}
