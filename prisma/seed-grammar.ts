import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

// Create SQLite database adapter with URL
const dbPath = path.join(process.cwd(), 'dev.db')
const adapter = new PrismaBetterSqlite3({ url: dbPath })

const prisma = new PrismaClient({ adapter })

const grammarData = [
  {
    name: 'Tenses',
    nameVi: 'Các thì',
    description: 'Học các thì trong tiếng Anh từ cơ bản đến nâng cao',
    icon: '⏰',
    order: 1,
    lessons: [
      {
        title: 'Present Simple',
        titleVi: 'Thì hiện tại đơn',
        order: 1,
        content: `# Thì Hiện Tại Đơn (Present Simple)

## 1. Cấu trúc

### Câu khẳng định
- **I/You/We/They** + động từ nguyên mẫu
- **He/She/It** + động từ + s/es

### Câu phủ định
- **I/You/We/They** + don't + động từ nguyên mẫu
- **He/She/It** + doesn't + động từ nguyên mẫu

### Câu nghi vấn
- **Do** + I/you/we/they + động từ nguyên mẫu?
- **Does** + he/she/it + động từ nguyên mẫu?

## 2. Cách dùng

### a) Diễn tả sự thật, chân lý hiển nhiên
- The sun rises in the east. (Mặt trời mọc ở phía đông)
- Water boils at 100°C. (Nước sôi ở 100°C)

### b) Diễn tả thói quen, hành động thường xuyên
- I wake up at 7am every day. (Tôi thức dậy lúc 7 giờ sáng mỗi ngày)
- She drinks coffee in the morning. (Cô ấy uống cà phê vào buổi sáng)

### c) Diễn tả lịch trình, thời gian biểu
- The train leaves at 9pm. (Tàu khởi hành lúc 9 giờ tối)
- The meeting starts at 2pm. (Cuộc họp bắt đầu lúc 2 giờ chiều)

## 3. Dấu hiệu nhận biết

- **always** (luôn luôn)
- **usually** (thường xuyên)
- **often** (thường)
- **sometimes** (thỉnh thoảng)
- **rarely/seldom** (hiếm khi)
- **never** (không bao giờ)
- **every day/week/month/year** (mỗi ngày/tuần/tháng/năm)

## 4. Lưu ý khi thêm s/es

- Thêm **es** với động từ kết thúc bằng: -s, -ss, -sh, -ch, -x, -o, -z
  - go → goes, watch → watches, kiss → kisses
  
- Động từ kết thúc bằng **phụ âm + y**: đổi y → ies
  - study → studies, fly → flies
  
- Động từ kết thúc bằng **nguyên âm + y**: thêm s
  - play → plays, buy → buys`,
        examples: JSON.stringify([
          { en: 'I play soccer every weekend.', vi: 'Tôi chơi bóng đá mỗi cuối tuần.' },
          { en: 'She works at a bank.', vi: 'Cô ấy làm việc ở ngân hàng.' },
          { en: 'They don\'t like spicy food.', vi: 'Họ không thích đồ ăn cay.' },
          { en: 'Does he speak English?', vi: 'Anh ấy có nói tiếng Anh không?' },
          { en: 'The Earth revolves around the Sun.', vi: 'Trái Đất quay quanh Mặt Trời.' }
        ]),
        exercises: [
          {
            type: 'multiple-choice',
            question: 'She ___ to school every day.',
            questionVi: 'Cô ấy ___ đến trường mỗi ngày.',
            options: JSON.stringify(['go', 'goes', 'going', 'gone']),
            answer: 'goes',
            explanation: 'Với chủ ngữ "She" (ngôi thứ 3 số ít), động từ phải thêm "s".'
          },
          {
            type: 'multiple-choice',
            question: 'They ___ play tennis on Sundays.',
            questionVi: 'Họ ___ chơi tennis vào Chủ nhật.',
            options: JSON.stringify(['doesn\'t', 'don\'t', 'isn\'t', 'aren\'t']),
            answer: 'don\'t',
            explanation: 'Với chủ ngữ "They", dùng "don\'t" cho câu phủ định.'
          },
          {
            type: 'multiple-choice',
            question: '___ you like coffee?',
            questionVi: 'Bạn có thích cà phê không?',
            options: JSON.stringify(['Do', 'Does', 'Are', 'Is']),
            answer: 'Do',
            explanation: 'Với chủ ngữ "you", dùng "Do" cho câu nghi vấn.'
          },
          {
            type: 'fill-in',
            question: 'Water ___ (freeze) at 0°C.',
            questionVi: 'Nước ___ (đóng băng) ở 0°C.',
            answer: 'freezes',
            explanation: 'Sự thật hiển nhiên, chủ ngữ "Water" (số ít) → thêm "s".'
          },
          {
            type: 'fill-in',
            question: 'My brother ___ (study) English every evening.',
            questionVi: 'Anh trai tôi ___ (học) tiếng Anh mỗi tối.',
            answer: 'studies',
            explanation: 'Động từ kết thúc bằng phụ âm + y → đổi y thành ies.'
          }
        ]
      },
      {
        title: 'Present Continuous',
        titleVi: 'Thì hiện tại tiếp diễn',
        order: 2,
        content: `# Thì Hiện Tại Tiếp Diễn (Present Continuous)

## 1. Cấu trúc

### Câu khẳng định
**S + am/is/are + V-ing**
- I am studying
- He/She/It is studying
- You/We/They are studying

### Câu phủ định
**S + am/is/are + not + V-ing**
- I am not studying
- He isn't studying
- They aren't studying

### Câu nghi vấn
**Am/Is/Are + S + V-ing?**
- Are you studying?
- Is she studying?

## 2. Cách dùng

### a) Hành động đang xảy ra tại thời điểm nói
- I am reading a book now. (Tôi đang đọc sách bây giờ)
- She is cooking dinner at the moment. (Cô ấy đang nấu bữa tối lúc này)

### b) Hành động xảy ra xung quanh thời điểm nói
- He is learning Japanese this month. (Anh ấy đang học tiếng Nhật tháng này)

### c) Diễn tả kế hoạch, sự sắp xếp trong tương lai gần
- I am meeting him tomorrow. (Tôi sẽ gặp anh ấy vào ngày mai)
- We are flying to Paris next week. (Chúng tôi sẽ bay đến Paris tuần sau)

### d) Phàn nàn về hành động thường xuyên (với always)
- He is always complaining! (Anh ta lúc nào cũng phàn nàn!)

## 3. Dấu hiệu nhận biết

- **now** (bây giờ)
- **at the moment** (lúc này)
- **currently** (hiện tại)
- **right now** (ngay bây giờ)
- **Look!** (Nhìn kìa!)
- **Listen!** (Nghe này!)

## 4. Quy tắc thêm -ing

### Thông thường: thêm -ing
- play → playing, read → reading

### Động từ kết thúc bằng -e: bỏ e, thêm -ing
- come → coming, write → writing

### Động từ 1 âm tiết, kết thúc bằng 1 nguyên âm + 1 phụ âm: gấp đôi phụ âm, thêm -ing
- run → running, sit → sitting, swim → swimming

### Động từ kết thúc bằng -ie: đổi ie → y, thêm -ing
- lie → lying, die → dying

## 5. Động từ KHÔNG dùng ở thì tiếp diễn

### Động từ chỉ tri giác
- see, hear, smell, taste, feel

### Động từ chỉ sở hữu
- have (có), own, belong, possess

### Động từ chỉ tình cảm
- love, hate, like, prefer, want

### Động từ chỉ tư duy
- know, understand, believe, remember, forget`,
        examples: JSON.stringify([
          { en: 'She is reading a book now.', vi: 'Cô ấy đang đọc sách bây giờ.' },
          { en: 'They are playing football at the moment.', vi: 'Họ đang chơi bóng đá lúc này.' },
          { en: 'I am not watching TV right now.', vi: 'Tôi không xem TV ngay bây giờ.' },
          { en: 'Are you listening to me?', vi: 'Bạn có đang nghe tôi nói không?' },
          { en: 'He is always losing his keys!', vi: 'Anh ấy lúc nào cũng làm mất chìa khóa!' }
        ]),
        exercises: [
          {
            type: 'multiple-choice',
            question: 'Look! The children ___ in the garden.',
            questionVi: 'Nhìn kìa! Bọn trẻ ___ trong vườn.',
            options: JSON.stringify(['play', 'plays', 'are playing', 'is playing']),
            answer: 'are playing',
            explanation: 'Có "Look!" và "children" (số nhiều) → are playing.'
          },
          {
            type: 'multiple-choice',
            question: 'She ___ dinner at the moment.',
            questionVi: 'Cô ấy ___ bữa tối lúc này.',
            options: JSON.stringify(['cook', 'cooks', 'is cooking', 'are cooking']),
            answer: 'is cooking',
            explanation: 'Có "at the moment" và "She" → is cooking.'
          },
          {
            type: 'fill-in',
            question: 'I ___ (write) an email right now.',
            questionVi: 'Tôi ___ (viết) một email ngay bây giờ.',
            answer: 'am writing',
            explanation: 'Có "right now" → dùng hiện tại tiếp diễn: am writing.'
          },
          {
            type: 'fill-in',
            question: 'They ___ (not/watch) TV now.',
            questionVi: 'Họ ___ (không xem) TV bây giờ.',
            answer: 'aren\'t watching',
            explanation: 'Câu phủ định với "They" → aren\'t watching.'
          },
          {
            type: 'multiple-choice',
            question: 'I ___ you. (believe)',
            questionVi: 'Tôi ___ bạn. (tin)',
            options: JSON.stringify(['believe', 'am believing', 'believes', 'believing']),
            answer: 'believe',
            explanation: '"believe" là động từ chỉ tư duy, không dùng thì tiếp diễn.'
          }
        ]
      },
      {
        title: 'Past Simple',
        titleVi: 'Thì quá khứ đơn',
        order: 3,
        content: `# Thì Quá Khứ Đơn (Past Simple)

## 1. Cấu trúc

### Câu khẳng định
**S + V2/V-ed**
- I played / I went
- She worked / She came

### Câu phủ định
**S + didn't + V(nguyên mẫu)**
- I didn't play
- She didn't go

### Câu nghi vấn
**Did + S + V(nguyên mẫu)?**
- Did you play?
- Did she go?

## 2. Cách dùng

### a) Hành động đã hoàn thành trong quá khứ
- I visited London last year. (Tôi đã thăm London năm ngoái)
- She graduated in 2020. (Cô ấy tốt nghiệp năm 2020)

### b) Chuỗi hành động trong quá khứ
- He came home, took a shower, and went to bed. (Anh ấy về nhà, tắm rửa và đi ngủ)

### c) Thói quen trong quá khứ
- When I was young, I played football every day. (Khi còn nhỏ, tôi chơi bóng mỗi ngày)

## 3. Dấu hiệu nhận biết

- **yesterday** (hôm qua)
- **last week/month/year** (tuần/tháng/năm trước)
- **ago** (cách đây)
- **in + năm trong quá khứ** (in 2020)
- **when I was young** (khi tôi còn nhỏ)

## 4. Quy tắc thêm -ed

### Thông thường: thêm -ed
- work → worked, play → played

### Kết thúc bằng -e: chỉ thêm -d
- love → loved, like → liked

### Kết thúc bằng phụ âm + y: đổi y → ied
- study → studied, cry → cried

### Động từ 1 âm tiết, kết thúc bằng 1 nguyên âm + 1 phụ âm: gấp đôi phụ âm
- stop → stopped, plan → planned

## 5. Động từ bất quy tắc (Irregular Verbs)

| Nguyên mẫu | Quá khứ | Nghĩa |
|------------|---------|-------|
| go | went | đi |
| come | came | đến |
| see | saw | nhìn thấy |
| eat | ate | ăn |
| drink | drank | uống |
| buy | bought | mua |
| make | made | làm |
| take | took | lấy |
| have | had | có |
| do | did | làm |`,
        examples: JSON.stringify([
          { en: 'I visited my grandparents yesterday.', vi: 'Tôi đã thăm ông bà hôm qua.' },
          { en: 'She didn\'t go to school last week.', vi: 'Cô ấy không đi học tuần trước.' },
          { en: 'Did you watch the movie?', vi: 'Bạn đã xem phim chưa?' },
          { en: 'They bought a new car in 2022.', vi: 'Họ đã mua xe mới năm 2022.' },
          { en: 'He came, saw, and conquered.', vi: 'Anh ấy đến, thấy và chinh phục.' }
        ]),
        exercises: [
          {
            type: 'multiple-choice',
            question: 'I ___ to the cinema yesterday.',
            questionVi: 'Tôi ___ đến rạp chiếu phim hôm qua.',
            options: JSON.stringify(['go', 'goes', 'went', 'going']),
            answer: 'went',
            explanation: 'Có "yesterday" → quá khứ đơn. "go" bất quy tắc → went.'
          },
          {
            type: 'fill-in',
            question: 'She ___ (study) English last night.',
            questionVi: 'Cô ấy ___ (học) tiếng Anh tối qua.',
            answer: 'studied',
            explanation: 'Có "last night" → quá khứ đơn: studied.'
          },
          {
            type: 'fill-in',
            question: 'They ___ (not/like) the food.',
            questionVi: 'Họ ___ (không thích) đồ ăn.',
            answer: 'didn\'t like',
            explanation: 'Câu phủ định quá khứ: didn\'t + V nguyên mẫu.'
          },
          {
            type: 'multiple-choice',
            question: '___ you ___ breakfast this morning?',
            questionVi: 'Bạn ___ ăn sáng sáng nay chưa?',
            options: JSON.stringify(['Do/eat', 'Did/eat', 'Did/ate', 'Do/ate']),
            answer: 'Did/eat',
            explanation: 'Câu hỏi quá khứ: Did + S + V nguyên mẫu?'
          }
        ]
      },
      {
        title: 'Past Continuous',
        titleVi: 'Thì quá khứ tiếp diễn',
        order: 4,
        content: `# Thì Quá Khứ Tiếp Diễn (Past Continuous)

## 1. Cấu trúc

### Câu khẳng định
**S + was/were + V-ing**
- I/He/She/It was studying
- You/We/They were studying

### Câu phủ định
**S + was/were + not + V-ing**
- I wasn't studying
- They weren't studying

### Câu nghi vấn
**Was/Were + S + V-ing?**
- Was she studying?
- Were they studying?

## 2. Cách dùng

### a) Hành động đang xảy ra tại một thời điểm cụ thể trong quá khứ
- At 8pm yesterday, I was watching TV. (Lúc 8 giờ tối qua, tôi đang xem TV)

### b) Hành động đang xảy ra thì có hành động khác xen vào
- I was reading when she called. (Tôi đang đọc sách thì cô ấy gọi)
- **was/were + V-ing** WHEN **S + V2/V-ed**

### c) Hai hành động cùng xảy ra song song
- While I was cooking, he was watching TV. (Trong khi tôi nấu ăn, anh ấy đang xem TV)
- **While S1 + was/were + V-ing, S2 + was/were + V-ing**

### d) Miêu tả bối cảnh trong quá khứ
- The sun was shining and birds were singing. (Mặt trời đang chiếu sáng và chim chóc đang hót)

## 3. Dấu hiệu nhận biết

- **at + giờ cụ thể + thời gian quá khứ** (at 8pm yesterday)
- **when** (khi)
- **while** (trong khi)
- **as** (trong lúc)

## 4. So sánh Past Simple và Past Continuous

### Past Simple: hành động ngắn, xen vào
- She called. (Cô ấy đã gọi - hành động ngắn)

### Past Continuous: hành động dài, đang diễn ra
- I was reading. (Tôi đang đọc - hành động dài)

### Kết hợp
- **I was reading** WHEN **she called**.
- (Tôi đang đọc thì cô ấy gọi)`,
        examples: JSON.stringify([
          { en: 'I was sleeping at 11pm last night.', vi: 'Tôi đang ngủ lúc 11 giờ đêm qua.' },
          { en: 'They were playing football when it started to rain.', vi: 'Họ đang chơi bóng thì trời bắt đầu mưa.' },
          { en: 'While she was cooking, I was cleaning the house.', vi: 'Trong khi cô ấy nấu ăn, tôi đang dọn nhà.' },
          { en: 'What were you doing at 6pm yesterday?', vi: 'Bạn đang làm gì lúc 6 giờ chiều hôm qua?' },
          { en: 'The children weren\'t sleeping, they were playing.', vi: 'Bọn trẻ không ngủ, chúng đang chơi.' }
        ]),
        exercises: [
          {
            type: 'multiple-choice',
            question: 'I ___ TV at 9pm last night.',
            questionVi: 'Tôi ___ TV lúc 9 giờ tối qua.',
            options: JSON.stringify(['watch', 'watched', 'was watching', 'were watching']),
            answer: 'was watching',
            explanation: 'Có thời điểm cụ thể "at 9pm last night" → quá khứ tiếp diễn.'
          },
          {
            type: 'fill-in',
            question: 'They ___ (play) when I arrived.',
            questionVi: 'Họ ___ (chơi) khi tôi đến.',
            answer: 'were playing',
            explanation: 'Hành động đang xảy ra (were playing) khi có hành động xen vào (arrived).'
          },
          {
            type: 'multiple-choice',
            question: 'While she ___, he ___ a book.',
            questionVi: 'Trong khi cô ấy ___, anh ấy ___ sách.',
            options: JSON.stringify([
              'cooked/read',
              'was cooking/was reading',
              'cooked/was reading',
              'was cooking/read'
            ]),
            answer: 'was cooking/was reading',
            explanation: '2 hành động cùng xảy ra song song → cả 2 đều dùng quá khứ tiếp diễn.'
          }
        ]
      },
      {
        title: 'Future Simple',
        titleVi: 'Thì tương lai đơn',
        order: 5,
        content: `# Thì Tương Lai Đơn (Future Simple)

## 1. Cấu trúc

### Câu khẳng định
**S + will + V(nguyên mẫu)**
- I will go
- She will come

### Câu phủ định
**S + will not (won't) + V(nguyên mẫu)**
- I won't go
- She won't come

### Câu nghi vấn
**Will + S + V(nguyên mẫu)?**
- Will you go?
- Will she come?

## 2. Cách dùng

### a) Dự đoán về tương lai
- It will rain tomorrow. (Ngày mai trời sẽ mưa)
- She will be a great doctor. (Cô ấy sẽ là bác sĩ giỏi)

### b) Quyết định tức thì tại thời điểm nói
- I'm thirsty. I'll buy a drink. (Tôi khát nước. Tôi sẽ mua đồ uống)
- The phone is ringing. I'll answer it. (Điện thoại đang reo. Tôi sẽ trả lời)

### c) Lời hứa, đề nghị, yêu cầu
- I'll help you. (Tôi sẽ giúp bạn - lời hứa)
- Will you help me? (Bạn sẽ giúp tôi chứ? - yêu cầu)

### d) Đưa ra lời mời
- Will you have some tea? (Bạn uống trà nhé?)

## 3. Dấu hiệu nhận biết

- **tomorrow** (ngày mai)
- **next week/month/year** (tuần/tháng/năm sau)
- **soon** (sớm)
- **in the future** (trong tương lai)
- **I think, I hope, I believe** (tôi nghĩ, tôi hy vọng, tôi tin)

## 4. Be going to vs Will

### Be going to: kế hoạch, dự định có trước
- I'm going to visit Paris next month. (Tôi sẽ thăm Paris tháng sau - đã lên kế hoạch)

### Will: quyết định tức thì
- I'll visit Paris. (Tôi sẽ thăm Paris - quyết định ngay)

### Be going to: dự đoán có căn cứ
- Look at the clouds! It's going to rain. (Nhìn mây kìa! Trời sắp mưa)

### Will: dự đoán không có căn cứ
- I think it will rain tomorrow. (Tôi nghĩ ngày mai trời sẽ mưa)`,
        examples: JSON.stringify([
          { en: 'I will call you tomorrow.', vi: 'Tôi sẽ gọi cho bạn vào ngày mai.' },
          { en: 'She won\'t be late.', vi: 'Cô ấy sẽ không đến muộn.' },
          { en: 'Will you help me?', vi: 'Bạn sẽ giúp tôi chứ?' },
          { en: 'I think he will pass the exam.', vi: 'Tôi nghĩ anh ấy sẽ đậu kỳ thi.' },
          { en: 'Don\'t worry, I\'ll be there.', vi: 'Đừng lo, tôi sẽ ở đó.' }
        ]),
        exercises: [
          {
            type: 'multiple-choice',
            question: 'I ___ you tomorrow.',
            questionVi: 'Tôi ___ bạn vào ngày mai.',
            options: JSON.stringify(['call', 'will call', 'am calling', 'called']),
            answer: 'will call',
            explanation: 'Có "tomorrow" → dùng will call.'
          },
          {
            type: 'fill-in',
            question: 'She ___ (not/come) to the party.',
            questionVi: 'Cô ấy ___ (không đến) bữa tiệc.',
            answer: 'won\'t come',
            explanation: 'Câu phủ định tương lai: won\'t + V nguyên mẫu.'
          },
          {
            type: 'multiple-choice',
            question: '___ you ___ me with this?',
            questionVi: 'Bạn ___ giúp tôi việc này chứ?',
            options: JSON.stringify(['Do/help', 'Will/help', 'Are/helping', 'Did/help']),
            answer: 'Will/help',
            explanation: 'Yêu cầu trong tương lai: Will + S + V?'
          }
        ]
      }
    ]
  },
  {
    name: 'Articles',
    nameVi: 'Mạo từ',
    description: 'Cách dùng a, an, the trong tiếng Anh',
    icon: '📝',
    order: 2,
    lessons: [
      {
        title: 'A, An, The',
        titleVi: 'Cách dùng a, an, the',
        order: 1,
        content: `# Mạo từ: A, An, The

## 1. Mạo từ bất định: A / AN

### Khi nào dùng A / AN?
- Dùng trước danh từ số ít, đếm được, không xác định
- Nhắc đến lần đầu tiên

### A vs AN
- **A** + phụ âm: a book, a car, a university
- **AN** + nguyên âm: an apple, an egg, an hour

**Lưu ý:** Phát âm chứ không phải chữ cái!
- an hour (âm đầu là /aʊ/)
- a university (âm đầu là /ju/)

### Cách dùng A / AN

#### a) Nói về nghề nghiệp
- He is **a** teacher. (Anh ấy là giáo viên)
- She is **an** engineer. (Cô ấy là kỹ sư)

#### b) Nói về một người/vật thuộc một nhóm
- This is **a** pen. (Đây là một cái bút)
- That is **an** elephant. (Đó là một con voi)

#### c) Với số lượng
- once **a** week (một lần một tuần)
- 100km **an** hour (100km một giờ)

## 2. Mạo từ xác định: THE

### Khi nào dùng THE?
- Danh từ đã được nhắc đến trước đó
- Danh từ duy nhất
- Danh từ được xác định rõ

### Cách dùng THE

#### a) Đã nhắc đến trước
- I saw **a** cat. **The** cat was black.
- (Tôi thấy một con mèo. Con mèo đó màu đen)

#### b) Vật duy nhất
- **the** sun (mặt trời)
- **the** moon (mặt trăng)
- **the** Earth (trái đất)

#### c) Nhạc cụ
- play **the** piano (chơi piano)
- play **the** guitar (chơi guitar)

#### d) Tên riêng địa lý
- **the** Pacific Ocean (Thái Bình Dương)
- **the** United States (Hoa Kỳ)
- **the** Nile River (sông Nile)

#### e) Với tính từ so sánh nhất
- **the** best (tốt nhất)
- **the** most beautiful (đẹp nhất)

#### f) Cả gia đình
- **the** Smiths (gia đình Smith)

## 3. Zero Article (Không dùng mạo từ)

### Khi nào KHÔNG dùng mạo từ?

#### a) Danh từ số nhiều không xác định
- I like **books**. (Tôi thích sách)
- **Cats** are cute. (Mèo dễ thương)

#### b) Danh từ không đếm được chung chung
- **Water** is essential. (Nước rất cần thiết)
- I drink **coffee**. (Tôi uống cà phê)

#### c) Bữa ăn
- have **breakfast/lunch/dinner**

#### d) Môn học, môn thể thao
- study **English** (học tiếng Anh)
- play **football** (chơi bóng đá)

#### e) Tên riêng (người, địa điểm)
- **London**, **Vietnam**, **John**`,
        examples: JSON.stringify([
          { en: 'I saw a cat. The cat was sleeping.', vi: 'Tôi thấy một con mèo. Con mèo đang ngủ.' },
          { en: 'She is an honest person.', vi: 'Cô ấy là người trung thực.' },
          { en: 'The sun rises in the east.', vi: 'Mặt trời mọc ở phía đông.' },
          { en: 'I have breakfast at 7am.', vi: 'Tôi ăn sáng lúc 7 giờ.' },
          { en: 'He plays the piano very well.', vi: 'Anh ấy chơi piano rất giỏi.' }
        ]),
        exercises: [
          {
            type: 'multiple-choice',
            question: 'She is ___ teacher.',
            questionVi: 'Cô ấy là giáo viên.',
            options: JSON.stringify(['a', 'an', 'the', 'no article']),
            answer: 'a',
            explanation: 'Nghề nghiệp với phụ âm → dùng "a".'
          },
          {
            type: 'multiple-choice',
            question: 'I bought ___ apple. ___ apple was red.',
            questionVi: 'Tôi mua một quả táo. Quả táo đó màu đỏ.',
            options: JSON.stringify(['a/The', 'an/The', 'a/A', 'an/A']),
            answer: 'an/The',
            explanation: 'Lần đầu dùng "an", lần hai đã xác định dùng "the".'
          },
          {
            type: 'fill-in',
            question: 'He plays ___ guitar.',
            questionVi: 'Anh ấy chơi guitar.',
            answer: 'the',
            explanation: 'Nhạc cụ luôn dùng "the".'
          },
          {
            type: 'fill-in',
            question: 'I have ___ breakfast at 7am.',
            questionVi: 'Tôi ăn sáng lúc 7 giờ.',
            answer: '',
            explanation: 'Bữa ăn không dùng mạo từ (zero article).'
          }
        ]
      }
    ]
  },
  {
    name: 'Conditionals',
    nameVi: 'Câu điều kiện',
    description: 'Các loại câu điều kiện trong tiếng Anh',
    icon: '🔀',
    order: 3,
    lessons: [
      {
        title: 'Zero & First Conditional',
        titleVi: 'Điều kiện loại 0 và 1',
        order: 1,
        content: `# Câu Điều Kiện Loại 0 và 1

## 1. Câu điều kiện loại 0 (Zero Conditional)

### Cấu trúc
**If + S + V(s/es), S + V(s/es)**
- If + present simple, present simple

### Cách dùng
Diễn tả sự thật hiển nhiên, chân lý, điều luôn đúng

### Ví dụ
- If you heat water to 100°C, it boils.
- (Nếu bạn đun nước đến 100°C, nó sẽ sôi)
- If it rains, the ground gets wet.
- (Nếu trời mưa, mặt đất sẽ ướt)

### Có thể thay IF = WHEN
- When you heat ice, it melts.
- (Khi bạn làm nóng đá, nó sẽ tan)

## 2. Câu điều kiện loại 1 (First Conditional)

### Cấu trúc
**If + S + V(s/es), S + will + V(nguyên mẫu)**
- If + present simple, will + V

### Cách dùng
Diễn tả điều có thể xảy ra trong tương lai

### Ví dụ
- If it rains tomorrow, I will stay at home.
- (Nếu ngày mai trời mưa, tôi sẽ ở nhà)
- If you study hard, you will pass the exam.
- (Nếu bạn học chăm, bạn sẽ đậu kỳ thi)

### Lưu ý
- Có thể dùng: can, may, should thay cho will
- If you finish early, you **can** go home.
- If she asks, you **should** tell her.

### Đảo mệnh đề
- I will help you **if** you need.
- (Tôi sẽ giúp bạn nếu bạn cần)

## 3. So sánh Type 0 và Type 1

| Loại 0 | Loại 1 |
|--------|--------|
| Sự thật hiển nhiên | Có thể xảy ra |
| present + present | present + will |
| If water reaches 100°C, it boils | If it rains, I will bring umbrella |`,
        examples: JSON.stringify([
          { en: 'If you mix blue and yellow, you get green.', vi: 'Nếu trộn xanh và vàng, bạn được màu xanh lá.' },
          { en: 'If I have time tomorrow, I will visit you.', vi: 'Nếu ngày mai tôi có thời gian, tôi sẽ thăm bạn.' },
          { en: 'If she calls, tell her I\'m busy.', vi: 'Nếu cô ấy gọi, nói cô ấy tôi đang bận.' },
          { en: 'Water freezes if the temperature drops below 0°C.', vi: 'Nước đóng băng nếu nhiệt độ xuống dưới 0°C.' }
        ]),
        exercises: [
          {
            type: 'multiple-choice',
            question: 'If it ___ tomorrow, we will cancel the trip.',
            questionVi: 'Nếu ngày mai trời mưa, chúng tôi sẽ hủy chuyến đi.',
            options: JSON.stringify(['rain', 'rains', 'will rain', 'rained']),
            answer: 'rains',
            explanation: 'Câu điều kiện loại 1: If + present simple, will + V.'
          },
          {
            type: 'multiple-choice',
            question: 'If you heat ice, it ___.',
            questionVi: 'Nếu bạn làm nóng đá, nó ___.',
            options: JSON.stringify(['melt', 'melts', 'will melt', 'melted']),
            answer: 'melts',
            explanation: 'Sự thật hiển nhiên → câu điều kiện loại 0: present simple.'
          },
          {
            type: 'fill-in',
            question: 'If she ___ (come), I will tell her.',
            questionVi: 'Nếu cô ấy đến, tôi sẽ nói cô ấy.',
            answer: 'comes',
            explanation: 'Câu điều kiện loại 1: If + present simple.'
          }
        ]
      },
      {
        title: 'Second & Third Conditional',
        titleVi: 'Điều kiện loại 2 và 3',
        order: 2,
        content: `# Câu Điều Kiện Loại 2 và 3

## 1. Câu điều kiện loại 2 (Second Conditional)

### Cấu trúc
**If + S + V2/V-ed, S + would + V(nguyên mẫu)**
- If + past simple, would + V

### Cách dùng
- Diễn tả điều không có thật ở hiện tại
- Diễn tả điều không thể xảy ra hoặc khó xảy ra

### Ví dụ
- If I were rich, I would buy a yacht.
- (Nếu tôi giàu, tôi sẽ mua du thuyền - nhưng tôi không giàu)
- If I had wings, I could fly.
- (Nếu tôi có cánh, tôi có thể bay - nhưng tôi không có cánh)

### Lưu ý đặc biệt với BE
- Dùng **WERE** cho tất cả ngôi (không dùng WAS)
- If I **were** you, I would study harder.
- If he **were** here, he would help us.

### Có thể dùng: could, might thay cho would
- If I had more time, I **could** learn Japanese.
- If she knew, she **might** be angry.

## 2. Câu điều kiện loại 3 (Third Conditional)

### Cấu trúc
**If + S + had + V3/V-ed, S + would have + V3/V-ed**
- If + past perfect, would have + V3

### Cách dùng
Diễn tả điều không có thật trong quá khứ, hối tiếc về quá khứ

### Ví dụ
- If I had studied harder, I would have passed the exam.
- (Nếu tôi đã học chăm hơn, tôi đã đậu kỳ thi - nhưng tôi không học chăm và đã trượt)
- If she had come earlier, she would have met him.
- (Nếu cô ấy đến sớm hơn, cô ấy đã gặp anh ấy - nhưng cô ấy đến muộn và không gặp)

### Có thể dùng: could have, might have
- If I had known, I **could have** helped you.
- If they had invited me, I **might have** gone.

## 3. So sánh Type 2 và Type 3

| Loại 2 | Loại 3 |
|--------|--------|
| Không có thật ở hiện tại | Không có thật trong quá khứ |
| past simple + would V | had V3 + would have V3 |
| If I were you, I would go | If I had been you, I would have gone |

## 4. Rút gọn

### Type 2
- If I **were** you → If I **were** you = **Were I** you
- Were I you, I would refuse.

### Type 3
- If I **had known** → **Had I known**
- Had I known, I would have told you.`,
        examples: JSON.stringify([
          { en: 'If I were a bird, I would fly.', vi: 'Nếu tôi là chim, tôi sẽ bay.' },
          { en: 'If I had known, I would have come.', vi: 'Nếu tôi biết, tôi đã đến rồi.' },
          { en: 'If she studied harder, she would pass.', vi: 'Nếu cô ấy học chăm hơn, cô ấy sẽ đậu.' },
          { en: 'If they had left earlier, they would have caught the train.', vi: 'Nếu họ đi sớm hơn, họ đã bắt kịp tàu.' }
        ]),
        exercises: [
          {
            type: 'multiple-choice',
            question: 'If I ___ rich, I would travel the world.',
            questionVi: 'Nếu tôi giàu, tôi sẽ đi du lịch vòng quanh thế giới.',
            options: JSON.stringify(['am', 'was', 'were', 'had been']),
            answer: 'were',
            explanation: 'Câu điều kiện loại 2, với BE luôn dùng WERE.'
          },
          {
            type: 'multiple-choice',
            question: 'If she ___ earlier, she ___ the train.',
            questionVi: 'Nếu cô ấy đến sớm hơn, cô ấy đã bắt kịp tàu.',
            options: JSON.stringify([
              'came/would catch',
              'had come/would catch',
              'came/would have caught',
              'had come/would have caught'
            ]),
            answer: 'had come/would have caught',
            explanation: 'Câu điều kiện loại 3: If + had V3, would have V3.'
          },
          {
            type: 'fill-in',
            question: 'If I ___ (be) you, I would accept the offer.',
            questionVi: 'Nếu tôi là bạn, tôi sẽ chấp nhận lời đề nghị.',
            answer: 'were',
            explanation: 'Câu điều kiện loại 2 với BE → were.'
          }
        ]
      }
    ]
  }
]

async function seed() {
  console.log('🌱 Starting grammar data seeding...')

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing grammar data...')
    await prisma.grammarExercise.deleteMany()
    await prisma.grammarLesson.deleteMany()
    await prisma.grammarTopic.deleteMany()

    // Seed topics and lessons
    for (const topicData of grammarData) {
      console.log(`\n📚 Creating topic: ${topicData.nameVi}`)
      
      const { lessons, ...topicFields } = topicData
      
      const topic = await prisma.grammarTopic.create({
        data: {
          ...topicFields,
          lessons: {
            create: lessons.map((lessonData) => {
              const { exercises, ...lessonFields } = lessonData
              
              return {
                ...lessonFields,
                exercises: {
                  create: exercises.map((exercise) => ({
                    ...exercise,
                    type: exercise.type
                  }))
                }
              }
            })
          }
        },
        include: {
          lessons: {
            include: {
              exercises: true
            }
          }
        }
      })

      console.log(`  ✅ Created ${topic.lessons.length} lessons`)
      const totalExercises = topic.lessons.reduce((sum, lesson) => sum + lesson.exercises.length, 0)
      console.log(`  ✅ Created ${totalExercises} exercises`)
    }

    console.log('\n🎉 Grammar data seeding completed!')
    
    // Summary
    const topicCount = await prisma.grammarTopic.count()
    const lessonCount = await prisma.grammarLesson.count()
    const exerciseCount = await prisma.grammarExercise.count()
    
    console.log('\n📊 Summary:')
    console.log(`  Topics: ${topicCount}`)
    console.log(`  Lessons: ${lessonCount}`)
    console.log(`  Exercises: ${exerciseCount}`)

  } catch (error) {
    console.error('❌ Error seeding grammar data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
