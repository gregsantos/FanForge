'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient, authListeners, type AuthUser, type RegisterData, type LoginData } from '@/lib/services/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  isClient: boolean
  signUp: (data: RegisterData) => Promise<void>
  signIn: (data: LoginData) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<AuthUser>) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true)
    
    // Set up auth state listener which will handle both initial session restoration
    // and subsequent auth changes
    const unsubscribe = authListeners.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    // Fallback timeout to ensure loading state always resolves
    // This handles edge cases where auth listener might not fire
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Auth state did not resolve within 3 seconds, falling back to getCurrentUser')
        authClient.getCurrentUser()
          .then((user) => {
            setUser(user)
            setLoading(false)
          })
          .catch((error) => {
            console.error('Fallback getCurrentUser failed:', error)
            setUser(null)
            setLoading(false)
          })
      }
    }, 3000)

    return () => {
      unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [])

  const signUp = async (data: RegisterData) => {
    setLoading(true)
    try {
      await authClient.signUp(data)
      // User will be set via the auth state change listener
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signIn = async (data: LoginData) => {
    setLoading(true)
    try {
      await authClient.signIn(data)
      // User will be set via the auth state change listener
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await authClient.signOut()
      setUser(null)
      setLoading(false)
      // Redirect to home page after successful logout
      router.push('/')
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!user) throw new Error('No user logged in')
    
    try {
      await authClient.updateProfile(data)
      // Refresh user data
      const updatedUser = await authClient.getCurrentUser()
      setUser(updatedUser)
    } catch (error) {
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await authClient.resetPassword(email)
    } catch (error) {
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    isClient,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}