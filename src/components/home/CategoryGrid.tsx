'use client';

import React from 'react';
import {
  Wrench,
  Zap,
  Hammer,
  Layers,
  Paintbrush,
  AirVent,
  Tv,
  Sparkles,
  Droplets,
  ShieldCheck,
  Compass,
  Shield,
  LucideIcon,
} from 'lucide-react';
import { ServiceCategoryDTO } from '@/lib/types';

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  Zap,
  Hammer,
  Layers,
  Paintbrush,
  AirVent,
  Tv,
  Sparkles,
  Droplets,
  ShieldCheck,
  Compass,
  Shield,
};

const badgeColorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  teal: { bg: 'bg-teal-50/70', text: 'text-teal-700', iconBg: 'bg-teal-600' },
  blue: { bg: 'bg-blue-50/70', text: 'text-blue-700', iconBg: 'bg-blue-600' },
  brick: { bg: 'bg-orange-50/70', text: 'text-amber-800', iconBg: 'bg-amber-800' },
  purple: { bg: 'bg-purple-50/70', text: 'text-purple-700', iconBg: 'bg-purple-600' },
  rose: { bg: 'bg-rose-50/70', text: 'text-rose-700', iconBg: 'bg-rose-600' },
  green: { bg: 'bg-emerald-50/70', text: 'text-emerald-700', iconBg: 'bg-emerald-600' },
  amber: { bg: 'bg-amber-50/70', text: 'text-amber-700', iconBg: 'bg-amber-600' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-700', iconBg: 'bg-slate-700' },
};

interface CategoryGridProps {
  categories: ServiceCategoryDTO[];
  selectedSlug?: string | null;
  onSelectCategory: (slug: string) => void;
}

export default function CategoryGrid({
  categories,
  selectedSlug,
  onSelectCategory,
}: CategoryGridProps) {
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
        {categories.map((cat) => {
          const Icon = iconMap[cat.iconName] || Wrench;
          const colors = badgeColorMap[cat.colorScheme] || badgeColorMap.teal;
          const isSelected = selectedSlug === cat.slug;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl transition-all duration-200 text-center ${
                isSelected
                  ? 'bg-blue-50/90 border-2 border-blue-600 shadow-md scale-102'
                  : 'bg-white hover:bg-slate-50/80 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {/* Subtle top indicator pin dot (matching screenshot) */}
              <div className="w-2 h-2 rounded-full border border-slate-300 bg-slate-100 mb-2 group-hover:border-blue-400 transition" />

              {/* Icon Container with solid square background (matches screenshot) */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105 ${colors.iconBg}`}
              >
                <Icon size={22} strokeWidth={2.2} />
              </div>

              {/* Category Name */}
              <span className="mt-2.5 font-bold text-xs sm:text-sm text-slate-800 line-clamp-1">
                {cat.name}
              </span>

              {/* Nearby Count */}
              <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                {cat.activeWorkersCount} nearby
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
