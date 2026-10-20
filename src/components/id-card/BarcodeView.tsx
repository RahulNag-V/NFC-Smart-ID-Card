import React from 'react';

interface BarcodeViewProps {
  value: string;
  height?: number;
  className?: string;
  showText?: boolean;
  lightBg?: boolean;
}

// Generate Code 128 style rhythmic bar patterns for the string
export const BarcodeView: React.FC<BarcodeViewProps> = ({
  value,
  height = 36,
  className = '',
  showText = true,
  lightBg = true,
}) => {
  // Deterministic bar widths pattern based on ASCII character values
  const generateBars = (text: string) => {
    const bars: { width: number; isSpace: boolean }[] = [];
    
    // Start guard pattern (thin bar, space, thin bar)
    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 1, isSpace: true });
    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 2, isSpace: true });

    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      const b1 = (code % 3) + 1;
      const s1 = ((code >> 1) % 2) + 1;
      const b2 = ((code >> 2) % 3) + 1;
      const s2 = ((code >> 3) % 2) + 1;
      const b3 = ((code >> 4) % 2) + 1;
      const s3 = 1;

      bars.push({ width: b1, isSpace: false });
      bars.push({ width: s1, isSpace: true });
      bars.push({ width: b2, isSpace: false });
      bars.push({ width: s2, isSpace: true });
      bars.push({ width: b3, isSpace: false });
      bars.push({ width: s3, isSpace: true });
    }

    // Stop guard pattern
    bars.push({ width: 2, isSpace: false });
    bars.push({ width: 1, isSpace: true });
    bars.push({ width: 3, isSpace: false });
    bars.push({ width: 2, isSpace: true });
    bars.push({ width: 1, isSpace: false });

    return bars;
  };

  const bars = generateBars(value);
  const totalWidth = bars.reduce((acc, b) => acc + b.width, 0);

  let currentX = 0;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="none"
        style={{ maxHeight: `${height}px` }}
      >
        {bars.map((bar, index) => {
          const x = currentX;
          currentX += bar.width;
          if (bar.isSpace) return null;
          return (
            <rect
              key={index}
              x={x}
              y={0}
              width={bar.width}
              height={height}
              fill={lightBg ? '#221b16' : '#ffffff'}
            />
          );
        })}
      </svg>
      {showText && (
        <span
          className={`font-mono tracking-widest text-[9px] font-bold mt-1 ${
            lightBg ? 'text-[#2b241e]' : 'text-white/80'
          }`}
        >
          *{value}*
        </span>
      )}
    </div>
  );
};
