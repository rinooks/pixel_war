/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Dashboard Page - Large screen broadcast view for classroom
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Monitor,
  Clock,
  Trophy,
  Target,
  Users,
  Maximize2,
  Minimize2,
  Zap,
  Crown,
} from 'lucide-react'
import useGameStore, { GAME_STATUS, TEAM_COLORS, CANVAS_SIZE } from '../store/gameStore'
import audioManager from '../lib/audio'
import { PixelCanvasDisplay } from '../components/game/PixelCanvas'
import { VictoryScreen } from '../components/game/VictoryScreen'
import { ActiveEventBanner } from '../components/game/EventButtons'
import { formatTime } from '../components/ui/Timer'
import { GlassCard } from '../components/ui/GlassCard'
import { Badge } from '../components/ui/Badge'

export const DashboardPage = () => {
  const navigate = useNavigate()

  const {
    sessionId,
    sessionName,
    timerRemaining,
    timerStatus,
    teams,
    players,
    scores,
    pixels,
    currentMission,
    activeEvent,
    eventMultiplier,
    setTeams,
    setTimerDuration,
  } = useGameStore()

  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showVictory, setShowVictory] = useState(false)

  // Demo initialization
  useEffect(() => {
    audioManager.init()

    if (teams.length === 0) {
      const demoTeams = [
        { id: 'team-red', name: '레드팀', color: TEAM_COLORS.red },
        { id: 'team-blue', name: '블루팀', color: TEAM_COLORS.blue },
        { id: 'team-green', name: '그린팀', color: TEAM_COLORS.green },
        { id: 'team-yellow', name: '옐로우팀', color: TEAM_COLORS.yellow },
      ]
      setTeams(demoTeams)
      setTimerDuration(300)
    }
  }, [teams.length, setTeams, setTimerDuration])

  // Show victory screen when game ends
  useEffect(() => {
    if (timerStatus === GAME_STATUS.ENDED) {
      setShowVictory(true)
    }
  }, [timerStatus])

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Calculate team stats
  const teamStats = teams.map(team => {
    const teamPixels = Object.values(pixels).filter(p => p.teamId === team.id).length
    const teamPlayers = Object.values(players).filter(p => p.team === team.id).length
    const teamScore = scores[team.id] || 0

    return {
      ...team,
      pixelCount: teamPixels,
      playerCount: teamPlayers,
      score: teamScore,
    }
  }).sort((a, b) => b.score - a.score)

  const totalPixels = Object.keys(pixels).length
  const totalPlayers = Object.keys(players).length
  const isLowTime = timerRemaining <= 30
  const isCriticalTime = timerRemaining <= 10

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="glass border-b border-white/10 px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Session info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-electric flex items-center justify-center">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Pixel War</h1>
                <p className="text-white/50 text-sm">
                  {sessionName || `세션 ${sessionId || 'DEMO'}`}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Timer (prominent) */}
          <div className="flex flex-col items-center">
            <div
              className={`
                mono text-7xl font-bold tracking-wider
                ${isCriticalTime ? 'text-red-500 animate-pulse' : isLowTime ? 'text-orange-400' : 'gradient-text'}
              `}
            >
              {formatTime(timerRemaining)}
            </div>
            <Badge
              variant={timerStatus === GAME_STATUS.PLAYING ? 'success' :
                       timerStatus === GAME_STATUS.PAUSED ? 'warning' : 'default'}
              size="lg"
            >
              {timerStatus === GAME_STATUS.PLAYING ? '진행 중' :
               timerStatus === GAME_STATUS.PAUSED ? '일시정지' :
               timerStatus === GAME_STATUS.ENDED ? '종료' : '대기 중'}
            </Badge>
          </div>

          {/* Right: Stats and controls */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-white/50 text-sm">참가자</p>
              <p className="mono text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#00d4ff]" />
                {totalPlayers}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-sm">총 픽셀</p>
              <p className="mono text-2xl font-bold text-white">{totalPixels}</p>
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-3 rounded-lg glass hover:bg-white/10 transition-colors"
            >
              {isFullscreen ? (
                <Minimize2 className="w-6 h-6 text-white" />
              ) : (
                <Maximize2 className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Active event banner */}
      {activeEvent && (
        <div className="px-8 py-3">
          <ActiveEventBanner className="text-xl" />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex p-8 gap-8 min-h-0">
        {/* Left: Canvas (main focus) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <PixelCanvasDisplay
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              pixelSize={12}
              className="rounded-2xl overflow-hidden shadow-2xl"
            />

            {/* Mission overlay */}
            {currentMission && (
              <div className="absolute top-4 left-4 glass-elevated rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#00d4ff]" />
                  <span className="font-medium text-white">{currentMission.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Leaderboard */}
        <div className="w-96 flex flex-col">
          {/* Leaderboard header */}
          <GlassCard className="mb-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">리더보드</h2>
                <p className="text-white/50">실시간 순위</p>
              </div>
            </div>
          </GlassCard>

          {/* Team rankings */}
          <div className="flex-1 space-y-3 overflow-y-auto">
            {teamStats.map((team, index) => (
              <TeamRankCard
                key={team.id}
                team={team}
                rank={index + 1}
                isLeader={index === 0}
              />
            ))}
          </div>

          {/* Occupancy chart */}
          <GlassCard className="mt-4">
            <h3 className="text-lg font-semibold text-white mb-3">점유율</h3>
            <div className="h-6 rounded-full overflow-hidden flex bg-white/10">
              {teamStats.map((team) => {
                const percentage = totalPixels > 0
                  ? (team.pixelCount / totalPixels) * 100
                  : 25
                return (
                  <div
                    key={team.id}
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: team.color,
                    }}
                  />
                )
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {teamStats.map((team) => (
                <div key={team.id} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: team.color }}
                  />
                  <span className="text-white/70 truncate">{team.name}</span>
                  <span className="mono font-medium text-white ml-auto">
                    {totalPixels > 0
                      ? ((team.pixelCount / totalPixels) * 100).toFixed(0)
                      : 0}%
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>

      {/* Victory screen */}
      {showVictory && (
        <VictoryScreen onClose={() => setShowVictory(false)} />
      )}

      {/* Copyright */}
      <footer className="glass border-t border-white/10 px-8 py-2 text-center">
        <p className="text-sm text-white/30">© 2026 REFERENCE HRD. All Rights Reserved.</p>
      </footer>
    </div>
  )
}

const TeamRankCard = ({ team, rank, isLeader }) => {
  const rankColors = {
    1: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/50',
    2: 'from-gray-400/20 to-gray-500/10 border-gray-400/50',
    3: 'from-amber-600/20 to-amber-700/10 border-amber-600/50',
  }

  const bgClass = rankColors[rank] || 'from-white/5 to-white/2 border-white/10'

  return (
    <div
      className={`
        rounded-xl p-4 border
        bg-gradient-to-r ${bgClass}
        ${isLeader ? 'animate-pulse-glow' : ''}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Rank */}
        <div className="text-center w-12">
          {isLeader ? (
            <Crown className="w-8 h-8 text-yellow-400 mx-auto" />
          ) : (
            <span className="mono text-3xl font-bold text-white/50">#{rank}</span>
          )}
        </div>

        {/* Team color indicator */}
        <div
          className="w-6 h-16 rounded-lg"
          style={{ backgroundColor: team.color }}
        />

        {/* Team info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white">{team.name}</h3>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {team.playerCount}명
            </span>
            <span>{team.pixelCount} 픽셀</span>
          </div>
        </div>

        {/* Score */}
        <div className="text-right">
          <p className="mono text-3xl font-bold" style={{ color: team.color }}>
            {team.score.toLocaleString()}
          </p>
          <p className="text-sm text-white/50">점</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
