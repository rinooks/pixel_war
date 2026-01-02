/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Victory Screen Component
 */

import React, { useEffect, useMemo } from 'react'
import { Trophy, Medal, Star, Crown, Users, Target, Zap } from 'lucide-react'
import useGameStore, { GAME_MODES } from '../../store/gameStore'
import audioManager from '../../lib/audio'
import { Button } from '../ui/Button'

export const VictoryScreen = ({ onClose }) => {
  const { scores, teams, players, gameMode, pixels } = useGameStore()

  useEffect(() => {
    audioManager.playVictory()
  }, [])

  // Calculate final rankings
  const rankings = useMemo(() => {
    if (gameMode === GAME_MODES.TEAM) {
      return teams
        .map(team => ({
          id: team.id,
          name: team.name,
          color: team.color,
          score: scores[team.id] || 0,
          pixelCount: Object.values(pixels).filter(p => p.teamId === team.id).length,
          memberCount: Object.values(players).filter(p => p.team === team.id).length,
        }))
        .sort((a, b) => b.score - a.score)
    } else {
      return Object.entries(players)
        .map(([id, player]) => ({
          id,
          name: player.name,
          color: player.color || '#ffffff',
          score: scores[id] || player.score || 0,
          pixelCount: player.pixelsPlaced || 0,
        }))
        .sort((a, b) => b.score - a.score)
    }
  }, [scores, teams, players, gameMode, pixels])

  // Calculate MVP (Most Valuable Player)
  const mvp = useMemo(() => {
    if (gameMode === GAME_MODES.TEAM) {
      return Object.entries(players)
        .map(([id, player]) => ({
          id,
          name: player.name,
          pixelsPlaced: player.pixelsPlaced || 0,
          team: teams.find(t => t.id === player.team),
        }))
        .sort((a, b) => b.pixelsPlaced - a.pixelsPlaced)[0]
    }
    return null
  }, [players, teams, gameMode])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPixels = Object.keys(pixels).length
    const totalPlayers = Object.keys(players).length
    const averageScore = rankings.length > 0
      ? Math.round(rankings.reduce((sum, r) => sum + r.score, 0) / rankings.length)
      : 0

    return { totalPixels, totalPlayers, averageScore }
  }, [pixels, players, rankings])

  const winner = rankings[0]
  const isTeamMode = gameMode === GAME_MODES.TEAM

  return (
    <div className="victory-overlay">
      <div className="max-w-4xl w-full mx-4 animate-victory">
        {/* Winner announcement */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 animate-float"
            style={{
              background: `linear-gradient(135deg, ${winner?.color || '#00d4ff'} 0%, #a855f7 100%)`,
              boxShadow: `0 0 60px ${winner?.color || '#00d4ff'}50`,
            }}
          >
            <Trophy className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            VICTORY!
          </h1>

          <div className="flex items-center justify-center gap-3 mb-2">
            <Crown className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl md:text-4xl font-bold"
              style={{ color: winner?.color }}
            >
              {winner?.name || '승자'}
            </h2>
          </div>

          <p className="text-xl text-white/70">
            최종 점수: <span className="mono font-bold text-white">{winner?.score?.toLocaleString() || 0}</span>점
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={Target}
            label="총 픽셀"
            value={stats.totalPixels.toLocaleString()}
            color="#00d4ff"
          />
          <StatCard
            icon={Users}
            label="참여자"
            value={stats.totalPlayers}
            color="#a855f7"
          />
          <StatCard
            icon={Zap}
            label="평균 점수"
            value={stats.averageScore.toLocaleString()}
            color="#00ff88"
          />
        </div>

        {/* Final rankings */}
        <div className="glass-elevated rounded-xl p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Medal className="w-5 h-5 text-yellow-400" />
            최종 순위
          </h3>

          <div className="space-y-3">
            {rankings.slice(0, 5).map((item, index) => (
              <RankingRow
                key={item.id}
                rank={index + 1}
                item={item}
                isTeam={isTeamMode}
              />
            ))}
          </div>
        </div>

        {/* MVP (Team mode only) */}
        {mvp && isTeamMode && (
          <div className="glass-elevated rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              MVP
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full gradient-electric flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {mvp.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">{mvp.name}</p>
                <p className="text-white/60">
                  {mvp.team?.name} · {mvp.pixelsPlaced} 픽셀 배치
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={onClose}>
            결과 닫기
          </Button>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
          >
            새 게임
          </Button>
        </div>

        {/* Copyright */}
        <p className="text-center text-white/30 text-sm mt-8">
          © 2026 REFERENCE HRD. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card rounded-xl p-4 text-center">
    <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} />
    <p className="mono text-2xl font-bold text-white">{value}</p>
    <p className="text-sm text-white/60">{label}</p>
  </div>
)

const RankingRow = ({ rank, item, isTeam }) => {
  const rankColors = {
    1: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400' },
    2: { bg: 'bg-gray-400/20', border: 'border-gray-400/50', text: 'text-gray-300' },
    3: { bg: 'bg-amber-600/20', border: 'border-amber-600/50', text: 'text-amber-500' },
  }

  const colors = rankColors[rank] || { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white/50' }

  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.text} font-bold text-lg`}>
        {rank === 1 ? <Crown className="w-5 h-5" /> : `#${rank}`}
      </div>

      <div
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: item.color }}
      />

      <div className="flex-1">
        <p className="font-medium text-white">{item.name}</p>
        {isTeam && (
          <p className="text-sm text-white/50">
            {item.memberCount}명 · {item.pixelCount} 픽셀
          </p>
        )}
      </div>

      <p className="mono font-bold text-xl text-white">
        {item.score.toLocaleString()}
      </p>
    </div>
  )
}

export default VictoryScreen
