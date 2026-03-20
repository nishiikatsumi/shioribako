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

    const tag = await getPrisma().tag.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!tag) {
      return NextResponse.json(
        { error: 'タグが見つかりません' },
        { status: 404 }
      )
    }

    // 所有者チェック
    const userInfo = await getOrCreateUserInfo(user)

    if (tag.userId !== userInfo.id) {
      return NextResponse.json(
        { error: 'このタグを閲覧する権限がありません' },
        { status: 403 }
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

    // 対象タグの存在確認 & 所有者チェック
    const existing = await getPrisma().tag.findUnique({
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
    const duplicate = await getPrisma().tag.findFirst({
      where: { userId: userInfo.id, name, NOT: { id } },
    })

    if (duplicate) {
      return NextResponse.json(
        { error: '同じ名前のタグが既に存在します' },
        { status: 409 }
      )
    }

    const tag = await getPrisma().tag.update({
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

    // 認証チェック
    const user = await getAuthenticatedUser(request)
    if (!user) return unauthorizedResponse()

    // トークンからユーザーを取得（未作成なら自動作成）
    const userInfo = await getOrCreateUserInfo(user)

    // 対象タグの存在確認 & 所有者チェック
    const existing = await getPrisma().tag.findUnique({
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

    await getPrisma().tag.delete({ where: { id } })

    return NextResponse.json({ message: 'タグを削除しました' })
  } catch (error) {
    console.error('[DELETE /api/tags/[id]]', error)
    return NextResponse.json(
      { error: 'タグの削除に失敗しました' },
      { status: 500 }
    )
  }
}
