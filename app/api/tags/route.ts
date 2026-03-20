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

    const tags = await getPrisma().tag.findMany({
      where: { userId: userInfo.id },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ tags })
  } catch (error) {
    console.error('[GET /api/tags]', error)
    return NextResponse.json(
      { error: 'タグの取得に失敗しました' },
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

    // 同名タグの重複チェック
    const existing = await getPrisma().tag.findFirst({
      where: { userId: userInfo.id, name },
    })

    if (existing) {
      return NextResponse.json(
        { error: '同じ名前のタグが既に存在します' },
        { status: 409 }
      )
    }

    const tag = await getPrisma().tag.create({
      data: {
        name,
        userId: userInfo.id,
      },
    })

    return NextResponse.json({ tag }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/tags]', error)
    return NextResponse.json(
      { error: 'タグの作成に失敗しました' },
      { status: 500 }
    )
  }
}
