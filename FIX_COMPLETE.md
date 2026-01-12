# ✅ ĐÃ FIX - Hướng Dẫn Sử Dụng

## 🎉 Đã Fix Những Gì

### 1. ✅ Fix lỗi "Provider not configured"
- Bỏ yêu cầu API key phải bắt đầu bằng `sk-`
- Cho phép dùng bất kỳ API key nào (phù hợp với local AI)

### 2. ✅ Thêm logging chi tiết
- Log mọi bước: khởi tạo, cấu hình, request, response
- Log đầy đủ thông tin lỗi với stack trace
- Log emoji để dễ đọc: 🔧 📤 ✅ ❌

### 3. ✅ Cải thiện error handling
- Hiển thị rõ lỗi là gì
- Tự động fallback sang Dictionary API khi lỗi
- Trả về thông tin lỗi chi tiết trong response

## 🚀 Cách Sử Dụng

### Bước 1: Cấu hình `.env`

Tạo/sửa file `.env`:

```bash
# Provider - phải là "openai" để dùng local AI
AI_PROVIDER=openai

# API Key - điền bất kỳ giá trị nào (local AI không cần key thật)
OPENAI_API_KEY=local-key

# URL của local AI
OPENAI_BASE_URL=http://localhost:8080/v1

# Model name
OPENAI_MODEL=gpt-3.5-turbo
```

### Bước 2: Khởi động server

```bash
pnpm dev
```

### Bước 3: Kiểm tra cấu hình

Chạy script debug:
```bash
./debug-test.sh
```

Hoặc kiểm tra thủ công:
```bash
curl http://localhost:3000/api/ai-test
```

### Bước 4: Test API

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "vocabulary", "words": ["hello"], "useAI": true}'
```

## 📊 Cách Xem Log

Khi bạn gọi API, xem log trong terminal đang chạy `pnpm dev`:

```
🔧 Creating AI client from environment variables...
Environment check: {
  AI_PROVIDER: 'openai',
  OPENAI_API_KEY: '✓ Set',
  OPENAI_BASE_URL: 'http://localhost:8080/v1',
  OPENAI_MODEL: 'gpt-3.5-turbo'
}

🔍 OpenAI Provider isConfigured: {
  hasApiKey: true,
  apiKey: 'local-key...',
  baseUrl: 'http://localhost:8080/v1',
  isConfigured: true
}

📥 /api/generate received request: {
  action: 'vocabulary',
  words: 1,
  useAI: true
}

🤖 Initializing AI client...
📋 Available AI providers: [ 'openai' ]
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
📝 Messages: [...]

✅ Received response from OpenAI API
📊 Response: {
  hasContent: true,
  contentLength: 245,
  usage: { prompt_tokens: 89, completion_tokens: 156, total_tokens: 245 }
}

✅ Successfully parsed AI response
✅ Added word to results: hello
💾 Saving to database: hello
✅ Saved to database: hello
⏱️ Rate limiting (500ms)...
✅ Completed processing 1 words
✅ Vocabulary processed: 1 words
```

## 🐛 Khi Có Lỗi

Nếu có lỗi, bạn sẽ thấy log như:

```
❌ OpenAI Provider Error: FetchError: request failed
❌ Error Message: connect ECONNREFUSED 127.0.0.1:8080
❌ Error Stack: FetchError: request to http://localhost:8080/v1/chat/completions failed
    at ClientRequest.<anonymous>
    ...
```

Hoặc:

```
❌ Provider openai is not configured
Config details: {
  hasApiKey: false,  ← Thiếu API key
  hasBaseUrl: true,
  baseUrl: 'http://localhost:8080/v1'
}
```

## 🛠️ Debug Tools

### 1. Script debug tự động
```bash
./debug-test.sh
```

Sẽ kiểm tra:
- ✅ File .env có tồn tại không
- ✅ Local AI có chạy không
- ✅ Next.js server có chạy không
- ✅ Dictionary API có hoạt động không
- ✅ AI API có hoạt động không

### 2. Check configuration
```bash
curl http://localhost:3000/api/ai-test | jq '.'
```

### 3. Test từng bước

**Test Dictionary API (không cần AI):**
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "vocabulary", "words": ["test"], "useAI": false}'
```

**Test AI API:**
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"action": "vocabulary", "words": ["hello"], "useAI": true}'
```

## 📝 Các Log Quan Trọng

### ✅ Khi thành công:
- `🔧 Creating AI client...` - Đang khởi tạo
- `✅ Provider configured` - Cấu hình OK
- `📤 Sending request to OpenAI API...` - Đang gửi request
- `✅ Received response` - Nhận được response
- `✅ Successfully parsed` - Parse JSON OK
- `✅ Saved to database` - Lưu DB thành công

### ❌ Khi có lỗi:
- `❌ Provider not configured` - Thiếu config
- `❌ OpenAI Provider Error` - Lỗi khi gọi API
- `❌ Error Message:` - Chi tiết lỗi
- `⚠️ AI parsing failed` - Parse JSON lỗi (tự động fallback)

## 🎯 Ví Dụ Cấu Hình

### LocalAI (Port 8080):
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=not-needed
OPENAI_BASE_URL=http://localhost:8080/v1
OPENAI_MODEL=gpt-3.5-turbo
```

### LM Studio (Port 1234):
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=lm-studio
OPENAI_BASE_URL=http://localhost:1234/v1
OPENAI_MODEL=local-model
```

### Cloud OpenAI:
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-xxxxx...
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

## 📚 Tài Liệu

| File | Mô tả |
|------|-------|
| `DEBUG_GUIDE.md` | Hướng dẫn debug chi tiết |
| `QUICKSTART.md` | Setup nhanh 3 bước |
| `LOCAL_AI_USAGE.md` | Hướng dẫn sử dụng đầy đủ |
| `debug-test.sh` | Script test tự động |
| `test-generate.sh` | Script test đầy đủ |

## ✅ Checklist

Trước khi chạy, đảm bảo:

- [ ] File `.env` đã được tạo và cấu hình
- [ ] Local AI đang chạy (nếu dùng local)
- [ ] Port trong `.env` khớp với Local AI
- [ ] Next.js dev server đang chạy (`pnpm dev`)

## 🆘 Vẫn Lỗi?

1. Chạy `./debug-test.sh` để xem lỗi ở đâu
2. Xem log trong terminal chạy `pnpm dev`
3. Copy log và gửi cho tôi

Log cần gửi:
```
🔧 Creating AI client from environment variables...
Environment check: {...}
❌ Error: ...
```

## 🎉 Hoàn Tất!

Nếu tất cả OK, bạn sẽ thấy:

```bash
./debug-test.sh

# Output:
✅ File .env
✅ Local AI
✅ Next.js server
✅ Dictionary API
✅ AI API

Kết quả: 5/5 tests passed
🎉 TẤT CẢ ĐỀU HOẠT ĐỘNG!
```

Giờ bạn có thể dùng `/api/generate` với local AI! 🚀
