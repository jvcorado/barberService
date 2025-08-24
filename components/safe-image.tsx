import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface SafeImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackText?: string;
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  className = "",
  fallbackText,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            {fallbackText || alt || "Imagem não disponível"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        unoptimized={
          src.includes("storage.googleapis.com") || src.includes("utfs.io")
        }
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
        </div>
      )}
    </div>
  );
}
