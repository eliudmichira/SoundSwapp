import React from 'react';

interface SoundSwappLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const SoundSwappLogo: React.FC<SoundSwappLogoProps> = ({ width = 36, height = 36, className }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 36 36"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="soundswapp-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--brand-primary)" />
        <stop offset="35%" stopColor="var(--brand-accent-pink)" />
        <stop offset="100%" stopColor="var(--brand-secondary)" />
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.8" result="blur" />
        <feOffset dy="1" result="offsetBlur" />
        <feMerge>
          <feMergeNode in="offsetBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <pattern id="bg-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
        <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <circle cx="18" cy="18" r="18" fill="url(#soundswapp-grad)" opacity="0.9" />
    <circle cx="18" cy="18" r="18" fill="url(#bg-pattern)" opacity="0.5"/>
    <g filter="url(#glow)" transform="translate(0.5, 0.5)">
      <path
        d="M12.5 23.5 C10 23.5 8.5 21.5 9 19 C9.5 16.5 12.5 15.5 15 15.5 C17.5 15.5 19.5 14 19 11.5 C18.5 9 16.5 7.5 14 7.5"
        stroke="white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M12.8 23 C10.5 23 9.3 21.3 9.7 19.2 C10.1 17.1 12.8 16.1 15 16.1 C17.2 16.1 18.8 14.7 18.4 12.5 C18.0 10.3 16.2 8.5 14 8.5"
        stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M23.5 23.5 C26 23.5 27.5 21.5 27 19 C26.5 16.5 23.5 15.5 21 15.5 C18.5 15.5 16.5 14 17 11.5 C17.5 9 19.5 7.5 22 7.5"
        stroke="white" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M23.2 23 C25.5 23 26.7 21.3 26.3 19.2 C25.9 17.1 23.2 16.1 21 16.1 C18.8 16.1 17.2 14.7 17.6 12.5 C18.0 10.3 19.8 8.5 22 8.5"
        stroke="rgba(255,255,255,0.5)" fill="none" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default SoundSwappLogo; 