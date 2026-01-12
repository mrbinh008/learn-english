#!/bin/bash

# Test script for /api/generate with Local AI
# Usage: ./test-generate.sh

echo "🧪 Testing /api/generate with Local AI"
echo "======================================="
echo ""

BASE_URL="http://localhost:3000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Checking AI Configuration${NC}"
echo "GET $BASE_URL/api/ai-test"
echo ""
curl -s $BASE_URL/api/ai-test | jq '.'
echo ""
echo ""

echo -e "${YELLOW}2. Testing Vocabulary Generation with AI${NC}"
echo "POST $BASE_URL/api/generate"
echo '{"action": "vocabulary", "words": ["hello"], "useAI": true}'
echo ""
curl -s -X POST $BASE_URL/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "vocabulary", "words": ["hello"], "useAI": true}' | jq '.'
echo ""
echo ""

echo -e "${YELLOW}3. Testing Multiple Words with AI${NC}"
echo "POST $BASE_URL/api/generate"
echo '{"action": "vocabulary", "words": ["serendipity", "ephemeral"], "useAI": true}'
echo ""
curl -s -X POST $BASE_URL/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "vocabulary", "words": ["serendipity", "ephemeral"], "useAI": true}' | jq '.'
echo ""
echo ""

echo -e "${YELLOW}4. Testing Vocabulary without AI (Dictionary API)${NC}"
echo "POST $BASE_URL/api/generate"
echo '{"action": "vocabulary", "words": ["example"], "useAI": false}'
echo ""
curl -s -X POST $BASE_URL/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "vocabulary", "words": ["example"], "useAI": false}' | jq '.'
echo ""
echo ""

echo -e "${YELLOW}5. Testing Flashcard Generation with AI${NC}"
echo "POST $BASE_URL/api/generate"
echo '{"action": "flashcards", "topic": "technology", "useAI": true}'
echo ""
curl -s -X POST $BASE_URL/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "flashcards", "topic": "technology", "useAI": true}' | jq '.'
echo ""
echo ""

echo -e "${GREEN}✅ All tests completed!${NC}"
echo ""
echo "Note: If you see errors, make sure:"
echo "1. Your Next.js server is running (pnpm dev)"
echo "2. Your local AI is running (if using AI)"
echo "3. Your .env file is configured correctly"
