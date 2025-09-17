import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import App from './App'

describe('BPM Counter App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('BPM Counter')).toBeInTheDocument()
  })

  it('shows initial instruction text', () => {
    render(<App />)
    expect(screen.getByText('Tap to the beat')).toBeInTheDocument()
  })

  it('displays tap button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'TAP' })).toBeInTheDocument()
  })

  it('displays reset button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
  })

  it('shows instructions for mobile and desktop', () => {
    render(<App />)
    expect(screen.getByText(/tap the button or.*press spacebar/i)).toBeInTheDocument()
    expect(screen.getByText(/press esc to reset/i)).toBeInTheDocument()
  })

  it('activates tap button when clicked', () => {
    render(<App />)

    const tapButton = screen.getByRole('button', { name: 'TAP' })
    expect(tapButton).not.toHaveClass('active')

    fireEvent.click(tapButton)
    expect(tapButton).toHaveClass('active')
  })

  it('calculates BPM after multiple taps', () => {
    render(<App />)

    const tapButton = screen.getByRole('button', { name: 'TAP' })

    // Mock Date.now to simulate consistent timing (120 BPM = 500ms intervals)
    let mockTime = 1000
    vi.spyOn(Date, 'now').mockImplementation(() => mockTime)

    // First tap
    fireEvent.click(tapButton)
    mockTime += 500 // Advance 500ms

    // Second tap
    fireEvent.click(tapButton)
    mockTime += 500 // Advance 500ms

    // Third tap - should calculate BPM
    fireEvent.click(tapButton)

    // Should show BPM calculation (120 BPM)
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('BPM')).toBeInTheDocument()
    expect(screen.queryByText('Tap to the beat')).not.toBeInTheDocument()
  })

  it('resets when reset button is clicked', () => {
    render(<App />)

    const tapButton = screen.getByRole('button', { name: 'TAP' })
    const resetButton = screen.getByRole('button', { name: 'Reset' })

    // Mock Date.now to simulate taps
    let mockTime = 1000
    vi.spyOn(Date, 'now').mockImplementation(() => mockTime)

    // Tap a few times to get BPM
    fireEvent.click(tapButton)
    mockTime += 500
    fireEvent.click(tapButton)
    mockTime += 500
    fireEvent.click(tapButton)

    // Verify BPM is showing
    expect(screen.getByText('120')).toBeInTheDocument()

    // Reset
    fireEvent.click(resetButton)

    // Should show initial state
    expect(screen.getByText('Tap to the beat')).toBeInTheDocument()
    expect(screen.queryByText('120')).not.toBeInTheDocument()
    expect(tapButton).not.toHaveClass('active')
  })

  it('responds to spacebar keypress', () => {
    render(<App />)

    const tapButton = screen.getByRole('button', { name: 'TAP' })
    expect(tapButton).not.toHaveClass('active')

    // Simulate spacebar press
    fireEvent.keyDown(window, { code: 'Space' })

    expect(tapButton).toHaveClass('active')
  })

  it('responds to escape key for reset', () => {
    render(<App />)

    const tapButton = screen.getByRole('button', { name: 'TAP' })

    // Mock Date.now to simulate taps
    let mockTime = 1000
    vi.spyOn(Date, 'now').mockImplementation(() => mockTime)

    // Tap a few times to get BPM
    fireEvent.click(tapButton)
    mockTime += 500
    fireEvent.click(tapButton)
    mockTime += 500
    fireEvent.click(tapButton)

    // Verify BPM is showing
    expect(screen.getByText('120')).toBeInTheDocument()

    // Press escape
    fireEvent.keyDown(window, { code: 'Escape' })

    // Should reset
    expect(screen.getByText('Tap to the beat')).toBeInTheDocument()
    expect(screen.queryByText('120')).not.toBeInTheDocument()
  })

  it('auto-resets after 3 seconds of inactivity', () => {
    render(<App />)

    const tapButton = screen.getByRole('button', { name: 'TAP' })

    // Tap once to start
    fireEvent.click(tapButton)
    expect(tapButton).toHaveClass('active')

    // Advance time by 3 seconds
    act(() => {
      vi.advanceTimersByTime(3000)
    })

    // Should auto-reset
    expect(screen.getByText('Tap to the beat')).toBeInTheDocument()
    expect(tapButton).not.toHaveClass('active')
  })
})