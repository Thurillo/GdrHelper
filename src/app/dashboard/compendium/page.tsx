import { getCompendiumEntries } from "@/app/actions/compendium";
import CompendiumClient from "./CompendiumClient";

export const metadata = {
  title: "Compendio | GdrHelper",
  description: "Manuali, regole, mostri e incantesimi",
};

export default async function CompendiumPage() {
  const entries = await getCompendiumEntries();

  return (
    <CompendiumClient initialEntries={entries} />
  );
}
