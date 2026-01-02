/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Toast Notification Component
 */

import React, { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import useGameStore from '../../store/gameStore'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colors = {
  success: 'border-green-500/50 bg-green-500/10',
  error: 'border-red-500/50 bg-red-500/10',
  warning: 'border-orange-500/50 bg-orange-500/10',
  info: 'border-blue-500/50 bg-blue-500/10',
}

const iconColors = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-orange-400',
  info: 'text-blue-400',
}

const ToastItem = ({ id, message, type = 'info' }) => {
  const removeNotification = useGameStore((state) => state.removeNotification)

  const Icon = icons[type] || icons.info
  const colorClass = colors[type] || colors.info
  const iconColorClass = iconColors[type] || iconColors.info

  useEffect(() => {
    const timer = setTimeout(() => {
      removeNotification(id)
    }, 4000)

    return () => clearTimeout(timer)
  }, [id, removeNotification])

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-xl ${colorClass} animate-pixel-pop`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColorClass}`} />
      <p className="text-sm text-white flex-1">{message}</p>
      <button
        onClick={() => removeNotification(id)}
        className="text-white/50 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export const ToastContainer = () => {
  const notifications = useGameStore((state) => state.notifications)

  if (notifications.length === 0) return null

  return (
    <div className="toast-container max-w-md w-full px-4">
      {notifications.map((notification) => (
        <ToastItem key={notification.id} {...notification} />
      ))}
    </div>
  )
}

// Hook to show toasts easily
export const useToast = () => {
  const addNotification = useGameStore((state) => state.addNotification)

  return {
    success: (message) => addNotification(message, 'success'),
    error: (message) => addNotification(message, 'error'),
    warning: (message) => addNotification(message, 'warning'),
    info: (message) => addNotification(message, 'info'),
  }
}

export default ToastContainer
