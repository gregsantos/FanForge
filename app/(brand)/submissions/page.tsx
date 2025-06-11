"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockSubmissions, mockCampaigns } from "@/lib/mock-data"
import { 
  Search, 
  Filter, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare,
  Download,
  Calendar,
  User,
  FileImage
} from "lucide-react"

export default function BrandSubmissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)

  const filteredSubmissions = mockSubmissions.filter(submission => {
    const matchesSearch = submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "pending":
        return "secondary"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const handleStatusUpdate = (submissionId: string, newStatus: string) => {
    console.log(`Updating submission ${submissionId} to ${newStatus}`)
    // In a real app, this would make an API call
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Submissions</h1>
          <p className="text-muted-foreground">
            Review and manage creator submissions to your campaigns
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Submissions
            </CardTitle>
            <FileImage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSubmissions.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
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
            <div className="text-2xl font-bold">
              {mockSubmissions.filter(s => s.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSubmissions.filter(s => s.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
            <ThumbsDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockSubmissions.filter(s => s.status === "rejected").length}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("approved")}
              >
                Approved
              </Button>
              <Button
                variant={statusFilter === "rejected" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("rejected")}
              >
                Rejected
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="space-y-6">
        {filteredSubmissions.map((submission) => {
          const campaign = mockCampaigns.find(c => c.id === submission.campaign_id)
          const isSelected = selectedSubmission === submission.id
          
          return (
            <Card key={submission.id} className={`transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{submission.title}</CardTitle>
                      <Badge variant={getStatusColor(submission.status)}>
                        {getStatusText(submission.status)}
                      </Badge>
                    </div>
                    <CardDescription className="max-w-2xl">
                      {submission.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        Creator {submission.creator_id}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {submission.created_at.toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileImage className="h-4 w-4" />
                        {campaign?.title}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSubmission(
                      isSelected ? null : submission.id
                    )}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {isSelected && (
                <CardContent className="border-t pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Artwork Preview */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Artwork</h3>
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={submission.artwork_url}
                          alt={submission.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-2 h-4 w-4" />
                          Full View
                        </Button>
                      </div>
                    </div>

                    {/* Review Actions */}
                    <div className="space-y-4">
                      <h3 className="font-medium">Review Actions</h3>
                      
                      {submission.status === "pending" && (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleStatusUpdate(submission.id, "approved")}
                            >
                              <ThumbsUp className="mr-2 h-4 w-4" />
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleStatusUpdate(submission.id, "rejected")}
                            >
                              <ThumbsDown className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Add Feedback
                          </Button>
                        </div>
                      )}

                      {submission.status === "approved" && (
                        <div className="space-y-3">
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                              ✓ Approved on {submission.updated_at.toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Update Feedback
                          </Button>
                        </div>
                      )}

                      {submission.status === "rejected" && (
                        <div className="space-y-3">
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">
                              ✗ Rejected on {submission.updated_at.toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <ThumbsUp className="mr-2 h-4 w-4" />
                            Reconsider Approval
                          </Button>
                        </div>
                      )}

                      {/* Feedback */}
                      {submission.feedback && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Feedback</h4>
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm">{submission.feedback}</p>
                          </div>
                        </div>
                      )}

                      {/* Campaign Info */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Campaign Details</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Campaign: {campaign?.title}</p>
                          <p>Brand: {campaign?.brand_name}</p>
                          <p>Deadline: {campaign?.deadline.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredSubmissions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileImage className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No submissions found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filters."
                : "Submissions will appear here once creators start submitting to your campaigns."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}