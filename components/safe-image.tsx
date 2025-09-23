"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SafeImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
  placeholder?: React.ReactNode;
}

export default function SafeImage({
  src,
  alt,
  className,
  fallbackIcon,
  placeholder,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Se não há src ou houve erro, mostrar placeholder
  if (!src || hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-white/10",
          className,
        )}
      >
        {placeholder || fallbackIcon || (
          <svg
            className="w-8 h-8 text-white/50"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/10">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white/60 rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn("w-full h-full object-cover", isLoading && "opacity-0")}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
