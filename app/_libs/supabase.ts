import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// ブラウザ環境でのみ createClient() を呼ぶ。
// next build 時にサーバーサイドでこのファイルが評価される際、createClient() を
// 実行しないことで GoTrueClient や RealtimeClient の内部初期化によるネットワーク接続・
// タイマーの生成を防ぎ、Node.js プロセスが終了できない問題を解消する。
export const supabase = (
  typeof window !== 'undefined'
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null
) as SupabaseClient
