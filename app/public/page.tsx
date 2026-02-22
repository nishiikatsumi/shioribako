'use client'

import { useState, useEffect } from 'react'
import BookmarkShowForm, { Bookmark } from '@/app/_components/BookmarkShowForm'

export default function PublicPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch('/api/bookmarks')
        if (!res.ok) return
        const data = await res.json()
        setBookmarks(data.bookmarks)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBookmarks()
  }, [])

  return (
    <BookmarkShowForm
      bookmarks={bookmarks}
      isLoading={isLoading}
      pageTitle="ブックマーク一覧"
    />
  )
}
