/**
 * © 2026 REFERENCE HRD. All Rights Reserved.
 * Audio System using Web Audio API
 */

class AudioManager {
  constructor() {
    this.audioContext = null
    this.masterGain = null
    this.isMuted = false
    this.volume = 0.5
    this.initialized = false
  }

  // Initialize audio context (must be called after user interaction)
  init() {
    if (this.initialized) return

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.value = this.volume
      this.initialized = true
    } catch (e) {
      console.warn('Web Audio API not supported:', e)
    }
  }

  // Resume audio context if suspended
  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  // Set master volume
  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value))
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume
    }
  }

  // Toggle mute
  toggleMute() {
    this.isMuted = !this.isMuted
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume
    }
    return this.isMuted
  }

  // Generate a simple beep sound
  playBeep(frequency = 440, duration = 0.1, type = 'sine') {
    if (!this.initialized || !this.audioContext) return

    this.resume()

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  // Sound: Pixel placed successfully
  playPixelPlace() {
    this.playBeep(800, 0.05, 'square')
  }

  // Sound: Pixel placement denied (on cooldown or no resources)
  playDenied() {
    this.playBeep(200, 0.15, 'sawtooth')
  }

  // Sound: Notification received
  playNotification() {
    if (!this.initialized || !this.audioContext) return
    this.resume()

    const now = this.audioContext.currentTime

    // Play two notes
    const frequencies = [523.25, 659.25] // C5, E5

    frequencies.forEach((freq, i) => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(freq, now + i * 0.1)

      gainNode.gain.setValueAtTime(0.2, now + i * 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.2)

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain)

      oscillator.start(now + i * 0.1)
      oscillator.stop(now + i * 0.1 + 0.2)
    })
  }

  // Sound: Event activation
  playEventActivation() {
    if (!this.initialized || !this.audioContext) return
    this.resume()

    const now = this.audioContext.currentTime

    // Rising arpeggio
    const frequencies = [392, 523.25, 659.25, 783.99] // G4, C5, E5, G5

    frequencies.forEach((freq, i) => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(freq, now + i * 0.08)

      gainNode.gain.setValueAtTime(0.25, now + i * 0.08)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3)

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain)

      oscillator.start(now + i * 0.08)
      oscillator.stop(now + i * 0.08 + 0.3)
    })
  }

  // Sound: Timer warning (last 30 seconds)
  playTimerWarning() {
    this.playBeep(880, 0.1, 'square')
    setTimeout(() => this.playBeep(880, 0.1, 'square'), 150)
  }

  // Sound: Game end / Victory
  playVictory() {
    if (!this.initialized || !this.audioContext) return
    this.resume()

    const now = this.audioContext.currentTime

    // Victory fanfare
    const notes = [
      { freq: 523.25, time: 0, duration: 0.15 },      // C5
      { freq: 659.25, time: 0.15, duration: 0.15 },   // E5
      { freq: 783.99, time: 0.3, duration: 0.15 },    // G5
      { freq: 1046.5, time: 0.45, duration: 0.4 },    // C6
    ]

    notes.forEach(({ freq, time, duration }) => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(freq, now + time)

      gainNode.gain.setValueAtTime(0.3, now + time)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + time + duration)

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain)

      oscillator.start(now + time)
      oscillator.stop(now + time + duration)
    })
  }

  // Sound: Countdown tick
  playCountdownTick() {
    this.playBeep(600, 0.05, 'sine')
  }

  // Sound: Game start
  playGameStart() {
    if (!this.initialized || !this.audioContext) return
    this.resume()

    const now = this.audioContext.currentTime

    // Three ascending beeps
    const frequencies = [440, 554.37, 659.25] // A4, C#5, E5

    frequencies.forEach((freq, i) => {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(freq, now + i * 0.2)

      gainNode.gain.setValueAtTime(0.2, now + i * 0.2)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.2 + 0.15)

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain)

      oscillator.start(now + i * 0.2)
      oscillator.stop(now + i * 0.2 + 0.15)
    })
  }

  // Sound: Error
  playError() {
    if (!this.initialized || !this.audioContext) return
    this.resume()

    const now = this.audioContext.currentTime

    // Descending buzz
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(300, now)
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2)

    gainNode.gain.setValueAtTime(0.2, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(now)
    oscillator.stop(now + 0.2)
  }

  // Sound: Invasion (placing pixel in enemy territory)
  playInvasion() {
    if (!this.initialized || !this.audioContext) return
    this.resume()

    const now = this.audioContext.currentTime

    // Aggressive stab sound
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(200, now)
    oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.05)
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1)

    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(now)
    oscillator.stop(now + 0.15)
  }
}

// Export singleton instance
export const audioManager = new AudioManager()
export default audioManager
