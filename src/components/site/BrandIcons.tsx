/* Minimal monochrome social glyphs (lucide-react does not ship brand marks). */
type P = { className?: string };

export function InstagramIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.6 3c.3 2.2 1.6 3.7 3.9 3.9v3.1c-1.4.1-2.7-.3-3.9-1v6.3c0 3.6-2.7 5.7-5.7 5.7-3.2 0-5.6-2.6-5.4-5.8.2-2.9 2.8-5.2 5.9-4.9v3.2c-.4-.1-.8-.2-1.2-.1-1.3.1-2.3 1.2-2.2 2.5.1 1.3 1.2 2.3 2.5 2.2 1.3 0 2.2-1 2.2-2.4V3h3.9Z" />
    </svg>
  );
}

/** Four-point sparkle — the brand's glint motif. */
export function Sparkle({ className, style }: P & { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d="M12 0c.6 5.6 2.2 8.8 12 12-9.8 3.2-11.4 6.4-12 12-.6-5.6-2.2-8.8-12-12C9.8 8.8 11.4 5.6 12 0Z" fill="currentColor" />
    </svg>
  );
}

/** Small crown mark drawn as line art, echoes her Crown Care logo. */
export function CrownMark({ className }: P) {
  return (
    <svg viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M6 32 3 10l15 11L32 4l14 17 15-11-3 22Z" />
      <path d="M8 36h48" />
      <circle cx="3" cy="9" r="2" />
      <circle cx="32" cy="3" r="2" />
      <circle cx="61" cy="9" r="2" />
    </svg>
  );
}
