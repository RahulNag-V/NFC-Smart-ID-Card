import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrCodeViewProps {
  value: string;
  size?: number;
  className?: string;
  darkColor?: string;
  lightColor?: string;
}

export const QrCodeView: React.FC<QrCodeViewProps> = ({
  value,
  size = 96,
  className = '',
  darkColor = '#221b16',
  lightColor = '#ffffff',
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size * 2, // High DPI
      margin: 1,
      color: {
        dark: darkColor,
        light: lightColor,
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [value, size, darkColor, lightColor]);

  if (!dataUrl) {
    return (
      <div
        className={`bg-white/80 animate-pulse rounded border border-[#d9cdbd] flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-[8px] font-mono text-[#73685c]">QR</span>
      </div>
    );
  }

  return (
    <div className={`p-1 bg-white rounded border border-[#d9cdbd] shadow-2xs ${className}`}>
      <img
        src={dataUrl}
        alt="Student ID Verification QR Code"
        width={size}
        height={size}
        className="block"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
};
