import { useRef, useState } from 'react'
import { site } from '../data/site'
import { track } from '../lib/analytics'
import { useKenBurns } from '../lib/animate'
import { Icon } from './Icons'

/**
 * Factory tour video.
 *
 * The player stays behind a poster image until someone presses play, so the
 * video file is never downloaded by visitors who do not watch it. Until an MP4
 * exists at `site.video.src`, the section shows the poster with a short note
 * instead of a dead player — see README for how to drop the file in.
 */
export function VideoSection() {
  const scope = useRef<HTMLElement>(null)
  const [playing, setPlaying] = useState(false)
  useKenBurns(scope, '.video__poster img')

  const { src, poster, title, available } = site.video

  return (
    <section className="section video" id="factory-tour" ref={scope}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow">Inside the works</p>
          <h2>See how your job gets made</h2>
          <p>
            A walk through the Umbergaon shop floor — cutting, bending, welding, finishing
            and dispatch.
          </p>
        </div>

        <div className="video__frame reveal reveal--scale">
          {playing && available ? (
            <video
              className="video__player"
              src={src}
              poster={poster}
              controls
              autoPlay
              playsInline
              preload="metadata"
              title={title}
            />
          ) : (
            <div className="video__poster">
              <img
                src={poster}
                alt={`${site.name} works in Umbergaon`}
                width={1400}
                height={788}
                loading="lazy"
                decoding="async"
              />

              {available ? (
                <button
                  type="button"
                  className="video__play"
                  aria-label="Play the factory tour video"
                  onClick={() => {
                    setPlaying(true)
                    track('video_play', { title })
                  }}
                >
                  <Icon name="play" />
                </button>
              ) : (
                <div className="video__pending">
                  <Icon name="play" />
                  <p>Factory tour video coming soon</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
