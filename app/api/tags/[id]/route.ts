import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/_libs/prisma'

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!tag) {
      return NextResponse.json(
        { error: 'タグが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({ tag })
  } catch (error) {
    console.error('[GET /api/tags/[id]]', error)
    return NextResponse.json(
      { error: 'タグの取得に失敗しました' },
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

    // 対象タグの存在確認 & 所有者チェック
    const existing = await prisma.tag.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'タグが見つかりません' },
        { status: 404 }
      )
    }

    if (existing.userId !== userInfo.id) {
      return NextResponse.json(
        { error: 'このタグを編集する権限がありません' },
        { status: 403 }
      )
    }

    // 同名タグの重複チェック（自分自身を除く）
    const duplicate = await prisma.tag.findFirst({
      where: { userId: userInfo.id, name, NOT: { id } },
    })

    if (duplicate) {
      return NextResponse.json(
        { error: '同じ名前のタグが既に存在します' },
        { status: 409 }
      )
    }

    // タグ更新
    const tag = await prisma.tag.update({
      where: { id },
      data: { name },
      include: { user: true },
    })

    return NextResponse.json({ tag })
  } catch (error) {
    console.error('[PUT /api/tags/[id]]', error)
    return NextResponse.json(
      { error: 'タグの更新に失敗しました' },
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

    // 対象タグの存在確認 & 所有者チェック
    const existing = await prisma.tag.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'タグが見つかりません' },
        { status: 404 }
      )
    }

    if (existing.userId !== userInfo.id) {
      return NextResponse.json(
        { error: 'このタグを削除する権限がありません' },
        { status: 403 }
      )
    }

    // タグ削除（PostTag は onDelete: Cascade で自動削除）
    await prisma.tag.delete({ where: { id } })

    return NextResponse.json({ message: 'タグを削除しました' })
  } catch (error) {
    console.error('[DELETE /api/tags/[id]]', error)
    return NextResponse.json(
      { error: 'タグの削除に失敗しました' },
      { status: 500 }
    )
  }
}
