#!/bin/bash

echo "🧪 === QUICK FIX TEST ==="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}1️⃣ Kiểm tra .env${NC}"
echo "AI_PROVIDER:"
grep "^AI_PROVIDER" .env || echo -e "${RED}❌ Chưa có AI_PROVIDER${NC}"
echo "OPENAI_API_KEY:"
grep "^OPENAI_API_KEY" .env | cut -d'=' -f1 || echo -e "${RED}❌ Chưa có OPENAI_API_KEY${NC}"
echo "OPENAI_BASE_URL:"
grep "^OPENAI_BASE_URL" .env | cut -d'=' -f2 || echo -e "${RED}❌ Chưa có OPENAI_BASE_URL${NC}"
echo ""

echo -e "${YELLOW}2️⃣ Kiểm tra database${NC}"
if [ -f "dev.db" ]; then
    echo -e "${GREEN}✅ dev.db tồn tại${NC}"
    # Check if Word table exists
    if sqlite3 dev.db "SELECT name FROM sqlite_master WHERE type='table' AND name='Word';" | grep -q "Word"; then
        echo -e "${GREEN}✅ Bảng Word đã có${NC}"
    else
        echo -e "${RED}❌ Bảng Word chưa có${NC}"
    fi
else
    echo -e "${RED}❌ dev.db không tồn tại${NC}"
fi
echo ""

echo -e "${YELLOW}3️⃣ Test API với dictionary (useAI=false)${NC}"
curl -s -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "vocabulary", "words": ["test"], "useAI": false}' | jq '.' 2>/dev/null || echo "Error"
echo ""

echo -e "${YELLOW}4️⃣ Test API với AI (useAI=true)${NC}"
curl -s -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "vocabulary", "words": ["hello"], "useAI": true}' | jq '.' 2>/dev/null || echo "Error"
echo ""

echo -e "${GREEN}✅ Tests complete!${NC}"
echo ""
echo "💡 Tip: Xem log chi tiết trong terminal chạy 'pnpm dev'"
