"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { Asset, CanvasElement } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { generateId } from "@/lib/utils"
import { 
  Save, 
  Download, 
  RotateCw, 
  Move, 
  Square, 
  Circle, 
  Trash2, 
  ZoomIn, 
  ZoomOut,
  Layers,
  Palette
} from "lucide-react"

interface CreationCanvasProps {
  assets: Asset[]
  campaignTitle: string
  onSave: (elements: CanvasElement[]) => void
  isLoading?: boolean
  onAutoSave?: (elements: CanvasElement[]) => void
}

export function CreationCanvas({ 
  assets, 
  campaignTitle, 
  onSave, 
  isLoading = false,
  onAutoSave 
}: CreationCanvasProps) {
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isDragging, setIsDragging] = useState(false)
  const [dragPreview, setDragPreview] = useState<{ x: number; y: number; asset: Asset } | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)

  const categories = [
    { id: "all", label: "All Assets", icon: Palette },
    { id: "characters", label: "Characters", icon: Circle },
    { id: "backgrounds", label: "Backgrounds", icon: Square },
    { id: "logos", label: "Logos", icon: Circle },
    { id: "titles", label: "Titles", icon: Square },
    { id: "props", label: "Props", icon: Circle },
  ]

  // Memoize filtered assets for performance
  const filteredAssets = useMemo(() => {
    return selectedCategory === "all" 
      ? assets 
      : assets.filter(asset => asset.category === selectedCategory)
  }, [assets, selectedCategory])

  // Virtual scrolling state for large asset libraries
  const [visibleAssets, setVisibleAssets] = useState<Asset[]>([])
  const [assetScrollTop, setAssetScrollTop] = useState(0)
  const assetContainerRef = useRef<HTMLDivElement>(null)
  
  // Performance optimization: Only show visible assets
  useEffect(() => {
    if (filteredAssets.length <= 20) {
      // For small lists, show all assets
      setVisibleAssets(filteredAssets)
      return
    }

    // For large lists, implement virtual scrolling
    const itemHeight = 120 // Approximate height per asset item
    const containerHeight = assetContainerRef.current?.clientHeight || 400
    const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 // Buffer
    const startIndex = Math.floor(assetScrollTop / itemHeight)
    const endIndex = Math.min(startIndex + visibleCount, filteredAssets.length)
    
    setVisibleAssets(filteredAssets.slice(startIndex, endIndex))
  }, [filteredAssets, assetScrollTop])

  // Auto-save functionality with debouncing
  useEffect(() => {
    if (onAutoSave && elements.length > 0) {
      const timer = setTimeout(() => {
        setIsAutoSaving(true)
        onAutoSave(elements)
        setTimeout(() => setIsAutoSaving(false), 1000)
      }, 2000) // Auto-save after 2 seconds of inactivity
      
      return () => clearTimeout(timer)
    }
  }, [elements, onAutoSave])

  // Debounce element updates for performance
  const debouncedUpdateElement = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      setElements(prev => 
        prev.map(el => el.id === id ? { ...el, ...updates } : el)
      )
    },
    []
  )

  // Zoom with mouse wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        setZoom(prev => Math.max(0.25, Math.min(2, prev + delta)))
      }
    }

    const canvas = canvasContainerRef.current
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false })
      return () => canvas.removeEventListener('wheel', handleWheel)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setDragPreview(null)
    
    const assetId = e.dataTransfer.getData("assetId")
    const asset = assets.find(a => a.id === assetId)

    if (asset && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left - panOffset.x) / zoom
      const y = (e.clientY - rect.top - panOffset.y) / zoom

      // Calculate element size based on asset metadata if available
      const aspectRatio = asset.metadata.width / asset.metadata.height
      const defaultSize = 100
      const width = defaultSize
      const height = defaultSize / aspectRatio

      const newElement: CanvasElement = {
        id: generateId(),
        assetId: asset.id,
        x: Math.max(0, x - width / 2),
        y: Math.max(0, y - height / 2),
        width,
        height,
        rotation: 0,
        zIndex: elements.length,
      }

      setElements(prev => [...prev, newElement])
      setSelectedElement(newElement.id)
    }
  }, [assets, elements.length, zoom, panOffset])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const assetId = e.dataTransfer.getData("assetId")
      const asset = assets.find(a => a.id === assetId)
      
      if (asset) {
        setDragPreview({ x, y, asset })
      }
    }
  }, [assets])

  const updateElement = debouncedUpdateElement

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id))
    setSelectedElement(null)
  }

  // Memoize selected element data for performance
  const selectedElementData = useMemo(() => {
    return selectedElement 
      ? elements.find(el => el.id === selectedElement)
      : null
  }, [selectedElement, elements])
  
  const selectedAsset = useMemo(() => {
    return selectedElementData 
      ? assets.find(a => a.id === selectedElementData.assetId)
      : null
  }, [selectedElementData, assets])

  // Pan controls
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+click
      e.preventDefault()
      setIsPanning(true)
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
    }
  }, [panOffset])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      })
    }
  }, [isPanning, panStart])

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedElement) {
        deleteElement(selectedElement)
      } else if (e.key === 'Escape') {
        setSelectedElement(null)
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedElement])

  const handleSave = () => {
    onSave(elements)
  }

  const resetCanvas = () => {
    setElements([])
    setSelectedElement(null)
    setPanOffset({ x: 0, y: 0 })
    setZoom(1)
  }

  const fitToScreen = () => {
    if (canvasContainerRef.current && canvasRef.current) {
      const container = canvasContainerRef.current.getBoundingClientRect()
      const canvasWidth = 800
      const canvasHeight = 600
      
      const scaleX = (container.width - 80) / canvasWidth
      const scaleY = (container.height - 80) / canvasHeight
      const newZoom = Math.min(scaleX, scaleY, 1)
      
      setZoom(newZoom)
      setPanOffset({ x: 0, y: 0 })
    }
  }

  return (
    <div className="flex h-screen bg-background relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading assets...</p>
          </div>
        </div>
      )}

      {/* Asset Palette */}
      <div className="w-80 lg:w-80 md:w-72 sm:w-64 border-r bg-card flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Asset Kit</CardTitle>
          <p className="text-sm text-muted-foreground">{campaignTitle}</p>
        </CardHeader>
        
        <div className="px-6 mb-4">
          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-xs"
              >
                <category.icon className="mr-1 h-3 w-3" />
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <CardContent 
          ref={assetContainerRef}
          className="flex-1 overflow-y-auto"
          onScroll={(e) => {
            const target = e.target as HTMLDivElement
            setAssetScrollTop(target.scrollTop)
          }}
        >
          <div className="grid grid-cols-2 gap-3" style={{
            minHeight: filteredAssets.length > 20 ? `${Math.ceil(filteredAssets.length / 2) * 120}px` : 'auto'
          }}>
            {(filteredAssets.length > 20 ? visibleAssets : filteredAssets).map((asset, index) => (
              <div
                key={asset.id}
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData("assetId", asset.id)
                  setIsDragging(true)
                }}
                onDragEnd={() => {
                  setIsDragging(false)
                  setDragPreview(null)
                }}
                className="asset-palette-item group relative"
              >
                <img
                  src={asset.thumbnailUrl || asset.url}
                  alt={asset.filename}
                  className="w-full h-full object-cover rounded"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to full URL if thumbnail fails
                    const target = e.target as HTMLImageElement
                    if (target.src !== asset.url) {
                      target.src = asset.url
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="text-xs font-medium truncate">{asset.filename}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {asset.category}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredAssets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Palette className="mx-auto h-8 w-8 mb-2" />
              <p className="text-sm">No assets in this category</p>
            </div>
          )}
        </CardContent>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col bg-muted/30 min-w-0">
        {/* Canvas Toolbar */}
        <div className="border-b bg-card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant={isPanning ? "default" : "outline"} 
              size="sm"
              onMouseDown={handleMouseDown}
            >
              <Move className="h-4 w-4 mr-1" />
              Pan {isPanning ? '(Active)' : ''}
            </Button>
            <div className="border-l h-6 mx-2" />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
              disabled={zoom <= 0.25}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.25))}
              disabled={zoom >= 2}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={fitToScreen}
              title="Fit to screen"
            >
              Fit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetCanvas}
              title="Reset canvas"
            >
              Reset
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled={isAutoSaving}
            >
              <Save className={`h-4 w-4 mr-1 ${isAutoSaving ? 'animate-spin' : ''}`} />
              {isAutoSaving ? 'Saving...' : 'Auto-Save'}
            </Button>
            <Button size="sm" onClick={handleSave} disabled={elements.length === 0}>
              <Download className="h-4 w-4 mr-1" />
              Submit
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4 overflow-auto">
          <div
            ref={canvasRef}
            className="relative bg-white border-2 border-dashed border-muted-foreground/25 rounded-lg mx-auto"
            style={{ 
              width: `${800 * zoom}px`, 
              height: `${600 * zoom}px`,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left'
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => setSelectedElement(null)}
          >
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Palette className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="font-medium mb-2">Start Creating</h3>
                  <p className="text-sm">Drag assets from the palette to begin</p>
                  <p className="text-xs mt-2 opacity-70">Ctrl+Scroll to zoom • Middle-click to pan</p>
                </div>
              </div>
            )}
            
            {/* Drag Preview */}
            {dragPreview && isDragging && (
              <div
                className="absolute pointer-events-none border-2 border-primary bg-primary/20 rounded opacity-60"
                style={{
                  left: dragPreview.x - 50,
                  top: dragPreview.y - 50,
                  width: 100,
                  height: 100,
                  zIndex: 9999
                }}
              >
                <img
                  src={dragPreview.asset.url}
                  alt={dragPreview.asset.filename}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
            
            {elements.map(element => {
              const asset = assets.find(a => a.id === element.assetId)
              if (!asset) return null
              
              return (
                <div
                  key={element.id}
                  className={`canvas-element absolute ${
                    selectedElement === element.id ? 'selected' : ''
                  }`}
                  style={{
                    left: element.x,
                    top: element.y,
                    width: element.width,
                    height: element.height,
                    transform: `rotate(${element.rotation}deg)`,
                    zIndex: element.zIndex,
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedElement(element.id)
                  }}
                >
                  <img
                    src={asset.url}
                    alt={asset.filename}
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 lg:w-80 md:w-72 sm:w-64 border-l bg-card flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Layers className="mr-2 h-5 w-5" />
            Properties
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 space-y-6">
          {selectedElementData ? (
            <>
              {/* Element Info */}
              <div>
                <h3 className="font-medium mb-2">Selected Element</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedAsset?.filename}
                </p>
                <Badge variant="outline">
                  {selectedAsset?.category}
                </Badge>
              </div>

              {/* Position */}
              <div className="space-y-3">
                <h4 className="font-medium">Position & Size</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">X</label>
                    <Input
                      type="number"
                      value={Math.round(selectedElementData.x)}
                      onChange={(e) => updateElement(selectedElementData.id, { 
                        x: parseInt(e.target.value) || 0 
                      })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Y</label>
                    <Input
                      type="number"
                      value={Math.round(selectedElementData.y)}
                      onChange={(e) => updateElement(selectedElementData.id, { 
                        y: parseInt(e.target.value) || 0 
                      })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Width</label>
                    <Input
                      type="number"
                      value={selectedElementData.width}
                      onChange={(e) => updateElement(selectedElementData.id, { 
                        width: parseInt(e.target.value) || 1 
                      })}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Height</label>
                    <Input
                      type="number"
                      value={selectedElementData.height}
                      onChange={(e) => updateElement(selectedElementData.id, { 
                        height: parseInt(e.target.value) || 1 
                      })}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>

              {/* Rotation */}
              <div className="space-y-2">
                <h4 className="font-medium">Rotation</h4>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={selectedElementData.rotation}
                    onChange={(e) => updateElement(selectedElementData.id, { 
                      rotation: parseInt(e.target.value) || 0 
                    })}
                    className="h-8"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateElement(selectedElementData.id, { 
                      rotation: (selectedElementData.rotation + 90) % 360 
                    })}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <h4 className="font-medium">Actions</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => deleteElement(selectedElementData.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Element
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Layers className="mx-auto h-8 w-8 mb-2" />
              <p className="text-sm">Select an element to edit properties</p>
            </div>
          )}

          {/* Layer Management */}
          <div className="space-y-2">
            <h4 className="font-medium">Layers ({elements.length})</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {elements
                .sort((a, b) => b.zIndex - a.zIndex)
                .map((element) => {
                  const asset = assets.find(a => a.id === element.assetId)
                  return (
                    <div
                      key={element.id}
                      className={`p-2 rounded border cursor-pointer transition-colors ${
                        selectedElement === element.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-muted'
                      }`}
                      onClick={() => setSelectedElement(element.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm truncate">
                          {asset?.filename || 'Unknown'}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {element.zIndex}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  )
}