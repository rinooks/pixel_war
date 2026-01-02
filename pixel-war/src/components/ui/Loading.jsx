/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Loading Components
 */

import React from 'react'

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  }

  return (
    <div
      className={`
        ${sizeClasses[size] || sizeClasses.md}
        border-white/20 border-t-[#00d4ff]
        rounded-full animate-spin
        ${className}
      `}
    />
  )
}

export const LoadingScreen = ({ message = '로딩 중...' }) => {
  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center gap-6 z-50">
      <div className="relative">
        <Spinner size="xl" />
        <div className="absolute inset-0 blur-xl bg-gradient-to-r from-[#00d4ff] to-[#a855f7] opacity-30" />
      </div>
      <p className="text-white/70 text-lg">{message}</p>
    </div>
  )
}

export const LoadingOverlay = ({ message }) => {
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 rounded-lg">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        {message && <p className="text-white/70">{message}</p>}
      </div>
    </div>
  )
}

export const SkeletonBox = ({ className = '' }) => {
  return (
    <div className={`bg-white/5 animate-pulse rounded ${className}`} />
  )
}

export default Spinner
