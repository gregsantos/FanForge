"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockCampaigns } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils"
import { Search, Filter, Calendar, Users, Image, ArrowRight, Bookmark } from "lucide-react"
import Link from "next/link"

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const campaigns = mockCampaigns.filter(campaign => campaign.status === "active")

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "anime", label: "Anime" },
    { id: "gaming", label: "Gaming" },
    { id: "fantasy", label: "Fantasy" },
    { id: "cyberpunk", label: "Cyberpunk" },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Discover Campaigns
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Find exciting creative opportunities from top brands
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns, brands, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="campaign-card group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{campaign.brand_name}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {campaign.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {campaign.title}
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="line-clamp-2">
                  {campaign.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Campaign Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{campaign.submission_count} submissions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Image className="h-4 w-4" />
                      <span>{campaign.assets.length} assets</span>
                    </div>
                  </div>
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Deadline:</span>
                  <span className="font-medium">{formatDate(campaign.deadline)}</span>
                </div>

                {/* Asset Preview */}
                {campaign.assets.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Asset Preview:</p>
                    <div className="flex gap-2">
                      {campaign.assets.slice(0, 3).map((asset) => (
                        <div
                          key={asset.id}
                          className="h-12 w-12 rounded border bg-muted overflow-hidden"
                        >
                          <img
                            src={asset.url}
                            alt={asset.filename}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                      {campaign.assets.length > 3 && (
                        <div className="h-12 w-12 rounded border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          +{campaign.assets.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/campaigns/${campaign.id}`} className="flex-1">
                    <Button className="w-full">
                      Join Campaign
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/campaigns/${campaign.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No campaigns found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find more campaigns.
            </p>
          </div>
        )}

        {/* Load More */}
        {filteredCampaigns.length > 0 && (
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Load More Campaigns
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}