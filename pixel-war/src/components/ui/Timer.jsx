/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Timer Display Component
 */

import React, { useEffect, useRef } from 'react'
import { Clock, Play, Pause, RotateCcw } from 'lucide-react'
import useGameStore, { GAME_STATUS } from '../../store/gameStore'
import audioManager from '../../lib/audio'

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const Timer = ({ size = 'md', showControls = false, className = '' }) => {
  const {
    timerRemaining,
    timerStatus,
    setTimerRemaining,
    startTimer,
    pauseTimer,
    resetTimer,
    endGame,
  } = useGameStore()

  const intervalRef = useRef(null)
  const lastWarningRef = useRef(null)

  // Timer countdown logic
  useEffect(() => {
    if (timerStatus === GAME_STATUS.PLAYING) {
      intervalRef.current = setInterval(() => {
        setTimerRemaining(timerRemaining - 1)

        // Warning sounds at 30, 10, 5, 4, 3, 2, 1 seconds
        if (timerRemaining <= 30 && timerRemaining !== lastWarningRef.current) {
          if (timerRemaining === 30 || timerRemaining <= 10) {
            audioManager.playTimerWarning()
            lastWarningRef.current = timerRemaining
          }
        }

        if (timerRemaining <= 1) {
          clearInterval(intervalRef.current)
          endGame()
          audioManager.playVictory()
        }
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timerStatus, timerRemaining, setTimerRemaining, endGame])

  const isLowTime = timerRemaining <= 30
  const isCriticalTime = timerRemaining <= 10

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl',
  }

  const textSizeClass = sizeClasses[size] || sizeClasses.md

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div
        className={`
          mono font-bold tracking-wider
          ${textSizeClass}
          ${isCriticalTime ? 'text-red-500 animate-pulse' : isLowTime ? 'text-orange-400' : 'gradient-text'}
        `}
      >
        {formatTime(timerRemaining)}
      </div>

      {showControls && (
        <div className="flex gap-2">
          {timerStatus !== GAME_STATUS.PLAYING ? (
            <button
              onClick={startTimer}
              className="btn btn-primary px-4 py-2 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              시작
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="btn btn-secondary px-4 py-2 flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              일시정지
            </button>
          )}
          <button
            onClick={resetTimer}
            className="btn btn-secondary px-4 py-2 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            리셋
          </button>
        </div>
      )}
    </div>
  )
}

export const TimerCompact = ({ className = '' }) => {
  const timerRemaining = useGameStore((state) => state.timerRemaining)
  const isLowTime = timerRemaining <= 30

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Clock className={`w-4 h-4 ${isLowTime ? 'text-orange-400' : 'text-white/60'}`} />
      <span className={`mono font-semibold ${isLowTime ? 'text-orange-400' : 'text-white'}`}>
        {formatTime(timerRemaining)}
      </span>
    </div>
  )
}

export default Timer
