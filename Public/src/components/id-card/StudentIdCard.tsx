import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { StudentProfile } from '../../data/student';
import { StudentIdCardFront } from './StudentIdCardFront';
import { StudentIdCardBack } from './StudentIdCardBack';
import {
  RotateCw,
  Download,
  Printer,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

interface StudentIdCardProps {
  student: StudentProfile;
  isSensitiveVisible: boolean;
  onToggleSensitive: () => void;
}

export const StudentIdCard: React.FC<StudentIdCardProps> = ({
  student,
  isSensitiveVisible,
  onToggleSensitive,
}) => {
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [isDownloading, setIsDownloading] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  const toggleSide = () => {
    setActiveSide((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const handleDownload = async () => {
    const elementId = activeSide === 'front' ? 'student-id-card-front' : 'student-id-card-back';
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      setIsDownloading(true);
      const dataUrl = await toPng(element, {
        quality: 0.98,
        pixelRatio: 3, // Ultra-sharp 300DPI output
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `${student.fullName.replace(/\s+/g, '_')}_Student_ID_${activeSide.toUpperCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to download student ID card image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* CARD INTERACTIVE CONTROLS BAR */}
      <div className="w-full max-w-[540px] flex flex-wrap items-center justify-between gap-2.5 mb-4 px-1">
        {/* Front / Back Side Switcher */}
        <div className="inline-flex items-center p-1 rounded-xl bg-[#f0eae1] border border-[#d9cdbd] shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveSide('front')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all select-none cursor-pointer ${
              activeSide === 'front'
                ? 'bg-[#704a29] text-[#fffefb] shadow-xs'
                : 'text-[#73685c] hover:text-[#2b241e] hover:bg-[#fffefb]'
            }`}
          >
            Front View
          </button>
          <button
            type="button"
            onClick={() => setActiveSide('back')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all select-none cursor-pointer ${
              activeSide === 'back'
                ? 'bg-[#704a29] text-[#fffefb] shadow-xs'
                : 'text-[#73685c] hover:text-[#2b241e] hover:bg-[#fffefb]'
            }`}
          >
            Back View
          </button>
        </div>

        {/* Action Buttons: Flip, Download, Print, Privacy */}
        <div className="flex items-center gap-2">
          {/* Flip Button */}
          <button
            type="button"
            onClick={toggleSide}
            title="Flip ID Card"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fffefb] border border-[#d9cdbd] hover:border-[#704a29] text-xs font-medium text-[#2b241e] shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#704a29]" />
            <span className="hidden sm:inline">Flip</span>
          </button>

          {/* Privacy Toggle Button */}
          <button
            type="button"
            onClick={onToggleSensitive}
            title={isSensitiveVisible ? 'Mask Sensitive Information' : 'Reveal Sensitive Information'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium shadow-2xs transition-all cursor-pointer active:scale-95 ${
              isSensitiveVisible
                ? 'bg-[#bc473b]/10 text-[#bc473b] border-[#bc473b]/30 hover:bg-[#bc473b]/15'
                : 'bg-[#fffefb] text-[#2b241e] border-[#d9cdbd] hover:border-[#704a29]'
            }`}
          >
            {isSensitiveVisible ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mask Data</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Show Private</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fffefb] border border-[#d9cdbd] hover:border-[#704a29] text-xs font-medium text-[#2b241e] shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[#704a29]" />
            <span>{isDownloading ? 'Exporting...' : 'Download'}</span>
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-xs font-semibold text-[#fffefb] shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* 3D FLIP CARD PRESENTATION WRAPPER */}
      <div
        ref={cardContainerRef}
        className="w-full flex justify-center [perspective:1400px]"
      >
        <motion.div
          animate={{ rotateY: activeSide === 'back' ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Face */}
          <div
            className="w-full"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              zIndex: activeSide === 'front' ? 20 : 0,
            }}
          >
            <StudentIdCardFront student={student} />
          </div>

          {/* Back Face */}
          <div
            className="w-full absolute inset-0"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              zIndex: activeSide === 'back' ? 20 : 0,
            }}
          >
            <StudentIdCardBack
              student={student}
              isSensitiveVisible={isSensitiveVisible}
            />
          </div>
        </motion.div>
      </div>

      {/* Card Metadata / Subtitle helper */}
      <div className="w-full max-w-[540px] flex items-center justify-between text-[11px] text-[#73685c] mt-3 px-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Authentic ISO/IEC 7810 CR80 Format</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span>Cryptographically Sealed QR Credential</span>
        </div>
      </div>
    </div>
  );
};
