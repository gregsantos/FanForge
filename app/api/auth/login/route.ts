import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      )
    }

    // Simulate authentication process
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock authentication (in real app, would verify against database)
    const mockUser = {
      id: "user-1",
      email,
      role: email.includes("admin") ? "brand_admin" : "creator",
      name: email.includes("admin") ? "Brand Manager" : "Creative User",
    }

    // Mock JWT token
    const token = `mock-jwt-token-${Date.now()}`

    return NextResponse.json({
      user: mockUser,
      token,
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    )
  }
}