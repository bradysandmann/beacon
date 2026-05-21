type Props = { className?: string; size?: number };

export function Logo({ className = "", size = 28 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-label="Beacon logo"
      role="img"
    >
      <defs>
        <linearGradient id="ls" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="55%" stopColor="#67E8F9" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="22" stroke="url(#ls)" strokeWidth="1.5" opacity="0.7" />
      <circle cx="32" cy="32" r="14" stroke="url(#ls)" strokeWidth="1.5" opacity="0.85" />
      <line x1="32" y1="2" x2="32" y2="10" stroke="#67E8F9" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32" y1="54" x2="32" y2="62" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="32" x2="10" y2="32" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="54" y1="32" x2="62" y2="32" stroke="#67E8F9" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="32" cy="32" r="4.5" fill="#fff" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Logo size={22} />
      <span className="font-sans font-semibold tracking-tighter text-[1.05rem] text-white">Beacon</span>
    </div>
  );
}
