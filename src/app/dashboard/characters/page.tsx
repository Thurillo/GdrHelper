import { getAuthSession } from "@/auth";
import prisma from "@/lib/prisma";
import ClientCharacterView from "./ClientCharacterView";
import { redirect } from "next/navigation";

export default async function CharactersPage() {
  const session = await getAuthSession();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch all characters for the logged in user
  // Or if the user is a DM, maybe we want to fetch characters in their campaigns?
  // For now, let's fetch characters they own.
  const characters = await prisma.character.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return <ClientCharacterView characters={characters} />;
}
