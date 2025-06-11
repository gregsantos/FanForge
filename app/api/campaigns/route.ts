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
      campaign.brand_name.toLowerCase().includes(searchLower)
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
      brand_name: campaign.brand_name,
      status: campaign.status,
      deadline: campaign.deadline,
      asset_count: campaign.assets.length,
      submission_count: campaign.submission_count,
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
    const { title, description, guidelines, deadline } = body
    
    if (!title || !description || !guidelines || !deadline) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create new campaign (mock)
    const newCampaign = {
      id: `campaign-${Date.now()}`,
      title,
      description,
      guidelines,
      brand_id: "mock-brand-id",
      brand_name: "Mock Brand",
      status: "draft" as const,
      deadline: new Date(deadline),
      assets: [],
      submission_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      campaign: {
        id: newCampaign.id,
        title: newCampaign.title,
        status: newCampaign.status,
        created_at: newCampaign.created_at,
      }
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    )
  }
}