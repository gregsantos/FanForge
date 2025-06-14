import { NextRequest, NextResponse } from "next/server"
import { mockCampaigns } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search")
  const status = searchParams.get("status")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "12")

  let filteredCampaigns = [...mockCampaigns]

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase()
    filteredCampaigns = filteredCampaigns.filter(campaign =>
      campaign.title.toLowerCase().includes(searchLower) ||
      campaign.description.toLowerCase().includes(searchLower) ||
      (campaign.brand?.name?.toLowerCase().includes(searchLower) || false)
    )
  }

  // Apply status filter
  if (status && status !== "all") {
    filteredCampaigns = filteredCampaigns.filter(campaign => campaign.status === status)
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex)

  const response = {
    campaigns: paginatedCampaigns.map(campaign => ({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      brand_name: campaign.brand.name,
      status: campaign.status,
      deadline: campaign.endDate,
      asset_count: campaign.assets.length,
      submission_count: campaign.submissionCount || 0,
      thumbnail_url: campaign.assets[0]?.url || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
    })),
    pagination: {
      page,
      limit,
      total: filteredCampaigns.length,
      pages: Math.ceil(filteredCampaigns.length / limit),
    }
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  return NextResponse.json(response)
}

export async function POST(request: NextRequest) {
  try {
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

    // Create new campaign (mock)
    const newCampaign = {
      id: `campaign-${Date.now()}`,
      title,
      description,
      guidelines,
      ipKitId,
      brand_id: "mock-brand-id",
      brand_name: "Mock Brand",
      status: status as "draft" | "active" | "paused" | "closed",
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      maxSubmissions: maxSubmissions || null,
      rewardAmount: rewardAmount || null,
      rewardCurrency,
      briefDocument: briefDocument || null,
      assets: [],
      submission_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }

    // TODO: In a real implementation, save to database here
    // For now, we'll just simulate the response

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      campaign: {
        id: newCampaign.id,
        title: newCampaign.title,
        status: newCampaign.status,
        created_at: newCampaign.created_at,
        updated_at: newCampaign.updated_at,
      }
    }, { status: 201 })

  } catch (error) {
    console.error("Campaign creation error:", error)
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    )
  }
}