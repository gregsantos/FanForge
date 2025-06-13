import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
// import { db } from '@/db'
// import { ipKits, brands, assets } from '@/db/schema'
// import { eq, and, desc, ilike, count } from 'drizzle-orm'
import { z } from 'zod'

// IP Kit creation schema
const createIpKitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
  guidelines: z.string().optional(),
  brandId: z.string().uuid('Invalid brand ID'),
  isPublished: z.boolean().default(false)
})

// IP Kit update schema
const updateIpKitSchema = createIpKitSchema.partial().extend({
  id: z.string().uuid('Invalid IP Kit ID')
})

// IP Kit query schema
const ipKitQuerySchema = z.object({
  brandId: z.string().uuid().nullable().optional(),
  search: z.string().nullable().optional(),
  published: z.enum(['true', 'false', 'all']).nullable().default('all'),
  limit: z.string().nullable().optional(),
  offset: z.string().nullable().optional()
}).transform(data => ({
  brandId: data.brandId || undefined,
  search: data.search || undefined,
  published: data.published || 'all',
  limit: data.limit ? Math.max(1, Math.min(100, parseInt(data.limit) || 20)) : 20,
  offset: data.offset ? Math.max(0, parseInt(data.offset) || 0) : 0
}))

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const query = ipKitQuerySchema.parse({
      brandId: searchParams.get('brandId'),
      search: searchParams.get('search'),
      published: searchParams.get('published'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    })

    // NOTE: Database query conditions removed for development mock data

    // For development: return mock data until database is connected
    // TODO: Replace with actual database query when DB is set up
    const mockIpKits = [
      {
        id: "550e8400-e29b-41d4-a716-446655440010",
        name: "Marvel Heroes Collection",
        description: "Complete set of Marvel superhero assets including characters, logos, and backgrounds",
        guidelines: "Use only for positive superhero content. Maintain character integrity and brand consistency.",
        brandId: "550e8400-e29b-41d4-a716-446655440001",
        isPublished: true,
        version: 2,
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T14:30:00Z",
        brandName: "Marvel Entertainment",
        assetCount: 24
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440011",
        name: "Star Wars Universe Kit",
        description: "Official Star Wars assets for fan content creation",
        guidelines: "Follow Disney content guidelines. No dark or inappropriate themes.",
        brandId: "550e8400-e29b-41d4-a716-446655440001",
        isPublished: false,
        version: 1,
        createdAt: "2024-01-10T09:00:00Z",
        updatedAt: "2024-01-18T16:45:00Z",
        brandName: "Disney",
        assetCount: 18
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440012",
        name: "Pokemon Adventure Pack",
        description: "Curated Pokemon characters and environments for creative projects",
        guidelines: "Family-friendly content only. Respect Pokemon character designs and personalities.",
        brandId: "550e8400-e29b-41d4-a716-446655440002",
        isPublished: true,
        version: 3,
        createdAt: "2024-01-05T11:30:00Z",
        updatedAt: "2024-01-22T12:15:00Z",
        brandName: "Nintendo",
        assetCount: 32
      }
    ]

    // Apply filters to mock data
    let filteredKits = mockIpKits

    if (query.brandId) {
      filteredKits = filteredKits.filter(kit => kit.brandId === query.brandId)
    }

    if (query.search) {
      filteredKits = filteredKits.filter(kit => 
        kit.name.toLowerCase().includes(query.search!.toLowerCase()) ||
        (kit.description && kit.description.toLowerCase().includes(query.search!.toLowerCase()))
      )
    }

    if (query.published !== 'all') {
      const isPublished = query.published === 'true'
      filteredKits = filteredKits.filter(kit => kit.isPublished === isPublished)
    }

    // Apply pagination
    const startIndex = query.offset
    const endIndex = startIndex + query.limit
    const result = filteredKits.slice(startIndex, endIndex)

    return NextResponse.json({
      ipKits: result,
      pagination: {
        limit: query.limit,
        offset: query.offset,
        hasMore: endIndex < filteredKits.length,
        total: filteredKits.length
      }
    })

  } catch (error) {
    console.error('IP Kits GET error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const ipKitData = createIpKitSchema.parse(body)

    // For development: create mock IP Kit until database is connected
    // TODO: Replace with actual database operations when DB is set up
    
    // Verify brand exists (mock validation)
    const validBrandIds = [
      "550e8400-e29b-41d4-a716-446655440001",
      "550e8400-e29b-41d4-a716-446655440002"
    ]
    
    if (!validBrandIds.includes(ipKitData.brandId)) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    // Create mock IP Kit
    const newIpKit = {
      id: `550e8400-e29b-41d4-a716-${Date.now().toString().slice(-12)}`,
      ...ipKitData,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(newIpKit, { status: 201 })

  } catch (error) {
    console.error('IP Kits POST error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid IP Kit data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}