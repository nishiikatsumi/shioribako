import { NextRequest, NextResponse } from 'next/server'
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
export async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.slice(7)
  const { data: { user }, error } = await getSupabaseAdmin().auth.getUser(token)
  if (error || !user) return null
  return user
}

// 認証必須のエンドポイントで使う。認証失敗時は 401 レスポンスを返す
export function unauthorizedResponse() {
  return NextResponse.json(
    { error: '認証が必要です' },
    { status: 401 }
  )
}

// URL バリデーション: http/https スキームのみ許可
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

// 文字列の長さ制限
const MAX_NAME_LENGTH = 100
const MAX_COMMENT_LENGTH = 10000
const MAX_URL_LENGTH = 2048

export function validateName(name: string): string | null {
  if (!name || name.trim().length === 0) return '名前は必須です'
  if (name.length > MAX_NAME_LENGTH) return `名前は${MAX_NAME_LENGTH}文字以内にしてください`
  return null
}

export function validateComment(comment: string | undefined): string | null {
  if (comment && comment.length > MAX_COMMENT_LENGTH) {
    return `コメントは${MAX_COMMENT_LENGTH}文字以内にしてください`
  }
  return null
}

export function validateBookmarkUrl(url: string): string | null {
  if (!url) return 'URL は必須です'
  if (url.length > MAX_URL_LENGTH) return `URL は${MAX_URL_LENGTH}文字以内にしてください`
  if (!isValidUrl(url)) return '有効な URL（http / https）を指定してください'
  return null
}
