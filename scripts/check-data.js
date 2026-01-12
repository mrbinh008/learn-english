const { PrismaClient } = require('@prisma/client')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
const path = require('path')

const dbPath = path.join(process.cwd(), 'dev.db')
const adapter = new PrismaBetterSqlite3({ url: dbPath })
const prisma = new PrismaClient({ adapter })

async function checkData() {
    try {
        const passagesCount = await prisma.readingPassage.count()
        console.log(`📊 Reading passages in database: ${passagesCount}`)
        
        const passages = await prisma.readingPassage.findMany({
            select: {
                id: true,
                title: true,
                level: true,
                category: true
            }
        })
        
        if (passages.length > 0) {
            console.log('\n📚 Passages:')
            passages.forEach((p, i) => {
                console.log(`  ${i + 1}. ${p.title} (${p.level}, ${p.category})`)
            })
        } else {
            console.log('\n⚠️  No reading passages found. You need to create some first.')
            console.log('   Go to /create and use the "Reading Passage" tab to generate content.')
        }
        
        // Also check vocabulary count
        const wordsCount = await prisma.word.count()
        console.log(`\n📖 Words in database: ${wordsCount}`)
        
    } catch (error) {
        console.error('Error:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkData()
