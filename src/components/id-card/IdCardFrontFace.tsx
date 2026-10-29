import React from 'react';
import btiLogo from '../../assets/bti-logo.jpeg';
import defaultPhoto from '../../assets/student-photo.png';
import { BarcodeView } from './BarcodeView';
import { StudentProfile, defaultStudentData } from '../../data/student';
import { useSiteContent } from '../../context/SiteContentContext';
import { InlineEditPopover } from '../editor/InlineEditPopover';

interface IdCardFrontFaceProps {
  id?: string;
  className?: string;
  isHovered?: boolean;
  glarePos?: { x: number; y: number };
  isExport?: boolean;
  student?: StudentProfile;
}

export const IdCardFrontFace: React.FC<IdCardFrontFaceProps> = ({
  id = 'card-front',
  className = '',
  isHovered = false,
  glarePos,
  isExport = false,
  student: studentProp,
}) => {
  const { activeContent, updateStudent, isEditMode } = useSiteContent();
  const currentStudent = studentProp || activeContent.student || defaultStudentData;
  const theme = activeContent.theme;

  const student = {
    name: currentStudent.fullName,
    usn: currentStudent.usn,
    department: currentStudent.department,
    validity: currentStudent.academicYear,
    photoUrl: currentStudent.photoUrl || defaultPhoto,
  };

  const cardBorderColor = theme?.colors?.idCardBorder || '#8c7860';
  const cardBgColor = theme?.colors?.idCardBackground || '#ffffff';

  const cardBoxShadow = isExport
    ? '0 4px 12px rgba(35, 25, 18, 0.12), 0 0 0 1px rgba(112, 74, 41, 0.18)'
    : isHovered
    ? [
        'inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.95)',
        'inset 1.5px 0 1px 0 rgba(255, 255, 255, 0.7)',
        'inset -1px 0 1px 0 rgba(0, 0, 0, 0.08)',
        'inset 0 -1.5px 1px 0 rgba(0, 0, 0, 0.14)',
        '0 1px 0 0 #e8dfd2',
        '0 2px 0 0 #d9cdbd',
        '0 3px 0 0 #c8b9a4',
        '0 4px 1px 0 rgba(43, 36, 30, 0.18)',
        '0 12px 24px -4px rgba(43, 36, 30, 0.24)',
        '0 28px 56px -10px rgba(43, 36, 30, 0.28)',
        '0 44px 80px -16px rgba(112, 74, 41, 0.16)',
      ].join(', ')
    : [
        'inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.95)',
        'inset 1.5px 0 1px 0 rgba(255, 255, 255, 0.7)',
        'inset -1px 0 1px 0 rgba(0, 0, 0, 0.08)',
        'inset 0 -1.5px 1px 0 rgba(0, 0, 0, 0.12)',
        '0 1px 0 0 #e8dfd2',
        '0 2px 0 0 #d9cdbd',
        '0 3px 0 0 #c8b9a4',
        '0 3.5px 1px 0 rgba(43, 36, 30, 0.15)',
        '0 8px 18px -3px rgba(43, 36, 30, 0.2)',
        '0 22px 42px -8px rgba(43, 36, 30, 0.22)',
        '0 36px 64px -14px rgba(112, 74, 41, 0.12)',
      ].join(', ');

  return (
    <div
      id={id}
      className={`w-full h-full rounded-2xl text-[#1e1713] border-2 overflow-hidden flex flex-col justify-between relative select-none ${className}`}
      style={{
        backgroundColor: cardBgColor,
        borderColor: cardBorderColor,
        boxShadow: cardBoxShadow,
        transition: 'box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease',
      }}
    >
      {/* Realistic PVC Surface Reflection & Specular Lamination Sheen */}
      {!isExport && (
        <>
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl z-20 overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.08) 100%)',
              mixBlendMode: 'overlay',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl z-20 overflow-hidden transition-opacity duration-300"
            style={{
              opacity: isHovered ? 0.75 : 0.4,
              background: glarePos
                ? `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.12) 32%, rgba(255,255,255,0) 62%)`
                : 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0) 65%)',
              mixBlendMode: 'soft-light',
            }}
          />
        </>
      )}

      {/* Subtle Security Micro-Guilloche Texture */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#704a29_1px,transparent_1px)] [background-size:8px_8px]" />

      {/* Dynamic Security Wave Design (Multi-Layered Guilloche & Gradient Waves) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 340 540"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="frontWaveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e9bf8c" stopOpacity="0.32" />
            <stop offset="50%" stopColor="#c89658" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#8c5828" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="frontWaveGrad2" x1="100%" y1="10%" x2="0%" y2="90%">
            <stop offset="0%" stopColor="#d49445" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#b37839" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#fff8f0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="frontWaveGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#8c5828" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#c89658" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#e9bf8c" stopOpacity="0.10" />
          </linearGradient>
        </defs>

        <path
          d="M0,170 C90,135 150,225 240,185 C295,160 325,180 340,195 L340,335 C285,370 215,315 130,355 C65,385 20,360 0,340 Z"
          fill="url(#frontWaveGrad1)"
        />
        <path
          d="M0,375 C85,340 165,415 255,370 C295,350 325,365 340,375 L340,540 L0,540 Z"
          fill="url(#frontWaveGrad2)"
        />
        <path
          d="M0,120 C100,160 190,110 270,145 C305,160 330,150 340,140 L340,210 C290,190 210,230 120,190 C60,165 20,185 0,175 Z"
          fill="url(#frontWaveGrad3)"
        />

        <g stroke="#855b33" strokeWidth="1.1" fill="none" opacity="0.36">
          <path d="M-10,180 C60,140 130,230 210,185 C270,150 310,200 350,175" />
          <path d="M-10,192 C60,152 130,242 210,197 C270,162 310,212 350,187" />
          <path d="M-10,204 C60,164 130,254 210,209 C270,174 310,224 350,199" />
          <path d="M-10,216 C60,176 130,266 210,221 C270,186 310,236 350,211" />
          <path d="M-10,228 C60,188 130,278 210,233 C270,198 310,248 350,223" />
          <path d="M-10,240 C60,200 130,290 210,245 C270,210 310,260 350,235" />
        </g>

        <g stroke="#b8860b" strokeWidth="1" fill="none" opacity="0.32">
          <path d="M-10,385 C75,435 155,350 235,400 C285,430 325,385 350,410" />
          <path d="M-10,397 C75,447 155,362 235,412 C285,442 325,397 350,422" />
          <path d="M-10,409 C75,459 155,374 235,424 C285,454 325,409 350,434" />
          <path d="M-10,421 C75,471 155,386 235,436 C285,466 325,421 350,446" />
          <path d="M-10,433 C75,483 155,398 235,448 C285,478 325,433 350,458" />
        </g>

        <circle cx="80" cy="270" r="65" fill="none" stroke="#a67c52" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.25" />
        <circle cx="260" cy="330" r="75" fill="none" stroke="#a67c52" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.25" />
      </svg>

      {/* Outer Security Hairline Frame */}
      <div className="absolute inset-1.5 rounded-xl border border-[#d9cdbd]/60 pointer-events-none" />

      {/* 4 Precision Corner Registration Crop Marks */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#a67c52]/60 pointer-events-none" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#a67c52]/60 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#a67c52]/60 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#a67c52]/60 pointer-events-none" />

      {/* 1. TOP SECTION: Full-Width College Logo Header */}
      <div className="w-full relative flex flex-col items-center z-10 shrink-0 bg-white border-b-2 border-[#704a29]/60 shadow-2xs">
        <div className="w-10 h-2 rounded-full bg-[#1c1612] border border-black/20 my-1 shadow-inner" />
        <div className="w-full overflow-hidden">
          <img
            src={btiLogo}
            alt="Bangalore Technological Institute"
            className="w-full h-auto object-cover block"
          />
        </div>
      </div>

      {/* MIDDLE SECTION: Photo, Name, USN, Department */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 py-1 z-10 text-center">
        {/* 2. Student Photograph with Inline Edit option */}
        <div className="relative w-25 h-32 sm:w-27 sm:h-35 rounded-lg overflow-hidden border-2 border-[#704a29] ring-2 ring-[#d9cdbd]/80 bg-[#f8f5ee] shadow-sm shrink-0">
          <img
            src={student.photoUrl}
            alt={student.name}
            className="w-full h-full object-cover object-top"
          />
          {isEditMode && (
            <InlineEditPopover
              value={student.photoUrl}
              label="Student Photo"
              type="image"
              pencilPosition="top-right"
              onSave={(url) => updateStudent({ photoUrl: url })}
            />
          )}
        </div>

        {/* 3. Student Name */}
        <h2 className="text-[18px] sm:text-[19.5px] font-serif font-bold text-[#1e1713] tracking-tight mt-2 leading-tight whitespace-nowrap">
          <InlineEditPopover
            value={student.name}
            label="Student Full Name"
            onSave={(name) => updateStudent({ fullName: name })}
          >
            {student.name}
          </InlineEditPopover>
        </h2>

        {/* 4. USN */}
        <div className="mt-1 px-3 py-0.5 rounded-full bg-[#fbf8f3] border border-[#d9cdbd] shadow-2xs">
          <span className="text-[11.5px] sm:text-[12.5px] font-mono font-extrabold text-[#704a29] tracking-wider">
            <InlineEditPopover
              value={student.usn}
              label="Student USN"
              onSave={(usn) => updateStudent({ usn, studentId: usn })}
            >
              {student.usn}
            </InlineEditPopover>
          </span>
        </div>

        {/* 5. Department */}
        <p className="text-[10.5px] sm:text-[11px] font-sans font-semibold text-[#4a3f35] mt-1 px-1 max-w-[260px] leading-snug">
          <InlineEditPopover
            value={student.department}
            label="Department"
            onSave={(dept) => updateStudent({ department: dept, branch: dept })}
          >
            {student.department}
          </InlineEditPopover>
        </p>
      </div>

      {/* BOTTOM SECTION: Validity & Barcode */}
      <div className="relative pb-2.5 px-3.5 flex flex-col items-center text-center z-10 shrink-0">
        <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-mono text-[#73685c] mb-1">
          <span className="tracking-wide font-semibold text-[#8c4e34]">
            Valid:
          </span>
          <span className="font-bold text-[#1e1713]">
            <InlineEditPopover
              value={student.validity}
              label="Validity Duration"
              onSave={(validity) => updateStudent({ academicYear: validity })}
            >
              {student.validity}
            </InlineEditPopover>
          </span>
        </div>

        <div className="w-full max-w-[220px] px-2 py-0.5 rounded-lg bg-white border border-[#d9cdbd] shadow-2xs">
          <BarcodeView
            value={student.usn}
            height={26}
            className="w-full"
            showText={true}
            lightBg={true}
          />
        </div>
      </div>
    </div>
  );
};
