"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockSubmissions } from "@/lib/mock-data"
import { formatDate, formatTimeAgo } from "@/lib/utils"
import { 
  Eye, 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Download, 
  Share2,
  Trophy,
  Star,
  Filter
} from "lucide-react"

export default function PortfolioPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  
  const submissions = mockSubmissions
  
  const filteredSubmissions = selectedFilter === "all" 
    ? submissions 
    : submissions.filter(s => s.status === selectedFilter)

  const statusConfig = {
    approved: { 
      icon: CheckCircle, 
      variant: "success" as const, 
      label: "Approved" 
    },
    pending: { 
      icon: Clock, 
      variant: "warning" as const, 
      label: "Pending Review" 
    },
    rejected: { 
      icon: XCircle, 
      variant: "destructive" as const, 
      label: "Changes Requested" 
    },
  }

  const stats = {
    total: submissions.length,
    approved: submissions.filter(s => s.status === "approved").length,
    pending: submissions.filter(s => s.status === "pending").length,
    rejected: submissions.filter(s => s.status === "rejected").length,
  }

  const filters = [
    { id: "all", label: "All Work", count: stats.total },
    { id: "approved", label: "Approved", count: stats.approved },
    { id: "pending", label: "Pending", count: stats.pending },
    { id: "rejected", label: "Changes Requested", count: stats.rejected },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Portfolio
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Track your submissions and showcase approved works
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-primary">
                {stats.total}
              </CardTitle>
              <CardDescription>Total Submissions</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-green-600">
                {stats.approved}
              </CardTitle>
              <CardDescription>Approved Works</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </CardTitle>
              <CardDescription>Under Review</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </CardTitle>
              <CardDescription>Need Updates</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Achievements Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="px-3 py-1">
                <Star className="mr-1 h-3 w-3" />
                First Submission
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <CheckCircle className="mr-1 h-3 w-3" />
                First Approval
              </Badge>
              <Badge variant="outline" className="px-3 py-1 opacity-50">
                <Trophy className="mr-1 h-3 w-3" />
                5 Approved Works
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                onClick={() => setSelectedFilter(filter.id)}
                className="flex items-center gap-2"
              >
                {filter.label}
                <Badge variant="secondary" className="ml-1">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Submissions Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubmissions.map((submission) => {
            const statusInfo = statusConfig[submission.status]
            const StatusIcon = statusInfo.icon
            
            return (
              <Card key={submission.id} className="group overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={submission.artwork_url}
                    alt={submission.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant={statusInfo.variant}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {submission.status === "approved" && (
                      <>
                        <Button size="sm" variant="secondary">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{submission.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {submission.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatTimeAgo(submission.created_at)}</span>
                    </div>
                    <Badge variant="outline">Campaign #1</Badge>
                  </div>
                  
                  {submission.feedback && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Feedback:</p>
                      <p className="text-sm text-muted-foreground">
                        {submission.feedback}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No submissions found
            </h3>
            <p className="text-muted-foreground mb-4">
              {selectedFilter === "all" 
                ? "Start creating to build your portfolio!"
                : `No ${selectedFilter} submissions yet.`
              }
            </p>
            <Button>
              Browse Campaigns
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}