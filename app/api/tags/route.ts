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

    // ユーザー自身のタグを取得
    const tags = await prisma.tag.findMany({
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
