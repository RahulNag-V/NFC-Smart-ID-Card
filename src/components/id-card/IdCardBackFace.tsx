import React from 'react';
import { Phone, Mail, MapPin, Calendar, Droplets, Building2, ShieldCheck } from 'lucide-react';
import { defaultStudentData } from '../../data/student';

interface IdCardBackFaceProps {
  id?: string;
  className?: string;
  isHovered?: boolean;
  glarePos?: { x: number; y: number };
  isExport?: boolean;
}

const formatDob = (dobStr: string) => {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dobStr)) return dobStr;
  const d = new Date(dobStr);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return dobStr;
};

export const IdCardBackFace: React.FC<IdCardBackFaceProps> = ({
  id = 'card-back',
  className = '',
  isHovered = false,
  glarePos,
  isExport = false,
}) => {
  const student = {
    address: defaultStudentData.permanentAddress.replace(/, India$/, ''),
    phone: defaultStudentData.phone,
    email: defaultStudentData.email,
    dob: formatDob(defaultStudentData.dateOfBirth),
    bloodGroup: defaultStudentData.bloodGroup,
    collegeName: defaultStudentData.college.name,
    collegeAddress: `${defaultStudentData.college.address}, ${defaultStudentData.college.city}, ${defaultStudentData.college.state} - ${defaultStudentData.college.pincode}`,
  };

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
      className={`w-full h-full rounded-2xl bg-[#ffffff] text-[#1e1713] border-2 border-[#8c7860] overflow-hidden flex flex-col justify-between relative select-none ${className}`}
      style={{
        boxShadow: cardBoxShadow,
        transition: 'box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Realistic PVC Surface Reflection & Specular Lamination Sheen */}
      {!isExport && (
        <>
          {/* Subtle semi-gloss PVC diagonal reflection */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl z-20 overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.08) 100%)',
              mixBlendMode: 'overlay',
            }}
          />
          {/* Dynamic Specular Sheen (Shifts with hover & tilt) */}
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

      {/* Subtle Security Micro-Guilloche Texture (Matching Front Side) */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#704a29_1px,transparent_1px)] [background-size:8px_8px]" />

      {/* Dynamic Security Wave Design (Multi-Layered Guilloche & Gradient Waves) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 340 540"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="backWaveGrad1" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e9bf8c" stopOpacity="0.32" />
            <stop offset="50%" stopColor="#c89658" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#8c5828" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="backWaveGrad2" x1="0%" y1="10%" x2="100%" y2="90%">
            <stop offset="0%" stopColor="#d49445" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#b37839" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#fff8f0" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="backWaveGrad3" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#8c5828" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#c89658" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#e9bf8c" stopOpacity="0.10" />
          </linearGradient>
        </defs>

        {/* 1. Large Fluid Organic Wave Shapes (Complementary Symmetrical Flow) */}
        <path
          d="M340,170 C250,135 190,225 100,185 C45,160 15,180 0,195 L0,335 C55,370 125,315 210,355 C275,385 320,360 340,340 Z"
          fill="url(#backWaveGrad1)"
        />
        <path
          d="M340,375 C255,340 175,415 85,370 C45,350 15,365 0,375 L0,540 L340,540 Z"
          fill="url(#backWaveGrad2)"
        />
        <path
          d="M340,120 C240,160 150,110 70,145 C35,160 10,150 0,140 L0,210 C50,190 130,230 220,190 C280,165 320,185 340,175 Z"
          fill="url(#backWaveGrad3)"
        />

        {/* 2. Precision Undulating Guilloche Wave Ribbons (Flowing through details) */}
        <g stroke="#855b33" strokeWidth="1.1" fill="none" opacity="0.36">
          <path d="M350,180 C280,140 210,230 130,185 C70,150 30,200 -10,175" />
          <path d="M350,192 C280,152 210,242 130,197 C70,162 30,212 -10,187" />
          <path d="M350,204 C280,164 210,254 130,209 C70,174 30,224 -10,199" />
          <path d="M350,216 C280,176 210,266 130,221 C70,186 30,236 -10,211" />
          <path d="M350,228 C280,188 210,278 130,233 C70,198 30,248 -10,223" />
          <path d="M350,240 C280,200 210,290 130,245 C70,210 30,260 -10,235" />
        </g>

        {/* 3. High-Security Counter Harmonic Wave Ribbons (Lower Address Section) */}
        <g stroke="#b8860b" strokeWidth="1" fill="none" opacity="0.32">
          <path d="M350,385 C265,435 185,350 105,400 C55,430 15,385 -10,410" />
          <path d="M350,397 C265,447 185,362 105,412 C55,442 15,397 -10,422" />
          <path d="M350,409 C265,459 185,374 105,424 C55,454 15,409 -10,434" />
          <path d="M350,421 C265,471 185,386 105,436 C55,466 15,421 -10,446" />
          <path d="M350,433 C265,483 185,398 105,448 C55,478 15,433 -10,458" />
        </g>

        {/* 4. Concentric Guilloche Wave Crests (Security Watermark Rings) */}
        <circle cx="260" cy="270" r="65" fill="none" stroke="#a67c52" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.25" />
        <circle cx="80" cy="330" r="75" fill="none" stroke="#a67c52" strokeWidth="0.8" strokeDasharray="4 2" opacity="0.25" />
      </svg>

      {/* Outer Security Hairline Frame */}
      <div className="absolute inset-1.5 rounded-xl border border-[#d9cdbd]/60 pointer-events-none" />

      {/* 4 Precision Corner Registration Crop Marks */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#a67c52]/60 pointer-events-none" />
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#a67c52]/60 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#a67c52]/60 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#a67c52]/60 pointer-events-none" />


      {/* 1. TOP HEADER: Precision Lanyard Slot & University Header Bar */}
      <div className="w-full relative flex flex-col items-center z-10 shrink-0 bg-white border-b-2 border-[#704a29]/60 shadow-2xs">
        {/* Precision Lanyard Slot Punch Hole (Identical alignment to Front Side) */}
        <div className="w-10 h-2 rounded-full bg-[#1c1612] border border-black/20 my-1 shadow-inner" />

        {/* Institutional Record Ribbon */}
        <div className="w-full flex items-center justify-between px-3.5 py-1 bg-[#fbf9f5] border-t border-[#d9cdbd]/40">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#704a29]" />
            <span className="text-[7.5px] sm:text-[8px] font-sans font-bold tracking-wider uppercase text-[#704a29]">
              Student Details &amp; Validation
            </span>
          </div>
          <span className="text-[7px] sm:text-[7.5px] font-mono text-[#8c6239] tracking-wider uppercase font-semibold">
            CS-51
          </span>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: Structured Personal Details */}
      <div className="flex-1 px-3 py-1.5 z-10 flex flex-col justify-center space-y-1.5">
        {/* DOB & Blood Group Grid (2 Columns) */}
        <div className="grid grid-cols-2 gap-1.5">
          {/* Date of Birth (DOB) */}
          <div className="p-1.5 rounded-lg bg-[#faf7f2] border border-[#e2d8cb] shadow-2xs">
            <div className="flex items-center gap-1 text-[7px] sm:text-[7.5px] font-sans uppercase text-[#704a29] font-bold tracking-wide">
              <Calendar className="w-2.5 h-2.5 text-[#704a29] shrink-0" />
              <span>Date of Birth (DOB)</span>
            </div>
            <p className="font-mono font-bold text-[#1e1713] text-[10.5px] sm:text-[11px] mt-0.5">
              {student.dob}
            </p>
          </div>

          {/* Blood Group */}
          <div className="p-1.5 rounded-lg bg-[#fef2f2]/70 border border-[#fecaca] shadow-2xs">
            <div className="flex items-center gap-1 text-[7px] sm:text-[7.5px] font-sans uppercase text-[#b91c1c] font-bold tracking-wide">
              <Droplets className="w-2.5 h-2.5 text-[#dc2626] shrink-0" />
              <span>Blood Group</span>
            </div>
            <p className="font-mono font-extrabold text-[#991b1b] text-[11.5px] sm:text-[12px] mt-0.5">
              {student.bloodGroup}
            </p>
          </div>
        </div>

        {/* Phone Number */}
        <div className="p-1.5 px-2.5 rounded-lg bg-[#faf7f2] border border-[#e2d8cb] shadow-2xs flex items-center gap-2">
          <div className="w-5.5 h-5.5 rounded-md bg-[#f4ece1] border border-[#d9cdbd] flex items-center justify-center shrink-0">
            <Phone className="w-2.5 h-2.5 text-[#704a29]" />
          </div>
          <div className="min-w-0">
            <span className="block text-[7px] sm:text-[7.5px] font-sans uppercase text-[#8c6239] font-bold tracking-wide">
              Phone Number
            </span>
            <p className="font-mono font-bold text-[#1e1713] text-[10px] sm:text-[10.5px] truncate">
              {student.phone}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="p-1.5 px-2.5 rounded-lg bg-[#faf7f2] border border-[#e2d8cb] shadow-2xs flex items-center gap-2">
          <div className="w-5.5 h-5.5 rounded-md bg-[#f4ece1] border border-[#d9cdbd] flex items-center justify-center shrink-0">
            <Mail className="w-2.5 h-2.5 text-[#704a29]" />
          </div>
          <div className="min-w-0">
            <span className="block text-[7px] sm:text-[7.5px] font-sans uppercase text-[#8c6239] font-bold tracking-wide">
              Email
            </span>
            <p className="font-mono font-bold text-[#1e1713] text-[9.5px] sm:text-[10px] truncate">
              {student.email}
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="p-1.5 px-2.5 rounded-lg bg-[#faf7f2] border border-[#e2d8cb] shadow-2xs flex items-start gap-2">
          <div className="w-5.5 h-5.5 rounded-md bg-[#f4ece1] border border-[#d9cdbd] flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-2.5 h-2.5 text-[#704a29]" />
          </div>
          <div className="min-w-0">
            <span className="block text-[7px] sm:text-[7.5px] font-sans uppercase text-[#8c6239] font-bold tracking-wide">
              Address
            </span>
            <p className="text-[#2b241e] text-[8px] sm:text-[8.5px] leading-snug font-sans font-medium mt-0.5">
              {student.address}
            </p>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION: Official College Address */}
      <div className="relative pb-2.5 px-3 z-10 shrink-0">
        <div className="p-2 rounded-xl bg-[#f5ede2] border border-[#d9cdbd] shadow-2xs">
          <div className="flex items-center gap-1.5 mb-1 pb-1 border-b border-[#704a29]/15">
            <Building2 className="w-2.5 h-2.5 text-[#704a29] shrink-0" />
            <span className="text-[7px] sm:text-[7.5px] font-sans uppercase font-bold text-[#704a29] tracking-wide">
              College Information &amp; Address
            </span>
          </div>
          <p className="text-[8.5px] sm:text-[9.5px] font-serif font-bold text-[#1e1713] uppercase tracking-wide leading-tight">
            {student.collegeName}
          </p>
          <p className="text-[7px] sm:text-[8px] text-[#524538] font-sans leading-tight mt-0.5">
            {student.collegeAddress}
          </p>
        </div>
      </div>
    </div>
  );
};
