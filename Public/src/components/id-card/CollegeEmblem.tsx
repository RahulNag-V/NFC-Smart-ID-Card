import React from 'react';
import btiLogo from '../../assets/bti-logo.jpeg';

interface CollegeEmblemProps {
  className?: string;
  size?: number;
  monochrome?: boolean;
}

export const CollegeEmblem: React.FC<CollegeEmblemProps> = ({
  className = '',
  size = 48,
  monochrome = false,
}) => {
  if (monochrome) {
    return (
      <div
        style={{ width: `${size}px`, height: `${size}px`, maxWidth: `${size}px`, maxHeight: `${size}px` }}
        className={`flex items-center justify-center pointer-events-none select-none overflow-hidden ${className}`}
      >
        <img
          src={btiLogo}
          alt="BTI Watermark"
          style={{ maxWidth: `${size}px`, maxHeight: `${size}px` }}
          className="w-full h-full object-contain filter grayscale invert opacity-20"
        />
      </div>
    );
  }

  return (
    <div
      style={{ height: `${size}px`, maxHeight: `${size}px` }}
      className={`rounded-md bg-white px-1 py-0.5 border border-[#d9cdbd] shadow-2xs flex items-center justify-center overflow-hidden shrink-0 select-none ${className}`}
    >
      <img
        src={btiLogo}
        alt="Bangalore Technological Institute"
        style={{ maxHeight: `${Math.max(12, size - 4)}px` }}
        className="h-full w-auto object-contain"
      />
    </div>
  );
};

