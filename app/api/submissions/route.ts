import { NextRequest, NextResponse } from "next/server"
import { mockSubmissions } from "@/lib/mock-data"
import { submissionSchema } from "@/lib/validations"

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
    filteredSubmissions = filteredSubmissions.filter(s => s.campaignId === campaignId)
  }

  if (creatorId) {
    filteredSubmissions = filteredSubmissions.filter(s => s.creatorId === creatorId)
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
      artwork_url: submission.artworkUrl,
      created_at: submission.createdAt,
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
    
    // Transform camelCase to snake_case for legacy compatibility
    const submissionData = {
      title: body.title,
      description: body.description,
      tags: body.tags || [],
      campaignId: body.campaign_id || body.campaignId,
      artworkUrl: body.artwork_url || body.artworkUrl,
      canvasData: body.canvas_data || body.canvasData,
      notes: body.notes,
    }

    // Validate with Zod schema
    const validationResult = submissionSchema.safeParse(submissionData)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation failed",
          details: validationResult.error.format()
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Create new submission (mock implementation)
    const newSubmission = {
      id: `submission-${Date.now()}`,
      title: validatedData.title,
      description: validatedData.description,
      artworkUrl: validatedData.artworkUrl || "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      thumbnailUrl: validatedData.artworkUrl, // Use same URL for now
      canvasData: validatedData.canvasData,
      tags: validatedData.tags,
      campaignId: validatedData.campaignId,
      creatorId: "mock-creator-id", // In real app, get from auth
      status: "pending" as const,
      reviewedBy: undefined,
      reviewedAt: undefined,
      feedback: undefined,
      rating: undefined,
      isPublic: false,
      viewCount: 0,
      likeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // In a real application, save to database here
    console.log('Creating submission:', newSubmission)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      submission: {
        id: newSubmission.id,
        campaign_id: newSubmission.campaignId,
        title: newSubmission.title,
        status: newSubmission.status,
        created_at: newSubmission.createdAt,
      },
      message: "Submission created successfully"
    }, { status: 201 })

  } catch (error) {
    console.error('Submission creation error:', error)
    return NextResponse.json(
      { 
        error: "Failed to create submission",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}