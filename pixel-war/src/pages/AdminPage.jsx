/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Admin Page - System administration and statistics
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Shield,
  Users,
  Settings,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Download,
  Search,
  ChevronRight,
  Monitor,
  Clock,
  Target,
  FileText,
  UserPlus,
  Mail,
  Lock,
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Button, IconButton } from '../components/ui/Button'
import { Input, Select } from '../components/ui/Input'
import { Modal, ModalActions, ConfirmModal } from '../components/ui/Modal'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { ToastContainer, useToast } from '../components/ui/Toast'
import { MISSIONS, MissionCard } from '../components/game/MissionDisplay'

// Mock data for demonstration
const mockInstructors = [
  { id: '1', name: '김강사', email: 'kim@reference.com', status: 'active', sessionsCount: 15 },
  { id: '2', name: '이강사', email: 'lee@reference.com', status: 'active', sessionsCount: 8 },
  { id: '3', name: '박강사', email: 'park@reference.com', status: 'inactive', sessionsCount: 3 },
]

const mockSessions = [
  { id: 'ABC123', name: '신입사원 교육 1차', instructor: '김강사', date: '2026-01-02', players: 24, status: 'ended' },
  { id: 'DEF456', name: '리더십 워크샵', instructor: '이강사', date: '2026-01-01', players: 16, status: 'ended' },
  { id: 'GHI789', name: '팀빌딩 세션', instructor: '김강사', date: '2025-12-28', players: 32, status: 'ended' },
]

const mockStats = {
  totalSessions: 48,
  totalPlayers: 1256,
  avgPlayersPerSession: 26,
  totalPixelsPlaced: 89432,
  mostPopularMission: '영토 점령',
}

export const AdminPage = () => {
  const navigate = useNavigate()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState('overview')
  const [instructors, setInstructors] = useState(mockInstructors)
  const [sessions, setSessions] = useState(mockSessions)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states
  const [showAddInstructor, setShowAddInstructor] = useState(false)
  const [showEditInstructor, setShowEditInstructor] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showMissionEditor, setShowMissionEditor] = useState(false)

  // Form states
  const [instructorForm, setInstructorForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleAddInstructor = () => {
    if (!instructorForm.name || !instructorForm.email) {
      toast.error('모든 필드를 입력해주세요')
      return
    }

    const newInstructor = {
      id: Date.now().toString(),
      ...instructorForm,
      status: 'active',
      sessionsCount: 0,
    }

    setInstructors([...instructors, newInstructor])
    setInstructorForm({ name: '', email: '', password: '' })
    setShowAddInstructor(false)
    toast.success('강사 계정이 생성되었습니다')
  }

  const handleDeleteInstructor = (id) => {
    setInstructors(instructors.filter(i => i.id !== id))
    setShowDeleteConfirm(null)
    toast.success('강사 계정이 삭제되었습니다')
  }

  const handleExportData = () => {
    // Mock CSV export
    const csvContent = 'Session ID,Name,Instructor,Date,Players\n' +
      sessions.map(s => `${s.id},${s.name},${s.instructor},${s.date},${s.players}`).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'session_data.csv'
    a.click()

    toast.success('데이터가 다운로드되었습니다')
  }

  const filteredSessions = sessions.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const tabs = [
    { id: 'overview', label: '개요', icon: BarChart3 },
    { id: 'instructors', label: '강사 관리', icon: Users },
    { id: 'sessions', label: '세션 기록', icon: Monitor },
    { id: 'missions', label: '미션 관리', icon: Target },
    { id: 'settings', label: '시스템 설정', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#050505] grid-pattern">
      {/* Header */}
      <header className="glass border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white/60 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              홈
            </Button>

            <div className="h-6 w-px bg-white/10" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff8844] to-[#ff4444] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">관리자 대시보드</h1>
                <p className="text-sm text-white/50">시스템 관리 및 통계</p>
              </div>
            </div>
          </div>

          <Badge variant="danger">Admin</Badge>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 glass border-r border-white/10 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left
                    ${activeTab === tab.id
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">대시보드 개요</h2>

              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={Monitor}
                  label="총 세션"
                  value={mockStats.totalSessions}
                  color="#00d4ff"
                />
                <StatCard
                  icon={Users}
                  label="총 참여자"
                  value={mockStats.totalPlayers.toLocaleString()}
                  color="#a855f7"
                />
                <StatCard
                  icon={Target}
                  label="배치된 픽셀"
                  value={mockStats.totalPixelsPlaced.toLocaleString()}
                  color="#00ff88"
                />
                <StatCard
                  icon={BarChart3}
                  label="평균 참여자"
                  value={mockStats.avgPlayersPerSession}
                  suffix="명/세션"
                  color="#ff8844"
                />
              </div>

              {/* Recent sessions */}
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">최근 세션</h3>
                  <Button variant="secondary" size="sm" onClick={() => setActiveTab('sessions')}>
                    전체 보기
                  </Button>
                </div>

                <div className="space-y-3">
                  {sessions.slice(0, 5).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-white/5"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-white">{session.name}</p>
                        <p className="text-sm text-white/50">
                          {session.instructor} · {session.date}
                        </p>
                      </div>
                      <Badge>{session.players}명</Badge>
                      <StatusBadge status={session.status} size="sm" />
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* Instructors Tab */}
          {activeTab === 'instructors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">강사 관리</h2>
                <Button
                  variant="primary"
                  icon={UserPlus}
                  onClick={() => setShowAddInstructor(true)}
                >
                  강사 추가
                </Button>
              </div>

              <GlassCard className="overflow-hidden p-0">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left px-4 py-3 text-white/60 font-medium">이름</th>
                      <th className="text-left px-4 py-3 text-white/60 font-medium">이메일</th>
                      <th className="text-left px-4 py-3 text-white/60 font-medium">상태</th>
                      <th className="text-left px-4 py-3 text-white/60 font-medium">세션 수</th>
                      <th className="text-right px-4 py-3 text-white/60 font-medium">작업</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {instructors.map((instructor) => (
                      <tr key={instructor.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 text-white font-medium">{instructor.name}</td>
                        <td className="px-4 py-3 text-white/70">{instructor.email}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={instructor.status} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-white/70">{instructor.sessionsCount}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <IconButton
                              icon={Edit2}
                              onClick={() => setShowEditInstructor(instructor)}
                              className="text-white/60 hover:text-white"
                            />
                            <IconButton
                              icon={Trash2}
                              onClick={() => setShowDeleteConfirm(instructor.id)}
                              className="text-white/60 hover:text-red-400"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">세션 기록</h2>
                <Button
                  variant="secondary"
                  icon={Download}
                  onClick={handleExportData}
                >
                  엑셀 다운로드
                </Button>
              </div>

              <Input
                icon={Search}
                placeholder="세션 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                containerClassName="max-w-md"
              />

              <GlassCard className="overflow-hidden p-0">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left px-4 py-3 text-white/60 font-medium">세션 ID</th>
                      <th className="text-left px-4 py-3 text-white/60 font-medium">이름</th>
                      <th className="text-left px-4 py-3 text-white/60 font-medium">강사</th>
                      <th className="text-left px-4 py-3 text-white/60 font-medium">날짜</th>
                      <th className="text-left px-4 py-3 text-white/60 font-medium">참여자</th>
                      <th className="text-left px-4 py-3 text-white/60 font-medium">상태</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 mono text-[#00d4ff]">{session.id}</td>
                        <td className="px-4 py-3 text-white font-medium">{session.name}</td>
                        <td className="px-4 py-3 text-white/70">{session.instructor}</td>
                        <td className="px-4 py-3 text-white/70">{session.date}</td>
                        <td className="px-4 py-3 text-white/70">{session.players}명</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={session.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            </div>
          )}

          {/* Missions Tab */}
          {activeTab === 'missions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">미션 관리</h2>
                <Button
                  variant="primary"
                  icon={Plus}
                  onClick={() => setShowMissionEditor(true)}
                >
                  미션 추가
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {MISSIONS.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    className="cursor-default"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">시스템 설정</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard>
                  <h3 className="text-lg font-semibold text-white mb-4">기본 게임 설정</h3>
                  <div className="space-y-4">
                    <Input
                      label="기본 제한 시간 (분)"
                      type="number"
                      defaultValue={5}
                    />
                    <Input
                      label="기본 픽셀 수"
                      type="number"
                      defaultValue={50}
                    />
                    <Input
                      label="기본 쿨타임 (초)"
                      type="number"
                      defaultValue={3}
                    />
                    <Button variant="primary" className="w-full mt-4">
                      설정 저장
                    </Button>
                  </div>
                </GlassCard>

                <GlassCard>
                  <h3 className="text-lg font-semibold text-white mb-4">점수 체계</h3>
                  <div className="space-y-4">
                    <Input
                      label="홈그라운드 방어 점수"
                      type="number"
                      defaultValue={1}
                    />
                    <Input
                      label="적진 침투 점수"
                      type="number"
                      defaultValue={3}
                    />
                    <Input
                      label="이벤트 배수 최대값"
                      type="number"
                      defaultValue={5}
                    />
                    <Button variant="primary" className="w-full mt-4">
                      설정 저장
                    </Button>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Instructor Modal */}
      <Modal
        isOpen={showAddInstructor}
        onClose={() => setShowAddInstructor(false)}
        title="강사 추가"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="이름"
            icon={Users}
            value={instructorForm.name}
            onChange={(e) => setInstructorForm({ ...instructorForm, name: e.target.value })}
          />
          <Input
            label="이메일"
            type="email"
            icon={Mail}
            value={instructorForm.email}
            onChange={(e) => setInstructorForm({ ...instructorForm, email: e.target.value })}
          />
          <Input
            label="임시 비밀번호"
            type="password"
            icon={Lock}
            value={instructorForm.password}
            onChange={(e) => setInstructorForm({ ...instructorForm, password: e.target.value })}
          />
        </div>

        <ModalActions>
          <Button variant="secondary" onClick={() => setShowAddInstructor(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleAddInstructor}>
            강사 추가
          </Button>
        </ModalActions>
      </Modal>

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => handleDeleteInstructor(showDeleteConfirm)}
        title="강사 삭제"
        message="정말로 이 강사 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        variant="danger"
      />

      {/* Toast notifications */}
      <ToastContainer />

      {/* Copyright */}
      <footer className="text-center py-4 border-t border-white/10">
        <p className="text-xs text-white/30">© 2026 REFERENCE HRD. All Rights Reserved.</p>
      </footer>
    </div>
  )
}

const StatCard = ({ icon: Icon, label, value, suffix, color }) => (
  <GlassCard className="flex items-center gap-4">
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center"
      style={{ backgroundColor: color + '20' }}
    >
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <div>
      <p className="text-white/60 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white">
        {value}
        {suffix && <span className="text-sm text-white/50 ml-1">{suffix}</span>}
      </p>
    </div>
  </GlassCard>
)

export default AdminPage
