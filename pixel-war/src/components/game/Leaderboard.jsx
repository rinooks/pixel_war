/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Leaderboard Component
 */

import React, { useMemo } from 'react'
import { Trophy, TrendingUp, Users, Crown } from 'lucide-react'
import useGameStore, { GAME_MODES } from '../../store/gameStore'
import { GlassCard } from '../ui/GlassCard'

export const Leaderboard = ({
  maxItems = 10,
  showDetails = true,
  compact = false,
  className = '',
}) => {
  const { scores, teams, players, gameMode } = useGameStore()

  const sortedItems = useMemo(() => {
    if (gameMode === GAME_MODES.TEAM) {
      return teams
        .map(team => ({
          id: team.id,
          name: team.name,
          color: team.color,
          score: scores[team.id] || 0,
          memberCount: Object.values(players).filter(p => p.team === team.id).length,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, maxItems)
    } else {
      return Object.entries(players)
        .map(([id, player]) => ({
          id,
          name: player.name,
          color: player.color || '#ffffff',
          score: scores[id] || player.score || 0,
          pixelsPlaced: player.pixelsPlaced || 0,
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, maxItems)
    }
  }, [scores, teams, players, gameMode, maxItems])

  const maxScore = sortedItems[0]?.score || 1

  if (compact) {
    return (
      <div className={`space-y-2 ${className}`}>
        {sortedItems.slice(0, 5).map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-2 text-sm"
          >
            <span className={`mono font-bold ${index === 0 ? 'text-yellow-400' : 'text-white/50'}`}>
              #{index + 1}
            </span>
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1 truncate text-white/80">{item.name}</span>
            <span className="mono font-semibold text-white">{item.score}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <GlassCard className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className="font-semibold text-white">리더보드</h3>
        <span className="text-white/50 text-sm ml-auto">
          {gameMode === GAME_MODES.TEAM ? '팀전' : '개인전'}
        </span>
      </div>

      <div className="space-y-3">
        {sortedItems.map((item, index) => (
          <LeaderboardItem
            key={item.id}
            rank={index + 1}
            item={item}
            progress={(item.score / maxScore) * 100}
            showDetails={showDetails}
            isTeam={gameMode === GAME_MODES.TEAM}
          />
        ))}

        {sortedItems.length === 0 && (
          <p className="text-center text-white/50 py-4">
            아직 점수가 없습니다
          </p>
        )}
      </div>
    </GlassCard>
  )
}

const LeaderboardItem = ({ rank, item, progress, showDetails, isTeam }) => {
  const rankColors = {
    1: 'text-yellow-400',
    2: 'text-gray-300',
    3: 'text-amber-600',
  }

  const rankIcons = {
    1: <Crown className="w-4 h-4 text-yellow-400" />,
  }

  return (
    <div className="group">
      <div className="flex items-center gap-3">
        {/* Rank */}
        <div className={`w-8 text-center ${rankColors[rank] || 'text-white/50'}`}>
          {rankIcons[rank] || (
            <span className="mono font-bold text-lg">#{rank}</span>
          )}
        </div>

        {/* Color indicator */}
        <div
          className="w-3 h-3 rounded-full ring-2 ring-white/20"
          style={{ backgroundColor: item.color }}
        />

        {/* Name */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">{item.name}</p>
          {showDetails && isTeam && (
            <p className="text-xs text-white/50 flex items-center gap-1">
              <Users className="w-3 h-3" />
              {item.memberCount}명
            </p>
          )}
        </div>

        {/* Score */}
        <div className="text-right">
          <p className="mono font-bold text-white text-lg">{item.score.toLocaleString()}</p>
          {showDetails && !isTeam && (
            <p className="text-xs text-white/50">
              {item.pixelsPlaced || 0} 픽셀
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            backgroundColor: item.color,
          }}
        />
      </div>
    </div>
  )
}

export const OccupancyChart = ({ className = '' }) => {
  const { pixels, teams } = useGameStore()

  const occupancy = useMemo(() => {
    const counts = {}
    teams.forEach(team => {
      counts[team.id] = { count: 0, color: team.color, name: team.name }
    })

    Object.values(pixels).forEach(pixel => {
      if (pixel.teamId && counts[pixel.teamId]) {
        counts[pixel.teamId].count++
      }
    })

    const total = Object.values(counts).reduce((sum, t) => sum + t.count, 0) || 1

    return Object.entries(counts).map(([id, data]) => ({
      id,
      ...data,
      percentage: (data.count / total) * 100,
    }))
  }, [pixels, teams])

  return (
    <GlassCard className={className}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[#00d4ff]" />
        <h3 className="font-semibold text-white">점유율</h3>
      </div>

      {/* Stacked bar */}
      <div className="h-4 rounded-full overflow-hidden flex bg-white/10">
        {occupancy.map((team) => (
          <div
            key={team.id}
            className="h-full transition-all duration-500"
            style={{
              width: `${team.percentage}%`,
              backgroundColor: team.color,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {occupancy.map((team) => (
          <div key={team.id} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: team.color }}
            />
            <span className="text-white/70 truncate flex-1">{team.name}</span>
            <span className="mono font-medium text-white">
              {team.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

export default Leaderboard
