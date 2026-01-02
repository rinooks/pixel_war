/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Join Page - Session entry for participants
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Hash, User, Palette } from 'lucide-react'
import useGameStore, { TEAM_COLORS } from '../store/gameStore'
import audioManager from '../lib/audio'
import { GlassCard, GlassPanel } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useToast } from '../components/ui/Toast'

export const JoinPage = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { setSession, setPlayer, setTeams, setConnected } = useGameStore()

  const [sessionId, setSessionId] = useState('')
  const [nickname, setNickname] = useState('')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  // Demo teams for testing
  const demoTeams = [
    { id: 'team-red', name: '레드팀', color: TEAM_COLORS.red },
    { id: 'team-blue', name: '블루팀', color: TEAM_COLORS.blue },
    { id: 'team-green', name: '그린팀', color: TEAM_COLORS.green },
    { id: 'team-yellow', name: '옐로우팀', color: TEAM_COLORS.yellow },
  ]

  const handleSessionCheck = async (e) => {
    e.preventDefault()

    if (!sessionId.trim()) {
      toast.error('세션 ID를 입력해주세요')
      return
    }

    if (!nickname.trim()) {
      toast.error('닉네임을 입력해주세요')
      return
    }

    // Initialize audio
    audioManager.init()

    // For demo, proceed to team selection
    setStep(2)
    setTeams(demoTeams)
  }

  const handleJoinSession = async () => {
    if (!selectedTeam) {
      toast.error('팀을 선택해주세요')
      return
    }

    setIsLoading(true)

    try {
      // Set session and player info
      setSession(sessionId, `세션 ${sessionId}`)
      setPlayer(`player-${Date.now()}`, nickname, selectedTeam.id)
      setConnected(true)

      audioManager.playGameStart()
      toast.success('세션에 참가했습니다!')

      // Navigate to game
      navigate('/play')
    } catch (error) {
      console.error('Join error:', error)
      toast.error('세션 참가에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] grid-pattern relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#00d4ff] rounded-full blur-[150px] opacity-10" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#a855f7] rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="mb-8">
          <Button
            variant="ghost"
            onClick={() => step === 1 ? navigate('/') : setStep(1)}
            className="text-white/60 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            뒤로가기
          </Button>
        </header>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            {step === 1 ? (
              <SessionForm
                sessionId={sessionId}
                setSessionId={setSessionId}
                nickname={nickname}
                setNickname={setNickname}
                onSubmit={handleSessionCheck}
              />
            ) : (
              <TeamSelection
                teams={demoTeams}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
                onJoin={handleJoinSession}
                isLoading={isLoading}
                nickname={nickname}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-8">
          <p className="text-white/30 text-sm">
            © 2026 REFERENCE HRD. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}

const SessionForm = ({ sessionId, setSessionId, nickname, setNickname, onSubmit }) => {
  return (
    <GlassCard>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-xl gradient-electric flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">세션 참가</h1>
        <p className="text-white/60">세션 ID와 닉네임을 입력하세요</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="세션 ID"
          placeholder="예: ABC123"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value.toUpperCase())}
          icon={Hash}
          className="uppercase"
        />

        <Input
          label="닉네임"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          icon={User}
          maxLength={20}
        />

        <Button type="submit" variant="primary" className="w-full mt-6">
          다음
        </Button>
      </form>

      {/* Quick join for demo */}
      <div className="mt-6 pt-6 border-t border-white/10 text-center">
        <p className="text-sm text-white/40 mb-3">테스트용 빠른 참가</p>
        <Button
          variant="secondary"
          onClick={() => {
            setSessionId('DEMO01')
            setNickname(`Player${Math.floor(Math.random() * 1000)}`)
          }}
        >
          데모 세션
        </Button>
      </div>
    </GlassCard>
  )
}

const TeamSelection = ({ teams, selectedTeam, setSelectedTeam, onJoin, isLoading, nickname }) => {
  return (
    <GlassCard>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#6366f1] flex items-center justify-center mx-auto mb-4">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">팀 선택</h1>
        <p className="text-white/60">{nickname}님, 참가할 팀을 선택하세요</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {teams.map((team) => (
          <button
            key={team.id}
            onClick={() => setSelectedTeam(team)}
            className={`
              p-4 rounded-lg border-2 transition-all
              ${selectedTeam?.id === team.id
                ? 'border-current bg-white/10'
                : 'border-transparent bg-white/5 hover:bg-white/10'
              }
            `}
            style={{
              color: team.color,
              borderColor: selectedTeam?.id === team.id ? team.color : 'transparent',
            }}
          >
            <div
              className="w-8 h-8 rounded-full mx-auto mb-2"
              style={{ backgroundColor: team.color }}
            />
            <p className="font-medium text-white">{team.name}</p>
          </button>
        ))}
      </div>

      <Button
        variant="primary"
        onClick={onJoin}
        disabled={!selectedTeam}
        loading={isLoading}
        className="w-full"
      >
        {selectedTeam ? `${selectedTeam.name}으로 참가` : '팀을 선택하세요'}
      </Button>
    </GlassCard>
  )
}

export default JoinPage
