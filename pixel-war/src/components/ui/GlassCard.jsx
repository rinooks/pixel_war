/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Glassmorphism Card Component
 */

import React from 'react'

export const GlassCard = ({
  children,
  className = '',
  elevated = false,
  hover = true,
  onClick,
  ...props
}) => {
  const baseClasses = elevated ? 'glass-elevated' : 'glass-card'
  const hoverClasses = hover && !elevated ? '' : ''
  const clickableClasses = onClick ? 'cursor-pointer' : ''

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} rounded-lg p-6 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export const GlassPanel = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`glass rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default GlassCard
