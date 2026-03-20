import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/app/_libs/prisma'
import { getAuthenticatedUser, getOrCreateUserInfo, unauthorizedResponse, validateName } from '@/app/_libs/auth'

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params

    // 認証チェック
    const user = await getAuthenticatedUser(request)
    if (!user) return unauthorizedResponse()

    const category = await getPrisma().category.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'カテゴリーが見つかりません' },
        { status: 404 }
      )
    }

    // 所有者チェック
    const userInfo = await getOrCreateUserInfo(user)

    if (category.userId !== userInfo.id) {
      return NextResponse.json(
        { error: 'このカテゴリーを閲覧する権限がありません' },
        { status: 403 }
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

    // 認証チェック
    const user = await getAuthenticatedUser(request)
    if (!user) return unauthorizedResponse()

    const body = await request.json()
    const { name }: { name: string } = body

    // バリデーション
    const nameError = validateName(name)
    if (nameError) {
      return NextResponse.json({ error: nameError }, { status: 400 })
    }

    // トークンからユーザーを取得（未作成なら自動作成）
    const userInfo = await getOrCreateUserInfo(user)

    // 対象カテゴリーの存在確認 & 所有者チェック
    const existing = await getPrisma().category.findUnique({
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
    const duplicate = await getPrisma().category.findFirst({
      where: { userId: userInfo.id, name, NOT: { id } },
    })

    if (duplicate) {
      return NextResponse.json(
        { error: '同じ名前のカテゴリーが既に存在します' },
        { status: 409 }
      )
    }

    const category = await getPrisma().category.update({
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

    // 認証チェック
    const user = await getAuthenticatedUser(request)
    if (!user) return unauthorizedResponse()

    // トークンからユーザーを取得（未作成なら自動作成）
    const userInfo = await getOrCreateUserInfo(user)

    // 対象カテゴリーの存在確認 & 所有者チェック
    const existing = await getPrisma().category.findUnique({
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

    await getPrisma().category.delete({ where: { id } })

    return NextResponse.json({ message: 'カテゴリーを削除しました' })
  } catch (error) {
    console.error('[DELETE /api/categories/[id]]', error)
    return NextResponse.json(
      { error: 'カテゴリーの削除に失敗しました' },
      { status: 500 }
    )
  }
}
