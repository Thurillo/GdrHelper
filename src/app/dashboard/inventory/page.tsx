import { getInventoryItems } from "@/app/actions/inventory";
import InventoryClient from "./InventoryClient";

export const metadata = {
  title: "Inventario | GdrHelper",
  description: "Gestisci l'inventario del party",
};

export default async function InventoryPage() {
  const items = await getInventoryItems();

  return (
    <InventoryClient initialItems={items} />
  );
}
