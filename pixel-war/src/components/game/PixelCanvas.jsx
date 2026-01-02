/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Pixel Canvas Component - Core game canvas with touch/click support
 */

import React, { useRef, useEffect, useState, useCallback } from 'react'
import useGameStore, { CANVAS_SIZE, GAME_STATUS, RENDER_MODES } from '../../store/gameStore'
import audioManager from '../../lib/audio'

// Team zone definitions (for scoring)
const getTeamZone = (x, y, canvasSize, teamCount) => {
  // Divide canvas into zones based on team count
  const zoneWidth = canvasSize / Math.ceil(Math.sqrt(teamCount))
  const zoneX = Math.floor(x / zoneWidth)
  const zoneY = Math.floor(y / zoneWidth)
  return zoneY * Math.ceil(Math.sqrt(teamCount)) + zoneX
}

export const PixelCanvas = ({
  width = CANVAS_SIZE,
  height = CANVAS_SIZE,
  pixelSize = 10,
  showGrid = true,
  interactive = true,
  showGhostGuide = false,
  className = '',
}) => {
  const canvasRef = useRef(null)
  const [hoveredPixel, setHoveredPixel] = useState(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const {
    pixels,
    pendingPixels,
    missionGuide,
    playerTeam,
    playerId,
    pixelInventory,
    currentCooldown,
    timerStatus,
    renderMode,
    placePixel,
    addPendingPixel,
    teams,
  } = useGameStore()

  const canvasWidth = width * pixelSize
  const canvasHeight = height * pixelSize

  // Get team color
  const getTeamColor = useCallback(() => {
    if (!playerTeam) return '#ffffff'
    const team = teams.find(t => t.id === playerTeam)
    return team?.color || '#ffffff'
  }, [playerTeam, teams])

  // Draw the canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Apply transformations
    ctx.save()
    ctx.translate(offset.x, offset.y)
    ctx.scale(scale, scale)

    // Draw background
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Draw ghost guide (mission template)
    if (showGhostGuide && missionGuide) {
      Object.entries(missionGuide).forEach(([key, color]) => {
        const [x, y] = key.split(',').map(Number)
        ctx.fillStyle = color + '30' // Semi-transparent
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)

        // Draw outline
        ctx.strokeStyle = color + '50'
        ctx.lineWidth = 1
        ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
      })
    }

    // Draw placed pixels
    Object.entries(pixels).forEach(([key, data]) => {
      const [x, y] = key.split('_').map(Number)
      ctx.fillStyle = data.color
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
    })

    // Draw pending pixels (for batch/sync modes)
    Object.entries(pendingPixels).forEach(([key, data]) => {
      const [x, y] = key.split(',').map(Number)
      ctx.fillStyle = data.color + '80'
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)

      // Draw pending indicator
      ctx.strokeStyle = '#ffffff40'
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])
      ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
      ctx.setLineDash([])
    })

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.lineWidth = 1

      for (let x = 0; x <= width; x++) {
        ctx.beginPath()
        ctx.moveTo(x * pixelSize, 0)
        ctx.lineTo(x * pixelSize, canvasHeight)
        ctx.stroke()
      }

      for (let y = 0; y <= height; y++) {
        ctx.beginPath()
        ctx.moveTo(0, y * pixelSize)
        ctx.lineTo(canvasWidth, y * pixelSize)
        ctx.stroke()
      }
    }

    // Draw hover indicator
    if (hoveredPixel && interactive) {
      const { x, y } = hoveredPixel
      const teamColor = getTeamColor()

      ctx.fillStyle = teamColor + '50'
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)

      ctx.strokeStyle = teamColor
      ctx.lineWidth = 2
      ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
    }

    ctx.restore()
  }, [
    pixels,
    pendingPixels,
    missionGuide,
    hoveredPixel,
    showGrid,
    showGhostGuide,
    interactive,
    scale,
    offset,
    width,
    height,
    pixelSize,
    canvasWidth,
    canvasHeight,
    getTeamColor,
  ])

  useEffect(() => {
    draw()
  }, [draw])

  // Get pixel coordinates from event
  const getPixelCoords = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    let clientX, clientY

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = Math.floor(((clientX - rect.left - offset.x) / scale) / pixelSize)
    const y = Math.floor(((clientY - rect.top - offset.y) / scale) / pixelSize)

    if (x >= 0 && x < width && y >= 0 && y < height) {
      return { x, y }
    }
    return null
  }, [offset, scale, pixelSize, width, height])

  // Handle pixel placement
  const handlePlacePixel = useCallback((coords) => {
    if (!coords || !interactive) return
    if (timerStatus !== GAME_STATUS.PLAYING) return

    const { x, y } = coords
    const teamColor = getTeamColor()

    // Check cooldown and inventory
    if (currentCooldown > 0) {
      audioManager.playDenied()
      return
    }

    if (pixelInventory <= 0) {
      audioManager.playDenied()
      return
    }

    // Place pixel based on render mode
    if (renderMode === RENDER_MODES.REALTIME) {
      const success = placePixel(x, y, teamColor, playerId)
      if (success) {
        audioManager.playPixelPlace()
      }
    } else {
      const success = addPendingPixel(x, y, teamColor, playerId)
      if (success) {
        audioManager.playPixelPlace()
      }
    }
  }, [
    interactive,
    timerStatus,
    currentCooldown,
    pixelInventory,
    renderMode,
    placePixel,
    addPendingPixel,
    playerId,
    getTeamColor,
  ])

  // Mouse/Touch event handlers
  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      setOffset(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
      setDragStart({ x: e.clientX, y: e.clientY })
    } else {
      const coords = getPixelCoords(e)
      setHoveredPixel(coords)
    }
  }, [isDragging, dragStart, getPixelCoords])

  const handleMouseDown = useCallback((e) => {
    if (e.button === 1 || e.button === 2) {
      // Middle or right click - start dragging
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }, [])

  const handleMouseUp = useCallback((e) => {
    if (isDragging) {
      setIsDragging(false)
    }
  }, [isDragging])

  const handleClick = useCallback((e) => {
    if (!isDragging) {
      const coords = getPixelCoords(e)
      handlePlacePixel(coords)
    }
  }, [isDragging, getPixelCoords, handlePlacePixel])

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      const coords = getPixelCoords(e)
      setHoveredPixel(coords)
    }
  }, [getPixelCoords])

  const handleTouchEnd = useCallback((e) => {
    if (hoveredPixel) {
      handlePlacePixel(hoveredPixel)
    }
    setHoveredPixel(null)
  }, [hoveredPixel, handlePlacePixel])

  const handleWheel = useCallback((e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale(prev => Math.max(0.5, Math.min(3, prev * delta)))
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHoveredPixel(null)
    setIsDragging(false)
  }, [])

  // Prevent context menu
  const handleContextMenu = useCallback((e) => {
    e.preventDefault()
  }, [])

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        className="pixel-canvas canvas-touch-area rounded-lg border border-white/10"
        style={{
          cursor: interactive ? (isDragging ? 'grabbing' : 'crosshair') : 'default',
          maxWidth: '100%',
          height: 'auto',
        }}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      {/* Coordinates display */}
      {hoveredPixel && interactive && (
        <div className="absolute top-2 right-2 glass px-2 py-1 rounded text-xs mono text-white/70">
          X: {hoveredPixel.x}, Y: {hoveredPixel.y}
        </div>
      )}
    </div>
  )
}

export const PixelCanvasDisplay = ({
  width = CANVAS_SIZE,
  height = CANVAS_SIZE,
  pixelSize = 8,
  className = '',
}) => {
  return (
    <PixelCanvas
      width={width}
      height={height}
      pixelSize={pixelSize}
      showGrid={false}
      interactive={false}
      className={className}
    />
  )
}

export default PixelCanvas
