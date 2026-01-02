/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Player Status Component - Shows inventory, cooldown, team info
 */

import React, { useEffect } from 'react'
import { Package, Clock, Zap, Users, Shield, Swords } from 'lucide-react'
import useGameStore, { GAME_STATUS } from '../../store/gameStore'
import { GlassCard } from '../ui/GlassCard'
import { Badge, TeamBadge } from '../ui/Badge'

export const PlayerStatus = ({ className = '' }) => {
  const {
    playerName,
    playerTeam,
    pixelInventory,
    maxPixels,
    currentCooldown,
    cooldownTime,
    scores,
    teams,
    timerStatus,
    activeEvent,
    eventMultiplier,
    decrementCooldown,
  } = useGameStore()

  // Cooldown timer
  useEffect(() => {
    if (currentCooldown > 0 && timerStatus === GAME_STATUS.PLAYING) {
      const interval = setInterval(() => {
        decrementCooldown()
      }, 100)
      return () => clearInterval(interval)
    }
  }, [currentCooldown, timerStatus, decrementCooldown])

  const team = teams.find(t => t.id === playerTeam)
  const teamScore = playerTeam ? (scores[playerTeam] || 0) : 0
  const cooldownProgress = currentCooldown > 0 ? (currentCooldown / cooldownTime) * 100 : 0
  const inventoryProgress = (pixelInventory / maxPixels) * 100

  return (
    <GlassCard className={className}>
      {/* Player info */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-white/60">플레이어</p>
          <p className="font-semibold text-white">{playerName || '이름 없음'}</p>
        </div>
        {team && <TeamBadge team={team} />}
      </div>

      {/* Active event */}
      {activeEvent && (
        <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="font-medium text-yellow-400">{activeEvent.name}</span>
            <Badge variant="warning" size="sm">x{eventMultiplier}</Badge>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Pixel inventory */}
        <div className="glass rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-[#00d4ff]" />
            <span className="text-sm text-white/60">픽셀</span>
          </div>
          <p className="mono text-2xl font-bold text-white">
            {pixelInventory}
            <span className="text-sm text-white/40">/{maxPixels}</span>
          </p>
          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${inventoryProgress}%`,
                backgroundColor: inventoryProgress > 20 ? '#00d4ff' : '#ff3366',
              }}
            />
          </div>
        </div>

        {/* Cooldown */}
        <div className="glass rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#a855f7]" />
            <span className="text-sm text-white/60">쿨타임</span>
          </div>
          <p className={`mono text-2xl font-bold ${currentCooldown > 0 ? 'text-orange-400' : 'text-green-400'}`}>
            {currentCooldown > 0 ? currentCooldown.toFixed(1) : '준비'}
            {currentCooldown > 0 && <span className="text-sm">초</span>}
          </p>
          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100 bg-[#a855f7]"
              style={{ width: `${100 - cooldownProgress}%` }}
            />
          </div>
        </div>

        {/* Team score */}
        <div className="glass rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4" style={{ color: team?.color || '#ffffff' }} />
            <span className="text-sm text-white/60">팀 점수</span>
          </div>
          <p className="mono text-2xl font-bold text-white">
            {teamScore.toLocaleString()}
          </p>
        </div>

        {/* Status */}
        <div className="glass rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Swords className="w-4 h-4 text-[#00ff88]" />
            <span className="text-sm text-white/60">상태</span>
          </div>
          <Badge
            variant={timerStatus === GAME_STATUS.PLAYING ? 'success' : 'default'}
            size="md"
          >
            {timerStatus === GAME_STATUS.PLAYING ? '전투 중' :
             timerStatus === GAME_STATUS.PAUSED ? '일시정지' :
             timerStatus === GAME_STATUS.ENDED ? '종료' : '대기 중'}
          </Badge>
        </div>
      </div>
    </GlassCard>
  )
}

export const CompactPlayerStatus = ({ className = '' }) => {
  const {
    pixelInventory,
    maxPixels,
    currentCooldown,
    playerTeam,
    teams,
    scores,
  } = useGameStore()

  const team = teams.find(t => t.id === playerTeam)
  const teamScore = playerTeam ? (scores[playerTeam] || 0) : 0

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {team && (
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: team.color }}
          />
          <span className="text-sm font-medium" style={{ color: team.color }}>
            {team.name}
          </span>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-sm">
        <Package className="w-4 h-4 text-[#00d4ff]" />
        <span className="mono font-medium text-white">
          {pixelInventory}/{maxPixels}
        </span>
      </div>

      {currentCooldown > 0 && (
        <div className="flex items-center gap-1.5 text-sm text-orange-400">
          <Clock className="w-4 h-4" />
          <span className="mono font-medium">{currentCooldown.toFixed(1)}s</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-sm">
        <Shield className="w-4 h-4 text-white/60" />
        <span className="mono font-medium text-white">{teamScore}</span>
      </div>
    </div>
  )
}

export default PlayerStatus
