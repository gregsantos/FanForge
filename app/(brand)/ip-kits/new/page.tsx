"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IpKitForm } from "@/components/ip-kits/ip-kit-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

type IpKitFormData = {
  name: string
  description?: string
  guidelines?: string
  isPublished: boolean
}

export default function NewIpKitPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Mock brand ID - in production this would come from context
  const mockBrandId = "550e8400-e29b-41d4-a716-446655440001"

  const handleSave = async (data: IpKitFormData) => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/ip-kits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          brandId: mockBrandId
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create IP kit')
      }

      const newIpKit = await response.json()
      
      // Redirect to the new IP kit's detail page
      router.push(`/ip-kits/${newIpKit.id}`)
      
    } catch (error) {
      console.error('Error creating IP kit:', error)
      // TODO: Show error toast/notification
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/ip-kits')
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/ip-kits">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New IP Kit</h1>
          <p className="text-muted-foreground">
            Set up a new intellectual property kit for your campaigns
          </p>
        </div>
      </div>

      {/* Introduction Card */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            IP kits are collections of brand assets that creators can use in campaigns. 
            They include images, guidelines, and usage rules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">1. Basic Information</h4>
              <p className="text-muted-foreground">
                Give your IP kit a clear name and description that creators will understand.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">2. Set Guidelines</h4>
              <p className="text-muted-foreground">
                Define how creators should use your assets, including style requirements and restrictions.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">3. Upload Assets</h4>
              <p className="text-muted-foreground">
                After creating your IP kit, you&apos;ll be able to upload and organize your brand assets.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* IP Kit Form */}
      <IpKitForm
        brandId={mockBrandId}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isLoading}
      />
    </div>
  )
}