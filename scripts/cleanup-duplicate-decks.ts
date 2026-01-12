import prisma from '../lib/db'

async function cleanupDuplicateDecks() {
    try {
        console.log('🔍 Finding duplicate decks...')

        // Get all decks
        const allDecks = await prisma.deck.findMany({
            orderBy: { createdAt: 'asc' } // Keep older decks
        })

        // Group decks by name
        const decksByName = new Map<string, typeof allDecks>()
        for (const deck of allDecks) {
            if (!decksByName.has(deck.name)) {
                decksByName.set(deck.name, [])
            }
            decksByName.get(deck.name)!.push(deck)
        }

        // Find duplicates
        let duplicatesFound = 0
        let duplicatesDeleted = 0

        for (const [name, decks] of decksByName.entries()) {
            if (decks.length > 1) {
                console.log(`\n⚠️ Found ${decks.length} decks with name "${name}":`)
                
                // Keep the first (oldest) deck
                const keepDeck = decks[0]
                console.log(`  ✅ Keeping: ${keepDeck.name} (ID: ${keepDeck.id}, Created: ${keepDeck.createdAt})`)
                
                // Delete the rest
                for (let i = 1; i < decks.length; i++) {
                    const deleteDeck = decks[i]
                    console.log(`  🗑️ Deleting: ${deleteDeck.name} (ID: ${deleteDeck.id}, Created: ${deleteDeck.createdAt})`)
                    
                    // Delete flashcards first (if not using cascade)
                    const deletedCards = await prisma.flashcard.deleteMany({
                        where: { deckId: deleteDeck.id }
                    })
                    console.log(`     - Deleted ${deletedCards.count} flashcards`)
                    
                    // Delete the deck
                    await prisma.deck.delete({
                        where: { id: deleteDeck.id }
                    })
                    
                    duplicatesDeleted++
                }
                
                duplicatesFound += decks.length - 1
            }
        }

        if (duplicatesFound === 0) {
            console.log('\n✅ No duplicate decks found!')
        } else {
            console.log(`\n✅ Cleanup complete!`)
            console.log(`   - Found ${duplicatesFound} duplicate deck(s)`)
            console.log(`   - Deleted ${duplicatesDeleted} duplicate deck(s)`)
        }

        // Show remaining decks
        const remainingDecks = await prisma.deck.findMany({
            include: {
                flashcards: true
            }
        })
        
        console.log(`\n📊 Remaining decks (${remainingDecks.length}):`)
        for (const deck of remainingDecks) {
            console.log(`   - ${deck.name} (${deck.flashcards.length} cards)`)
        }

    } catch (error) {
        console.error('❌ Error during cleanup:', error)
    } finally {
        await prisma.$disconnect()
    }
}

cleanupDuplicateDecks()
