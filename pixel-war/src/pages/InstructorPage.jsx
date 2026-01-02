/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Instructor Page - Session management and game control
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Settings,
  Users,
  Play,
  Pause,
  RotateCcw,
  Monitor,
  Clock,
  Layers,
  Target,
  Zap,
  Gift,
  Trash2,
} from 'lucide-react'
import useGameStore, { GAME_MODES, RENDER_MODES, GAME_STATUS, TEAM_COLORS } from '../store/gameStore'
import audioManager from '../lib/audio'
import { PixelCanvasDisplay } from '../components/game/PixelCanvas'
import { Leaderboard, OccupancyChart } from '../components/game/Leaderboard'
import { EventButtons } from '../components/game/EventButtons'
import { MissionSelector, MISSIONS } from '../components/game/MissionDisplay'
import { Timer } from '../components/ui/Timer'
import { GlassCard, GlassPanel } from '../components/ui/GlassCard'
import { Button, IconButton } from '../components/ui/Button'
import { Input, Select } from '../components/ui/Input'
import { Modal, ModalActions, ConfirmModal } from '../components/ui/Modal'
import { Badge, StatusBadge } from '../components/ui/Badge'
import { ToastContainer, useToast } from '../components/ui/Toast'

export const InstructorPage = () => {
  const navigate = useNavigate()
  const toast = useToast()

  const {
    sessionId,
    sessionName,
    gameMode,
    renderMode,
    timerStatus,
    timerDuration,
    teams,
    players,
    currentMission,
    setSession,
    setGameMode,
    setRenderMode,
    setTimerDuration,
    setTeams,
    setMission,
    startTimer,
    pauseTimer,
    resetTimer,
    refillPixels,
    commitPendingPixels,
    fullReset,
  } = useGameStore()

  const [showCreateSession, setShowCreateSession] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showMissionModal, setShowMissionModal] = useState(false)
  const [showConfirmReset, setShowConfirmReset] = useState(false)
  const [selectedMission, setSelectedMission] = useState(null)

  // Session form state
  const [newSessionName, setNewSessionName] = useState('')
  const [newTimerMinutes, setNewTimerMinutes] = useState(5)
  const [selectedMode, setSelectedMode] = useState(GAME_MODES.TEAM)
  const [selectedRenderMode, setSelectedRenderMode] = useState(RENDER_MODES.REALTIME)

  // Demo initialization
  useEffect(() => {
    audioManager.init()

    // Initialize with demo teams if not set
    if (teams.length === 0) {
      const demoTeams = [
        { id: 'team-red', name: '레드팀', color: TEAM_COLORS.red },
        { id: 'team-blue', name: '블루팀', color: TEAM_COLORS.blue },
        { id: 'team-green', name: '그린팀', color: TEAM_COLORS.green },
        { id: 'team-yellow', name: '옐로우팀', color: TEAM_COLORS.yellow },
      ]
      setTeams(demoTeams)
    }
  }, [teams.length, setTeams])

  const handleCreateSession = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase()
    setSession(id, newSessionName || `세션 ${id}`)
    setGameMode(selectedMode)
    setRenderMode(selectedRenderMode)
    setTimerDuration(newTimerMinutes * 60)

    toast.success(`세션 ${id}가 생성되었습니다`)
    setShowCreateSession(false)
  }

  const handleStartGame = () => {
    audioManager.playGameStart()
    startTimer()
    toast.success('게임이 시작되었습니다!')
  }

  const handlePauseGame = () => {
    pauseTimer()
    toast.info('게임이 일시정지되었습니다')
  }

  const handleResetGame = () => {
    resetTimer()
    toast.info('타이머가 리셋되었습니다')
    setShowConfirmReset(false)
  }

  const handlePixelDrop = () => {
    refillPixels(10)
    audioManager.playNotification()
    toast.success('모든 플레이어에게 10 픽셀이 지급되었습니다')
  }

  const handleBatchDeploy = () => {
    commitPendingPixels()
    audioManager.playEventActivation()
    toast.success('대기 중인 픽셀이 배치되었습니다')
  }

  const handleSelectMission = () => {
    if (selectedMission) {
      setMission(selectedMission)
      toast.success(`미션 "${selectedMission.name}"이 설정되었습니다`)
      setShowMissionModal(false)
    }
  }

  const playerCount = Object.keys(players).length

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

            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#a855f7]" />
                강사 콘솔
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {sessionId && (
              <div className="flex items-center gap-3">
                <StatusBadge status={timerStatus} />
                <div className="text-right">
                  <p className="text-xs text-white/50">세션 ID</p>
                  <p className="mono font-bold text-white">{sessionId}</p>
                </div>
              </div>
            )}

            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowCreateSession(true)}
            >
              새 세션
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Left column - Timer and Controls */}
          <div className="space-y-6">
            {/* Timer */}
            <GlassCard>
              <h3 className="flex items-center gap-2 mb-4 font-semibold text-white">
                <Clock className="w-5 h-5 text-[#00d4ff]" />
                타이머
              </h3>
              <Timer size="lg" className="mb-6" />

              <div className="grid grid-cols-3 gap-2">
                {timerStatus !== GAME_STATUS.PLAYING ? (
                  <Button
                    variant="success"
                    icon={Play}
                    onClick={handleStartGame}
                    className="col-span-2"
                  >
                    시작
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    icon={Pause}
                    onClick={handlePauseGame}
                    className="col-span-2"
                  >
                    일시정지
                  </Button>
                )}
                <Button
                  variant="secondary"
                  icon={RotateCcw}
                  onClick={() => setShowConfirmReset(true)}
                />
              </div>
            </GlassCard>

            {/* Game Settings Quick View */}
            <GlassCard>
              <h3 className="flex items-center gap-2 mb-4 font-semibold text-white">
                <Layers className="w-5 h-5 text-[#a855f7]" />
                게임 설정
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">모드</span>
                  <Badge variant="primary">
                    {gameMode === GAME_MODES.TEAM ? '팀전' : '개인전'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">렌더링</span>
                  <Badge>
                    {renderMode === RENDER_MODES.REALTIME ? '실시간' :
                     renderMode === RENDER_MODES.BATCH ? '배치' : '10초 주기'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">참가자</span>
                  <span className="mono font-medium text-white">{playerCount}명</span>
                </div>
              </div>

              <Button
                variant="secondary"
                onClick={() => setShowSettings(true)}
                className="w-full mt-4"
              >
                설정 변경
              </Button>
            </GlassCard>

            {/* Batch Deploy (for batch mode) */}
            {renderMode === RENDER_MODES.BATCH && (
              <GlassCard>
                <h3 className="flex items-center gap-2 mb-4 font-semibold text-white">
                  <Layers className="w-5 h-5 text-[#00ff88]" />
                  배치 투하
                </h3>
                <p className="text-sm text-white/60 mb-4">
                  대기 중인 모든 픽셀을 캔버스에 일괄 배치합니다.
                </p>
                <Button
                  variant="success"
                  onClick={handleBatchDeploy}
                  className="w-full"
                >
                  픽셀 투하
                </Button>
              </GlassCard>
            )}
          </div>

          {/* Center - Canvas Preview */}
          <div className="lg:col-span-2 xl:col-span-2 space-y-6">
            {/* Canvas */}
            <GlassCard className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <Monitor className="w-5 h-5 text-[#00d4ff]" />
                  캔버스 미리보기
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open('/dashboard', '_blank')}
                >
                  대시보드 열기
                </Button>
              </div>
              <PixelCanvasDisplay
                width={64}
                height={64}
                pixelSize={8}
                className="mx-auto"
              />
            </GlassCard>

            {/* Mission Control */}
            <GlassCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 font-semibold text-white">
                  <Target className="w-5 h-5 text-[#00d4ff]" />
                  미션 컨트롤
                </h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowMissionModal(true)}
                >
                  미션 선택
                </Button>
              </div>

              {currentMission ? (
                <div className="p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🎯</span>
                    <span className="font-medium text-white">{currentMission.name}</span>
                  </div>
                  <p className="text-sm text-white/60">{currentMission.description}</p>
                </div>
              ) : (
                <p className="text-white/50 text-center py-4">미션이 설정되지 않았습니다</p>
              )}
            </GlassCard>

            {/* Resource Management */}
            <GlassCard>
              <h3 className="flex items-center gap-2 mb-4 font-semibold text-white">
                <Gift className="w-5 h-5 text-[#a855f7]" />
                자원 관리
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  icon={Gift}
                  onClick={handlePixelDrop}
                >
                  픽셀 +10
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => refillPixels(50)}
                >
                  픽셀 전체 충전
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Right column - Events and Leaderboard */}
          <div className="space-y-6">
            {/* Event Buttons */}
            <EventButtons
              onEventActivate={(event) => {
                toast.success(`이벤트 "${event.name}" 활성화!`)
              }}
            />

            {/* Leaderboard */}
            <Leaderboard maxItems={5} />

            {/* Occupancy Chart */}
            <OccupancyChart />
          </div>
        </div>
      </main>

      {/* Create Session Modal */}
      <Modal
        isOpen={showCreateSession}
        onClose={() => setShowCreateSession(false)}
        title="새 세션 만들기"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="세션 이름"
            placeholder="예: 2024 신입사원 교육 1차"
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="게임 모드"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              options={[
                { value: GAME_MODES.TEAM, label: '팀전' },
                { value: GAME_MODES.INDIVIDUAL, label: '개인전' },
              ]}
            />

            <Select
              label="렌더링 방식"
              value={selectedRenderMode}
              onChange={(e) => setSelectedRenderMode(e.target.value)}
              options={[
                { value: RENDER_MODES.REALTIME, label: '실시간' },
                { value: RENDER_MODES.BATCH, label: '배치 투하' },
                { value: RENDER_MODES.SYNC_CYCLE, label: '10초 주기' },
              ]}
            />
          </div>

          <Input
            label="제한 시간 (분)"
            type="number"
            value={newTimerMinutes}
            onChange={(e) => setNewTimerMinutes(parseInt(e.target.value) || 5)}
            min={1}
            max={60}
          />
        </div>

        <ModalActions>
          <Button variant="secondary" onClick={() => setShowCreateSession(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleCreateSession}>
            세션 생성
          </Button>
        </ModalActions>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="게임 설정"
        size="md"
      >
        <div className="space-y-4">
          <Select
            label="게임 모드"
            value={gameMode}
            onChange={(e) => setGameMode(e.target.value)}
            options={[
              { value: GAME_MODES.TEAM, label: '팀전' },
              { value: GAME_MODES.INDIVIDUAL, label: '개인전' },
            ]}
          />

          <Select
            label="렌더링 방식"
            value={renderMode}
            onChange={(e) => setRenderMode(e.target.value)}
            options={[
              { value: RENDER_MODES.REALTIME, label: '실시간' },
              { value: RENDER_MODES.BATCH, label: '배치 투하' },
              { value: RENDER_MODES.SYNC_CYCLE, label: '10초 주기' },
            ]}
          />

          <Input
            label="제한 시간 (분)"
            type="number"
            value={Math.floor(timerDuration / 60)}
            onChange={(e) => setTimerDuration((parseInt(e.target.value) || 5) * 60)}
            min={1}
            max={60}
          />
        </div>

        <ModalActions>
          <Button variant="secondary" onClick={() => setShowSettings(false)}>
            닫기
          </Button>
        </ModalActions>
      </Modal>

      {/* Mission Modal */}
      <Modal
        isOpen={showMissionModal}
        onClose={() => setShowMissionModal(false)}
        title="미션 선택"
        size="lg"
      >
        <MissionSelector
          selectedMission={selectedMission}
          onSelect={setSelectedMission}
        />

        <ModalActions>
          <Button variant="secondary" onClick={() => setShowMissionModal(false)}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSelectMission}
            disabled={!selectedMission}
          >
            미션 설정
          </Button>
        </ModalActions>
      </Modal>

      {/* Reset Confirm Modal */}
      <ConfirmModal
        isOpen={showConfirmReset}
        onClose={() => setShowConfirmReset(false)}
        onConfirm={handleResetGame}
        title="타이머 리셋"
        message="타이머를 리셋하시겠습니까? 게임 진행 상황은 유지됩니다."
        confirmText="리셋"
        variant="danger"
      />

      {/* Toast notifications */}
      <ToastContainer />

      {/* Copyright */}
      <footer className="text-center py-4">
        <p className="text-xs text-white/30">© 2026 REFERENCE HRD. All Rights Reserved.</p>
      </footer>
    </div>
  )
}

export default InstructorPage
