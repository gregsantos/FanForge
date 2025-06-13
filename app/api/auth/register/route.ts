import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { db } from '@/db'
import { users, userRoles, roles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(1, 'Display name is required'),
  role: z.enum(['creator', 'brand_admin'], {
    errorMap: () => ({ message: 'Role must be either creator or brand_admin' })
  })
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          display_name: validatedData.displayName,
          role: validatedData.role,
        }
      }
    })

    if (authError) throw authError

    // Create user profile in our database
    if (authData.user) {
      try {
        await db.insert(users).values({
          id: authData.user.id,
          email: authData.user.email!,
          displayName: validatedData.displayName,
          emailVerified: false,
        })

        // Assign role
        const [roleRecord] = await db
          .select()
          .from(roles)
          .where(eq(roles.name, validatedData.role))
          .limit(1)

        if (roleRecord) {
          await db.insert(userRoles).values({
            userId: authData.user.id,
            roleId: roleRecord.id,
          })
        }
      } catch (dbError) {
        console.error('Error creating user profile:', dbError)
        // User was created in Supabase but profile creation failed
        // This should be handled by a cleanup process
      }
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
      message: 'Registration successful. Please check your email for verification.'
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      }, { status: 400 })
    }

    // Handle Supabase auth errors
    if (error && typeof error === 'object' && 'message' in error) {
      return NextResponse.json({
        success: false,
        message: error.message
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Registration failed'
    }, { status: 500 })
  }
}