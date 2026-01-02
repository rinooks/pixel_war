/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Button Components
 */

import React from 'react'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  success: 'btn-success',
  ghost: 'bg-transparent hover:bg-white/5 text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
  icon: 'p-2.5',
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  ...props
}) => {
  const variantClass = variants[variant] || variants.primary
  const sizeClass = sizes[size] || sizes.md

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
      )}
    </button>
  )
}

export const IconButton = ({
  icon: Icon,
  variant = 'ghost',
  size = 'icon',
  className = '',
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={`rounded-lg ${className}`}
      {...props}
    >
      <Icon className="w-5 h-5" />
    </Button>
  )
}

export default Button
