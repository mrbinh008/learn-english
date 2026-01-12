'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    BookOpen,
    Brain,
    FileText,
    GraduationCap,
    Home,
    Settings,
    BookA,
    RotateCcw,
    Plus
} from 'lucide-react'

const navItems = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/dictionary', label: 'Từ điển', icon: BookA },
    { href: '/flashcards', label: 'Flashcards', icon: Brain },
    { href: '/vocabulary', label: 'Từ vựng', icon: BookOpen },
    { href: '/grammar', label: 'Ngữ pháp', icon: GraduationCap },
    { href: '/reading', label: 'Luyện đọc', icon: FileText },
    { href: '/review', label: 'Ôn tập', icon: RotateCcw },
    { href: '/create', label: 'Tạo nội dung', icon: Plus },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Link href="/" className="logo">
                    <span className="logo-icon">🎓</span>
                    <span className="logo-text">LearnEnglish</span>
                </Link>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="sidebar-footer">
                <Link href="/settings" className={`nav-item ${pathname === '/settings' ? 'active' : ''}`}>
                    <Settings size={20} />
                    <span>Cài đặt</span>
                </Link>
            </div>
        </aside>
    )
}
