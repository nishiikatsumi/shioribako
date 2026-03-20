import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/app/_libs/prisma'
import { getAuthenticatedUser, getOrCreateUserInfo, unauthorizedResponse, validateName } from '@/app/_libs/auth'

export const GET = async (request: NextRequest) => {
  try {
    // 認証チェック
    const user = await getAuthenticatedUser(request)
    if (!user) return unauthorizedResponse()

    // トークンからユーザーを取得（未作成なら自動作成）
    const userInfo = await getOrCreateUserInfo(user)

    const categories = await getPrisma().category.findMany({
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

    // 同名カテゴリーの重複チェック
    const existing = await getPrisma().category.findFirst({
      where: { userId: userInfo.id, name },
    })

    if (existing) {
      return NextResponse.json(
        { error: '同じ名前のカテゴリーが既に存在します' },
        { status: 409 }
      )
    }

    const category = await getPrisma().category.create({
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
