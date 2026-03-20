import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/app/_libs/prisma'
import { PublishStatus } from '@/app/generated/prisma/enums'
import { getAuthenticatedUser, getOrCreateUserInfo, unauthorizedResponse, validateBookmarkUrl, validateComment } from '@/app/_libs/auth'

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const supabaseId = searchParams.get('supabaseId')

    if (supabaseId) {
      // マイブックマーク取得: 認証必須 & トークンのユーザーと一致確認
      const user = await getAuthenticatedUser(request)
      if (!user) return unauthorizedResponse()

      if (user.id !== supabaseId) {
        return NextResponse.json(
          { error: '他のユーザーのブックマークにはアクセスできません' },
          { status: 403 }
        )
      }

      // トークンからユーザーを取得（未作成なら自動作成）
      const userInfo = await getOrCreateUserInfo(user)

      const bookmarks = await getPrisma().bookmark.findMany({
        where: { userId: userInfo.id },
        include: {
          user: true,
          postCategories: { include: { category: true } },
          postTags: { include: { tag: true } },
        },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({ bookmarks })
    }

    // 公開ブックマーク取得: 認証不要
    const bookmarks = await getPrisma().bookmark.findMany({
      where: { publishStatus: PublishStatus.PUBLISHED },
      include: {
        user: true,
        postCategories: { include: { category: true } },
        postTags: { include: { tag: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ bookmarks })
  } catch (error) {
    console.error('[GET /api/bookmarks]', error)
    return NextResponse.json(
      { error: 'ブックマークの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export const POST = async (request: NextRequest) => {
  try {
    // 認証チェック
    const user = await getAuthenticatedUser(request)
    if (!user) return unauthorizedResponse()

    const body = await request.json()
    const {
      url,
      comment,
      isFavorite = false,
      publishStatus = PublishStatus.DRAFT,
      categoryIds = [],
      tagIds = [],
    }: {
      url: string
      comment?: string
      isFavorite?: boolean
      publishStatus?: PublishStatus
      categoryIds?: string[]
      tagIds?: string[]
    } = body

    // URL バリデーション
    const urlError = validateBookmarkUrl(url)
    if (urlError) {
      return NextResponse.json({ error: urlError }, { status: 400 })
    }

    // コメントバリデーション
    const commentError = validateComment(comment)
    if (commentError) {
      return NextResponse.json({ error: commentError }, { status: 400 })
    }

    // トークンからユーザーを取得（未作成なら自動作成）
    const userInfo = await getOrCreateUserInfo(user)

    const bookmark = await getPrisma().bookmark.create({
      data: {
        userId: userInfo.id,
        url,
        comment,
        isFavorite,
        publishStatus,
        postCategories: {
          create: categoryIds.map((categoryId: string) => ({ categoryId })),
        },
        postTags: {
          create: tagIds.map((tagId: string) => ({ tagId })),
        },
      },
      include: {
        user: true,
        postCategories: { include: { category: true } },
        postTags: { include: { tag: true } },
      },
    })

    return NextResponse.json({ bookmark }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/bookmarks]', error)
    return NextResponse.json(
      { error: 'ブックマークの作成に失敗しました' },
      { status: 500 }
    )
  }
}
