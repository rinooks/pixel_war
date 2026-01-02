/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Badge Components
 */

import React from 'react'

const variants = {
  default: 'bg-white/10 text-white',
  primary: 'bg-gradient-to-r from-[#00d4ff] to-[#a855f7] text-white',
  success: 'bg-green-500/20 text-green-400 border border-green-500/30',
  warning: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = '',
  ...props
}) => {
  const variantClass = variants[variant] || variants.default
  const sizeClass = sizes[size] || sizes.md

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variantClass} ${sizeClass} ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  )
}

export const TeamBadge = ({ team, size = 'md', className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${sizes[size] || sizes.md} ${className}
      `}
      style={{
        backgroundColor: `${team.color}20`,
        color: team.color,
        border: `1px solid ${team.color}50`,
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: team.color }}
      />
      {team.name}
    </span>
  )
}

export const StatusBadge = ({ status, size = 'md' }) => {
  const statusConfig = {
    waiting: { variant: 'default', label: '대기 중' },
    playing: { variant: 'success', label: '진행 중' },
    paused: { variant: 'warning', label: '일시정지' },
    ended: { variant: 'danger', label: '종료됨' },
    active: { variant: 'success', label: '활성' },
    inactive: { variant: 'default', label: '비활성' },
  }

  const config = statusConfig[status] || statusConfig.waiting

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  )
}

export default Badge
