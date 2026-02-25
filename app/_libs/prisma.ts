import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";
import pg from 'pg'

// next build 時にモジュール評価で pg.Pool を作成しないよう遅延初期化する。
// pg.Pool はインスタンス化時に即座に Socket ハンドルを生成するため、
// ビルド時に評価されると Node.js プロセスが終了できなくなる（supabase.ts と同様の問題）。
let _prisma: PrismaClient | null = null

export function getPrisma(): PrismaClient {
  if (!_prisma) {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      allowExitOnIdle: true,
    })
    const adapter = new PrismaPg(pool)
    _prisma = new PrismaClient({ adapter })
  }
  return _prisma
}