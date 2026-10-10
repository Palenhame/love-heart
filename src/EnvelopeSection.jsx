import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import './EnvelopeSection.css'

const letterParagraphs = [
  'Я не всегда могу подобрать правильные слова, чтобы объяснить, как много ты для меня значишь.',
  'Но есть одна вещь, в которой я уверен: рядом с тобой даже обычные моменты становятся особенными.',
  'Спасибо, что ты есть в моей жизни. Пусть впереди нас ждёт ещё много моментов, которые захочется сохранить в сердце.',
]

const stars = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: `${(i * 41 + 7) % 100}%`,
  y: `${(i * 29 + 13) % 100}%`,
  delay: `${(i % 9) * -0.7}s`,
}))

function EnvelopeSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const openLetter = () => {
    setIsOpen(true)
    setIsExpanded(true)
  }

  const closeLetter = () => {
    setIsExpanded(false)
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isExpanded) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeLetter()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isExpanded])

  const fullLetter = isExpanded && typeof document !== 'undefined'
    ? createPortal(
        <AnimatePresence>
          <motion.div
            className="letter-expanded-overlay"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeLetter()
            }}
            onTouchStart={(event) => {
              if (event.target === event.currentTarget) closeLetter()
            }}
          >
            <motion.article
              className="letter-expanded-paper"
              role="dialog"
              aria-modal="true"
              aria-labelledby="expanded-letter-title"
              initial={{ opacity: 0, y: 28, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="expanded-letter-topline">ЛИЧНО ДЛЯ ТЕБЯ</span>
              <span className="expanded-letter-heart" aria-hidden="true">♥</span>
              <h3 id="expanded-letter-title">Моё письмо тебе</h3>

              <div className="expanded-letter-body">
                {letterParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <p className="expanded-letter-signature">
                С любовью, всегда <span>♥</span>
              </p>
              <span className="letter-dismiss-hint">Нажми за пределами письма, чтобы закрыть</span>
            </motion.article>
          </motion.div>
        </AnimatePresence>,
        document.body,
      )
    : null

  return (
    <section className="envelope-section" id="letter">
      <div className="letter-glow" aria-hidden="true" />

      <div className="letter-stars" aria-hidden="true">
        {stars.map((star) => (
          <span
            key={star.id}
            style={{ '--x': star.x, '--y': star.y, '--delay': star.delay }}
          />
        ))}
      </div>

      <div className="letter-content">
        <motion.div
          className="letter-heading"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1 }}
        >
          <span className="letter-eyebrow">НЕСКОЛЬКО СЛОВ ДЛЯ ТЕБЯ</span>
          <h2>Я кое-что<br />приготовил для тебя…</h2>
          <p>
            Иногда самые важные слова хочется
            <br className="letter-desktop-break" /> произнести совсем тихо.
          </p>
        </motion.div>

        <motion.div
          className={`envelope-scene ${isOpen ? 'is-open' : ''}`}
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, delay: 0.15 }}
        >
          <div className="letter-paper" aria-hidden="true">
            <div className="letter-paper-inner">
              <span className="letter-paper-symbol">♥</span>
              <h3>Моё письмо тебе</h3>
              <p className="letter-teaser">Внутри есть несколько слов, которые я хочу тебе сказать…</p>
            </div>
          </div>

          <button
            type="button"
            className="envelope-button"
            aria-expanded={isExpanded}
            aria-label="Открыть письмо"
            onClick={openLetter}
          >
            <span className="envelope-back" />
            <span className="envelope-front" />
            <span className="envelope-flap" />
            <span className="envelope-seal"><span>♥</span></span>
          </button>
        </motion.div>

        <motion.p
          className="envelope-hint"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Нажми на конверт, чтобы открыть письмо
        </motion.p>
      </div>

      {fullLetter}
    </section>
  )
}

export default EnvelopeSection
