import { NextRequest, NextResponse } from "next/server"
import { mockSubmissions } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const campaignId = searchParams.get("campaign_id")
  const creatorId = searchParams.get("creator_id")
  const status = searchParams.get("status")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")

  let filteredSubmissions = [...mockSubmissions]

  // Apply filters
  if (campaignId) {
    filteredSubmissions = filteredSubmissions.filter(s => s.campaign_id === campaignId)
  }

  if (creatorId) {
    filteredSubmissions = filteredSubmissions.filter(s => s.creator_id === creatorId)
  }

  if (status && status !== "all") {
    filteredSubmissions = filteredSubmissions.filter(s => s.status === status)
  }

  // Pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex)

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  return NextResponse.json({
    submissions: paginatedSubmissions.map(submission => ({
      id: submission.id,
      campaign_title: "Mock Campaign", // Would fetch from campaigns
      creator_name: "Mock Creator", // Would fetch from users
      title: submission.title,
      status: submission.status,
      artwork_url: submission.artwork_url,
      created_at: submission.created_at,
    })),
    pagination: {
      page,
      limit,
      total: filteredSubmissions.length,
      pages: Math.ceil(filteredSubmissions.length / limit),
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { campaign_id, title, description } = body
    
    if (!campaign_id || !title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create new submission (mock)
    const newSubmission = {
      id: `submission-${Date.now()}`,
      campaign_id,
      creator_id: "mock-creator-id",
      title,
      description,
      artwork_url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      status: "pending" as const,
      created_at: new Date(),
      updated_at: new Date(),
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      submission: {
        id: newSubmission.id,
        campaign_id: newSubmission.campaign_id,
        title: newSubmission.title,
        status: newSubmission.status,
        created_at: newSubmission.created_at,
      }
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    )
  }
}