import { supabase } from '@/app/_libs/supabase'

/**
 * 認証トークン付きの fetch ラッパー。
 * Supabase セッションから access_token を取得し Authorization ヘッダーに付与する。
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession()
  const headers = new Headers(options.headers)

  if (session?.access_token) {
    headers.set('Authorization', `Bearer ${session.access_token}`)
  }

  return fetch(url, { ...options, headers })
}
