import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_libs/prisma'
import { PublishStatus } from '@/app/generated/prisma/enums'

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const supabaseId = searchParams.get('supabaseId')

    // supabaseId が指定された場合：該当ユーザーの全ブックマークを取得
    // 指定がない場合：全ユーザーの PUBLISHED ブックマークを取得
    let where = {}

    if (supabaseId) {
      const userInfo = await prisma.userInformation.findUnique({
        where: { supabaseId },
      })

      if (!userInfo) {
        return NextResponse.json(
          { error: 'ユーザーが見つかりません' },
          { status: 404 }
        )
      }

      where = { userId: userInfo.id }
    } else {
      where = { publishStatus: PublishStatus.PUBLISHED }
    }

    const bookmarks = await prisma.bookmark.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
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
    const body = await request.json()
    const {
      supabaseId,
      url,
      comment,
      isFavorite = false,
      publishStatus = PublishStatus.DRAFT,
      categoryIds = [],
      tagIds = [],
    }: {
      supabaseId: string
      url: string
      comment?: string
      isFavorite?: boolean
      publishStatus?: PublishStatus
      categoryIds?: string[]
      tagIds?: string[]
    } = body

    // バリデーション
    if (!supabaseId || !url) {
      return NextResponse.json(
        { error: 'supabaseId と url は必須です' },
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

    // ブックマーク作成
    const bookmark = await prisma.bookmark.create({
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

    return NextResponse.json({ bookmark }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/bookmarks]', error)
    return NextResponse.json(
      { error: 'ブックマークの作成に失敗しました' },
      { status: 500 }
    )
  }
}
