/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Firestore Database Operations
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  increment
} from 'firebase/firestore'
import { db } from './firebase'

// Collection names
const COLLECTIONS = {
  SESSIONS: 'sessions',
  PLAYERS: 'players',
  PIXELS: 'pixels',
  TEAMS: 'teams',
  MISSIONS: 'missions',
  ADMINS: 'admins',
  INSTRUCTORS: 'instructors',
  EVENTS: 'events',
  STATS: 'stats',
}

// ================== SESSION OPERATIONS ==================

export const createSession = async (sessionData) => {
  const sessionRef = doc(collection(db, COLLECTIONS.SESSIONS))
  const sessionId = sessionRef.id

  await setDoc(sessionRef, {
    ...sessionData,
    id: sessionId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: 'waiting',
    timerRemaining: sessionData.timerDuration || 300,
    pixels: {},
    scores: {},
  })

  return sessionId
}

export const getSession = async (sessionId) => {
  const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId)
  const sessionSnap = await getDoc(sessionRef)

  if (sessionSnap.exists()) {
    return { id: sessionSnap.id, ...sessionSnap.data() }
  }
  return null
}

export const updateSession = async (sessionId, data) => {
  const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId)
  await updateDoc(sessionRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const deleteSession = async (sessionId) => {
  const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId)
  await deleteDoc(sessionRef)
}

export const subscribeToSession = (sessionId, callback) => {
  const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId)
  return onSnapshot(sessionRef, (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...snap.data() })
    }
  })
}

export const getAllSessions = async () => {
  const q = query(
    collection(db, COLLECTIONS.SESSIONS),
    orderBy('createdAt', 'desc'),
    limit(50)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// ================== PLAYER OPERATIONS ==================

export const joinSession = async (sessionId, playerData) => {
  const playerRef = doc(collection(db, COLLECTIONS.SESSIONS, sessionId, COLLECTIONS.PLAYERS))
  const playerId = playerRef.id

  await setDoc(playerRef, {
    ...playerData,
    id: playerId,
    joinedAt: serverTimestamp(),
    pixelsPlaced: 0,
    score: 0,
    isActive: true,
  })

  return playerId
}

export const updatePlayer = async (sessionId, playerId, data) => {
  const playerRef = doc(db, COLLECTIONS.SESSIONS, sessionId, COLLECTIONS.PLAYERS, playerId)
  await updateDoc(playerRef, data)
}

export const removePlayer = async (sessionId, playerId) => {
  const playerRef = doc(db, COLLECTIONS.SESSIONS, sessionId, COLLECTIONS.PLAYERS, playerId)
  await deleteDoc(playerRef)
}

export const subscribeToPlayers = (sessionId, callback) => {
  const playersRef = collection(db, COLLECTIONS.SESSIONS, sessionId, COLLECTIONS.PLAYERS)
  return onSnapshot(playersRef, (snapshot) => {
    const players = {}
    snapshot.forEach(doc => {
      players[doc.id] = { id: doc.id, ...doc.data() }
    })
    callback(players)
  })
}

// ================== PIXEL OPERATIONS ==================

export const placePixel = async (sessionId, x, y, color, playerId, teamId = null) => {
  const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId)
  const pixelKey = `pixels.${x}_${y}`

  await updateDoc(sessionRef, {
    [pixelKey]: {
      color,
      playerId,
      teamId,
      placedAt: Date.now(),
    },
    updatedAt: serverTimestamp(),
  })

  // Update player stats
  if (playerId) {
    const playerRef = doc(db, COLLECTIONS.SESSIONS, sessionId, COLLECTIONS.PLAYERS, playerId)
    await updateDoc(playerRef, {
      pixelsPlaced: increment(1),
    })
  }
}

export const batchPlacePixels = async (sessionId, pixels) => {
  const batch = writeBatch(db)
  const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId)

  const updates = {}
  pixels.forEach(({ x, y, color, playerId, teamId }) => {
    updates[`pixels.${x}_${y}`] = {
      color,
      playerId,
      teamId,
      placedAt: Date.now(),
    }
  })

  batch.update(sessionRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })

  await batch.commit()
}

export const subscribeToPixels = (sessionId, callback) => {
  const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId)
  return onSnapshot(sessionRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data()
      callback(data.pixels || {})
    }
  })
}

// ================== TEAM OPERATIONS ==================

export const createTeam = async (sessionId, teamData) => {
  const teamRef = doc(collection(db, COLLECTIONS.SESSIONS, sessionId, COLLECTIONS.TEAMS))
  const teamId = teamRef.id

  await setDoc(teamRef, {
    ...teamData,
    id: teamId,
    score: 0,
    pixelCount: 0,
    memberCount: 0,
  })

  return teamId
}

export const updateTeamScore = async (sessionId, teamId, points) => {
  const teamRef = doc(db, COLLECTIONS.SESSIONS, sessionId, COLLECTIONS.TEAMS, teamId)
  await updateDoc(teamRef, {
    score: increment(points),
  })
}

export const subscribeToTeams = (sessionId, callback) => {
  const teamsRef = collection(db, COLLECTIONS.SESSIONS, sessionId, COLLECTIONS.TEAMS)
  return onSnapshot(teamsRef, (snapshot) => {
    const teams = []
    snapshot.forEach(doc => {
      teams.push({ id: doc.id, ...doc.data() })
    })
    callback(teams)
  })
}

// ================== MISSION OPERATIONS ==================

export const getMissions = async () => {
  const missionsRef = collection(db, COLLECTIONS.MISSIONS)
  const snapshot = await getDocs(missionsRef)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const createMission = async (missionData) => {
  const missionRef = doc(collection(db, COLLECTIONS.MISSIONS))
  await setDoc(missionRef, {
    ...missionData,
    id: missionRef.id,
    createdAt: serverTimestamp(),
  })
  return missionRef.id
}

export const updateMission = async (missionId, data) => {
  const missionRef = doc(db, COLLECTIONS.MISSIONS, missionId)
  await updateDoc(missionRef, data)
}

// ================== EVENT OPERATIONS ==================

export const activateEvent = async (sessionId, eventData) => {
  const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId)
  await updateDoc(sessionRef, {
    activeEvent: {
      ...eventData,
      activatedAt: Date.now(),
    },
    updatedAt: serverTimestamp(),
  })
}

export const deactivateEvent = async (sessionId) => {
  const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId)
  await updateDoc(sessionRef, {
    activeEvent: null,
    updatedAt: serverTimestamp(),
  })
}

// ================== SCORE OPERATIONS ==================

export const updateScore = async (sessionId, entityId, points, isTeam = true) => {
  const sessionRef = doc(db, COLLECTIONS.SESSIONS, sessionId)
  await updateDoc(sessionRef, {
    [`scores.${entityId}`]: increment(points),
    updatedAt: serverTimestamp(),
  })
}

export const calculateScores = (pixels, teams, zones = null) => {
  const scores = {}

  // Initialize scores
  teams.forEach(team => {
    scores[team.id] = { total: 0, homeDefense: 0, invasion: 0, pixelCount: 0 }
  })

  // Calculate based on pixel ownership
  Object.values(pixels).forEach(pixel => {
    if (pixel.teamId && scores[pixel.teamId]) {
      scores[pixel.teamId].pixelCount++

      // Check if in home zone or enemy zone (simplified)
      if (zones && zones[pixel.teamId]) {
        scores[pixel.teamId].homeDefense++
        scores[pixel.teamId].total += 1
      } else {
        scores[pixel.teamId].invasion++
        scores[pixel.teamId].total += 3
      }
    }
  })

  return scores
}

// ================== ADMIN OPERATIONS ==================

export const createInstructor = async (instructorData) => {
  const instructorRef = doc(collection(db, COLLECTIONS.INSTRUCTORS))
  await setDoc(instructorRef, {
    ...instructorData,
    id: instructorRef.id,
    createdAt: serverTimestamp(),
    isActive: true,
  })
  return instructorRef.id
}

export const getInstructors = async () => {
  const instructorsRef = collection(db, COLLECTIONS.INSTRUCTORS)
  const snapshot = await getDocs(instructorsRef)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const updateInstructor = async (instructorId, data) => {
  const instructorRef = doc(db, COLLECTIONS.INSTRUCTORS, instructorId)
  await updateDoc(instructorRef, data)
}

export const deleteInstructor = async (instructorId) => {
  const instructorRef = doc(db, COLLECTIONS.INSTRUCTORS, instructorId)
  await deleteDoc(instructorRef)
}

// ================== STATS OPERATIONS ==================

export const saveSessionStats = async (sessionId, stats) => {
  const statsRef = doc(db, COLLECTIONS.STATS, sessionId)
  await setDoc(statsRef, {
    ...stats,
    sessionId,
    savedAt: serverTimestamp(),
  })
}

export const getSessionStats = async (sessionId) => {
  const statsRef = doc(db, COLLECTIONS.STATS, sessionId)
  const statsSnap = await getDoc(statsRef)

  if (statsSnap.exists()) {
    return { id: statsSnap.id, ...statsSnap.data() }
  }
  return null
}

export const getAllStats = async () => {
  const statsRef = collection(db, COLLECTIONS.STATS)
  const q = query(statsRef, orderBy('savedAt', 'desc'), limit(100))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export default {
  createSession,
  getSession,
  updateSession,
  deleteSession,
  subscribeToSession,
  getAllSessions,
  joinSession,
  updatePlayer,
  removePlayer,
  subscribeToPlayers,
  placePixel,
  batchPlacePixels,
  subscribeToPixels,
  createTeam,
  updateTeamScore,
  subscribeToTeams,
  getMissions,
  createMission,
  updateMission,
  activateEvent,
  deactivateEvent,
  updateScore,
  calculateScores,
  createInstructor,
  getInstructors,
  updateInstructor,
  deleteInstructor,
  saveSessionStats,
  getSessionStats,
  getAllStats,
}
