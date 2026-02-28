import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/app/_libs/prisma'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase 環境変数が設定されていません')
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// Authorization ヘッダーからトークンを検証し、認証済みユーザーを返す
async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.slice(7)
  const { data: { user }, error } = await getSupabaseAdmin().auth.getUser(token)
  if (error || !user) return null
  return user
}

export const POST = async (request: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const { userName }: { userName: string } = await request.json()

    if (!userName) {
      return NextResponse.json(
        { error: 'userName は必須です' },
        { status: 400 }
      )
    }

    const supabaseId = user.id

    // 既に存在する場合はそのまま返す（二重登録防止）
    const existing = await getPrisma().userInformation.findUnique({
      where: { supabaseId },
    })

    if (existing) {
      return NextResponse.json({ user: existing })
    }

    const created = await getPrisma().userInformation.create({
      data: {
        supabaseId,
        userName,
      },
    })

    return NextResponse.json({ user: created }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/users]', error)
    return NextResponse.json(
      { error: 'ユーザーの作成に失敗しました' },
      { status: 500 }
    )
  }
}

export const DELETE = async (request: NextRequest) => {
  try {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    // 認証済みユーザー自身の ID を使用（リクエストボディを信頼しない）
    const supabaseId = user.id

    // Supabase Auth からアカウントを先に削除（失敗時は DB を残して整合性を保つ）
    const { error: adminError } = await getSupabaseAdmin().auth.admin.deleteUser(supabaseId)
    if (adminError) {
      console.error('[DELETE /api/users] Supabase user deletion failed:', adminError)
      return NextResponse.json(
        { error: 'アカウント削除に失敗しました' },
        { status: 500 }
      )
    }

    // DB から UserInformation を削除（Cascade で Bookmark / Category / Tag も全削除）
    await getPrisma().userInformation.delete({
      where: { supabaseId },
    })

    return NextResponse.json({ message: '退会処理が完了しました' })
  } catch (error) {
    console.error('[DELETE /api/users]', error)
    return NextResponse.json(
      { error: '退会処理に失敗しました' },
      { status: 500 }
    )
  }
}
