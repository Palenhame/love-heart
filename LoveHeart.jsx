import { useEffect, useState } from 'react'
import './LoveHeart.css'

const phrases = [
  'Я люблю тебя',
  'I love you',
  'Je t’aime',
  'Te amo',
  'Ich liebe dich',
  'Ti amo',
  '愛してる',
  '사랑해',
  'Te quiero',
  'Mon amour',
  'Meu amor',
  '我爱你',
  'Люблю тебя',
  'Forever',
  'Моя любовь',
  'Only you',
  'Mi amor',
  'Люблю',
  'Amore mio',
  'Ты моё счастье',
  'Be mine',
  'À jamais',
  '永遠に',
  'Моё сердце',
]

const HEART_PATH =
  'M50 91 C44 84 7 60 7 34 C7 17 27 7 43 18 C46 20 48 23 50 27 C52 23 54 20 57 18 C73 7 93 17 93 34 C93 60 56 84 50 91 Z'

// Распределяем отдельные фразы внутри сердца.
// Текст не обрезается рамкой.
function createHeartWords() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const path = new Path2D(HEART_PATH)

  if (!ctx) return []

  const words = []

  const colors = [
  '#760924',
  '#850b2b',
  '#941033',
  '#7d0926',
  '#a3153b',
]

  let id = 0
  let row = 0

  // Идём сверху вниз по сердцу.
  for (let y = 10; y <= 90; y += 3.2) {
    const ranges = []
    let start = null

    // Находим участки, которые действительно находятся
    // внутри контура сердца. Это учитывает выемку сверху.
    for (let x = 0; x <= 100; x += 0.5) {
      const inside = ctx.isPointInPath(path, x, y)

      if (inside && start === null) {
        start = x
      }

      if (!inside && start !== null) {
        ranges.push([start, x - 0.5])
        start = null
      }
    }

    if (start !== null) {
      ranges.push([start, 100])
    }

    // Раскладываем слова отдельными горизонтальными рядами.
    ranges.forEach(([left, right], rangeIndex) => {
      const step = 10.5
      const offset = row % 2 === 0 ? 0 : 1.5

      for (let x = left + 5 + offset; x <= right - 5; x += step) {
        const phrase = phrases[
          Math.floor(Math.random() * phrases.length)
        ]

        words.push({
          id: id++,
          text: phrase,
          x: x + (Math.random() - 0.5) * 1.2,
          y: y + (Math.random() - 0.5) * 0.45,
          size: 1.45 + Math.random() * 0.2,
          rotation: -2 + Math.random() * 4,
          opacity: 0.65 + Math.random() * 0.3,
          delay: row * 0.065 + rangeIndex * 0.08,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    })

    row++
  }

  return words
}

function LoveHeart() {
  const [words] = useState(() => createHeartWords())
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    // Сначала слова постепенно появляются,
    // а первый удар начинается через 1,2 секунды.
    const firstBeat = setTimeout(() => {
      setBeat(1)

      const interval = setInterval(() => {
        setBeat((previous) => previous + 1)
      }, 1800)

      intervalId = interval
    }, 1200)

    let intervalId

    return () => {
      clearTimeout(firstBeat)
      clearInterval(intervalId)
    }
  }, [])

  const visibleBeats = Array.from(
    { length: Math.min(beat, 2) },
    (_, i) => beat - Math.min(beat, 2) + 1 + i,
  )

  return (
    <main className="love-scene">
      <div className="ambient-glow" />

      <div className="particles" aria-hidden="true">
        {Array.from({ length: 32 }, (_, i) => (
          <span
            className="particle"
            key={i}
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              animationDelay: `${(i % 12) * -0.8}s`,
              animationDuration: `${9 + (i % 7) * 1.5}s`,
            }}
          />
        ))}
      </div>

      <div className="heart-stage">
        {/* Волны остаются настоящими контурами сердца */}
        {visibleBeats.flatMap((beatNumber) =>
          [0, 1, 2].map((waveNumber) => (
            <svg
              className={`heart-wave wave-${waveNumber}`}
              key={`${beatNumber}-${waveNumber}`}
              viewBox="0 0 100 100"
              aria-hidden="true"
              style={{
                animationDelay: `${waveNumber * 0.18}s`,
              }}
            >
              <path d={HEART_PATH} />
            </svg>
          )),
        )}

        {/* Каждое выражение — отдельный текстовый элемент */}
        <svg
          className={`heart-art ${beat > 0 ? 'is-beating' : ''}`}
          viewBox="0 0 100 100"
          role="img"
          aria-label="Сердце из слов о любви"
        >
          {words.map((word) => (
            <text
              key={word.id}
              className="heart-word"
              x={word.x}
              y={word.y}
              fontSize={word.size}
              fill={word.color}
              textAnchor="middle"
              dominantBaseline="middle"
              opacity="0"
              transform={`rotate(${word.rotation} ${word.x} ${word.y})`}
              style={{
                '--word-opacity': word.opacity,
                animationDelay: `${word.delay}s`,
              }}
            >
              {word.text}
            </text>
          ))}
        </svg>
      </div>
    </main>
  )
}

export default LoveHeart