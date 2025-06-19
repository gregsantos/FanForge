"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SubmissionForm } from "./submission-form"
import { SubmissionSuccess } from "./submission-success"
import { CanvasElement } from "@/types"
import { exportCanvas, generateExportFilename } from "@/lib/canvas-export"

interface SubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  campaignId: string
  campaignTitle: string
  canvasElements: CanvasElement[]
  assets: any[]
  onSubmissionSuccess?: (submissionId: string) => void
}

export function SubmissionModal({
  isOpen,
  onClose,
  campaignId,
  campaignTitle,
  canvasElements,
  assets,
  onSubmissionSuccess
}: SubmissionModalProps) {
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Generate artwork preview when modal opens
  useEffect(() => {
    if (isOpen && canvasElements.length > 0) {
      generateArtworkPreview()
    }
  }, [isOpen, canvasElements])

  const generateArtworkPreview = async () => {
    try {
      setIsGeneratingPreview(true)
      
      const blob = await exportCanvas(
        canvasElements,
        assets,
        { width: 800, height: 600 },
        { format: 'png', scale: 1 } // Lower scale for preview
      )
      
      const previewUrl = URL.createObjectURL(blob)
      setArtworkPreview(previewUrl)
    } catch (error) {
      console.error('Failed to generate artwork preview:', error)
    } finally {
      setIsGeneratingPreview(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      // Generate high-quality artwork for submission
      const artworkBlob = await exportCanvas(
        canvasElements,
        assets,
        { width: 800, height: 600 },
        { format: 'png', scale: 2 } // High quality for submission
      )

      // In a real app, you would upload the artwork to storage here
      // For now, we'll use the preview URL
      const artworkUrl = URL.createObjectURL(artworkBlob)

      const submissionData = {
        campaignId,
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        artworkUrl,
        canvasData: {
          elements: canvasElements,
          canvasSize: { width: 800, height: 600 },
          version: "1.0"
        }
      }

      // Submit to API
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaign_id: campaignId,
          title: formData.title,
          description: formData.description,
          tags: formData.tags,
          artwork_url: artworkUrl,
          canvas_data: submissionData.canvasData
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit')
      }

      const result = await response.json()
      
      // Show success modal
      setSubmissionId(result.submission.id)
      setShowSuccess(true)
      
      // Call success callback
      onSubmissionSuccess?.(result.submission.id)
      
    } catch (error) {
      console.error('Submission failed:', error)
      throw error
    }
  }

  const handleSaveDraft = async (formData: any) => {
    try {
      // Save draft with current canvas state
      const draftData = {
        campaignId,
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        canvasData: {
          elements: canvasElements,
          canvasSize: { width: 800, height: 600 },
          version: "1.0"
        },
        isDraft: true
      }

      // In a real app, save to drafts table or local storage
      console.log('Saving draft:', draftData)
      
      // For now, just show success message
      alert('Draft saved successfully!')
    } catch (error) {
      console.error('Draft save failed:', error)
      throw error
    }
  }

  // Clean up preview URL when modal closes
  useEffect(() => {
    return () => {
      if (artworkPreview) {
        URL.revokeObjectURL(artworkPreview)
      }
    }
  }, [artworkPreview])

  const handleSuccessClose = () => {
    setShowSuccess(false)
    setSubmissionId(null)
    onClose()
  }

  const handleCreateAnother = () => {
    setShowSuccess(false)
    setSubmissionId(null)
    // Reset the form for another submission
    setArtworkPreview(null)
    generateArtworkPreview()
  }

  return (
    <>
      <Dialog open={isOpen && !showSuccess} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Your Creation</DialogTitle>
          </DialogHeader>
          
          {isGeneratingPreview ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Generating preview...</p>
              </div>
            </div>
          ) : (
            <SubmissionForm
              campaignId={campaignId}
              campaignTitle={campaignTitle}
              canvasData={{
                elements: canvasElements,
                canvasSize: { width: 800, height: 600 },
                version: "1.0"
              }}
              artworkPreview={artworkPreview || undefined}
              onSubmit={handleSubmit}
              onSaveDraft={handleSaveDraft}
              onCancel={onClose}
            />
          )}
        </DialogContent>
      </Dialog>

      {submissionId && (
        <SubmissionSuccess
          isOpen={showSuccess}
          onClose={handleSuccessClose}
          submissionId={submissionId}
          campaignTitle={campaignTitle}
          onCreateAnother={handleCreateAnother}
          onViewSubmissions={() => {
            // Navigate to creator submissions page
            window.location.href = '/submissions'
          }}
        />
      )}
    </>
  )
}