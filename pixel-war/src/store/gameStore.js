/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Zustand Store for Game State Management
 */

import { create } from 'zustand'

// Team color definitions
export const TEAM_COLORS = {
  red: '#ff4444',
  blue: '#4488ff',
  green: '#44ff88',
  yellow: '#ffdd44',
  purple: '#aa44ff',
  orange: '#ff8844',
  pink: '#ff44aa',
  cyan: '#44ffff',
}

// Game modes
export const GAME_MODES = {
  TEAM: 'team',
  INDIVIDUAL: 'individual',
}

// Render modes
export const RENDER_MODES = {
  REALTIME: 'realtime',
  BATCH: 'batch',
  SYNC_CYCLE: 'sync_cycle',
}

// Game status
export const GAME_STATUS = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ENDED: 'ended',
}

// Default canvas size
export const CANVAS_SIZE = 64

// Initial game state
const initialGameState = {
  // Session info
  sessionId: null,
  sessionName: '',

  // Player info
  playerId: null,
  playerName: '',
  playerTeam: null,

  // Game settings
  gameMode: GAME_MODES.TEAM,
  renderMode: RENDER_MODES.REALTIME,
  canvasSize: CANVAS_SIZE,

  // Timer
  timerDuration: 300, // 5 minutes default
  timerRemaining: 300,
  timerStatus: GAME_STATUS.WAITING,

  // Canvas state (2D array of pixel colors)
  pixels: {},
  pendingPixels: {}, // For batch/sync mode

  // Teams
  teams: [],

  // Players
  players: {},

  // Resources
  pixelInventory: 50,
  maxPixels: 50,
  cooldownTime: 3, // seconds
  currentCooldown: 0,

  // Scoring
  scores: {},

  // Mission
  currentMission: null,
  missionGuide: null,

  // Events
  activeEvent: null,
  eventMultiplier: 1,

  // UI State
  isConnected: false,
  isLoading: false,
  error: null,
  notifications: [],
}

export const useGameStore = create((set, get) => ({
  ...initialGameState,

  // Session actions
  setSession: (sessionId, sessionName) => set({ sessionId, sessionName }),

  // Player actions
  setPlayer: (playerId, playerName, playerTeam) => set({
    playerId,
    playerName,
    playerTeam
  }),

  // Connection state
  setConnected: (isConnected) => set({ isConnected }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  // Game settings
  setGameMode: (gameMode) => set({ gameMode }),
  setRenderMode: (renderMode) => set({ renderMode }),
  setCanvasSize: (canvasSize) => set({ canvasSize }),

  // Timer actions
  setTimerDuration: (timerDuration) => set({ timerDuration, timerRemaining: timerDuration }),
  setTimerRemaining: (timerRemaining) => set({ timerRemaining }),
  setTimerStatus: (timerStatus) => set({ timerStatus }),

  startTimer: () => set({ timerStatus: GAME_STATUS.PLAYING }),
  pauseTimer: () => set({ timerStatus: GAME_STATUS.PAUSED }),
  resetTimer: () => set((state) => ({
    timerRemaining: state.timerDuration,
    timerStatus: GAME_STATUS.WAITING
  })),
  endGame: () => set({ timerStatus: GAME_STATUS.ENDED }),

  // Pixel actions
  setPixels: (pixels) => set({ pixels }),

  placePixel: (x, y, color, playerId) => {
    const state = get()
    if (state.pixelInventory <= 0 || state.currentCooldown > 0) return false

    const key = `${x},${y}`
    const newPixels = { ...state.pixels, [key]: { color, playerId, timestamp: Date.now() } }

    set({
      pixels: newPixels,
      pixelInventory: state.pixelInventory - 1,
      currentCooldown: state.cooldownTime,
    })

    return true
  },

  addPendingPixel: (x, y, color, playerId) => {
    const state = get()
    if (state.pixelInventory <= 0) return false

    const key = `${x},${y}`
    const newPending = { ...state.pendingPixels, [key]: { color, playerId, timestamp: Date.now() } }

    set({
      pendingPixels: newPending,
      pixelInventory: state.pixelInventory - 1,
    })

    return true
  },

  commitPendingPixels: () => {
    const state = get()
    const newPixels = { ...state.pixels, ...state.pendingPixels }
    set({ pixels: newPixels, pendingPixels: {} })
  },

  clearPendingPixels: () => set({ pendingPixels: {} }),

  // Resource actions
  setPixelInventory: (pixelInventory) => set({ pixelInventory }),
  setMaxPixels: (maxPixels) => set({ maxPixels }),
  setCooldownTime: (cooldownTime) => set({ cooldownTime }),
  setCurrentCooldown: (currentCooldown) => set({ currentCooldown }),

  decrementCooldown: () => set((state) => ({
    currentCooldown: Math.max(0, state.currentCooldown - 0.1)
  })),

  refillPixels: (amount) => set((state) => ({
    pixelInventory: Math.min(state.maxPixels, state.pixelInventory + amount)
  })),

  // Team actions
  setTeams: (teams) => set({ teams }),

  // Player actions
  setPlayers: (players) => set({ players }),
  addPlayer: (playerId, playerData) => set((state) => ({
    players: { ...state.players, [playerId]: playerData }
  })),
  removePlayer: (playerId) => set((state) => {
    const { [playerId]: removed, ...remaining } = state.players
    return { players: remaining }
  }),

  // Score actions
  setScores: (scores) => set({ scores }),
  updateScore: (teamOrPlayerId, points) => set((state) => ({
    scores: {
      ...state.scores,
      [teamOrPlayerId]: (state.scores[teamOrPlayerId] || 0) + points
    }
  })),

  // Mission actions
  setMission: (currentMission, missionGuide = null) => set({ currentMission, missionGuide }),
  clearMission: () => set({ currentMission: null, missionGuide: null }),

  // Event actions
  setActiveEvent: (activeEvent, eventMultiplier = 1) => set({ activeEvent, eventMultiplier }),
  clearEvent: () => set({ activeEvent: null, eventMultiplier: 1 }),

  // Notification actions
  addNotification: (message, type = 'info') => set((state) => ({
    notifications: [...state.notifications, { id: Date.now(), message, type }]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  clearNotifications: () => set({ notifications: [] }),

  // Reset game
  resetGame: () => set({
    ...initialGameState,
    sessionId: get().sessionId,
    sessionName: get().sessionName,
  }),

  // Full reset
  fullReset: () => set(initialGameState),
}))

export default useGameStore
