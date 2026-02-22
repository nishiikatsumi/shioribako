import { Bookmark, PublishStatus, UserInformation } from "../generated/prisma/client"

export type UserInformationResponse = {
  id: string
  supabaseId: string 
  userName: string
  thumbnailKey: string | null
  createdAt: Date
  updatedAt: Date
  bookmarks: Bookmark[]
}

// ブックマーク
export type BookmarksIndexResponse = {
  bookmarks: {
    id: string
    userId: string
    url: string
    comment: string | null
    isFavorite: boolean
    publishStatus: PublishStatus
    createdAt: Date
    updatedAt: Date
    postCategories: {
      id: string
      bookmarkId: string
      categoryId: string
      createdAt: Date
      updatedAt: Date
    }[]
    postTags: {
      id: string
      bookmarkId: string
      tagId: string
      createdAt: Date
      updatedAt: Date
    }[]
  }[];
}


