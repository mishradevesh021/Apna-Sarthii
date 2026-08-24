'use client';

import React from 'react';
import { Moon, Sparkles, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

interface EmergencyBannerProps {
  onEmergencyClick?: () => void;
}

export default function EmergencyBanner({ onEmergencyClick }: EmergencyBannerProps) {
  return (
    <div className="w-full">
      <Link
        href="/search?emergency=true"
        onClick={onEmergencyClick}
        className="group relative flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 p-4 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:from-amber-600 hover:to-orange-600 active:scale-[0.99]"
      >
        {/* Background decorative glow */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-xl group-hover:scale-125 transition-transform duration-500" />

        <div className="flex items-center gap-3.5 z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner text-amber-100 group-hover:rotate-6 transition-transform">
            <Moon size={24} className="fill-amber-200 text-amber-200" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                24×7 Services Available
              </h3>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            </div>
            <p className="text-xs text-amber-100 font-medium">
              Emergency plumbers, electricians & mechanics ready right now
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white/20 group-hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold transition">
          <span className="hidden xs:inline">Book Fast</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Link>
    </div>
  );
}
