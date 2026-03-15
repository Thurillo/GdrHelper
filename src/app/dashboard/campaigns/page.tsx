import { getCampaigns, getGameSystems } from "@/app/actions/campaign";
import CampaignClient from "./CampaignClient";

export const metadata = {
  title: "Campagne | GdrHelper",
  description: "Gestione delle tue campagne VTT",
};

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();
  const systems = await getGameSystems();

  return (
    <CampaignClient 
      initialCampaigns={campaigns} 
      gameSystems={systems} 
    />
  );
}
