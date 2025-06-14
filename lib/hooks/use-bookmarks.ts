"use client"

import { useState, useEffect } from "react"

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Load bookmarks on mount
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch("/api/bookmarks?userId=user-1")
        if (response.ok) {
          const data = await response.json()
          setBookmarks(data.bookmarks)
        }
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [])

  const isBookmarked = (campaignId: string) => {
    return bookmarks.includes(campaignId)
  }

  const toggleBookmark = async (campaignId: string) => {
    const wasBookmarked = isBookmarked(campaignId)
    
    // Optimistic update
    if (wasBookmarked) {
      setBookmarks(prev => prev.filter(id => id !== campaignId))
    } else {
      setBookmarks(prev => [...prev, campaignId])
    }

    try {
      if (wasBookmarked) {
        // Remove bookmark
        const response = await fetch(`/api/bookmarks?campaignId=${campaignId}&userId=user-1`, {
          method: "DELETE"
        })
        
        if (!response.ok) {
          throw new Error("Failed to remove bookmark")
        }
      } else {
        // Add bookmark
        const response = await fetch("/api/bookmarks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            campaignId,
            userId: "user-1"
          })
        })
        
        if (!response.ok) {
          throw new Error("Failed to add bookmark")
        }
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error)
      // Revert optimistic update on error
      if (wasBookmarked) {
        setBookmarks(prev => [...prev, campaignId])
      } else {
        setBookmarks(prev => prev.filter(id => id !== campaignId))
      }
    }
  }

  return {
    bookmarks,
    loading,
    isBookmarked,
    toggleBookmark
  }
}