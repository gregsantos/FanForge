"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { registerSchema } from "@/lib/validations"
import { useAuth } from "@/lib/contexts/auth"
import { Palette, BarChart3 } from "lucide-react"
import type { z } from "zod"

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [error, setError] = useState<string>("")
  const { signUp, loading, user } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const selectedRole = watch("role")

  // Redirect user based on role after successful registration
  useEffect(() => {
    if (user && !loading) {
      const redirectPath = user.role === "creator" ? "/discover" : "/dashboard"
      router.push(redirectPath)
    }
  }, [user, loading, router])

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError("")
      await signUp({
        email: data.email,
        password: data.password,
        displayName: data.name,
        role: data.role,
      })
      // Redirect will be handled by the useEffect when user state updates
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during registration")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join FanForge</CardTitle>
          <p className="text-muted-foreground">
            Create your account and start your creative journey.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                {...register("name")}
                error={errors.name?.message}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a secure password"
                {...register("password")}
                error={errors.password?.message}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">I am a...</label>
              <div className="grid grid-cols-1 gap-3">
                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    value="creator"
                    {...register("role")}
                    className="sr-only"
                  />
                  <div className={`
                    p-4 border rounded-lg transition-all hover:border-primary
                    ${selectedRole === "creator" ? "border-primary bg-primary/5" : "border-border"}
                  `}>
                    <div className="flex items-center space-x-3">
                      <Palette className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Creator</div>
                        <div className="text-sm text-muted-foreground">
                          Create artwork using official brand assets
                        </div>
                      </div>
                    </div>
                  </div>
                </label>

                <label className="relative cursor-pointer">
                  <input
                    type="radio"
                    value="brand_admin"
                    {...register("role")}
                    className="sr-only"
                  />
                  <div className={`
                    p-4 border rounded-lg transition-all hover:border-primary
                    ${selectedRole === "brand_admin" ? "border-primary bg-primary/5" : "border-border"}
                  `}>
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-medium">Brand Administrator</div>
                        <div className="text-sm text-muted-foreground">
                          Create campaigns and manage creator submissions
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <input type="checkbox" required className="h-4 w-4 rounded border-border" />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </div>
              
              <Button type="submit" className="w-full" loading={loading}>
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}