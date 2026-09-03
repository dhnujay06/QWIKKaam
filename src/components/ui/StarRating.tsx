import React from 'react';
import { cn } from '@/lib/utils';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export function StarRating({ rating, size = 'md', showNumber = true }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center text-amber-500">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={cn(sizeClasses[size], 'fill-current')} />
        ))}
        {hasHalfStar && <StarHalf className={cn(sizeClasses[size], 'fill-current')} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={cn(sizeClasses[size], 'text-slate-300')} />
        ))}
      </div>
      {showNumber && (
        <span className={cn('font-medium text-slate-700 ml-1', textClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
