import { motion } from 'motion/react'
import './MemoriesSection.css'

// Фото хранятся локально в src/assets/photos/ и называются 1.jpg, 2.jpg и т. д.
// Vite включает найденные файлы в сборку автоматически.
const photoFiles = import.meta.glob(
  './assets/photos/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
)

const captions = [
  {
    title: 'Твой взгляд',
    description: 'В котором хочется остаться.',
  },
  {
    title: 'Наши моменты',
    description: 'Маленькие мгновения, которые значат всё.',
  },
  {
    title: 'Твоё тепло',
    description: 'Место, где мне спокойно.',
  },
  {
    title: 'И снова ты',
    description: 'Ты — моя любимая история.',
  },
]

function getNumber(path) {
  const filename = path.split('/').pop() ?? ''
  const match = filename.match(/^(\d+)\.(?:jpe?g|png|webp)$/i)
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
}

const photos = Object.entries(photoFiles)
  // Показываем только файлы с именами вроде 1.jpg, 2.jpg, 10.jpg.
  .filter(([path]) => getNumber(path) !== Number.MAX_SAFE_INTEGER)
  // Сортировка именно по числам: 2.jpg будет перед 10.jpg.
  .sort(([pathA], [pathB]) => getNumber(pathA) - getNumber(pathB))
  .map(([path, src], index) => ({
    src,
    title: captions[index]?.title ?? `Наш момент ${index + 1}`,
    description:
      captions[index]?.description ?? 'Ещё одно воспоминание, которое хочется сохранить.',
    number: index + 1,
    path,
  }))

// Лепестки летят справа налево.
const petals = Array.from({ length: 34 }, (_, i) => ({
  id: i,
  top: `${(i * 29 + 7) % 94}%`,
  delay: `${-((i * 2.7) % 24)}s`,
  duration: `${15 + (i % 9) * 2}s`,
  size: `${8 + (i % 4) * 3}px`,
  drift: `${-25 + (i % 6) * 10}px`,
  opacity: 0.25 + (i % 5) * 0.1,
  rotate: `${(i * 47) % 360}deg`,
}))

// Полупрозрачные потоки воздуха.
const winds = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  top: `${12 + ((i * 23) % 78)}%`,
  delay: `${-i * 2.8}s`,
  duration: `${7 + (i % 4) * 2}s`,
  width: `${140 + (i % 4) * 75}px`,
  drift: `${-35 + (i % 5) * 17}px`,
}))

function MemoriesSection() {
  return (
    <section className="memories-section" id="memories">
      {/* Свет в глубине фона */}
      <div className="memories-glow" aria-hidden="true" />

      {/* Лепестки */}
      <div className="petal-layer" aria-hidden="true">
        {petals.map((petal) => (
          <span
            key={petal.id}
            className="flying-petal"
            style={{
              '--top': petal.top,
              '--delay': petal.delay,
              '--duration': petal.duration,
              '--size': petal.size,
              '--drift': petal.drift,
              '--opacity': petal.opacity,
              '--rotation': petal.rotate,
            }}
          />
        ))}
      </div>

      {/* Ветер проходит позади фотографий */}
      <div className="wind-layer" aria-hidden="true">
        {winds.map((wind) => (
          <span
            key={wind.id}
            className="wind-stream"
            style={{
              '--top': wind.top,
              '--delay': wind.delay,
              '--duration': wind.duration,
              '--width': wind.width,
              '--drift': wind.drift,
            }}
          />
        ))}
      </div>

      <div className="memories-content">
        <motion.div
          className="memories-heading"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="memories-eyebrow">МОЯ ЛЮБИМАЯ ИСТОРИЯ</span>

          <h2>
            Моменты,
            <br />
            которые хочется сохранить
          </h2>

          <p>
            Среди всех воспоминаний есть те,
            <br className="desktop-break" />
            к которым сердце возвращается снова.
          </p>

          <div className="heading-divider">
            <span />
            <span className="divider-heart">♥</span>
            <span />
          </div>
        </motion.div>

        {photos.length > 0 ? (
          <div className="photo-gallery">
            {photos.map((photo, index) => (
              <motion.article
                className={`memory-card memory-card-${(index % 4) + 1}`}
                key={photo.path}
                initial={{ opacity: 0, y: 65, filter: 'blur(9px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{
                  duration: 1.05,
                  delay: (index % 2) * 0.16,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -7, transition: { duration: 0.35 } }}
              >
                <div className="memory-image-wrap">
                  <img
                    className="memory-image"
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                  />
                  <div className="memory-image-shade" />

                  <span className="memory-number">
                    {String(photo.number).padStart(2, '0')}
                  </span>

                  <span className="memory-image-heart">♥</span>
                </div>

                <div className="memory-caption">
                  <h3>{photo.title}</h3>
                  <p>{photo.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <p className="memories-ending">
            Добавь фотографии в папку src/assets/photos — например, 1.jpg, 2.jpg, 3.jpg…
          </p>
        )}

        <motion.p
          className="memories-ending"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 1.5 }}
        >
          И это только начало…
        </motion.p>
      </div>
    </section>
  )
}

export default MemoriesSection
