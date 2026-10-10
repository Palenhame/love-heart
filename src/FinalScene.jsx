import { useEffect, useRef, useState } from 'react'
import './FinalScene.css'

// A long, elegant heart outline — deliberately unfilled, so it feels drawn in light
// rather than like a solid toy-shaped icon.
const HEART_PATH =
  'M500 875 C438 818 112 610 112 352 C112 180 300 92 438 207 C466 230 487 259 500 291 C513 259 534 230 562 207 C700 92 888 180 888 352 C888 610 562 818 500 875 Z'

const petals = Array.from({ length: 360 }, (_, i) => ({
  id: i,
  top: `${(i * 37 + 3) % 98}%`,
  delay: `${-((i * 1.73) % 23)}s`,
  duration: `${8.5 + (i % 9) * 1.35}s`,
  size: `${5 + (i % 7) * 1.8}px`,
  drift: `${-70 + (i % 13) * 12}px`,
  rotation: `${(i * 47) % 360}deg`,
  opacity: 0.36 + ((i * 7) % 6) * 0.09,
  sway: `${-30 + (i % 7) * 10}px`,
}))

const windStreaks = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  top: `${(i * 23 + 5) % 96}%`,
  delay: `${-((i * 2.4) % 16)}s`,
  duration: `${5.5 + (i % 5) * 1.1}s`,
  width: `${150 + (i % 5) * 95}px`,
  drift: `${-45 + (i % 6) * 18}px`,
}))

const dust = Array.from({ length: 110 }, (_, i) => ({
  id: i,
  x: 7 + ((i * 43) % 86),
  y: 8 + ((i * 61) % 84),
  size: 0.7 + (i % 4) * 0.45,
  delay: `${-((i * 0.83) % 7)}s`,
  duration: `${4 + (i % 6) * 1.2}s`,
}))

function FinalScene() {
  const sectionRef = useRef(null)
  const hasStartedRef = useRef(false)
  const timersRef = useRef([])
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return undefined

    const clearTimers = () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
      timersRef.current = []
    }

    // The cinematic countdown starts only when the visitor reaches the
    // actual bottom of the whole page, not merely when this section appears.
    const isAtPageEnd = () => {
      const doc = document.documentElement
      return window.scrollY + window.innerHeight >= doc.scrollHeight - 12
    }

    const startSequence = () => {
      if (hasStartedRef.current || !isAtPageEnd()) return
      hasStartedRef.current = true
      clearTimers()
      setPhase(0)

      timersRef.current = [
        window.setTimeout(() => setPhase(1), 3300),
        window.setTimeout(() => setPhase(2), 6100),
        window.setTimeout(() => setPhase(3), 10500),
        window.setTimeout(() => setPhase(4), 13500),
      ]
    }

    const checkIfReady = () => {
      if (!isAtPageEnd()) return
      const rect = node.getBoundingClientRect()
      const sectionVisible = rect.top < window.innerHeight && rect.bottom > 0
      if (sectionVisible) startSequence()
    }

    // Do not check immediately on mount: after replay the browser can still
    // momentarily report the previous bottom position. Only a real scroll
    // reaching the bottom can start the cinematic sequence.
    window.addEventListener('scroll', checkIfReady, { passive: true })

    return () => {
      window.removeEventListener('scroll', checkIfReady)
      clearTimers()
    }
  }, [])

  const replay = () => {
    // Ask App to remount the entire story. This resets every React state,
    // timeout, CSS animation and the initial heart's word-reveal sequence.
    window.dispatchEvent(new Event('love-site-replay'))
  }

  return (
    <section
      ref={sectionRef}
      className={`final-scene final-phase-${phase}`}
      id="finale"
      aria-labelledby="final-title"
    >
      <div className="final-vignette" aria-hidden="true" />
      <div className="final-bloom" aria-hidden="true" />
      <div className="final-light-column" aria-hidden="true" />

      {/* The petals and wind make a final sweep, then both vanish entirely. */}
      <div className="final-petals" aria-hidden="true">
        {petals.map((petal) => (
          <span
            className="final-petal"
            key={petal.id}
            style={{
              '--petal-top': petal.top,
              '--petal-delay': petal.delay,
              '--petal-duration': petal.duration,
              '--petal-size': petal.size,
              '--petal-drift': petal.drift,
              '--petal-sway': petal.sway,
              '--petal-rotation': petal.rotation,
              '--petal-opacity': petal.opacity,
            }}
          />
        ))}
      </div>

      <div className="final-wind" aria-hidden="true">
        {windStreaks.map((wind) => (
          <span
            className="final-wind-streak"
            key={wind.id}
            style={{
              '--wind-top': wind.top,
              '--wind-delay': wind.delay,
              '--wind-duration': wind.duration,
              '--wind-width': wind.width,
              '--wind-drift': wind.drift,
            }}
          />
        ))}
      </div>

      <div className="final-dust" aria-hidden="true">
        {dust.map((speck) => (
          <span
            className="final-dust-speck"
            key={speck.id}
            style={{
              '--dust-x': `${speck.x}%`,
              '--dust-y': `${speck.y}%`,
              '--dust-size': `${speck.size}px`,
              '--dust-delay': speck.delay,
              '--dust-duration': speck.duration,
            }}
          />
        ))}
      </div>

      <div className="final-content">
        <p className="final-eyebrow">И НАПОСЛЕДОК</p>

        <div className="final-heart-stage" aria-hidden="true">
          {/* Expanding heart-shaped echoes begin only at the climax. */}
          {[0, 1, 2].map((ring) => (
            <svg
              className={`final-heart-wave final-heart-wave-${ring}`}
              key={ring}
              viewBox="0 0 1000 1000"
              aria-hidden="true"
            >
              <path d={HEART_PATH} />
            </svg>
          ))}

          <div className="final-heart-aura" />

          <svg className="final-heart-art" viewBox="0 0 1000 1000" role="presentation">
            <defs>
              <filter id="final-heart-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="final-heart-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5a0a24" />
                <stop offset="42%" stopColor="#b52a54" />
                <stop offset="72%" stopColor="#73102f" />
                <stop offset="100%" stopColor="#3b0619" />
              </linearGradient>
            </defs>

            <path className="final-heart-halo" d={HEART_PATH} pathLength="1" />
            <path className="final-heart-line" d={HEART_PATH} pathLength="1" />
            <path className="final-heart-core" d={HEART_PATH} pathLength="1" />
          </svg>

          <div className="final-heart-flare" />
        </div>

        <div className="final-copy">
          <h2 id="final-title">
            Среди бесконечности возможностей
            <br className="final-desktop-break" />
            я снова и снова выбираю тебя.
          </h2>
          <p>Сегодня. Завтра. И каждый день после.</p>
          <button type="button" className="final-replay" onClick={replay}>
            <span aria-hidden="true">♥</span>
            Ещё раз
          </button>
        </div>
      </div>

      <div className="final-bottom-note" aria-hidden="true">
        <span />
        <span className="final-bottom-heart">♥</span>
        <span />
      </div>
    </section>
  )
}

export default FinalScene
