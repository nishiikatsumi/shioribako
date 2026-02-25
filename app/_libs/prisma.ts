import { PrismaClient } from '@/app/generated/prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";
import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  allowExitOnIdle: true,
})

const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })