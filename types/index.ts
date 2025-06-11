export interface User {
  id: string
  email: string
  role: "creator" | "brand_admin"
  name: string
  avatar_url?: string
  created_at: Date
  updated_at: Date
}

export interface Campaign {
  id: string
  title: string
  description: string
  guidelines: string
  brand_id: string
  brand_name: string
  status: "draft" | "active" | "closed"
  deadline: Date
  assets: Asset[]
  submission_count: number
  created_at: Date
  updated_at: Date
}

export interface Asset {
  id: string
  campaign_id: string
  filename: string
  url: string
  category: "characters" | "backgrounds" | "logos" | "titles" | "props"
  metadata: {
    width: number
    height: number
    file_size: number
    mime_type: string
  }
  created_at: Date
}

export interface Submission {
  id: string
  campaign_id: string
  creator_id: string
  title: string
  description: string
  artwork_url: string
  status: "pending" | "approved" | "rejected"
  feedback?: string
  created_at: Date
  updated_at: Date
}

export interface CanvasElement {
  id: string
  asset: Asset
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
}