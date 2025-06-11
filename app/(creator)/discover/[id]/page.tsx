import { mockCampaigns } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { CampaignDiscoverClient } from "./campaign-discover-client"

export async function generateStaticParams() {
  return mockCampaigns.map((campaign) => ({
    id: campaign.id,
  }))
}

interface CampaignDiscoverPageProps {
  params: {
    id: string
  }
}

export default function CampaignDiscoverPage({ params }: CampaignDiscoverPageProps) {
  const campaign = mockCampaigns.find(c => c.id === params.id)
  
  if (!campaign) {
    notFound()
  }

  return <CampaignDiscoverClient campaign={campaign} />
}