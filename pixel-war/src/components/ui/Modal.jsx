/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Modal Component
 */

import React, { useEffect, useCallback } from 'react'
import { X } from 'lucide-react'

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  className = '',
}) => {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw] max-h-[90vh]',
  }

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`
          relative w-full ${sizeClasses[size] || sizeClasses.md}
          glass-elevated rounded-xl
          animate-pixel-pop
          ${className}
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            {title && (
              <h2 className="text-xl font-semibold text-white">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  )
}

export const ModalActions = ({ children, className = '' }) => {
  return (
    <div className={`flex justify-end gap-3 mt-6 pt-4 border-t border-white/10 ${className}`}>
      {children}
    </div>
  )
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '확인',
  message,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'primary',
}) => {
  const buttonVariants = {
    primary: 'btn-primary',
    danger: 'btn-danger',
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-white/70">{message}</p>
      <ModalActions>
        <button onClick={onClose} className="btn btn-secondary">
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className={`btn ${buttonVariants[variant] || buttonVariants.primary}`}
        >
          {confirmText}
        </button>
      </ModalActions>
    </Modal>
  )
}

export default Modal
