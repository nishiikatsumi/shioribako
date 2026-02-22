import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_libs/prisma'
import { PublishStatus } from '@/app/generated/prisma/enums'

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    const bookmark = await prisma.bookmark.findUnique({
      where: { id },
      include: {
        user: true,
        postCategories: {
          include: {
            category: true,
          },
        },
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!bookmark) {
      return NextResponse.json(
        { error: 'ブックマークが見つかりません' },
        { status: 404 }
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
    const body = await request.json()
    const {
      supabaseId,
      url,
      comment,
      isFavorite,
      publishStatus,
      categoryIds,
      tagIds,
    }: {
      supabaseId: string
      url?: string
      comment?: string
      isFavorite?: boolean
      publishStatus?: PublishStatus
      categoryIds?: string[]
      tagIds?: string[]
    } = body

    // バリデーション
    if (!supabaseId) {
      return NextResponse.json(
        { error: 'supabaseId は必須です' },
        { status: 400 }
      )
    }

    // supabaseId から UserInformation を取得
    const userInfo = await prisma.userInformation.findUnique({
      where: { supabaseId },
    })

    if (!userInfo) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // 対象ブックマークの存在確認 & 所有者チェック
    const existing = await prisma.bookmark.findUnique({
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
    const bookmark = await prisma.$transaction(async (tx) => {
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
          postCategories: {
            include: {
              category: true,
            },
          },
          postTags: {
            include: {
              tag: true,
            },
          },
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
    const body = await request.json()
    const { supabaseId }: { supabaseId: string } = body

    // バリデーション
    if (!supabaseId) {
      return NextResponse.json(
        { error: 'supabaseId は必須です' },
        { status: 400 }
      )
    }

    // supabaseId から UserInformation を取得
    const userInfo = await prisma.userInformation.findUnique({
      where: { supabaseId },
    })

    if (!userInfo) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // 対象ブックマークの存在確認 & 所有者チェック
    const existing = await prisma.bookmark.findUnique({
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
    await prisma.bookmark.delete({ where: { id } })

    return NextResponse.json({ message: 'ブックマークを削除しました' })
  } catch (error) {
    console.error('[DELETE /api/bookmarks/[id]]', error)
    return NextResponse.json(
      { error: 'ブックマークの削除に失敗しました' },
      { status: 500 }
    )
  }
}
