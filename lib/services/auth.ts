import { createClient } from '@/utils/supabase/client'
import type { User } from '@/types'

export interface AuthUser {
  id: string
  email: string
  displayName?: string
  avatarUrl?: string
  role?: string
  emailVerified: boolean
}

export interface RegisterData {
  email: string
  password: string
  displayName: string
  role: 'creator' | 'brand_admin'
}

export interface LoginData {
  email: string
  password: string
}

// Client-side auth functions
export const authClient = {
  async signUp(data: RegisterData) {
    const supabase = createClient()
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          display_name: data.displayName,
          role: data.role,
        }
      }
    })

    if (authError) throw authError

    // User profile creation will be handled by the API route
    // which runs on the server-side

    return authData
  },

  async signIn(data: LoginData) {
    const supabase = createClient()
    
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) throw error
    return authData
  },

  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = createClient()
    
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null

    // Return basic user info from Supabase
    // Extended profile data should be fetched via API routes
    return {
      id: user.id,
      email: user.email!,
      displayName: user.user_metadata?.display_name,
      avatarUrl: user.user_metadata?.avatar_url,
      role: user.user_metadata?.role,
      emailVerified: user.email_confirmed_at !== null,
    }
  },

  async updateProfile(updates: Partial<Pick<User, 'displayName' | 'avatarUrl' | 'bio' | 'socialLinks'>>) {
    // Profile updates should be handled via API routes
    // that run on the server-side
    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error('Failed to update profile')
    }
  },

  async resetPassword(email: string) {
    const supabase = createClient()
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw error
  },

  async updatePassword(newPassword: string) {
    const supabase = createClient()
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
  }
}


// Auth state change listeners for client-side
export const authListeners = {
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    const supabase = createClient()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const user = await authClient.getCurrentUser()
          callback(user)
        } else {
          callback(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }
}