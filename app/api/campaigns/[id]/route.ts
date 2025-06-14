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
      brand_name: campaign.brand?.name,
      status: campaign.status,
      deadline: campaign.endDate,
      created_at: campaign.createdAt,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = mockCampaigns.find(c => c.id === params.id)
    
    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const { 
      title, 
      description, 
      guidelines, 
      ipKitId,
      startDate,
      endDate,
      maxSubmissions,
      rewardAmount,
      rewardCurrency = "USD",
      briefDocument,
      status = "draft"
    } = body
    
    if (!title || !description || !guidelines || !ipKitId) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, guidelines, and ipKitId are required" },
        { status: 400 }
      )
    }

    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      if (end <= start) {
        return NextResponse.json(
          { error: "End date must be after start date" },
          { status: 400 }
        )
      }
    }

    if (endDate && new Date(endDate) <= new Date()) {
      return NextResponse.json(
        { error: "End date must be in the future" },
        { status: 400 }
      )
    }

    // Validate status transitions
    const allowedTransitions: Record<string, string[]> = {
      "draft": ["active"],
      "active": ["paused", "closed"],
      "paused": ["active", "closed"],
      "closed": [] // Cannot transition from closed
    }

    if (status !== campaign.status) {
      const allowed = allowedTransitions[campaign.status] || []
      if (!allowed.includes(status)) {
        return NextResponse.json(
          { error: `Cannot transition from ${campaign.status} to ${status}` },
          { status: 400 }
        )
      }
    }

    // Update campaign (mock - in real implementation, update database)
    const updatedCampaign = {
      ...campaign,
      title,
      description,
      guidelines,
      ipKitId,
      status: status as "draft" | "active" | "paused" | "closed",
      startDate: startDate ? new Date(startDate) : campaign.startDate,
      endDate: endDate ? new Date(endDate) : campaign.endDate,
      maxSubmissions: maxSubmissions || null,
      rewardAmount: rewardAmount || null,
      rewardCurrency,
      briefDocument: briefDocument || null,
      updatedAt: new Date(),
    }

    // TODO: In a real implementation, save to database here
    // For now, we'll just simulate the response

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))

    return NextResponse.json({
      campaign: {
        id: updatedCampaign.id,
        title: updatedCampaign.title,
        status: updatedCampaign.status,
        updated_at: updatedCampaign.updatedAt,
      }
    })

  } catch (error) {
    console.error("Campaign update error:", error)
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    )
  }
}