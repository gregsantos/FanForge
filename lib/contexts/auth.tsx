'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient, authListeners, type AuthUser, type RegisterData, type LoginData } from '@/lib/services/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
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
  const router = useRouter()

  useEffect(() => {
    // Get initial user
    authClient.getCurrentUser()
      .then((user) => {
        setUser(user)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error getting initial user:', error)
        setUser(null)
        setLoading(false)
      })

    // Listen for auth state changes
    const unsubscribe = authListeners.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
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