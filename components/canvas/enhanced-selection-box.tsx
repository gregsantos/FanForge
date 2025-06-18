"use client"

import { CanvasElement } from "@/types"
import { RotateCw } from "lucide-react"

interface EnhancedSelectionBoxProps {
  element: CanvasElement
  onResizeMouseDown: (e: React.MouseEvent, elementId: string, corner: string) => void
  onRotationMouseDown: (e: React.MouseEvent, elementId: string) => void
  isTouchDevice: boolean
}

export function EnhancedSelectionBox({
  element,
  onResizeMouseDown,
  onRotationMouseDown,
  isTouchDevice
}: EnhancedSelectionBoxProps) {
  if (isTouchDevice) {
    // For touch devices, show simplified selection (existing corner handles only)
    return (
      <>
        {/* Corner resize handles */}
        <div
          className="absolute w-3 h-3 bg-primary border border-white rounded-sm cursor-nw-resize -top-1 -left-1"
          onMouseDown={(e) => onResizeMouseDown(e, element.id, 'nw')}
        />
        <div
          className="absolute w-3 h-3 bg-primary border border-white rounded-sm cursor-ne-resize -top-1 -right-1"
          onMouseDown={(e) => onResizeMouseDown(e, element.id, 'ne')}
        />
        <div
          className="absolute w-3 h-3 bg-primary border border-white rounded-sm cursor-sw-resize -bottom-1 -left-1"
          onMouseDown={(e) => onResizeMouseDown(e, element.id, 'sw')}
        />
        <div
          className="absolute w-3 h-3 bg-primary border border-white rounded-sm cursor-se-resize -bottom-1 -right-1"
          onMouseDown={(e) => onResizeMouseDown(e, element.id, 'se')}
        />
      </>
    )
  }

  return (
    <>
      {/* Selection border */}
      <div className="absolute inset-0 border-2 border-primary rounded-sm pointer-events-none" />
      
      {/* Corner resize handles */}
      <div
        className="absolute w-3 h-3 bg-white border-2 border-primary rounded-sm cursor-nw-resize -top-1 -left-1 hover:scale-110 transition-transform pointer-events-auto"
        onMouseDown={(e) => onResizeMouseDown(e, element.id, 'nw')}
      />
      <div
        className="absolute w-3 h-3 bg-white border-2 border-primary rounded-sm cursor-ne-resize -top-1 -right-1 hover:scale-110 transition-transform pointer-events-auto"
        onMouseDown={(e) => onResizeMouseDown(e, element.id, 'ne')}
      />
      <div
        className="absolute w-3 h-3 bg-white border-2 border-primary rounded-sm cursor-sw-resize -bottom-1 -left-1 hover:scale-110 transition-transform pointer-events-auto"
        onMouseDown={(e) => onResizeMouseDown(e, element.id, 'sw')}
      />
      <div
        className="absolute w-3 h-3 bg-white border-2 border-primary rounded-sm cursor-se-resize -bottom-1 -right-1 hover:scale-110 transition-transform pointer-events-auto"
        onMouseDown={(e) => onResizeMouseDown(e, element.id, 'se')}
      />

      {/* Side handles for one-directional resizing */}
      {/* Top handle */}
      <div
        className="absolute w-3 h-3 bg-white border-2 border-primary rounded-sm cursor-ns-resize -top-1 left-1/2 transform -translate-x-1/2 hover:scale-110 transition-transform pointer-events-auto"
        onMouseDown={(e) => onResizeMouseDown(e, element.id, 'n')}
      />
      {/* Right handle */}
      <div
        className="absolute w-3 h-3 bg-white border-2 border-primary rounded-sm cursor-ew-resize -right-1 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform pointer-events-auto"
        onMouseDown={(e) => onResizeMouseDown(e, element.id, 'e')}
      />
      {/* Bottom handle */}
      <div
        className="absolute w-3 h-3 bg-white border-2 border-primary rounded-sm cursor-ns-resize -bottom-1 left-1/2 transform -translate-x-1/2 hover:scale-110 transition-transform pointer-events-auto"
        onMouseDown={(e) => onResizeMouseDown(e, element.id, 's')}
      />
      {/* Left handle */}
      <div
        className="absolute w-3 h-3 bg-white border-2 border-primary rounded-sm cursor-ew-resize -left-1 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform pointer-events-auto"
        onMouseDown={(e) => onResizeMouseDown(e, element.id, 'w')}
      />

      {/* Rotation handle - positioned to avoid toolbar overlap */}
      <div
        className="absolute w-6 h-6 bg-white border-2 border-primary rounded-full cursor-grab -top-12 left-1/2 transform -translate-x-1/2 flex items-center justify-center hover:scale-110 transition-transform shadow-sm pointer-events-auto"
        onMouseDown={(e) => onRotationMouseDown(e, element.id)}
        title="Rotate"
      >
        <RotateCw className="w-3 h-3 text-primary" />
      </div>
    </>
  )
}