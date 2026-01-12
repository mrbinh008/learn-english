# 🐛 Hướng Dẫn Debug và Kiểm Tra Lỗi

## ✅ Đã Fix Gì

1. ✅ **Fix isConfigured()** - Bỏ yêu cầu API key phải bắt đầu bằng `sk-` (cho phép dùng local API)
2. ✅ **Thêm logging chi tiết** - Mọi bước đều có log để debug
3. ✅ **Log lỗi rõ ràng** - Hiển thị đầy đủ thông tin lỗi

## 🔍 Cách Xem Log

### Bước 1: Mở Terminal và chạy dev server
```bash
pnpm dev
```

### Bước 2: Trong terminal khác, test API
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "vocabulary", "words": ["hello"], "useAI": true}'
```

### Bước 3: Xem log trong terminal đang chạy `pnpm dev`

Bạn sẽ thấy các log như:

```
🔧 Creating AI client from environment variables...
Environment check: {
  AI_PROVIDER: 'openai',
  OPENAI_API_KEY: '✓ Set',
  OPENAI_BASE_URL: 'http://localhost:8080/v1',
  OPENAI_MODEL: 'gpt-3.5-turbo'
}

📥 /api/generate received request: {
  action: 'vocabulary',
  words: 1,
  useAI: true
}

🤖 Initializing AI client...
📋 Available AI providers: ['openai']
🔄 Processing 1 words with AI...

📖 Processing word: "hello"
📤 Sending prompt to AI...
🔧 OpenAI Provider Configuration: {
  hasApiKey: true,
  apiKeyPrefix: 'local-key...',
  baseUrl: 'http://localhost:8080/v1',
  model: 'gpt-3.5-turbo'
}
📤 Sending request to OpenAI API...
```

## 🛠️ Kiểm Tra Cấu Hình

### 1. Kiểm tra file .env
```bash
cat .env | grep -E "AI_PROVIDER|OPENAI"
```

Phải thấy:
```
AI_PROVIDER=openai
OPENAI_API_KEY=local-key
OPENAI_BASE_URL=http://localhost:8080/v1
OPENAI_MODEL=gpt-3.5-turbo
```

### 2. Kiểm tra AI provider có hoạt động không
```bash
# Check status endpoint
curl http://localhost:3000/api/ai-test
```

Kết quả phải là:
```json
{
  "success": true,
  "config": {
    "defaultProvider": "openai",
    "availableProviders": ["openai"],
    "openai": {
      "configured": true,
      "hasCustomUrl": true,
      "customUrl": "http://localhost:8080",
      "model": "gpt-3.5-turbo"
    }
  }
}
```

## 🐛 Các Lỗi Thường Gặp

### Lỗi 1: "Provider openai is not configured"

**Nguyên nhân:** Thiếu OPENAI_API_KEY trong .env

**Cách fix:**
```bash
echo "OPENAI_API_KEY=local-key" >> .env
```

**Log bạn sẽ thấy:**
```
❌ Provider openai is not configured
Config details: {
  hasApiKey: false,  ← Đây là vấn đề
  hasBaseUrl: true,
  baseUrl: 'http://localhost:8080/v1'
}
```

### Lỗi 2: "Connection refused" hoặc "ECONNREFUSED"

**Nguyên nhân:** Local AI chưa chạy hoặc sai port

**Cách kiểm tra:**
```bash
# Kiểm tra local AI có chạy không
curl http://localhost:8080/v1/models

# Hoặc port khác
curl http://localhost:1234/v1/models
```

**Log bạn sẽ thấy:**
```
❌ OpenAI Provider Error: FetchError: request to http://localhost:8080/v1/chat/completions failed
❌ Error Message: connect ECONNREFUSED 127.0.0.1:8080
```

**Cách fix:**
- Khởi động local AI của bạn (LocalAI, LM Studio, etc.)
- Hoặc đổi port trong .env cho đúng

### Lỗi 3: "Invalid JSON response"

**Nguyên nhân:** AI trả về text thay vì JSON

**Log bạn sẽ thấy:**
```
📥 Received AI response: This is the definition of hello...
⚠️ AI parsing failed for hello, using dictionary API
Parse error: SyntaxError: Unexpected token T in JSON at position 0
```

**Cách fix:** Hệ thống tự động fallback sang Dictionary API, bạn vẫn nhận được kết quả

### Lỗi 4: "401 Unauthorized"

**Nguyên nhân:** API key sai

**Log bạn sẽ thấy:**
```
❌ API Error Response: {
  status: 401,
  statusText: 'Unauthorized',
  data: { error: 'Invalid API key' }
}
```

**Cách fix:**
- Với local AI: thử `OPENAI_API_KEY=anything`
- Với cloud OpenAI: kiểm tra API key thật

## 📊 Cấu Trúc Log

### Khi Thành Công:
```
🔧 Creating AI client...
✅ OpenAI Provider isConfigured: true
📥 /api/generate received request
🤖 Initializing AI client...
📋 Available AI providers: ['openai']
📖 Processing word: "hello"
📤 Sending prompt to AI...
🔧 OpenAI Provider Configuration: {...}
📤 Sending request to OpenAI API...
✅ Received response from OpenAI API
📊 Response: { hasContent: true, contentLength: 245 }
✅ Successfully parsed AI response
✅ Added word to results: hello
💾 Saving to database: hello
✅ Saved to database: hello
✅ Vocabulary processed: 1 words
```

### Khi Có Lỗi:
```
🔧 Creating AI client...
❌ Provider openai is not configured
Error details: {
  message: 'Provider openai is not configured',
  stack: '...'
}
```

## 🧪 Test Script Chi Tiết

Tạo file `debug-test.sh`:

```bash
#!/bin/bash

echo "=== 🔍 DEBUGGING TESTS ==="
echo ""

# Test 1: Check environment
echo "1️⃣ Checking .env file..."
cat .env | grep -E "AI_PROVIDER|OPENAI"
echo ""

# Test 2: Check if local AI is running
echo "2️⃣ Checking if local AI is running..."
curl -s http://localhost:8080/v1/models || echo "❌ Local AI not responding"
echo ""

# Test 3: Check Next.js server
echo "3️⃣ Checking Next.js server..."
curl -s http://localhost:3000/api/ai-test | jq '.'
echo ""

# Test 4: Test vocabulary generation
echo "4️⃣ Testing vocabulary generation..."
curl -s -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "vocabulary", "words": ["test"], "useAI": true}' | jq '.'
echo ""

echo "=== ✅ TESTS COMPLETE ==="
echo "Check your terminal running 'pnpm dev' for detailed logs"
```

Chạy:
```bash
chmod +x debug-test.sh
./debug-test.sh
```

## 📝 Checklist Debug

Khi gặp lỗi, kiểm tra theo thứ tự:

- [ ] **1. .env file có đúng không?**
  ```bash
  cat .env | grep OPENAI
  ```

- [ ] **2. Local AI có chạy không?**
  ```bash
  curl http://localhost:8080/v1/models
  ```

- [ ] **3. Next.js dev server có chạy không?**
  ```bash
  curl http://localhost:3000/api/ai-test
  ```

- [ ] **4. Xem log trong terminal chạy `pnpm dev`**

- [ ] **5. API key có được set không?**
  ```bash
  echo $OPENAI_API_KEY  # Nếu dùng export
  # Hoặc kiểm tra trong log
  ```

## 🎯 Ví Dụ Cấu Hình Đầy Đủ

### LocalAI:
```bash
# .env
AI_PROVIDER=openai
OPENAI_API_KEY=not-needed
OPENAI_BASE_URL=http://localhost:8080/v1
OPENAI_MODEL=gpt-3.5-turbo
```

### LM Studio:
```bash
# .env
AI_PROVIDER=openai
OPENAI_API_KEY=lm-studio
OPENAI_BASE_URL=http://localhost:1234/v1
OPENAI_MODEL=local-model
```

### Standard OpenAI:
```bash
# .env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-xxx...
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

## 💡 Tips

1. **Luôn xem log trong terminal chạy `pnpm dev`** - Đây là nơi bạn thấy tất cả log
2. **Dùng `jq` để format JSON** - `curl ... | jq '.'`
3. **Test từng bước** - Kiểm tra local AI trước, rồi mới test endpoint
4. **Nếu AI fail** - Hệ thống tự động dùng Dictionary API

## 🆘 Vẫn Còn Lỗi?

Copy log từ terminal (chạy `pnpm dev`) và gửi cho tôi. Tôi cần thấy:

1. Log khi khởi động server
2. Log khi gọi API
3. Error message đầy đủ

Ví dụ log cần gửi:
```
🔧 Creating AI client from environment variables...
Environment check: {...}
📥 /api/generate received request: {...}
❌ Error: ...
```
