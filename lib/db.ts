import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

// Create SQLite database adapter with URL
// Use absolute path to database file
const dbPath = path.join(process.cwd(), 'dev.db')
console.log('🔧 Database absolute path:', dbPath)
console.log('🔧 DATABASE_URL from env:', process.env.DATABASE_URL)
console.log('🔧 Current working directory:', process.cwd())

// Check if file exists
const fs = require('fs')
console.log('🔧 Database file exists:', fs.existsSync(dbPath))

const adapter = new PrismaBetterSqlite3({ url: dbPath })

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
