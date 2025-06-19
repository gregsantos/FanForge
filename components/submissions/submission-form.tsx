"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Save, Send, AlertCircle, CheckCircle } from "lucide-react"
import { CanvasElement } from "@/types"

interface SubmissionFormData {
  title: string
  description: string
  tags: string[]
  artworkUrl?: string
  canvasData?: {
    elements: CanvasElement[]
    canvasSize: { width: number; height: number }
    version: string
  }
}

interface SubmissionFormProps {
  campaignId: string
  campaignTitle: string
  initialData?: Partial<SubmissionFormData>
  canvasData?: {
    elements: CanvasElement[]
    canvasSize: { width: number; height: number }
    version: string
  }
  artworkPreview?: string
  onSubmit: (data: SubmissionFormData) => Promise<void>
  onSaveDraft?: (data: SubmissionFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

export function SubmissionForm({
  campaignId,
  campaignTitle,
  initialData,
  canvasData,
  artworkPreview,
  onSubmit,
  onSaveDraft,
  onCancel,
  isLoading = false,
  mode = 'create'
}: SubmissionFormProps) {
  const [formData, setFormData] = useState<SubmissionFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    tags: initialData?.tags || [],
    artworkUrl: initialData?.artworkUrl,
    canvasData: initialData?.canvasData || canvasData
  })
  
  const [newTag, setNewTag] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraftSaving, setIsDraftSaving] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
    }

    if (!canvasData || canvasData.elements.length === 0) {
      newErrors.canvas = 'Canvas must contain at least one element'
    }

    if (formData.tags.length > 10) {
      newErrors.tags = 'Maximum 10 tags allowed'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const submissionData: SubmissionFormData = {
        ...formData,
        canvasData,
        artworkUrl: artworkPreview
      }
      await onSubmit(submissionData)
    } catch (error) {
      console.error('Submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!onSaveDraft) return

    setIsDraftSaving(true)
    try {
      const draftData: SubmissionFormData = {
        ...formData,
        canvasData,
        artworkUrl: artworkPreview
      }
      await onSaveDraft(draftData)
    } catch (error) {
      console.error('Draft save failed:', error)
    } finally {
      setIsDraftSaving(false)
    }
  }

  const addTag = () => {
    if (!newTag.trim()) return
    
    const tag = newTag.trim().toLowerCase()
    if (!formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))
      setNewTag('')
      // Clear tag error if it exists
      if (errors.tags) {
        setErrors(prev => ({ ...prev, tags: '' }))
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            {mode === 'create' ? 'Submit Your Creation' : 'Edit Submission'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Campaign: <span className="font-medium">{campaignTitle}</span>
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Artwork Preview */}
            {artworkPreview && (
              <div className="space-y-2">
                <Label>Artwork Preview</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                  <img 
                    src={artworkPreview} 
                    alt="Canvas artwork preview showing the user's creative composition" 
                    className="max-w-full max-h-48 mx-auto rounded"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {canvasData?.elements.length || 0} elements on canvas
                  </p>
                </div>
                {errors.canvas && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.canvas}
                  </p>
                )}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Give your creation a catchy title..."
                maxLength={100}
                className={errors.title ? 'border-destructive' : ''}
              />
              {errors.title && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.title}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.title.length}/100 characters
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your creative process, inspiration, or key features of your work..."
                rows={4}
                maxLength={1000}
                className={errors.description ? 'border-destructive' : ''}
              />
              {errors.description && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/1000 characters
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleTagKeyPress}
                    placeholder="Add a tag..."
                    maxLength={20}
                    disabled={formData.tags.length >= 10}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    disabled={!newTag.trim() || formData.tags.length >= 10}
                  >
                    Add
                  </Button>
                </div>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                {errors.tags && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.tags}
                  </p>
                )}
                
                <p className="text-xs text-muted-foreground">
                  {formData.tags.length}/10 tags • Tags help others discover your work
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting || isDraftSaving}
              >
                Cancel
              </Button>
              
              {onSaveDraft && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting || isDraftSaving || isLoading}
                  className="flex items-center gap-2"
                >
                  {isDraftSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Saving Draft...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Draft
                    </>
                  )}
                </Button>
              )}
              
              <Button
                type="submit"
                disabled={isSubmitting || isDraftSaving || isLoading}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Creation
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}