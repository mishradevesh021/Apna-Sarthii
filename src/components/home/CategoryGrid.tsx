'use client';

import React from 'react';
import {
  Wrench,
  Zap,
  Plug,
  Hammer,
  Layers,
  Paintbrush,
  Palette,
  AirVent,
  Snowflake,
  Tv,
  Sparkles,
  Droplets,
  ShieldCheck,
  Compass,
  Flame,
  Shield,
  Camera,
} from 'lucide-react';
import { ServiceCategoryDTO } from '@/lib/types';
import { defaultCategories } from '@/lib/categories-data';

// Helper to render customized, high-fidelity trade icons
function renderTradeIcon(iconName: string, size = 24) {
  switch (iconName?.toLowerCase()) {
    case 'wrench':
    case 'plumber':
      return <Wrench size={size} strokeWidth={2.2} />;
    case 'plug':
    case 'zap':
    case 'electrician':
      return <Plug size={size} strokeWidth={2.2} />;
    case 'brickwall':
    case 'brick':
    case 'mason':
      // Custom Brick Wall SVG for perfect match to screenshot
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18" />
          <path d="M3 15h18" />
          <path d="M9 3v6" />
          <path d="M15 9v6" />
          <path d="M9 15v6" />
        </svg>
      );
    case 'saw':
    case 'carpenter':
    case 'layers':
      // Custom Hand Saw SVG for perfect match to screenshot
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m20 5-8.5 8.5a2.12 2.12 0 1 1-3-3L17 2l3 3Z" />
          <path d="m7 15-4 4a2 2 0 0 0 0 2.83l.17.17a2 2 0 0 0 2.83 0l4-4" />
          <path d="m11 11-4 4" />
        </svg>
      );
    case 'palette':
    case 'painter':
    case 'paintbrush':
      return <Palette size={size} strokeWidth={2.2} />;
    case 'airvent':
    case 'ac':
    case 'snowflake':
      return <AirVent size={size} strokeWidth={2.2} />;
    case 'tv':
    case 'appliance':
      return <Tv size={size} strokeWidth={2.2} />;
    case 'sparkles':
    case 'cleaning':
    case 'cleaner':
      return <Sparkles size={size} strokeWidth={2.2} />;
    case 'droplets':
    case 'ro':
      return <Droplets size={size} strokeWidth={2.2} />;
    case 'camera':
    case 'cctv':
    case 'shieldcheck':
      return <Camera size={size} strokeWidth={2.2} />;
    case 'compass':
    case 'mechanic':
      return <Compass size={size} strokeWidth={2.2} />;
    case 'flame':
    case 'welder':
      return <Flame size={size} strokeWidth={2.2} />;
    default:
      return <Wrench size={size} strokeWidth={2.2} />;
  }
}

// Background Colors for Icon Containers matching the uploaded screenshot colors
const colorBgMap: Record<string, string> = {
  teal: 'bg-[#167e7c] text-white',      // Plumber Teal
  blue: 'bg-[#1d4ed8] text-white',      // Electrician Electric Blue
  brick: 'bg-[#a34336] text-white',     // Mason Terracotta Brick
  purple: 'bg-[#6d28d9] text-white',    // Carpenter Purple
  rose: 'bg-[#be185d] text-white',      // Painter Magenta Pink
  sky: 'bg-[#0284c7] text-white',       // AC Sky Blue
  indigo: 'bg-[#4338ca] text-white',    // Appliance Indigo
  green: 'bg-[#059669] text-white',     // Cleaner Emerald Green
  cyan: 'bg-[#0891b2] text-white',      // RO Cyan
  slate: 'bg-[#334155] text-white',     // CCTV Dark Slate
  amber: 'bg-[#d97706] text-white',     // Mechanic Amber
};

interface CategoryGridProps {
  categories?: ServiceCategoryDTO[];
  selectedSlug?: string | null;
  onSelectCategory: (slug: string) => void;
}

export default function CategoryGrid({
  categories,
  selectedSlug,
  onSelectCategory,
}: CategoryGridProps) {
  // Use provided categories or fallback to default categories
  const displayList = categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-700 uppercase">
          SERVICES YOU NEED
        </h2>
        {selectedSlug && (
          <button
            onClick={() => onSelectCategory('all')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800"
          >
            Show All
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {displayList.map((cat) => {
          const isSelected = selectedSlug === cat.slug;
          const iconBg = colorBgMap[cat.colorScheme] || colorBgMap.teal;

          return (
            <button
              key={cat.id || cat.slug}
              onClick={() => onSelectCategory(cat.slug)}
              className={`group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl transition-all duration-200 text-center ${
                isSelected
                  ? 'bg-blue-50/90 border-2 border-blue-600 shadow-md scale-102'
                  : 'bg-white hover:bg-slate-50/90 border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {/* Subtle top indicator pin dot (matching screenshot) */}
              <div className="w-2 h-2 rounded-full border border-slate-300 bg-slate-100 mb-2 group-hover:border-blue-400 transition" />

              {/* Icon Container with solid square background (matches screenshot) */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105 ${iconBg}`}
              >
                {renderTradeIcon(cat.iconName || cat.slug, 22)}
              </div>

              {/* Category Name */}
              <span className="mt-2.5 font-bold text-xs sm:text-sm text-slate-800 line-clamp-1">
                {cat.name}
              </span>

              {/* Nearby Count */}
              <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                {cat.activeWorkersCount || 2} nearby
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
