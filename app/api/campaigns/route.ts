import { NextRequest, NextResponse } from "next/server"
import { mockCampaigns } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search")
  const status = searchParams.get("status")
  const category = searchParams.get("category")
  const deadline = searchParams.get("deadline")
  const assetCount = searchParams.get("assetCount")
  const featured = searchParams.get("featured")
  const sortBy = searchParams.get("sortBy") || "created_at"
  const sortDirection = searchParams.get("sortDirection") || "desc"
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
    const statusList = status.split(",").filter(s => s.length > 0)
    if (statusList.length > 0) {
      filteredCampaigns = filteredCampaigns.filter(campaign => statusList.includes(campaign.status))
    }
  }

  // Apply category filter
  if (category && category !== "all") {
    // For mock data, we'll simulate category filtering
    // In a real implementation, this would filter by campaign category
    const categoryKeywords: Record<string, string[]> = {
      anime: ["anime", "manga", "character"],
      gaming: ["game", "gaming", "esports"],
      fantasy: ["fantasy", "magic", "dragon"],
      cyberpunk: ["cyber", "neon", "future"],
      art: ["art", "design", "creative"],
      music: ["music", "sound", "audio"],
      video: ["video", "film", "animation"]
    }
    
    const keywords = categoryKeywords[category] || []
    if (keywords.length > 0) {
      filteredCampaigns = filteredCampaigns.filter(campaign =>
        keywords.some(keyword => 
          campaign.title.toLowerCase().includes(keyword) ||
          campaign.description.toLowerCase().includes(keyword)
        )
      )
    }
  }

  // Apply deadline filter
  if (deadline && deadline !== "all") {
    const now = new Date()
    filteredCampaigns = filteredCampaigns.filter(campaign => {
      if (!campaign.endDate) return deadline === "none"
      
      const campaignDeadline = new Date(campaign.endDate)
      const timeDiff = campaignDeadline.getTime() - now.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
      
      switch (deadline) {
        case "week":
          return daysDiff <= 7 && daysDiff > 0
        case "month":
          return daysDiff <= 30 && daysDiff > 0
        case "quarter":
          return daysDiff <= 90 && daysDiff > 0
        case "none":
          return false
        default:
          return true
      }
    })
  }

  // Apply asset count filter
  if (assetCount && assetCount !== "all") {
    filteredCampaigns = filteredCampaigns.filter(campaign => {
      const count = campaign.assets.length
      switch (assetCount) {
        case "few":
          return count >= 1 && count <= 5
        case "some":
          return count >= 6 && count <= 15
        case "many":
          return count >= 16
        default:
          return true
      }
    })
  }

  // Apply featured filter
  if (featured === "true") {
    filteredCampaigns = filteredCampaigns.filter(campaign => campaign.featured === true)
  }

  // Apply sorting
  filteredCampaigns.sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (sortBy) {
      case "title":
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case "deadline":
        aValue = a.endDate ? new Date(a.endDate) : new Date("9999-12-31")
        bValue = b.endDate ? new Date(b.endDate) : new Date("9999-12-31")
        break
      case "submission_count":
        aValue = a.submissionCount || 0
        bValue = b.submissionCount || 0
        break
      case "created_at":
      default:
        aValue = new Date(a.createdAt)
        bValue = new Date(b.createdAt)
        break
    }
    
    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex)

  const response = {
    campaigns: paginatedCampaigns.map(campaign => ({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      brand_name: campaign.brand?.name || "Unknown Brand",
      status: campaign.status,
      deadline: campaign.endDate,
      asset_count: campaign.assets.length,
      submission_count: campaign.submissionCount || 0,
      thumbnail_url: campaign.assets[0]?.url || "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
      created_at: campaign.createdAt,
      updated_at: campaign.updatedAt,
      featured: campaign.featured || false,
    })),
    pagination: {
      page,
      limit,
      total: filteredCampaigns.length,
      pages: Math.ceil(filteredCampaigns.length / limit),
    },
    filters: {
      search,
      status,
      category,
      deadline,
      assetCount,
      sortBy,
      sortDirection
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