import React, { useState } from 'react';
import { Smartphone, Laptop, Headphones } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ProductImageProps {
  src: string;
  alt: string;
  categoryGroup?: string;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  categoryGroup = 'iphones',
  className,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    const Icon =
      categoryGroup === 'laptops'
        ? Laptop
        : categoryGroup === 'accessories'
        ? Headphones
        : Smartphone;

    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 p-4 text-center',
          className
        )}
      >
        <Icon className="h-10 w-10 text-[#001B5E]/40 mb-2" />
        <span className="text-xs font-medium text-slate-600 line-clamp-2 max-w-[180px]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  );
};
