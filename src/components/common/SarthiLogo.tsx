import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark' | 'navy';
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function SarthiLogo({ variant = 'navy', showTagline = false, size = 'md' }: LogoProps) {
  const isLight = variant === 'light';

  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', dot: 'w-1.5 h-1.5' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', dot: 'w-2 h-2' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', dot: 'w-2.5 h-2.5' },
  };

  const currentSize = sizeClasses[size];

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group select-none transition-transform active:scale-98">
      <div
        className={`relative flex items-center justify-center ${currentSize.icon} rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300`}
      >
        {/* Geometric Guide/Compass/Chariot Motif */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5/6 h-5/6 text-white"
        >
          {/* Outer Ring */}
          <circle cx="12" cy="12" r="9" opacity="0.4" />
          {/* Charioteer / Compass Navigation Star */}
          <path d="M12 3v18" />
          <path d="M3 12h18" />
          <polygon points="12,6 15,12 12,18 9,12" fill="white" stroke="none" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span
            className={`font-black tracking-tight ${currentSize.text} ${
              isLight ? 'text-white' : 'text-slate-900'
            }`}
          >
            SARTHI
          </span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 self-baseline mb-1"></span>
        </div>
        {showTagline && (
          <span
            className={`text-[10px] font-medium tracking-wide uppercase ${
              isLight ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Your Local Companion
          </span>
        )}
      </div>
    </Link>
  );
}
