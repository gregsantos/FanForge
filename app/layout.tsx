import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/shared/navigation"
import { AuthProvider } from "@/lib/contexts/auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FanForge - Create with Official Brand Assets",
  description:
    "Collaborative platform for sanctioned derivative content creation. Connect with brands and create amazing artwork using official assets.",
  keywords: ["fan art", "brand collaboration", "creative platform", "official assets"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}