'use client';

import Image from 'next/image';
import { cn, getVibeGradient } from '@/lib/utils';

type RestaurantImageProps = {
  src: string | null;
  alt: string;
  seed: string;
  className?: string;
  priority?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  quality?: number;
  fallbackTextClassName?: string;
  fallbackClassName?: string;
};

export function RestaurantImage({
  src,
  alt,
  seed,
  className,
  priority = false,
  fetchPriority,
  sizes = '100vw',
  quality,
  fallbackTextClassName,
  fallbackClassName,
}: RestaurantImageProps) {
  if (!src) {
    const gradient = getVibeGradient(seed);
    return (
      <div
        className={cn(
          'relative h-full w-full overflow-hidden',
          gradient,
          className,
          fallbackClassName
        )}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.7)_1px,transparent_0)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span
            className={cn(
              'text-8xl font-black text-white mix-blend-overlay rotate-12',
              fallbackTextClassName
            )}
          >
            {seed?.[0] ?? '?'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn('object-cover', className)}
      sizes={sizes}
      priority={priority}
      fetchPriority={fetchPriority}
      quality={quality}
      referrerPolicy="no-referrer"
    />
  );
}
