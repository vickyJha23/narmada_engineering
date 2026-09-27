// Inline, stroke-based icons so the site ships no icon-font or SVG-sprite request.
// Every icon draws on a 24×24 grid and inherits `currentColor`.

type IconProps = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

const icons = {
  panel: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M8 4v16M13 4v16M18 4v16" />
      <path d="M3 12h18" />
    </svg>
  ),
  cylinder: (p: IconProps) => (
    <svg {...base} {...p}>
      <ellipse cx="12" cy="6" rx="6" ry="2.6" />
      <path d="M6 6v12c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6V6" />
      <path d="M9 10.5h6" />
    </svg>
  ),
  trolley: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3 5h3l2.2 9.4A1.6 1.6 0 0 0 9.8 15.7H18" />
      <path d="M7 8h13l-1.4 5.2" />
      <circle cx="10" cy="19" r="1.6" />
      <circle cx="17.5" cy="19" r="1.6" />
    </svg>
  ),
  duct: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3 8h8l5-3v14l-5-3H3z" />
      <path d="M16 9.5h5M16 14.5h5" />
    </svg>
  ),
  fan: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 9.8c0-3 1-5.6 3.2-5.6 1.7 0 2.5 1.6 1.6 3.2-.8 1.4-2.6 2.2-4.8 2.4" />
      <path d="M14.2 12c3 0 5.6 1 5.6 3.2 0 1.7-1.6 2.5-3.2 1.6-1.4-.8-2.2-2.6-2.4-4.8" />
      <path d="M9.8 12c-3 0-5.6-1-5.6-3.2 0-1.7 1.6-2.5 3.2-1.6 1.4.8 2.2 2.6 2.4 4.8" />
      <path d="M12 14.2c0 3-1 5.6-3.2 5.6-1.7 0-2.5-1.6-1.6-3.2.8-1.4 2.6-2.2 4.8-2.4" />
    </svg>
  ),
  filter: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
      <path d="M3.5 9h17M3.5 15h17M9 3.5v17M15 3.5v17" />
    </svg>
  ),
  louver: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M6 8h12M6 12h12M6 16h12" />
    </svg>
  ),
  structure: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M4 20V5h16v15" />
      <path d="M4 12h16M4 5l16 7M20 5 4 12" />
    </svg>
  ),
  cabin: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3" y="6" width="18" height="13" rx="1.2" />
      <path d="M3 10h18" />
      <rect x="6.5" y="13" width="4" height="3.5" />
      <path d="M15 13h3.5" />
    </svg>
  ),
  hopper: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M3.5 5h17l-5.5 9v5h-6v-5z" />
      <path d="M3.5 5h17" />
    </svg>
  ),
  spray: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M9 8h6v12H9z" />
      <path d="M11 8V5h4" />
      <path d="M18 5h.01M20.5 7h.01M18 9.5h.01M20.5 11h.01" />
    </svg>
  ),
  blueprint: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3" y="4.5" width="18" height="15" rx="1.5" />
      <path d="M7 8.5h6M7 12h4M7 15.5h8" />
      <circle cx="16.5" cy="10" r="2" />
    </svg>
  ),
  people: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 6.2a3 3 0 0 1 0 5.6M17.5 14.4A5.5 5.5 0 0 1 20.5 19" />
    </svg>
  ),
  check: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="m4.5 12.5 4.5 4.5L19.5 6.5" />
    </svg>
  ),
  phone: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.7 2 2 0 0 1 5 3.5Z" />
    </svg>
  ),
  mail: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  ),
  pin: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  clock: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  ),
  whatsapp: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...p}>
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.53 3.75 1.46 5.31L2 22.2l5.2-1.62a9.8 9.8 0 0 0 4.84 1.27h.01c5.43 0 9.84-4.4 9.84-9.84S17.47 2 12.04 2Zm0 17.98h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.09.96.99-3-.2-.31a8.13 8.13 0 0 1-1.25-4.36c0-4.51 3.68-8.18 8.2-8.18 2.19 0 4.24.85 5.79 2.4a8.12 8.12 0 0 1 2.4 5.79c0 4.51-3.68 8.18-8.36 8.18Zm4.5-6.13c-.25-.12-1.46-.72-1.68-.8-.23-.09-.39-.13-.56.12s-.64.8-.79.97c-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05s.89 2.38 1.01 2.54c.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  ),
  facebook: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...p}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  ),
  instagram: (p: IconProps) => (
    <svg {...base} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...p}>
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4v11H3v-11Zm6.5 0h3.83v1.5h.05c.53-1 1.84-2.06 3.78-2.06 4.04 0 4.79 2.66 4.79 6.12v5.44h-4v-4.82c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.9h-4v-11Z" />
    </svg>
  ),
  play: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false" {...p}>
      <path d="M8.2 5.4a1 1 0 0 1 1.52-.85l8.1 5.09a1 1 0 0 1 0 1.69l-8.1 5.09A1 1 0 0 1 8.2 15.6Z" />
    </svg>
  ),
  arrow: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M5 12h13M13 6.5 18.5 12 13 17.5" />
    </svg>
  ),
  close: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  ),
  chevronLeft: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M14.5 5.5 8 12l6.5 6.5" />
    </svg>
  ),
  chevronRight: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M9.5 5.5 16 12l-6.5 6.5" />
    </svg>
  ),
  menu: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  ),
  target: (p: IconProps) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  eye: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  plus: (p: IconProps) => (
    <svg {...base} {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
} as const

export type IconName = keyof typeof icons

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const C = icons[name]
  return <C className={className} />
}
