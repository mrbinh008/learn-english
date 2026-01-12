import { Layout } from "@/components/Layout"
import Link from "next/link"
import {
  BookA,
  Brain,
  BookOpen,
  GraduationCap,
  FileText,
  RotateCcw,
  TrendingUp,
  Target,
  Flame,
  Clock
} from "lucide-react"

const features = [
  {
    href: "/dictionary",
    icon: BookA,
    iconClass: "blue",
    title: "Từ điển",
    description: "Tra từ tiếng Anh, xem nghĩa, phát âm, ví dụ và từ đồng nghĩa"
  },
  {
    href: "/flashcards",
    icon: Brain,
    iconClass: "purple",
    title: "Flashcards",
    description: "Học từ vựng hiệu quả với flashcard và spaced repetition"
  },
  {
    href: "/vocabulary",
    icon: BookOpen,
    iconClass: "green",
    title: "Từ vựng",
    description: "Học từ vựng theo chủ đề: Giao tiếp, Du lịch, Công việc..."
  },
  {
    href: "/grammar",
    icon: GraduationCap,
    iconClass: "orange",
    title: "Ngữ pháp",
    description: "Học ngữ pháp tiếng Anh từ cơ bản đến nâng cao"
  },
  {
    href: "/reading",
    icon: FileText,
    iconClass: "pink",
    title: "Luyện đọc",
    description: "Đọc hiểu với các bài viết theo nhiều cấp độ"
  },
  {
    href: "/review",
    icon: RotateCcw,
    iconClass: "red",
    title: "Ôn tập",
    description: "Làm bài test ôn tập định kỳ, theo dõi tiến độ"
  }
]

export default function Home() {
  return (
    <Layout>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Chào mừng đến với LearnEnglish! 🎓</h1>
        <p className="page-subtitle">
          Nền tảng học tiếng Anh toàn diện với sự hỗ trợ của AI
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon feature-icon blue">
            <Target size={24} />
          </div>
          <div className="stat-info">
            <h3>0</h3>
            <p>Từ đã học</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon feature-icon green">
            <Flame size={24} />
          </div>
          <div className="stat-info">
            <h3>0</h3>
            <p>Ngày streak</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon feature-icon orange">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>0</h3>
            <p>Phút học hôm nay</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon feature-icon purple">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <h3>0%</h3>
            <p>Độ chính xác</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
        Các tính năng
      </h2>
      <div className="card-grid">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link
              key={feature.href}
              href={feature.href}
              className="feature-card"
            >
              <div className={`feature-icon ${feature.iconClass}`}>
                <Icon size={24} />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem' }}>
          Bắt đầu nhanh
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/dictionary" className="btn btn-primary">
            <BookA size={18} />
            Tra từ điển
          </Link>
          <Link href="/flashcards" className="btn btn-secondary">
            <Brain size={18} />
            Học Flashcard
          </Link>
          <Link href="/review" className="btn btn-success">
            <RotateCcw size={18} />
            Ôn tập ngay
          </Link>
        </div>
      </div>
    </Layout>
  )
}
