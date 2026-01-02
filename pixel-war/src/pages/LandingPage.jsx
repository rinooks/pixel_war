/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Landing Page - Entry point for all users
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Monitor, Settings, Shield, Sparkles } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'

const roleCards = [
  {
    id: 'participant',
    title: '참여자',
    subtitle: 'Participant',
    description: '세션에 참여하여 픽셀 전쟁에 참가합니다',
    icon: Users,
    path: '/join',
    gradient: 'from-[#00d4ff] to-[#0066ff]',
  },
  {
    id: 'instructor',
    title: '강사',
    subtitle: 'Instructor',
    description: '세션을 생성하고 게임을 관리합니다',
    icon: Settings,
    path: '/instructor',
    gradient: 'from-[#a855f7] to-[#6366f1]',
  },
  {
    id: 'dashboard',
    title: '대시보드',
    subtitle: 'Dashboard',
    description: '강의장 대형 스크린용 공통 화면',
    icon: Monitor,
    path: '/dashboard',
    gradient: 'from-[#00ff88] to-[#00d4ff]',
  },
  {
    id: 'admin',
    title: '관리자',
    subtitle: 'Admin',
    description: '시스템 전체 관리 및 통계 확인',
    icon: Shield,
    path: '/admin',
    gradient: 'from-[#ff8844] to-[#ff4444]',
  },
]

export const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#050505] grid-pattern relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00d4ff] rounded-full blur-[150px] opacity-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a855f7] rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex flex-col">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#00d4ff]" />
            <span className="text-sm text-white/70">REFERENCE HRD Solution</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            <span className="gradient-text">Pixel War</span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            실시간 픽셀 배치를 통한 팀워크, 자원 관리, 전략적 의사결정 시뮬레이션
          </p>
        </header>

        {/* Role selection grid */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full">
            {roleCards.map((card) => (
              <RoleCard
                key={card.id}
                {...card}
                onClick={() => navigate(card.path)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-12">
          <p className="text-white/30 text-sm">
            © 2026 REFERENCE HRD. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}

const RoleCard = ({ title, subtitle, description, icon: Icon, gradient, onClick }) => {
  return (
    <GlassCard
      onClick={onClick}
      className="group cursor-pointer h-full flex flex-col"
    >
      {/* Icon */}
      <div
        className={`
          w-16 h-16 rounded-xl mb-6
          bg-gradient-to-br ${gradient}
          flex items-center justify-center
          group-hover:scale-110 transition-transform duration-300
        `}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        <p className="text-sm text-white/50 mb-3">{subtitle}</p>
        <p className="text-white/60">{description}</p>
      </div>

      {/* Hover indicator */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <span className={`
          text-sm font-medium bg-gradient-to-r ${gradient}
          bg-clip-text text-transparent
          group-hover:translate-x-1 inline-block transition-transform
        `}>
          선택하기 →
        </span>
      </div>
    </GlassCard>
  )
}

export default LandingPage
