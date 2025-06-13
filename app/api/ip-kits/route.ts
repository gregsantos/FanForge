import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { db } from '@/db'
import { ipKits, brands, assets } from '@/db/schema'
import { eq, and, desc, ilike, count } from 'drizzle-orm'
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

    // Build query conditions
    const conditions = []

    if (query.brandId) {
      conditions.push(eq(ipKits.brandId, query.brandId))
    }

    if (query.search) {
      conditions.push(ilike(ipKits.name, `%${query.search}%`))
    }

    if (query.published !== 'all') {
      conditions.push(eq(ipKits.isPublished, query.published === 'true'))
    }

    // Execute query with asset counts
    const result = await db
      .select({
        id: ipKits.id,
        name: ipKits.name,
        description: ipKits.description,
        guidelines: ipKits.guidelines,
        brandId: ipKits.brandId,
        isPublished: ipKits.isPublished,
        version: ipKits.version,
        createdAt: ipKits.createdAt,
        updatedAt: ipKits.updatedAt,
        brandName: brands.name,
        assetCount: count(assets.id)
      })
      .from(ipKits)
      .leftJoin(brands, eq(ipKits.brandId, brands.id))
      .leftJoin(assets, eq(ipKits.id, assets.ipKitId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .groupBy(ipKits.id, brands.name)
      .orderBy(desc(ipKits.updatedAt))
      .limit(query.limit)
      .offset(query.offset)

    return NextResponse.json({
      ipKits: result,
      pagination: {
        limit: query.limit,
        offset: query.offset,
        hasMore: result.length === query.limit
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
      { error: 'Internal server error' },
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

    // Verify that the brand exists and user has access to it
    const brand = await db
      .select()
      .from(brands)
      .where(eq(brands.id, ipKitData.brandId))
      .limit(1)

    if (brand.length === 0) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      )
    }

    // TODO: Add proper authorization check for brand access
    // For now, we'll assume the user has access

    // Create the IP Kit record
    const [newIpKit] = await db
      .insert(ipKits)
      .values(ipKitData)
      .returning()

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
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}