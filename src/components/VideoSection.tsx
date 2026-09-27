import { useEffect, useRef, useState } from 'react'
import { site } from '../data/site'
import { track } from '../lib/analytics'
import { Icon } from './Icons'

interface VideoClip {
  id: string
  title: string
  src: string
  duration: string
}

const clips: VideoClip[] = [
  {
    id: 'overview',
    title: 'Shop Floor & Works Overview',
    src: '/media/factory-tour.mp4',
    duration: '0:41',
  },
  {
    id: 'fabrication',
    title: 'Fabrication & Assembly',
    src: '/media/factory-tour-3.mp4',
    duration: '0:32',
  },
  {
    id: 'machining',
    title: 'Precision Machining',
    src: '/media/factory-tour-2.mp4',
    duration: '0:05',
  },
]

/**
 * Factory tour video.
 *
 * Automatically plays in muted loop mode when the visitor scrolls to this section,
 * and pauses when scrolled away to preserve performance.
 */
export function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [selectedClip, setSelectedClip] = useState<VideoClip>(clips[0])
  const [isMuted, setIsMuted] = useState(true)

  const { poster, title, available } = site.video

  // Autoplay video as soon as user scrolls to the section
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          if (videoRef.current) {
            videoRef.current.muted = isMuted
            videoRef.current.play().catch(() => {
              // If browser restricts unmuted playback, enforce muted autoplay
              if (videoRef.current) {
                videoRef.current.muted = true
                setIsMuted(true)
                videoRef.current.play().catch(() => {})
              }
            })
          }
        } else {
          videoRef.current?.pause()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [selectedClip.src, isMuted])

  const toggleSound = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted
      videoRef.current.muted = nextMuted
      setIsMuted(nextMuted)
      track('video_sound_toggle', { muted: nextMuted })
    }
  }

  const handleClipChange = (clip: VideoClip) => {
    setSelectedClip(clip)
    track('video_clip_select', { clip: clip.title })
  }

  return (
    <section className="section video" id="factory-tour" ref={sectionRef}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <p className="eyebrow">Inside the works</p>
          <h2>See how your job gets made</h2>
          <p>
            A walk through the Umbergaon shop floor — cutting, bending, welding, finishing
            and dispatch.
          </p>
        </div>

        {/* Sleek clip selector tabs */}
        {available && clips.length > 1 && (
          <div className="video__tabs reveal" role="tablist" aria-label="Video clips">
            {clips.map((clip) => {
              const active = clip.id === selectedClip.id
              return (
                <button
                  key={clip.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`video__tab ${active ? 'video__tab--active' : ''}`}
                  onClick={() => handleClipChange(clip)}
                >
                  <span className="video__tab-indicator" />
                  <span className="video__tab-title">{clip.title}</span>
                  <span className="video__tab-duration">{clip.duration}</span>
                </button>
              )
            })}
          </div>
        )}

        <div className="video__frame reveal reveal--scale">
          {available ? (
            <div className="video__wrapper">
              <video
                ref={videoRef}
                key={selectedClip.src}
                className="video__player"
                src={selectedClip.src}
                poster={poster}
                muted={isMuted}
                loop
                playsInline
                autoPlay
                preload="auto"
                title={`${title} - ${selectedClip.title}`}
              />

              {/* Live Tour Badge */}
              <div className="video__badge" aria-hidden="true">
                <span className="video__badge-dot" />
                <span>Shop Floor Tour • Umbergaon</span>
              </div>

              {/* Floating Mute / Unmute Control */}
              <button
                type="button"
                className="video__audio-btn"
                onClick={toggleSound}
                aria-label={isMuted ? 'Unmute video sound' : 'Mute video sound'}
              >
                <Icon name={isMuted ? 'volumeX' : 'volume'} />
                <span>{isMuted ? 'Unmute Sound' : 'Mute'}</span>
              </button>
            </div>
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
              <div className="video__pending">
                <Icon name="play" />
                <p>Factory tour video coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
