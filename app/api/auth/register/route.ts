import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { email, password, name, role } = body
    
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate role
    if (!["creator", "brand_admin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // Simulate registration process
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock user creation
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      role,
      name,
      created_at: new Date(),
    }

    // Mock JWT token
    const token = `mock-jwt-token-${Date.now()}`

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      },
      token,
    }, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    )
  }
}