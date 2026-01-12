#!/bin/bash

echo "🐛 === DEBUG TEST SCRIPT ==="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Kiểm tra cấu hình...${NC}"
echo ""

# Check 1: .env file
echo -e "${YELLOW}1️⃣ Kiểm tra file .env${NC}"
if [ -f .env ]; then
    echo -e "${GREEN}✅ File .env tồn tại${NC}"
    echo "Nội dung:"
    cat .env | grep -E "AI_PROVIDER|OPENAI" || echo "⚠️ Không tìm thấy config OPENAI"
else
    echo -e "${RED}❌ File .env không tồn tại!${NC}"
    echo "Tạo file .env từ .env.example:"
    echo "cp .env.example .env"
fi
echo ""

# Check 2: Local AI
echo -e "${YELLOW}2️⃣ Kiểm tra Local AI${NC}"
BASE_URL=$(grep OPENAI_BASE_URL .env 2>/dev/null | cut -d'=' -f2 | tr -d '"' | tr -d "'")
if [ -z "$BASE_URL" ]; then
    BASE_URL="http://localhost:8080"
fi
echo "Testing: $BASE_URL/v1/models"

if curl -s -f "$BASE_URL/v1/models" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Local AI đang chạy${NC}"
    curl -s "$BASE_URL/v1/models" | head -20
else
    echo -e "${RED}❌ Local AI không phản hồi!${NC}"
    echo ""
    echo "Kiểm tra:"
    echo "  - Local AI đã chạy chưa?"
    echo "  - Port có đúng không? (hiện tại: $BASE_URL)"
    echo ""
    echo "Thử các port phổ biến:"
    echo "  LocalAI: http://localhost:8080/v1"
    echo "  LM Studio: http://localhost:1234/v1"
    echo "  Ollama+LiteLLM: http://localhost:4000"
fi
echo ""

# Check 3: Next.js server
echo -e "${YELLOW}3️⃣ Kiểm tra Next.js server${NC}"
if curl -s -f http://localhost:3000/api/ai-test > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Next.js server đang chạy${NC}"
    echo "Response:"
    curl -s http://localhost:3000/api/ai-test | jq '.' 2>/dev/null || curl -s http://localhost:3000/api/ai-test
else
    echo -e "${RED}❌ Next.js server không phản hồi!${NC}"
    echo "Chạy server bằng: pnpm dev"
fi
echo ""

# Check 4: Test với Dictionary API (không cần AI)
echo -e "${YELLOW}4️⃣ Test với Dictionary API (không dùng AI)${NC}"
echo "POST /api/generate với useAI=false"
DICT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "vocabulary", "words": ["test"], "useAI": false}')

if echo "$DICT_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Dictionary API hoạt động${NC}"
    echo "$DICT_RESPONSE" | jq '.' 2>/dev/null || echo "$DICT_RESPONSE"
else
    echo -e "${RED}❌ Dictionary API lỗi${NC}"
    echo "$DICT_RESPONSE"
fi
echo ""

# Check 5: Test với AI
echo -e "${YELLOW}5️⃣ Test với AI (useAI=true)${NC}"
echo "POST /api/generate với useAI=true"
echo -e "${BLUE}⏳ Đang gọi API...${NC}"
AI_RESPONSE=$(curl -s -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "vocabulary", "words": ["hello"], "useAI": true}')

if echo "$AI_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    echo -e "${GREEN}✅ AI API hoạt động${NC}"
    echo "$AI_RESPONSE" | jq '.' 2>/dev/null || echo "$AI_RESPONSE"
else
    echo -e "${RED}❌ AI API lỗi${NC}"
    echo "Response:"
    echo "$AI_RESPONSE" | jq '.' 2>/dev/null || echo "$AI_RESPONSE"
    echo ""
    echo -e "${YELLOW}📝 Kiểm tra log trong terminal đang chạy 'pnpm dev'${NC}"
fi
echo ""

# Summary
echo "================================================"
echo -e "${BLUE}📊 TÓM TẮT${NC}"
echo "================================================"

# Count checks
CHECKS=0
PASSED=0

# .env exists
CHECKS=$((CHECKS + 1))
if [ -f .env ]; then
    PASSED=$((PASSED + 1))
    echo -e "${GREEN}✅${NC} File .env"
else
    echo -e "${RED}❌${NC} File .env"
fi

# Local AI running
CHECKS=$((CHECKS + 1))
if curl -s -f "$BASE_URL/v1/models" > /dev/null 2>&1; then
    PASSED=$((PASSED + 1))
    echo -e "${GREEN}✅${NC} Local AI"
else
    echo -e "${RED}❌${NC} Local AI"
fi

# Next.js running
CHECKS=$((CHECKS + 1))
if curl -s -f http://localhost:3000/api/ai-test > /dev/null 2>&1; then
    PASSED=$((PASSED + 1))
    echo -e "${GREEN}✅${NC} Next.js server"
else
    echo -e "${RED}❌${NC} Next.js server"
fi

# Dictionary API works
CHECKS=$((CHECKS + 1))
if echo "$DICT_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    PASSED=$((PASSED + 1))
    echo -e "${GREEN}✅${NC} Dictionary API"
else
    echo -e "${RED}❌${NC} Dictionary API"
fi

# AI API works
CHECKS=$((CHECKS + 1))
if echo "$AI_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
    PASSED=$((PASSED + 1))
    echo -e "${GREEN}✅${NC} AI API"
else
    echo -e "${RED}❌${NC} AI API"
fi

echo ""
echo "Kết quả: $PASSED/$CHECKS tests passed"
echo ""

if [ $PASSED -eq $CHECKS ]; then
    echo -e "${GREEN}🎉 TẤT CẢ ĐỀU HOẠT ĐỘNG!${NC}"
else
    echo -e "${YELLOW}⚠️ Một số test bị lỗi. Kiểm tra:${NC}"
    echo ""
    echo "1. Xem log chi tiết trong terminal chạy 'pnpm dev'"
    echo "2. Đọc DEBUG_GUIDE.md để biết cách fix"
    echo "3. Đảm bảo:"
    echo "   - File .env đã được cấu hình"
    echo "   - Local AI đang chạy (nếu dùng AI)"
    echo "   - Next.js dev server đang chạy"
fi

echo ""
echo "================================================"
echo -e "${BLUE}📚 TÀI LIỆU${NC}"
echo "================================================"
echo "- DEBUG_GUIDE.md - Hướng dẫn debug chi tiết"
echo "- QUICKSTART.md - Hướng dẫn setup nhanh"
echo "- LOCAL_AI_USAGE.md - Hướng dẫn sử dụng"
echo ""
echo -e "${YELLOW}💡 Tip: Luôn xem log trong terminal chạy 'pnpm dev'${NC}"
