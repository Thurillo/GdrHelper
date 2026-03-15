"use server";

import prisma from "@/lib/prisma";
import { getAuthSession } from "@/auth";
import { revalidatePath } from "next/cache";

// Custom type based on expected UI props
export type InventoryItemView = {
  id: string; // InventoryItem.id
  itemId: string;
  name: string;
  type: string;
  rarity: string;
  damage: string;
  weight: number;
  quantity: number;
  equipped: boolean;
};

// Gets or creates a global party inventory for the user
async function getOrCreateGlobalInventory(userId: string) {
  // Try to find the user's first character to attach to, or create one dummy Inventory if none exist
  // For simplicity MVP we will just return all inventory items across all user characters
  // or create a generic party inventory. Let's create an Inventory for the User if we add userId, 
  // but Inventory doesn't have userId.
  
  // Look for any inventory associated with characters of this user
  const characters = await prisma.character.findMany({
    where: { userId },
    select: { id: true, inventory: { select: { id: true } } }
  });

  const charWithInv = characters.find(c => c.inventory);
  if (charWithInv?.inventory) {
    return charWithInv.inventory.id;
  }

  // Create an inventory for the first character if it exists
  if (characters.length > 0) {
    const inv = await prisma.inventory.create({
      data: { characterId: characters[0].id }
    });
    return inv.id;
  }

  // No characters exist, create an empty inventory without char
  const inv = await prisma.inventory.create({ data: {} });
  return inv.id;
}

export async function getInventoryItems(): Promise<InventoryItemView[]> {
  const session = await getAuthSession();
  if (!session?.user?.id) return [];

  // Fetch all inventory items that belong to the user's characters
  const items = await prisma.inventoryItem.findMany({
    where: {
      inventory: {
        character: {
          userId: session.user.id
        }
      }
    },
    include: {
      item: true
    }
  });

  // If no items are found across characters, maybe we want to quickly seed some mock data for the MVP?
  if (items.length === 0) {
    const invId = await getOrCreateGlobalInventory(session.user.id);
    
    // Seed items
    const sword = await prisma.item.create({ data: { name: "Spada Lunga +1", type: "Arma", rarity: "Non comune", weight: 3, damage: "1d8+1" }});
    const potion = await prisma.item.create({ data: { name: "Pozione di Guarigione", type: "Pozione", rarity: "Comune", weight: 0.5, damage: "2d4+2" }});
    
    await prisma.inventoryItem.create({ data: { inventoryId: invId, itemId: sword.id, quantity: 1, equipped: true }});
    await prisma.inventoryItem.create({ data: { inventoryId: invId, itemId: potion.id, quantity: 3, equipped: false }});
    
    revalidatePath("/dashboard/inventory");
    // Return empty on this pass, page will refresh
    return [];
  }

  return items.map(invItem => ({
    id: invItem.id,
    itemId: invItem.itemId,
    name: invItem.item.name,
    type: invItem.item.type || "Generico",
    rarity: invItem.item.rarity || "Comune",
    damage: invItem.item.damage || "—",
    weight: invItem.item.weight,
    quantity: invItem.quantity,
    equipped: invItem.equipped,
  }));
}

export async function toggleItemEquipped(id: string, equipped: boolean) {
  const session = await getAuthSession();
  if (!session?.user?.id) throw new Error("Non autorizzato");

  await prisma.inventoryItem.update({
    where: { id },
    data: { equipped }
  });

  revalidatePath("/dashboard/inventory");
}

export async function deleteInventoryItem(id: string) {
  const session = await getAuthSession();
  if (!session?.user?.id) throw new Error("Non autorizzato");

  await prisma.inventoryItem.delete({
    where: { id }
  });

  revalidatePath("/dashboard/inventory");
}
