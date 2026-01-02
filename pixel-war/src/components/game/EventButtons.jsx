/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Event Buttons Component - For instructor to trigger special events
 */

import React, { useState } from 'react'
import { Zap, Target, Shield, Swords, Gift, Timer, Skull, Star } from 'lucide-react'
import useGameStore from '../../store/gameStore'
import audioManager from '../../lib/audio'
import { GlassCard } from '../ui/GlassCard'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

// Available events
export const EVENTS = [
  {
    id: 'invasion_5x',
    name: '인베이전 5배',
    description: '적진 침투 시 점수 5배',
    icon: Swords,
    multiplier: 5,
    duration: 60,
    color: '#ff4444',
  },
  {
    id: 'defense_3x',
    name: '홈 디펜스 3배',
    description: '자기 영역 방어 시 점수 3배',
    icon: Shield,
    multiplier: 3,
    duration: 60,
    color: '#4488ff',
  },
  {
    id: 'double_points',
    name: '더블 포인트',
    description: '모든 점수 2배',
    icon: Star,
    multiplier: 2,
    duration: 30,
    color: '#ffdd44',
  },
  {
    id: 'speed_boost',
    name: '스피드 부스트',
    description: '쿨타임 50% 감소',
    icon: Zap,
    multiplier: 1,
    duration: 45,
    color: '#00ff88',
  },
  {
    id: 'pixel_drop',
    name: '픽셀 드롭',
    description: '모든 플레이어에게 10 픽셀 추가',
    icon: Gift,
    multiplier: 1,
    duration: 0,
    color: '#a855f7',
  },
  {
    id: 'chaos_mode',
    name: '카오스 모드',
    description: '랜덤 픽셀이 캔버스에 배치됨',
    icon: Skull,
    multiplier: 1,
    duration: 30,
    color: '#ff8844',
  },
]

export const EventButtons = ({ onEventActivate, className = '' }) => {
  const { activeEvent, setActiveEvent, clearEvent } = useGameStore()
  const [cooldowns, setCooldowns] = useState({})

  const handleActivateEvent = (event) => {
    if (cooldowns[event.id]) return

    // Play sound
    audioManager.playEventActivation()

    // Set active event
    setActiveEvent(event, event.multiplier)

    // Callback
    onEventActivate?.(event)

    // Set cooldown
    setCooldowns(prev => ({ ...prev, [event.id]: true }))

    // Auto-deactivate after duration
    if (event.duration > 0) {
      setTimeout(() => {
        clearEvent()
      }, event.duration * 1000)
    }

    // Reset cooldown after 2 minutes
    setTimeout(() => {
      setCooldowns(prev => ({ ...prev, [event.id]: false }))
    }, 120000)
  }

  return (
    <GlassCard className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="font-semibold text-white">돌발 이벤트</h3>
        </div>
        {activeEvent && (
          <Badge variant="warning">
            활성: {activeEvent.name}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {EVENTS.map((event) => {
          const Icon = event.icon
          const isActive = activeEvent?.id === event.id
          const isOnCooldown = cooldowns[event.id]

          return (
            <button
              key={event.id}
              onClick={() => handleActivateEvent(event)}
              disabled={isOnCooldown || isActive}
              className={`
                relative p-4 rounded-lg text-left transition-all
                ${isActive
                  ? 'ring-2 ring-yellow-400 bg-yellow-500/20'
                  : isOnCooldown
                    ? 'opacity-50 cursor-not-allowed bg-white/5'
                    : 'bg-white/5 hover:bg-white/10 cursor-pointer'
                }
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: event.color + '30' }}
                >
                  <Icon className="w-4 h-4" style={{ color: event.color }} />
                </div>
                <span className="font-medium text-white text-sm">{event.name}</span>
              </div>

              <p className="text-xs text-white/50">{event.description}</p>

              {event.duration > 0 && (
                <div className="flex items-center gap-1 mt-2 text-xs text-white/40">
                  <Timer className="w-3 h-3" />
                  {event.duration}초
                </div>
              )}

              {isActive && (
                <div className="absolute inset-0 rounded-lg animate-pulse-glow pointer-events-none" />
              )}
            </button>
          )
        })}
      </div>

      {/* Deactivate button */}
      {activeEvent && (
        <Button
          variant="secondary"
          onClick={clearEvent}
          className="w-full mt-4"
        >
          이벤트 종료
        </Button>
      )}
    </GlassCard>
  )
}

export const ActiveEventBanner = ({ className = '' }) => {
  const { activeEvent, eventMultiplier } = useGameStore()

  if (!activeEvent) return null

  const event = EVENTS.find(e => e.id === activeEvent.id) || activeEvent
  const Icon = event.icon || Zap

  return (
    <div
      className={`
        flex items-center justify-center gap-3 py-3 px-4
        animate-pulse-glow rounded-lg
        ${className}
      `}
      style={{
        backgroundColor: event.color + '20',
        borderColor: event.color + '50',
        boxShadow: `0 0 30px ${event.color}40`,
      }}
    >
      <Icon className="w-5 h-5" style={{ color: event.color }} />
      <span className="font-semibold" style={{ color: event.color }}>
        {event.name}
      </span>
      {eventMultiplier > 1 && (
        <Badge variant="warning" size="sm">x{eventMultiplier}</Badge>
      )}
    </div>
  )
}

export default EventButtons
