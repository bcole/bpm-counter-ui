import { useState, useCallback, useEffect } from 'react'
import './App.css'

function App() {
  const [bpm, setBpm] = useState<number | null>(null)
  const [taps, setTaps] = useState<number[]>([])
  const [isActive, setIsActive] = useState(false)

  const calculateBPM = useCallback((tapTimes: number[]) => {
    if (tapTimes.length < 2) return null

    const intervals = []
    for (let i = 1; i < tapTimes.length; i++) {
      intervals.push(tapTimes[i] - tapTimes[i - 1])
    }

    const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
    return Math.round(60000 / averageInterval)
  }, [])

  const handleTap = useCallback(() => {
    const now = Date.now()
    setTaps(prevTaps => {
      const newTaps = [...prevTaps, now]
      const recentTaps = newTaps.slice(-8) // Keep only last 8 taps for accuracy

      const calculatedBPM = calculateBPM(recentTaps)
      setBpm(calculatedBPM)

      return recentTaps
    })
    setIsActive(true)
  }, [calculateBPM])

  const reset = useCallback(() => {
    setTaps([])
    setBpm(null)
    setIsActive(false)
  }, [])

  // Handle spacebar presses
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault()
        handleTap()
      } else if (event.code === 'Escape') {
        reset()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleTap, reset])

  // Auto-reset after 3 seconds of inactivity
  useEffect(() => {
    if (taps.length === 0) return

    const timeout = setTimeout(() => {
      reset()
    }, 3000)

    return () => clearTimeout(timeout)
  }, [taps, reset])

  return (
    <div className="app">
      <div className="container">
        <h1>BPM Counter</h1>

        <div className="bpm-display">
          {bpm ? (
            <>
              <span className="bpm-number">{bpm}</span>
              <span className="bpm-label">BPM</span>
            </>
          ) : (
            <span className="instruction">
              Tap to the beat
            </span>
          )}
        </div>

        <div className="tap-area">
          <button
            className={`tap-button ${isActive ? 'active' : ''}`}
            onClick={handleTap}
            type="button"
          >
            TAP
          </button>
        </div>

        <div className="controls">
          <button className="reset-button" onClick={reset} type="button">
            Reset
          </button>
        </div>

        <div className="instructions">
          <p>📱 Tap the button or 🖥️ press SPACEBAR to the beat</p>
          <p>Press ESC to reset • Auto-resets after 3s</p>
        </div>
      </div>
    </div>
  )
}

export default App
