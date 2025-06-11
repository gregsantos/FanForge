"use client"

import {CreationCanvas} from "@/components/canvas/creation-canvas"
import {mockAssets} from "@/lib/mock-data"

export default function CreatePage() {
  return (
    <div className='flex h-screen bg-background'>
      <CreationCanvas
        assets={mockAssets}
        campaignTitle='Test Campaign'
        onSave={() => {}}
      />
    </div>
  )
}
