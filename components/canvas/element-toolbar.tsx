"use client"

import { Button } from "@/components/ui/button"
import { 
  RotateCw, 
  Copy, 
  Trash2, 
  ChevronUp, 
  ChevronDown 
} from "lucide-react"
import { CanvasElement } from "@/types"

interface ElementToolbarProps {
  element: CanvasElement
  onRotate: () => void
  onCopy: () => void
  onDelete: () => void
  onLayerUp: () => void
  onLayerDown: () => void
  canvasRef: React.RefObject<HTMLDivElement>
  zoom: number
  panOffset: { x: number; y: number }
  canvasScale: number
}

export function ElementToolbar({
  element,
  onRotate,
  onCopy,
  onDelete,
  onLayerUp,
  onLayerDown,
  canvasRef,
  zoom,
  panOffset,
  canvasScale
}: ElementToolbarProps) {
  // Calculate toolbar position above the selected element
  if (!canvasRef.current) return null
  
  const canvasRect = canvasRef.current.getBoundingClientRect()
  
  // For scaled canvas with transform-origin: center, we need to account for the centering offset
  const canvasWidth = 800
  const canvasHeight = 600
  
  // Calculate the center offset due to transform-origin: center
  const scaledWidth = canvasWidth * canvasScale
  const scaledHeight = canvasHeight * canvasScale
  const centerOffsetX = (canvasRect.width - scaledWidth) / 2
  const centerOffsetY = (canvasRect.height - scaledHeight) / 2
  
  // Element position with proper scaling and centering
  const elementX = (element.x * zoom * canvasScale) + (panOffset.x * canvasScale)
  const elementY = (element.y * zoom * canvasScale) + (panOffset.y * canvasScale)
  const elementWidth = element.width * zoom * canvasScale
  
  // Final screen position
  const toolbarX = canvasRect.left + centerOffsetX + elementX + (elementWidth / 2)
  const toolbarY = Math.max(10, canvasRect.top + centerOffsetY + elementY - 45) // Prevent going off top of screen

  return (
    <div
      className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg flex items-center gap-1 p-1 z-50"
      style={{
        left: `${toolbarX}px`,
        top: `${toolbarY}px`,
        transform: 'translateX(-50%)', // Center horizontally above element
      }}
    >
      {/* Rotate */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRotate}
        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Rotate 90°"
      >
        <RotateCw className="h-4 w-4" />
      </Button>

      {/* Layer Up */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onLayerUp}
        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Bring Forward"
      >
        <ChevronUp className="h-4 w-4" />
      </Button>

      {/* Layer Down */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onLayerDown}
        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Send Backward"
      >
        <ChevronDown className="h-4 w-4" />
      </Button>

      {/* Copy */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onCopy}
        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Copy"
      >
        <Copy className="h-4 w-4" />
      </Button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200 dark:bg-gray-600 mx-1" />

      {/* Delete */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}