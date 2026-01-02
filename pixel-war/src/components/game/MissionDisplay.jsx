/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Mission Display Component
 */

import React from 'react'
import { Target, Info, CheckCircle, XCircle } from 'lucide-react'
import useGameStore from '../../store/gameStore'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'

// Sample missions library
export const MISSIONS = [
  {
    id: 'guideline_fill',
    name: '가이드라인 채우기',
    description: '주어진 도안을 정확하게 따라 픽셀을 배치하세요.',
    type: 'creative',
    difficulty: 'easy',
    points: 100,
  },
  {
    id: 'color_unity',
    name: '색상 통일',
    description: '팀 색상으로 지정된 영역을 모두 채우세요.',
    type: 'territory',
    difficulty: 'medium',
    points: 150,
  },
  {
    id: 'minimal_resource',
    name: '최소 자원 미션',
    description: '주어진 목표를 최소한의 픽셀로 달성하세요.',
    type: 'efficiency',
    difficulty: 'hard',
    points: 200,
  },
  {
    id: 'territory_control',
    name: '영토 점령',
    description: '캔버스의 50% 이상을 팀 색상으로 점령하세요.',
    type: 'territory',
    difficulty: 'medium',
    points: 150,
  },
  {
    id: 'invasion',
    name: '적진 침투',
    description: '상대 팀 영역에 최대한 많은 픽셀을 배치하세요.',
    type: 'attack',
    difficulty: 'hard',
    points: 200,
  },
  {
    id: 'defense',
    name: '홈그라운드 방어',
    description: '우리 팀 영역을 상대의 침입으로부터 지키세요.',
    type: 'defense',
    difficulty: 'medium',
    points: 150,
  },
]

const difficultyColors = {
  easy: 'success',
  medium: 'warning',
  hard: 'danger',
}

const difficultyLabels = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움',
}

const typeIcons = {
  creative: '🎨',
  territory: '🏴',
  efficiency: '⚡',
  attack: '⚔️',
  defense: '🛡️',
}

export const MissionDisplay = ({ className = '' }) => {
  const { currentMission, missionGuide } = useGameStore()

  if (!currentMission) {
    return (
      <GlassCard className={className}>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-[#00d4ff]" />
          <h3 className="font-semibold text-white">현재 미션</h3>
        </div>
        <div className="text-center py-6 text-white/50">
          <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>진행 중인 미션이 없습니다</p>
        </div>
      </GlassCard>
    )
  }

  const mission = MISSIONS.find(m => m.id === currentMission.id) || currentMission

  return (
    <GlassCard className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#00d4ff]" />
          <h3 className="font-semibold text-white">현재 미션</h3>
        </div>
        <Badge variant={difficultyColors[mission.difficulty]} size="sm">
          {difficultyLabels[mission.difficulty]}
        </Badge>
      </div>

      <div className="space-y-3">
        {/* Mission name */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">{typeIcons[mission.type]}</span>
          <h4 className="text-lg font-semibold text-white">{mission.name}</h4>
        </div>

        {/* Description */}
        <p className="text-white/70">{mission.description}</p>

        {/* Points */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-sm text-white/50">보상 점수:</span>
          <span className="mono font-bold text-[#00ff88]">+{mission.points}</span>
        </div>

        {/* Progress (if applicable) */}
        {currentMission.progress !== undefined && (
          <div className="pt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/50">진행률</span>
              <span className="mono text-white">{currentMission.progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full gradient-electric transition-all duration-500"
                style={{ width: `${currentMission.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  )
}

export const MissionCard = ({
  mission,
  isSelected = false,
  onSelect,
  className = '',
}) => {
  return (
    <div
      onClick={() => onSelect?.(mission)}
      className={`
        glass-card rounded-lg p-4 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-[#00d4ff] bg-white/10' : ''}
        ${className}
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeIcons[mission.type]}</span>
          <h4 className="font-semibold text-white">{mission.name}</h4>
        </div>
        <Badge variant={difficultyColors[mission.difficulty]} size="sm">
          {difficultyLabels[mission.difficulty]}
        </Badge>
      </div>

      <p className="text-sm text-white/60 mb-3">{mission.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-sm text-white/50">보상: <span className="mono text-[#00ff88]">+{mission.points}</span></span>
        {isSelected && (
          <CheckCircle className="w-5 h-5 text-[#00d4ff]" />
        )}
      </div>
    </div>
  )
}

export const MissionSelector = ({ selectedMission, onSelect, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {MISSIONS.map((mission) => (
        <MissionCard
          key={mission.id}
          mission={mission}
          isSelected={selectedMission?.id === mission.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

export default MissionDisplay
