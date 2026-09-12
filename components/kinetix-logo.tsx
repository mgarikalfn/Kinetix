interface KinetixLogoProps {
  className?: string;
  size?: number;
}

export const KinetixLogo = ({ className = "", size = 32 }: KinetixLogoProps) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="primaryGlow" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="innerGlow" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6366F1" floodOpacity="0.35" />
          </filter>
        </defs>
        <rect
          x="4"
          y="4"
          width="40"
          height="40"
          rx="12"
          fill="#121216"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />
        <path
          d="M14 16C14 14.8954 14.8954 14 16 14H24C29.5228 14 34 18.4772 34 24C34 29.5228 29.5228 34 24 34H16C14.8954 34 14 33.1046 14 32V16Z"
          fill="url(#primaryGlow)"
          opacity="0.2"
        />
        <path
          d="M17 18L31 30M31 18L17 30"
          stroke="url(#primaryGlow)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#softShadow)"
        />
        <circle cx="24" cy="24" r="4.5" fill="#09090B" stroke="#A855F7" strokeWidth="2" />
      </svg>
      <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent font-sans">
        Kinetix
      </span>
    </div>
  );
};
