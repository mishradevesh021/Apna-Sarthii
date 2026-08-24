import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export default function RatingStars({
  rating,
  reviewCount,
  size = 'sm',
  showNumber = true,
}: RatingStarsProps) {
  const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 20;

  return (
    <div className="inline-flex items-center gap-1">
      <Star
        size={iconSize}
        className="fill-amber-400 text-amber-400 inline-block"
      />
      {showNumber && (
        <span className="font-semibold text-slate-800 text-xs sm:text-sm">
          {rating.toFixed(1)}
        </span>
      )}
      {typeof reviewCount === 'number' && (
        <span className="text-slate-400 text-xs">({reviewCount})</span>
      )}
    </div>
  );
}
