import { NextRequest, NextResponse } from "next/server"
import { mockCampaigns } from "@/lib/mock-data"

export async function generateStaticParams() {
  return mockCampaigns.map((campaign) => ({
    id: campaign.id,
  }))
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const campaign = mockCampaigns.find(c => c.id === params.id)
  
  if (!campaign) {
    return NextResponse.json(
      { error: "Campaign not found" },
      { status: 404 }
    )
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))

  return NextResponse.json({
    campaign: {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      guidelines: campaign.guidelines,
      brand_name: campaign.brand_name,
      status: campaign.status,
      deadline: campaign.deadline,
      created_at: campaign.created_at,
      assets: campaign.assets.map(asset => ({
        id: asset.id,
        filename: asset.filename,
        url: asset.url,
        category: asset.category,
        metadata: asset.metadata,
      }))
    }
  })
}