import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { StudentProfile, defaultStudentData } from '../../data/student';
import { IdCardFrontFace } from './IdCardFrontFace';
import { IdCardBackFace } from './IdCardBackFace';
import { RotateCw, Download, Printer, LayoutGrid, Check, ShieldCheck } from 'lucide-react';
import { toPng } from 'html-to-image';

interface VerticalStudentIdCardProps {
  student?: StudentProfile;
}

export const VerticalStudentIdCard: React.FC<VerticalStudentIdCardProps> = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<'flip' | 'side-by-side'>('flip');
  const [isExporting, setIsExporting] = useState<'front' | 'back' | null>(null);

  // 3D Perspective Tilt & Hover State
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 2.5, y: -3.5 });
  const [glarePos, setGlarePos] = useState({ x: 35, y: 25 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const touchQuery = window.matchMedia('(hover: none) or (pointer: coarse)');
    setIsTouchDevice(touchQuery.matches);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    if (motionQuery.matches) {
      setTilt({ x: 0, y: 0 });
    }

    const handleTouchChange = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) setTilt({ x: 0, y: 0 });
    };

    touchQuery.addEventListener('change', handleTouchChange);
    motionQuery.addEventListener('change', handleMotionChange);

    // Passive Device Orientation (Gyroscope) support for mobile without intrusive permission prompts
    let lastGyroTime = 0;
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      const now = performance.now();
      if (now - lastGyroTime < 30) return; // ~30fps throttle for optimal battery & performance
      lastGyroTime = now;

      if (e.gamma === null || e.beta === null) return;
      if (prefersReducedMotion) return;

      // Gamma (left to right tilt, range -20 to +20)
      // Beta (front to back tilt, natural handheld pitch is ~45deg, range -20 to +20)
      const clampedGamma = Math.max(-20, Math.min(20, e.gamma));
      const clampedBeta = Math.max(-20, Math.min(20, e.beta - 45));

      const gyroTiltY = (clampedGamma / 20) * 4.5;
      const gyroTiltX = -(clampedBeta / 20) * 4.0;

      setTilt({ x: gyroTiltX, y: gyroTiltY });
      setGlarePos({
        x: Math.round(50 + (clampedGamma / 20) * 35),
        y: Math.round(50 + (clampedBeta / 20) * 35),
      });
    };

    try {
      if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', handleDeviceOrientation, true);
      }
    } catch {
      // Safe fallback if sensors unavailable
    }

    return () => {
      touchQuery.removeEventListener('change', handleTouchChange);
      motionQuery.removeEventListener('change', handleMotionChange);
      try {
        window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
      } catch { }
    };
  }, [prefersReducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || prefersReducedMotion || !cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const normX = Math.max(-1, Math.min(1, (x - centerX) / centerX));
    const normY = Math.max(-1, Math.min(1, (y - centerY) / centerY));

    // Restrained, elegant rotation (3 to 5 degrees)
    const maxTilt = 4.8;
    setTilt({
      x: -normY * maxTilt,
      y: normX * maxTilt,
    });
    setGlarePos({
      x: Math.round((x / rect.width) * 100),
      y: Math.round((y / rect.height) * 100),
    });
  };

  const handleMouseEnter = () => {
    if (isTouchDevice || prefersReducedMotion) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt(prefersReducedMotion ? { x: 0, y: 0 } : { x: 2.5, y: -3.5 });
    setGlarePos({ x: 35, y: 25 });
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleDownload = async (side: 'front' | 'back') => {
    const elementId = side === 'front' ? 'export-card-front' : 'export-card-back';
    const cleanName = defaultStudentData.fullName.replace(/[^a-zA-Z0-9]/g, '');
    const cleanUsn = defaultStudentData.usn.replace(/[^a-zA-Z0-9]/g, '');
    const filename = `${cleanName}_${cleanUsn}_ID_${side.toUpperCase()}.png`;
    const node = document.getElementById(elementId);
    if (!node) return;

    try {
      setIsExporting(side);
      const dataUrl = await toPng(node, {
        pixelRatio: 3, // 300 DPI print quality
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export ID card:', err);
    } finally {
      setIsExporting(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col items-center pb-24 sm:pb-28">
      {/* Top View Mode & Quick Flip Controls */}
      <div className="mb-3.5 flex flex-wrap items-center justify-center gap-2 print:hidden">
        <div className="flex items-center gap-1 p-1 rounded-full bg-[#f0eae1] border border-[#d9cdbd] text-xs font-medium shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('flip')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${viewMode === 'flip'
              ? 'bg-[#704a29] text-[#fffefb] font-bold shadow-xs'
              : 'text-[#73685c] hover:text-[#2b241e]'
              }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Interactive 3D Flip</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${viewMode === 'side-by-side'
              ? 'bg-[#704a29] text-[#fffefb] font-bold shadow-xs'
              : 'text-[#73685c] hover:text-[#2b241e]'
              }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Side-by-Side (Print Preview)</span>
          </button>
        </div>

        {viewMode === 'flip' && (
          <button
            type="button"
            onClick={handleFlip}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#fffefb] border border-[#d9cdbd] hover:border-[#704a29] text-xs font-bold text-[#704a29] shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
            title="Click to flip card"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'Flip to Front' : 'Flip to Back'}</span>
          </button>
        )}
      </div>

      {/* ================= VIEW MODE 1: 3D FLIPPABLE CARD ================= */}
      {viewMode === 'flip' && (
        <div className="w-full flex flex-col items-center print:hidden relative py-1">
          {/* Card & Flanking Page Watermarks Container */}
          <div className="relative w-full max-w-[255px] sm:max-w-[275px] flex items-center justify-center">
            {/* Left Vertical Page Watermark: CSE (Uncut edges, compact 58% of ID card height) */}
            <div
              className="absolute right-full top-1/2 -translate-y-1/2 h-[58%] flex items-center justify-center -mr-2 sm:-mr-3 md:-mr-3.5 pointer-events-none select-none z-0"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 170 360"
                className="h-full w-auto block overflow-visible"
                style={{ overflow: 'visible' }}
              >
                <text
                  x="85"
                  y="180"
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform="rotate(-90 85 180)"
                  fill="#855b33"
                  fillOpacity="0.45"
                  style={{
                    fontFamily:
                      '"Times New Roman", Times, "Tinos", Georgia, serif',
                    fontWeight: 900,
                    fontSize: '140px',
                    letterSpacing: '-4px',
                  }}
                >
                  CSE
                </text>
              </svg>
            </div>

            {/* 3D Flippable Card */}
            <div
              ref={cardContainerRef}
              onClick={handleFlip}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleFlip();
                }
              }}
              title="Click to flip ID card"
              className="w-full aspect-[1/1.58] relative [perspective:1400px] cursor-pointer select-none group focus:outline-none py-1"
            >
              {/* Ambient Floor Shadow (Responsive to perspective & lift) */}
              <motion.div
                animate={{
                  scaleX: isHovered ? 1.08 : 0.94,
                  scaleY: isHovered ? 1.15 : 0.9,
                  opacity: isHovered ? 0.7 : 0.42,
                  y: isHovered ? 26 : 16,
                  x: isHovered ? -tilt.y * 1.4 : -tilt.y * 0.7,
                  filter: isHovered ? 'blur(16px)' : 'blur(10px)',
                }}
                transition={{
                  duration: isHovered ? 0.18 : 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[84%] h-8 rounded-[50%] bg-[#22160e]/45 pointer-events-none -z-10"
              />

              <motion.div
                animate={{
                  rotateY: isFlipped ? 180 - tilt.y : tilt.y,
                  rotateX: isFlipped ? -tilt.x : tilt.x,
                  y: isHovered ? -8 : 0,
                  scale: isHovered ? 1.025 : 1,
                }}
                transition={{
                  duration: isHovered ? 0.15 : 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-full h-full relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* FRONT FACE */}
                <div
                  className="w-full h-full absolute inset-0"
                  style={{
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <IdCardFrontFace isHovered={isHovered} glarePos={glarePos} />
                </div>

                {/* BACK FACE */}
                <div
                  className="w-full h-full absolute inset-0"
                  style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                  }}
                >
                  <IdCardBackFace isHovered={isHovered} glarePos={glarePos} />
                </div>
              </motion.div>
            </div>

            {/* Right Vertical Page Watermark: STUDENT (Uncut edges, compact 58% of ID card height) */}
            <div
              className="absolute left-full top-1/2 -translate-y-1/2 h-[58%] flex items-center justify-center -ml-2 sm:-ml-3 md:-ml-3.5 pointer-events-none select-none z-0"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 130 360"
                className="h-full w-auto block overflow-visible"
                style={{ overflow: 'visible' }}
              >
                <g transform="translate(65, 180) rotate(-90) scale(1, 1.15)">
                  <text
                    x="0"
                    y="0"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#855b33"
                    fillOpacity="0.45"
                    style={{
                      fontFamily:
                        '"Times New Roman", Times, "Tinos", Georgia, serif',
                      fontWeight: 900,
                      fontSize: '64px',
                      letterSpacing: '-2px',
                    }}
                  >
                    STUDENT
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <span className="text-[11px] font-mono text-[#73685c] mt-2">
            &bull; Click card to flip 360&deg;
          </span>
        </div>
      )}

      {/* ================= VIEW MODE 2: SIDE-BY-SIDE (FRONT & BACK) ================= */}
      {viewMode === 'side-by-side' && (
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 py-2 print:hidden relative">
          {/* Left Vertical Watermark: CSE */}
          <div
            className="hidden lg:flex absolute right-[calc(100%-0.6rem)] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <svg viewBox="0 0 170 360" className="w-auto h-[250px] block overflow-visible" style={{ overflow: 'visible' }}>
              <text
                x="85"
                y="180"
                textAnchor="middle"
                dominantBaseline="central"
                transform="rotate(-90 85 180)"
                fill="#855b33"
                fillOpacity="0.45"
                style={{
                  fontFamily:
                    '"Times New Roman", Times, "Tinos", Georgia, serif',
                  fontWeight: 900,
                  fontSize: '140px',
                  letterSpacing: '-4px',
                }}
              >
                CSE
              </text>
            </svg>
          </div>

          {/* Front Side Block */}
          <div className="flex flex-col items-center w-full max-w-[255px] sm:max-w-[275px]">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#704a29]">
              <span className="w-2 h-2 rounded-full bg-[#704a29]" />
              Front Side (Student Identity)
            </div>
            <div className="w-full aspect-[1/1.58] transition-transform duration-300 hover:-translate-y-1.5 hover:scale-[1.015]">
              <IdCardFrontFace isHovered={false} />
            </div>
          </div>

          {/* Back Side Block */}
          <div className="flex flex-col items-center w-full max-w-[255px] sm:max-w-[275px]">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#704a29]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#704a29]" />
              Back Side (Official Record &amp; Address)
            </div>
            <div className="w-full aspect-[1/1.58] transition-transform duration-300 hover:-translate-y-1.5 hover:scale-[1.015]">
              <IdCardBackFace isHovered={false} />
            </div>
          </div>

          {/* Right Vertical Watermark: STUDENT */}
          <div
            className="hidden lg:flex absolute left-[calc(100%-0.6rem)] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <svg viewBox="0 0 130 360" className="w-auto h-[250px] block overflow-visible" style={{ overflow: 'visible' }}>
              <g transform="translate(65, 180) rotate(-90) scale(1, 1.15)">
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#855b33"
                  fillOpacity="0.45"
                  style={{
                    fontFamily:
                      '"Times New Roman", Times, "Tinos", Georgia, serif',
                    fontWeight: 900,
                    fontSize: '64px',
                    letterSpacing: '-2px',
                  }}
                >
                  STUDENT
                </text>
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* ================= PRINT / PDF LAYOUT (Visible during print) ================= */}
      <div className="hidden print:flex print:flex-row print:justify-center print:gap-8 print:w-full print:py-6">
        <div className="w-[54mm] h-[85.6mm] aspect-[1/1.58] page-break-inside-avoid">
          <IdCardFrontFace isExport={true} />
        </div>
        <div className="w-[54mm] h-[85.6mm] aspect-[1/1.58] page-break-inside-avoid">
          <IdCardBackFace isExport={true} />
        </div>
      </div>

      {/* Hidden high-res nodes for canvas PNG generation (Standard CR-80 ratio) */}
      <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none opacity-0">
        <div id="export-card-front" className="w-[340px] aspect-[1/1.58]">
          <IdCardFrontFace isExport={true} />
        </div>
        <div id="export-card-back" className="w-[340px] aspect-[1/1.58]">
          <IdCardBackFace isExport={true} />
        </div>
      </div>

      {/* Export & Print Action Bar */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2 print:hidden max-w-md mx-auto">
        <button
          type="button"
          onClick={() => handleDownload('front')}
          disabled={isExporting !== null}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fffefb] hover:bg-[#f0eae1] text-[#2b241e] border border-[#d9cdbd] text-[11px] font-semibold shadow-2xs transition active:scale-95 cursor-pointer disabled:opacity-50"
          title="Download 300 DPI high-resolution PNG of Front Side"
        >
          {isExporting === 'front' ? (
            <Check className="w-3.5 h-3.5 text-[#10B981]" />
          ) : (
            <Download className="w-3.5 h-3.5 text-[#704a29]" />
          )}
          <span>Download Front (PNG)</span>
        </button>

        <button
          type="button"
          onClick={() => handleDownload('back')}
          disabled={isExporting !== null}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fffefb] hover:bg-[#f0eae1] text-[#2b241e] border border-[#d9cdbd] text-[11px] font-semibold shadow-2xs transition active:scale-95 cursor-pointer disabled:opacity-50"
          title="Download 300 DPI high-resolution PNG of Back Side"
        >
          {isExporting === 'back' ? (
            <Check className="w-3.5 h-3.5 text-[#10B981]" />
          ) : (
            <Download className="w-3.5 h-3.5 text-[#704a29]" />
          )}
          <span>Download Back (PNG)</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#704a29] hover:bg-[#593a1f] text-[#fffefb] text-[11px] font-semibold shadow-2xs transition active:scale-95 cursor-pointer"
          title="Print or Save as PDF"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save as PDF</span>
        </button>
      </div>
    </div>
  );
};

