'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, CheckCircle2, Clock, Zap, ArrowRight } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import { formatINR, formatDistance } from '@/lib/utils';
import { WorkerCardDTO } from '@/lib/types';

interface WorkerCardProps {
  worker: WorkerCardDTO;
  onRequestClick: (worker: WorkerCardDTO) => void;
  compact?: boolean;
}

export default function WorkerCard({ worker, onRequestClick, compact = false }: WorkerCardProps) {
  const initials = worker.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Avatar background colors based on initials
  const avatarColors = [
    'from-teal-600 to-emerald-700',
    'from-blue-600 to-indigo-700',
    'from-amber-600 to-orange-700',
    'from-purple-600 to-pink-700',
    'from-rose-600 to-red-700',
  ];
  const colorIndex = (worker.name.charCodeAt(0) + worker.name.length) % avatarColors.length;
  const avatarBg = avatarColors[colorIndex];

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-white p-4 border border-slate-200/80 shadow-xs hover:shadow-premium hover:border-blue-300 transition-all duration-300">
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Initials Avatar Badge (matches screenshot) */}
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${avatarBg} text-white font-extrabold text-sm flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform`}
            >
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  {worker.name}
                </h3>
                {worker.isVerified && (
                  <span
                    title="Verified Professional"
                    className="inline-flex items-center text-blue-600 text-xs font-semibold"
                  >
                    <CheckCircle2 size={15} className="fill-blue-50 text-blue-600" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                <span className="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                  {worker.categoryName}
                </span>
                <span>•</span>
                <span>{worker.experienceYears} yrs exp</span>
              </div>
            </div>
          </div>

          {/* Pricing Tag */}
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Starts at</div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900">
              {formatINR(worker.startingPrice)}
            </div>
          </div>
        </div>

        {/* Rating & Distance Meta */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
          <RatingStars rating={worker.rating} reviewCount={worker.reviewCount} />

          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <MapPin size={13} className="text-red-500" />
            <span>{worker.locality}</span>
            {typeof worker.distanceKm === 'number' && (
              <span className="text-slate-400">({formatDistance(worker.distanceKm)})</span>
            )}
          </div>
        </div>

        {/* Availability Status & Badges */}
        <div className="flex items-center justify-between mt-2.5 flex-wrap gap-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            {worker.isAvailable ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available Today
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                <Clock size={11} /> Busy Now
              </span>
            )}

            {worker.emergency24x7 && (
              <span className="inline-flex items-center gap-0.5 text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full font-semibold border border-amber-200/60">
                <Zap size={10} className="fill-amber-500 text-amber-500" /> 24×7
              </span>
            )}
          </div>

          <span className="text-slate-400 font-medium">{worker.completedJobs} jobs done</span>
        </div>

        {/* Smart Match Recommendation Tag (if present) */}
        {worker.matchReasons && worker.matchReasons.length > 0 && (
          <div className="mt-2.5 bg-slate-50 rounded-xl p-2 border border-slate-100 text-[11px] text-slate-600 flex flex-wrap gap-1.5 items-center">
            <span className="font-bold text-blue-700">Recommended:</span>
            {worker.matchReasons.map((reason, idx) => (
              <span key={idx} className="bg-white px-1.5 py-0.5 rounded border border-slate-200/70 text-slate-700">
                ✓ {reason}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-4 pt-2">
        <Link
          href={`/workers/${worker.userId || worker.id}`}
          className="flex-1 text-center py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition active:scale-98"
        >
          View Profile
        </Link>
        <button
          onClick={() => onRequestClick(worker)}
          className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition active:scale-98 flex items-center justify-center gap-1"
        >
          <span>Request</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
