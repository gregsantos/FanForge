"use client"

import { useState, useRef, useCallback } from "react"
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
}

export function CreationCanvas({ assets, campaignTitle, onSave }: CreationCanvasProps) {
  const [elements, setElements] = useState<CanvasElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const canvasRef = useRef<HTMLDivElement>(null)

  const categories = [
    { id: "all", label: "All Assets", icon: Palette },
    { id: "characters", label: "Characters", icon: Circle },
    { id: "backgrounds", label: "Backgrounds", icon: Square },
    { id: "logos", label: "Logos", icon: Circle },
    { id: "titles", label: "Titles", icon: Square },
    { id: "props", label: "Props", icon: Circle },
  ]

  const filteredAssets = selectedCategory === "all" 
    ? assets 
    : assets.filter(asset => asset.category === selectedCategory)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const assetId = e.dataTransfer.getData("assetId")
    const asset = assets.find(a => a.id === assetId)

    if (asset && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / zoom
      const y = (e.clientY - rect.top) / zoom

      const newElement: CanvasElement = {
        id: generateId(),
        asset,
        x: Math.max(0, x - 50),
        y: Math.max(0, y - 50),
        width: 100,
        height: 100,
        rotation: 0,
        zIndex: elements.length,
      }

      setElements(prev => [...prev, newElement])
      setSelectedElement(newElement.id)
    }
  }, [assets, elements.length, zoom])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    )
  }

  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id))
    setSelectedElement(null)
  }

  const selectedElementData = selectedElement 
    ? elements.find(el => el.id === selectedElement)
    : null

  const handleSave = () => {
    onSave(elements)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Asset Palette */}
      <div className="w-80 border-r bg-card flex flex-col">
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

        <CardContent className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {filteredAssets.map(asset => (
              <div
                key={asset.id}
                draggable
                onDragStart={e => e.dataTransfer.setData("assetId", asset.id)}
                className="asset-palette-item group relative"
              >
                <img
                  src={asset.url}
                  alt={asset.filename}
                  className="w-full h-full object-cover rounded"
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
      <div className="flex-1 flex flex-col bg-muted/30">
        {/* Canvas Toolbar */}
        <div className="border-b bg-card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Move className="h-4 w-4 mr-1" />
              Move
            </Button>
            <div className="border-l h-6 mx-2" />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.25))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-1" />
              Save Draft
            </Button>
            <Button size="sm" onClick={handleSave}>
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
                </div>
              </div>
            )}
            
            {elements.map(element => (
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
                  src={element.asset.url}
                  alt={element.asset.filename}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 border-l bg-card flex flex-col">
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
                  {selectedElementData.asset.filename}
                </p>
                <Badge variant="outline">
                  {selectedElementData.asset.category}
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
                .map((element) => (
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
                      {element.asset.filename}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {element.zIndex}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  )
}