import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_libs/prisma'

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const supabaseId = searchParams.get('supabaseId')

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

    // ユーザー自身のカテゴリーを取得
    const categories = await prisma.category.findMany({
      where: { userId: userInfo.id },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('[GET /api/categories]', error)
    return NextResponse.json(
      { error: 'カテゴリーの取得に失敗しました' },
      { status: 500 }
    )
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { supabaseId, name }: { supabaseId: string; name: string } = body

    // バリデーション
    if (!supabaseId || !name) {
      return NextResponse.json(
        { error: 'supabaseId と name は必須です' },
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

    // 同名カテゴリーの重複チェック
    const existing = await prisma.category.findFirst({
      where: { userId: userInfo.id, name },
    })

    if (existing) {
      return NextResponse.json(
        { error: '同じ名前のカテゴリーが既に存在します' },
        { status: 409 }
      )
    }

    // カテゴリー作成
    const category = await prisma.category.create({
      data: {
        name,
        userId: userInfo.id,
      },
    })

    return NextResponse.json({ category }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/categories]', error)
    return NextResponse.json(
      { error: 'カテゴリーの作成に失敗しました' },
      { status: 500 }
    )
  }
}
