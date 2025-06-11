"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockSubmissions } from "@/lib/mock-data"
import { Campaign } from "@/types"
import { 
  Calendar, 
  Users, 
  FileText, 
  Image, 
  Edit, 
  Share, 
  Download,
  Eye,
  ThumbsUp,
  Clock,
  AlertCircle,
  Plus,
  MoreHorizontal,
  Layers
} from "lucide-react"
import Link from "next/link"

interface CampaignDetailClientProps {
  campaign: Campaign
}

export function CampaignDetailClient({ campaign }: CampaignDetailClientProps) {
  const campaignSubmissions = mockSubmissions.filter(s => s.campaign_id === campaign.id)
  const pendingSubmissions = campaignSubmissions.filter(s => s.status === "pending")
  const approvedSubmissions = campaignSubmissions.filter(s => s.status === "approved")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "draft":
        return "secondary"
      case "closed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getDaysUntilDeadline = () => {
    const today = new Date()
    const deadline = new Date(campaign.deadline)
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysLeft = getDaysUntilDeadline()

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{campaign.title}</h1>
            <Badge variant={getStatusColor(campaign.status)}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {campaign.brand_name} • Created {campaign.created_at.toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Campaign
          </Button>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Submissions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.submission_count}</div>
            <p className="text-xs text-muted-foreground">
              {campaignSubmissions.length} in review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Review
            </CardTitle>
            <Eye className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Needs attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved Works
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedSubmissions.length}</div>
            <p className="text-xs text-muted-foreground">
              Ready to showcase
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Time Remaining
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daysLeft > 0 ? `${daysLeft}d` : "Ended"}
            </div>
            <p className="text-xs text-muted-foreground">
              Until {campaign.deadline.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Description */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {campaign.description}
              </p>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Creative Guidelines</CardTitle>
              <CardDescription>
                Please follow these guidelines when creating your submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm leading-relaxed">{campaign.guidelines}</p>
              </div>
            </CardContent>
          </Card>

          {/* Asset Kit */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Asset Kit</CardTitle>
                  <CardDescription>
                    Official brand assets for this campaign
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {campaign.assets.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {campaign.assets.map((asset) => (
                    <div key={asset.id} className="group relative">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img
                          src={asset.url}
                          alt={asset.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm font-medium truncate">{asset.filename}</p>
                        <Badge variant="outline" className="text-xs">
                          {asset.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Image className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">No assets uploaded yet</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Upload Assets
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Submissions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Submissions</CardTitle>
                  <CardDescription>
                    Latest creator submissions to this campaign
                  </CardDescription>
                </div>
                <Link href="/submissions">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {campaignSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {campaignSubmissions.slice(0, 3).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          <img
                            src={submission.artwork_url}
                            alt={submission.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium">{submission.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Creator {submission.creator_id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {submission.created_at.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            submission.status === "approved" ? "default" :
                            submission.status === "pending" ? "secondary" : 
                            "destructive"
                          }
                        >
                          {submission.status}
                        </Badge>
                        <Link href="/submissions">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-8 w-8 mb-2" />
                  <p className="text-sm">No submissions yet</p>
                  <p className="text-xs">Submissions will appear here once creators start participating</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Campaign Status */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={getStatusColor(campaign.status)}>
                    {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Deadline</span>
                  <span className="text-sm font-medium">
                    {campaign.deadline.toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Time Left</span>
                  <span className={`text-sm font-medium ${daysLeft <= 7 && daysLeft > 0 ? 'text-orange-600' : daysLeft <= 0 ? 'text-red-600' : ''}`}>
                    {daysLeft > 0 ? `${daysLeft} days` : "Campaign ended"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Submissions</span>
                  <span className="text-sm font-medium">{campaign.submission_count}</span>
                </div>
              </div>

              {daysLeft <= 7 && daysLeft > 0 && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <p className="text-sm text-orange-800">
                      Campaign ending soon!
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit Campaign
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                View All Submissions
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="w-full">
                <Share className="mr-2 h-4 w-4" />
                Share Campaign
              </Button>
            </CardContent>
          </Card>

          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Campaign ID</span>
                <span className="font-mono">{campaign.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brand</span>
                <span>{campaign.brand_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{campaign.created_at.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{campaign.updated_at.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assets</span>
                <span>{campaign.assets.length} files</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}