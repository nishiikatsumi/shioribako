import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/app/_libs/prisma'
import { PublishStatus } from '@/app/generated/prisma/enums'
import { getAuthenticatedUser, getOrCreateUserInfo, unauthorizedResponse, validateBookmarkUrl, validateComment } from '@/app/_libs/auth'

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    // 認証チェック
    const user = await getAuthenticatedUser(request)
    if (!user) return unauthorizedResponse()

    const bookmark = await getPrisma().bookmark.findUnique({
      where: { id },
      include: {
        user: true,
        postCategories: { include: { category: true } },
        postTags: { include: { tag: true } },
      },
    })

    if (!bookmark) {
      return NextResponse.json(
        { error: 'ブックマークが見つかりません' },
        { status: 404 }
      )
    }

    // 所有者チェック: 自分のブックマークか、公開ブックマークのみ閲覧可
    const userInfo = await getOrCreateUserInfo(user)

    if (bookmark.userId !== userInfo.id && bookmark.publishStatus !== PublishStatus.PUBLISHED) {
      return NextResponse.json(
        { error: 'このブックマークを閲覧する権限がありません' },
        { status: 403 }
      )
    }

    return NextResponse.json({ bookmark })
  } catch (error) {
    console.error('[GET /api/bookmarks/[id]]', error)
    return NextResponse.json(
      { error: 'ブックマークの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    // 認証チェック
    const user = await getAuthenticatedUser(request)
    if (!user) return unauthorizedResponse()

    const body = await request.json()
    const {
      url,
      comment,
      isFavorite,
      publishStatus,
      categoryIds,
      tagIds,
    }: {
      url?: string
      comment?: string
      isFavorite?: boolean
      publishStatus?: PublishStatus
      categoryIds?: string[]
      tagIds?: string[]
    } = body

    // URL バリデーション（指定されている場合）
    if (url !== undefined) {
      const urlError = validateBookmarkUrl(url)
      if (urlError) {
        return NextResponse.json({ error: urlError }, { status: 400 })
      }
    }

    // コメントバリデーション
    const commentError = validateComment(comment)
    if (commentError) {
      return NextResponse.json({ error: commentError }, { status: 400 })
    }

    // トークンからユーザーを取得（未作成なら自動作成）
    const userInfo = await getOrCreateUserInfo(user)

    // 対象ブックマークの存在確認 & 所有者チェック
    const existing = await getPrisma().bookmark.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'ブックマークが見つかりません' },
        { status: 404 }
      )
    }

    if (existing.userId !== userInfo.id) {
      return NextResponse.json(
        { error: 'このブックマークを編集する権限がありません' },
        { status: 403 }
      )
    }

    // カテゴリー・タグを一括更新（既存を削除して再作成）
    const bookmark = await getPrisma().$transaction(async (tx) => {
      if (categoryIds !== undefined) {
        await tx.postCategory.deleteMany({ where: { bookmarkId: id } })
      }
      if (tagIds !== undefined) {
        await tx.postTag.deleteMany({ where: { bookmarkId: id } })
      }

      return tx.bookmark.update({
        where: { id },
        data: {
          ...(url !== undefined && { url }),
          ...(comment !== undefined && { comment }),
          ...(isFavorite !== undefined && { isFavorite }),
          ...(publishStatus !== undefined && { publishStatus }),
          ...(categoryIds !== undefined && {
            postCategories: {
              create: categoryIds.map((categoryId) => ({ categoryId })),
            },
          }),
          ...(tagIds !== undefined && {
            postTags: {
              create: tagIds.map((tagId) => ({ tagId })),
            },
          }),
        },
        include: {
          user: true,
          postCategories: { include: { category: true } },
          postTags: { include: { tag: true } },
        },
      })
    })

    return NextResponse.json({ bookmark })
  } catch (error) {
    console.error('[PUT /api/bookmarks/[id]]', error)
    return NextResponse.json(
      { error: 'ブックマークの更新に失敗しました' },
      { status: 500 }
    )
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    // 認証チェック
    const user = await getAuthenticatedUser(request)
    if (!user) return unauthorizedResponse()

    // トークンからユーザーを取得（未作成なら自動作成）
    const userInfo = await getOrCreateUserInfo(user)

    // 対象ブックマークの存在確認 & 所有者チェック
    const existing = await getPrisma().bookmark.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'ブックマークが見つかりません' },
        { status: 404 }
      )
    }

    if (existing.userId !== userInfo.id) {
      return NextResponse.json(
        { error: 'このブックマークを削除する権限がありません' },
        { status: 403 }
      )
    }

    // ブックマーク削除（PostCategory・PostTag は onDelete: Cascade で自動削除）
    await getPrisma().bookmark.delete({ where: { id } })

    return NextResponse.json({ message: 'ブックマークを削除しました' })
  } catch (error) {
    console.error('[DELETE /api/bookmarks/[id]]', error)
    return NextResponse.json(
      { error: 'ブックマークの削除に失敗しました' },
      { status: 500 }
    )
  }
}
