import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_libs/prisma'

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    const category = await prisma.category.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'カテゴリーが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error('[GET /api/categories/[id]]', error)
    return NextResponse.json(
      { error: 'カテゴリーの取得に失敗しました' },
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

    // 対象カテゴリーの存在確認 & 所有者チェック
    const existing = await prisma.category.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'カテゴリーが見つかりません' },
        { status: 404 }
      )
    }

    if (existing.userId !== userInfo.id) {
      return NextResponse.json(
        { error: 'このカテゴリーを編集する権限がありません' },
        { status: 403 }
      )
    }

    // 同名カテゴリーの重複チェック（自分自身を除く）
    const duplicate = await prisma.category.findFirst({
      where: { userId: userInfo.id, name, NOT: { id } },
    })

    if (duplicate) {
      return NextResponse.json(
        { error: '同じ名前のカテゴリーが既に存在します' },
        { status: 409 }
      )
    }

    // カテゴリー更新
    const category = await prisma.category.update({
      where: { id },
      data: { name },
      include: { user: true },
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error('[PUT /api/categories/[id]]', error)
    return NextResponse.json(
      { error: 'カテゴリーの更新に失敗しました' },
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

    // 対象カテゴリーの存在確認 & 所有者チェック
    const existing = await prisma.category.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'カテゴリーが見つかりません' },
        { status: 404 }
      )
    }

    if (existing.userId !== userInfo.id) {
      return NextResponse.json(
        { error: 'このカテゴリーを削除する権限がありません' },
        { status: 403 }
      )
    }

    // カテゴリー削除（PostCategory は onDelete: Cascade で自動削除）
    await prisma.category.delete({ where: { id } })

    return NextResponse.json({ message: 'カテゴリーを削除しました' })
  } catch (error) {
    console.error('[DELETE /api/categories/[id]]', error)
    return NextResponse.json(
      { error: 'カテゴリーの削除に失敗しました' },
      { status: 500 }
    )
  }
}
