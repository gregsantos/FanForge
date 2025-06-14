"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { campaignSchema } from "@/lib/validations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar, Save, Eye, ArrowLeft, Loader2 } from "lucide-react"
import { type z } from "zod"

type CampaignFormData = z.infer<typeof campaignSchema>

interface IPKit {
  id: string
  name: string
  description: string
  assetCount: number
  isPublished: boolean
}

export default function NewCampaignPage() {
  const router = useRouter()
  const [ipKits, setIpKits] = useState<IPKit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      status: "draft",
      rewardCurrency: "USD",
    },
  })

  const handleSave = useCallback(async (data: CampaignFormData, isAutoSave = false) => {
    if (!isAutoSave) setIsSaving(true)

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
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

      const result = await response.json()
      setLastSaved(new Date())

      if (!isAutoSave) {
        router.push(`/campaigns/${result.campaign.id}`)
      }
    } catch (error) {
      console.error("Failed to save campaign:", error)
      // TODO: Add toast notification for error
    } finally {
      if (!isAutoSave) setIsSaving(false)
    }
  }, [router])

  // Load IP kits on component mount
  useEffect(() => {
    const fetchIpKits = async () => {
      try {
        const response = await fetch("/api/ip-kits")
        if (response.ok) {
          const data = await response.json()
          setIpKits(data.ipKits || [])
        }
      } catch (error) {
        console.error("Failed to load IP kits:", error)
      }
    }

    fetchIpKits()
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (!isDirty) return

    const autoSaveTimeout = setTimeout(async () => {
      const formData = watch()
      if (formData.title || formData.description) {
        await handleSave(formData, true)
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimeout)
  }, [isDirty, watch, handleSave])

  const onSubmit = (data: CampaignFormData) => {
    handleSave({ ...data, status: "draft" })
  }

  const handlePublish = (data: CampaignFormData) => {
    handleSave({ ...data, status: "active" })
  }

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log("Preview campaign")
  }

  const watchedValues = watch()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Campaign</h1>
          <p className="text-muted-foreground">
            Set up a new creator collaboration campaign
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

            {/* Advanced Options */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Options</CardTitle>
                <CardDescription>
                  Additional campaign settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maxSubmissions">Maximum Submissions</Label>
                  <Input
                    id="maxSubmissions"
                    type="number"
                    min="1"
                    placeholder="Leave empty for unlimited"
                    {...register("maxSubmissions", {
                      valueAsNumber: true,
                    })}
                  />
                  {errors.maxSubmissions && (
                    <p className="text-sm text-destructive">{errors.maxSubmissions.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rewardAmount">Reward Amount</Label>
                    <Input
                      id="rewardAmount"
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register("rewardAmount", {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.rewardAmount && (
                      <p className="text-sm text-destructive">{errors.rewardAmount.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rewardCurrency">Currency</Label>
                    <Select
                      value={watchedValues.rewardCurrency || "USD"}
                      onValueChange={(value) => setValue("rewardCurrency", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="briefDocument">Brief Document URL</Label>
                  <Input
                    id="briefDocument"
                    type="url"
                    placeholder="https://example.com/campaign-brief.pdf"
                    {...register("briefDocument")}
                  />
                  {errors.briefDocument && (
                    <p className="text-sm text-destructive">{errors.briefDocument.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                      Save Draft
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={handleSubmit(handlePublish)}
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Publish Campaign
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
                  Preview
                </Button>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status:</span>
                    <span className="text-sm font-medium">
                      {watchedValues.status === "draft" ? "Draft" : "Active"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Form Valid:</span>
                    <span className="text-sm">
                      {Object.keys(errors).length === 0 ? "✅" : "❌"}
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

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Form Completion</span>
                    <span>
                      {Math.round(
                        (Object.values(watchedValues).filter(Boolean).length /
                          Object.keys(watchedValues).length) *
                          100
                      )}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.round(
                          (Object.values(watchedValues).filter(Boolean).length /
                            Object.keys(watchedValues).length) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}