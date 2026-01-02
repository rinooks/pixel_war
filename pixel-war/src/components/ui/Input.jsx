/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Input Components
 */

import React from 'react'

export const Input = ({
  label,
  error,
  helper,
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={`input ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1.5 text-sm text-white/50">{helper}</p>
      )}
    </div>
  )
}

export const Select = ({
  label,
  error,
  options = [],
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">
          {label}
        </label>
      )}
      <select
        className={`input appearance-none cursor-pointer ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#0a0a0a]"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

export default Input
