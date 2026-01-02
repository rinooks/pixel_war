/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Participant Page - Main game interface for players
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LogOut,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Menu,
  X,
} from 'lucide-react'
import useGameStore, { GAME_STATUS, TEAM_COLORS } from '../store/gameStore'
import audioManager from '../lib/audio'
import { PixelCanvas } from '../components/game/PixelCanvas'
import { PlayerStatus, CompactPlayerStatus } from '../components/game/PlayerStatus'
import { Leaderboard } from '../components/game/Leaderboard'
import { MissionDisplay } from '../components/game/MissionDisplay'
import { ActiveEventBanner } from '../components/game/EventButtons'
import { VictoryScreen } from '../components/game/VictoryScreen'
import { Timer, TimerCompact } from '../components/ui/Timer'
import { GlassCard, GlassPanel } from '../components/ui/GlassCard'
import { Button, IconButton } from '../components/ui/Button'
import { ToastContainer, useToast } from '../components/ui/Toast'

export const ParticipantPage = () => {
  const navigate = useNavigate()
  const toast = useToast()

  const {
    sessionId,
    playerName,
    playerTeam,
    timerStatus,
    isConnected,
    activeEvent,
    teams,
    fullReset,
    // Demo: initialize with sample data
    setTeams,
    setTimerDuration,
    setPixelInventory,
    setMaxPixels,
    startTimer,
  } = useGameStore()

  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showVictory, setShowVictory] = useState(false)

  // Demo initialization
  useEffect(() => {
    if (!isConnected) {
      // Initialize demo data
      const demoTeams = [
        { id: 'team-red', name: '레드팀', color: TEAM_COLORS.red },
        { id: 'team-blue', name: '블루팀', color: TEAM_COLORS.blue },
        { id: 'team-green', name: '그린팀', color: TEAM_COLORS.green },
        { id: 'team-yellow', name: '옐로우팀', color: TEAM_COLORS.yellow },
      ]
      setTeams(demoTeams)
      setTimerDuration(300)
      setPixelInventory(50)
      setMaxPixels(50)
    }
  }, [isConnected, setTeams, setTimerDuration, setPixelInventory, setMaxPixels])

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

  // Handle mute
  const toggleMute = () => {
    const muted = audioManager.toggleMute()
    setIsMuted(muted)
  }

  // Handle exit
  const handleExit = () => {
    fullReset()
    navigate('/')
  }

  const team = teams.find(t => t.id === playerTeam)

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Top bar */}
      <header className="glass border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Menu and session info */}
          <div className="flex items-center gap-4">
            <IconButton
              icon={Menu}
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden"
            />
            <div className="hidden sm:block">
              <p className="text-xs text-white/50">세션</p>
              <p className="mono text-sm font-medium text-white">{sessionId || 'DEMO'}</p>
            </div>
          </div>

          {/* Center: Timer */}
          <div className="flex-1 flex justify-center">
            <TimerCompact />
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            <CompactPlayerStatus className="hidden md:flex" />

            <IconButton
              icon={isMuted ? VolumeX : Volume2}
              onClick={toggleMute}
              className="text-white/60 hover:text-white"
            />

            <IconButton
              icon={isFullscreen ? Minimize2 : Maximize2}
              onClick={toggleFullscreen}
              className="hidden sm:flex text-white/60 hover:text-white"
            />

            <IconButton
              icon={LogOut}
              onClick={handleExit}
              className="text-white/60 hover:text-red-400"
            />
          </div>
        </div>
      </header>

      {/* Active event banner */}
      {activeEvent && (
        <div className="px-4 py-2">
          <ActiveEventBanner />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar - Mobile */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-80 glass-elevated transform transition-transform lg:hidden
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="font-semibold text-white">정보</h2>
            <IconButton icon={X} onClick={() => setShowSidebar(false)} />
          </div>
          <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-60px)]">
            <PlayerStatus />
            <MissionDisplay />
            <Leaderboard compact />
          </div>
        </aside>

        {/* Sidebar overlay */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 p-4 overflow-y-auto border-r border-white/10">
          <div className="space-y-4">
            <PlayerStatus />
            <MissionDisplay />
          </div>
        </aside>

        {/* Canvas area */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <div className="max-w-full">
            {/* Game status message */}
            {timerStatus === GAME_STATUS.WAITING && (
              <div className="text-center mb-4">
                <p className="text-white/60">게임 시작을 대기 중입니다...</p>
                <Button
                  variant="primary"
                  onClick={startTimer}
                  className="mt-2"
                >
                  데모: 게임 시작
                </Button>
              </div>
            )}

            {timerStatus === GAME_STATUS.PAUSED && (
              <div className="text-center mb-4">
                <p className="text-orange-400 font-medium">일시정지됨</p>
              </div>
            )}

            {/* Canvas */}
            <PixelCanvas
              width={64}
              height={64}
              pixelSize={10}
              interactive={timerStatus === GAME_STATUS.PLAYING}
              className="mx-auto"
            />
          </div>
        </div>

        {/* Right sidebar - Desktop */}
        <aside className="hidden xl:block w-80 p-4 overflow-y-auto border-l border-white/10">
          <Leaderboard />
        </aside>
      </main>

      {/* Toast notifications */}
      <ToastContainer />

      {/* Victory screen */}
      {showVictory && (
        <VictoryScreen onClose={() => setShowVictory(false)} />
      )}

      {/* Copyright */}
      <footer className="glass border-t border-white/10 px-4 py-2 text-center">
        <p className="text-xs text-white/30">© 2026 REFERENCE HRD. All Rights Reserved.</p>
      </footer>
    </div>
  )
}

export default ParticipantPage
