import { mockCampaigns } from "@/lib/mock-data"
import { notFound } from "next/navigation"
import { CampaignDetailClient } from "./campaign-detail-client"

export async function generateStaticParams() {
  return mockCampaigns.map((campaign) => ({
    id: campaign.id,
  }))
}

interface CampaignDetailPageProps {
  params: {
    id: string
  }
}

export default function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const campaign = mockCampaigns.find(c => c.id === params.id)
  
  if (!campaign) {
    notFound()
  }

  return <CampaignDetailClient campaign={campaign} />
}