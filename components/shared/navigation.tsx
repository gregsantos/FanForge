"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UserDropdown } from "@/components/shared/user-dropdown"
import { useAuth } from "@/lib/contexts/auth"
import { Menu, X, Palette, Search, User as UserIcon, BarChart3, FileText, Eye, Image, Package } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  const creatorLinks = useMemo(() => [
    { href: "/discover", label: "Discover", icon: Search },
    { href: "/create", label: "Create", icon: Palette },
    { href: "/submissions", label: "Submissions", icon: Eye },
    { href: "/portfolio", label: "My Work", icon: FileText },
    { href: "/profile", label: "Profile", icon: UserIcon },
  ], [])

  const brandLinks = useMemo(() => [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/ip-kits", label: "IP Kits", icon: Package },
    { href: "/campaigns", label: "Campaigns", icon: FileText },
    { href: "/assets", label: "Assets", icon: Image },
    { href: "/submissions", label: "Reviews", icon: Eye },
  ], [])

  const links = user?.role === "creator" ? creatorLinks : brandLinks

  const handleSignOut = async () => {
    try {
      await signOut()
      setMobileMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger on Alt + key to avoid conflicts
      if (!event.altKey || !user) return

      const key = event.key.toLowerCase()
      const links = user.role === "creator" ? creatorLinks : brandLinks

      switch (key) {
        case 'd':
          event.preventDefault()
          router.push(user.role === "creator" ? "/discover" : "/dashboard")
          break
        case 'c':
          event.preventDefault()
          router.push(user.role === "creator" ? "/create" : "/campaigns")
          break
        case 'i':
          event.preventDefault()
          if (user.role === "brand_admin") {
            router.push("/ip-kits")
          }
          break
        case 'a':
          event.preventDefault()
          if (user.role === "brand_admin") {
            router.push("/assets")
          }
          break
        case 'p':
          event.preventDefault()
          if (user.role === "creator") {
            router.push("/portfolio")
          }
          break
        case 's':
          event.preventDefault()
          if (user.role === "brand_admin") {
            router.push("/submissions")
          }
          break
        case 'escape':
          setMobileMenuOpen(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [user, router, creatorLinks, brandLinks])

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">FanForge</span>
            </Link>
            
            {user && (
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <link.icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {!user ? (
              <div className="hidden md:flex md:space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex md:items-center">
                <UserDropdown />
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {user ? (
              <>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon className="mr-3 h-5 w-5" />
                    {link.label}
                  </Link>
                ))}
                <div className="border-t pt-4">
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {user.displayName || user.email}
                  </div>
                  <Button variant="outline" size="sm" className="mx-3" onClick={handleSignOut} disabled={loading}>
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-start">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      </nav>
    </>
  )
}