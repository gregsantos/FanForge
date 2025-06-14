"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { campaignSchema } from "@/lib/validations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Save, 
  Eye, 
  ArrowLeft, 
  Loader2, 
  Play, 
  Pause, 
  Square,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { type z } from "zod"
import { mockCampaigns } from "@/lib/mock-data"
import { notFound } from "next/navigation"

type CampaignFormData = z.infer<typeof campaignSchema>

interface IPKit {
  id: string
  name: string
  description: string
  assetCount: number
  isPublished: boolean
}

interface Campaign {
  id: string
  title: string
  description: string
  guidelines: string
  ipKitId: string
  status: "draft" | "active" | "paused" | "closed"
  startDate?: Date
  endDate?: Date
  maxSubmissions?: number
  rewardAmount?: number
  rewardCurrency: string
  briefDocument?: string
  submissionCount: number
  createdAt: Date
  updatedAt: Date
}

export default function EditCampaignPage() {
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id as string

  const [ipKits, setIpKits] = useState<IPKit[]>([])
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
  })

  // Load campaign data and IP kits
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load campaign data (using mock data for now)
        const mockCampaign = mockCampaigns.find(c => c.id === campaignId)
        if (!mockCampaign) {
          notFound()
          return
        }

        const campaignData = {
          id: mockCampaign.id,
          title: mockCampaign.title,
          description: mockCampaign.description,
          guidelines: mockCampaign.guidelines || "",
          ipKitId: mockCampaign.ipKitId || "",
          status: mockCampaign.status,
          startDate: mockCampaign.startDate,
          endDate: mockCampaign.endDate,
          maxSubmissions: undefined,
          rewardAmount: undefined,
          rewardCurrency: "USD",
          briefDocument: undefined,
          submissionCount: mockCampaign.submissionCount || 0,
          createdAt: mockCampaign.createdAt,
          updatedAt: mockCampaign.updatedAt,
        }

        setCampaign(campaignData)

        // Reset form with campaign data
        reset({
          title: campaignData.title,
          description: campaignData.description,
          guidelines: campaignData.guidelines,
          ipKitId: campaignData.ipKitId,
          status: campaignData.status,
          startDate: campaignData.startDate,
          endDate: campaignData.endDate,
          maxSubmissions: campaignData.maxSubmissions,
          rewardAmount: campaignData.rewardAmount,
          rewardCurrency: campaignData.rewardCurrency as "USD" | "EUR" | "GBP" | "CAD" | "AUD",
          briefDocument: campaignData.briefDocument,
        })

        // Load IP kits
        const ipKitsResponse = await fetch("/api/ip-kits")
        if (ipKitsResponse.ok) {
          const ipKitsData = await ipKitsResponse.json()
          setIpKits(ipKitsData.ipKits || [])
        }
      } catch (error) {
        console.error("Failed to load campaign data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [campaignId, reset])

  const handleSave = useCallback(async (data: CampaignFormData, isAutoSave = false) => {
    if (!isAutoSave) setIsSaving(true)

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          startDate: data.startDate?.toISOString(),
          endDate: data.endDate?.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save campaign")
      }

      setLastSaved(new Date())

      if (!isAutoSave) {
        router.push(`/campaigns/${campaignId}`)
      }
    } catch (error) {
      console.error("Failed to save campaign:", error)
      // TODO: Add toast notification for error
    } finally {
      if (!isAutoSave) setIsSaving(false)
    }
  }, [campaignId, router])

  // Auto-save functionality
  useEffect(() => {
    if (!isDirty || !campaign) return

    const autoSaveTimeout = setTimeout(async () => {
      const formData = watch()
      if (formData.title || formData.description) {
        await handleSave(formData, true)
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimeout)
  }, [isDirty, watch, handleSave, campaign])

  const onSubmit = (data: CampaignFormData) => {
    handleSave(data)
  }

  const handleStatusChange = async (newStatus: "draft" | "active" | "paused" | "closed") => {
    if (!campaign) return

    try {
      setIsSaving(true)
      const formData = watch()
      
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: newStatus,
          startDate: formData.startDate?.toISOString(),
          endDate: formData.endDate?.toISOString(),
        }),
      })

      if (response.ok) {
        setCampaign(prev => prev ? { ...prev, status: newStatus } : null)
        setValue("status", newStatus)
        setLastSaved(new Date())
      }
    } catch (error) {
      console.error("Failed to update campaign status:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePreview = () => {
    router.push(`/campaigns/${campaignId}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2 text-muted-foreground">Loading campaign...</p>
        </div>
      </div>
    )
  }

  if (!campaign) {
    notFound()
  }

  const watchedValues = watch()
  const canPublish = watchedValues.title && watchedValues.description && watchedValues.guidelines && watchedValues.ipKitId
  const hasSubmissions = campaign.submissionCount > 0

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4" />
      case "paused":
        return <Pause className="h-4 w-4" />
      case "closed":
        return <Square className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "draft":
        return "secondary"
      case "paused":
        return "outline"
      case "closed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/campaigns/${campaignId}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaign
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Edit Campaign</h1>
          <p className="text-muted-foreground">
            Modify your campaign settings and content
          </p>
        </div>
      </div>

      {/* Auto-save indicator */}
      {lastSaved && (
        <div className="mb-4 text-sm text-muted-foreground">
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Essential details about your campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter campaign title..."
                    {...register("title")}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what creators will be working on..."
                    className="min-h-[100px]"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guidelines">Guidelines & Requirements</Label>
                  <Textarea
                    id="guidelines"
                    placeholder="Provide detailed guidelines for creators..."
                    className="min-h-[120px]"
                    {...register("guidelines")}
                  />
                  {errors.guidelines && (
                    <p className="text-sm text-destructive">{errors.guidelines.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* IP Kit Assignment */}
            <Card>
              <CardHeader>
                <CardTitle>IP Kit Selection</CardTitle>
                <CardDescription>
                  Choose which assets creators can use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="ipKitId">IP Kit</Label>
                  <Select
                    value={watchedValues.ipKitId || ""}
                    onValueChange={(value) => setValue("ipKitId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an IP kit..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ipKits.map((kit) => (
                        <SelectItem key={kit.id} value={kit.id}>
                          <div className="flex flex-col">
                            <span>{kit.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {kit.assetCount} assets
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ipKitId && (
                    <p className="text-sm text-destructive">{errors.ipKitId.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>
                  Set campaign start and end dates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date (Optional)</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      {...register("startDate", {
                        valueAsDate: true,
                      })}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-destructive">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date (Optional)</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      {...register("endDate", {
                        valueAsDate: true,
                      })}
                    />
                    {errors.endDate && (
                      <p className="text-sm text-destructive">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Status</CardTitle>
                <CardDescription>
                  Manage campaign lifecycle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Status:</span>
                  <Badge variant={getStatusColor(campaign.status)}>
                    {getStatusIcon(campaign.status)}
                    <span className="ml-1">
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </Badge>
                </div>

                <div className="space-y-2">
                  {campaign.status === "draft" && (
                    <Button
                      type="button"
                      onClick={() => handleStatusChange("active")}
                      disabled={!canPublish || isSaving}
                      className="w-full"
                    >
                      {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="mr-2 h-4 w-4" />
                      )}
                      Publish Campaign
                    </Button>
                  )}

                  {campaign.status === "active" && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleStatusChange("paused")}
                        disabled={isSaving}
                        className="w-full"
                      >
                        {isSaving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Pause className="mr-2 h-4 w-4" />
                        )}
                        Pause Campaign
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleStatusChange("closed")}
                        disabled={isSaving}
                        className="w-full"
                      >
                        {isSaving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Square className="mr-2 h-4 w-4" />
                        )}
                        Close Campaign
                      </Button>
                    </>
                  )}

                  {campaign.status === "paused" && (
                    <>
                      <Button
                        type="button"
                        onClick={() => handleStatusChange("active")}
                        disabled={!canPublish || isSaving}
                        className="w-full"
                      >
                        {isSaving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="mr-2 h-4 w-4" />
                        )}
                        Resume Campaign
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleStatusChange("closed")}
                        disabled={isSaving}
                        className="w-full"
                      >
                        {isSaving ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Square className="mr-2 h-4 w-4" />
                        )}
                        Close Campaign
                      </Button>
                    </>
                  )}

                  {hasSubmissions && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <p className="text-sm text-amber-800">
                          Campaign has {campaign.submissionCount} submissions
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={handlePreview}
                  className="w-full"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Campaign
                </Button>
              </CardContent>
            </Card>

            {/* Form Status */}
            <Card>
              <CardHeader>
                <CardTitle>Form Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Form Valid:</span>
                    <span className="text-sm">
                      {Object.keys(errors).length === 0 ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Valid
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          {Object.keys(errors).length} errors
                        </div>
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Can Publish:</span>
                    <span className="text-sm">
                      {canPublish ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Ready
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          Missing fields
                        </div>
                      )}
                    </span>
                  </div>

                  {lastSaved && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Saved:</span>
                      <span className="text-sm">
                        {lastSaved.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}