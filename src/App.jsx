import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

import LoveHeart from '../LoveHeart'
import MemoriesSection from './MemoriesSection'
import EnvelopeSection from './EnvelopeSection'
import FinalScene from './FinalScene'

function App() {
  const [storyKey, setStoryKey] = useState(0)
  const lenisRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      smoothWheel: true,
    })

    lenisRef.current = lenis

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    const scrollToTop = () => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true })
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    const restartWholeStory = () => {
      // Reset scroll BEFORE remounting. Otherwise the new finale can see the
      // old bottom position and consume its one-time trigger while offscreen.
      scrollToTop()
      setStoryKey((current) => current + 1)

      // Confirm the reset after React has committed the new story as well.
      window.requestAnimationFrame(() => {
        scrollToTop()
        window.requestAnimationFrame(scrollToTop)
      })
    }

    window.addEventListener('love-site-replay', restartWholeStory)
    return () => {
      window.removeEventListener('love-site-replay', restartWholeStory)
    }
  }, [])

  return (
    <div className="love-story-root" key={storyKey}>
      <LoveHeart />
      <MemoriesSection />
      <EnvelopeSection />
      <FinalScene />
    </div>
  )
}

export default App
