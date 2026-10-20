import React from 'react';
import { StudentProfile } from '../../data/student';
import { CollegeEmblem } from './CollegeEmblem';
import { BarcodeView } from './BarcodeView';
import { QrCodeView } from './QrCodeView';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface StudentIdCardFrontProps {
  student: StudentProfile;
}

export const StudentIdCardFront: React.FC<StudentIdCardFrontProps> = ({ student }) => {
  return (
    <div
      id="student-id-card-front"
      className="relative w-full aspect-[1.586/1] max-w-[540px] mx-auto rounded-2xl bg-[#fffefb] text-[#2b241e] shadow-2xl border-2 border-[#d9cdbd] overflow-hidden flex flex-col justify-between font-sans select-none print:shadow-none print:border print:border-[#221b16]"
      style={{
        boxShadow: '0 20px 40px -15px rgba(43, 36, 30, 0.2), 0 0 0 1px rgba(112, 74, 41, 0.3)',
      }}
    >
      {/* Subtle Guilloche Watermark Pattern */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#704a29_1px,transparent_1px)] [background-size:10px_10px]" />
      
      {/* Subtle Warm Holographic Corner Effect */}
      <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-gradient-to-br from-[#704a29]/15 via-transparent to-[#221b16]/10 pointer-events-none" />

      {/* TOP HEADER BAND: Rich Dark Walnut Leather & Bistre */}
      <div className="relative bg-[#221b16] text-[#fffefb] px-3 sm:px-4 py-2 sm:py-2.5 border-b-2 border-[#704a29]">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Official Emblem */}
          <div className="shrink-0 drop-shadow-sm">
            <CollegeEmblem size={38} className="sm:w-[44px] sm:h-[44px]" />
          </div>

          {/* College Identity Details */}
          <div className="flex-1 min-w-0">
            <h2 className="text-[10px] sm:text-[13px] font-serif font-bold uppercase tracking-tight text-[#fffefb] truncate leading-tight">
              {student.college.name}
            </h2>
            <p className="text-[7.5px] sm:text-[9px] text-[#e5ded5] truncate opacity-90 leading-tight">
              {student.college.affiliations}
            </p>
            <p className="text-[7px] sm:text-[8px] text-[#d9cdbd] font-medium tracking-wide truncate">
              {student.college.accreditation}
            </p>
          </div>

          {/* Status Badge */}
          <div className="hidden sm:flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-[8px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span>ACTIVE</span>
            </div>
            <span className="text-[7.5px] font-mono text-[#d9cdbd] mt-0.5">AY {student.academicYear}</span>
          </div>
        </div>

        {/* Crisp Ribbon Strip */}
        <div className="mt-1 -mx-3 sm:-mx-4 px-3 sm:px-4 py-0.5 bg-gradient-to-r from-[#1c1612] via-[#704a29] to-[#1c1612] border-t border-white/10 flex items-center justify-between">
          <span className="text-[8px] sm:text-[9.5px] font-mono uppercase tracking-[0.2em] font-extrabold text-[#fffefb]">
            STUDENT IDENTITY CARD
          </span>
          <span className="text-[7px] sm:text-[8.5px] font-mono text-[#f0eae1]">
            ID: <strong className="text-white">{student.studentId}</strong>
          </span>
        </div>
      </div>

      {/* CARD BODY CONTENT */}
      <div className="flex-1 p-3 sm:p-4 flex gap-3 sm:gap-4 items-center relative z-10">
        {/* Student Photograph with Security Border */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-lg overflow-hidden border-2 border-[#704a29] bg-[#f8f5ee] shadow-xs">
            <img
              src={student.photoUrl}
              alt={student.fullName}
              className="w-full h-full object-cover object-top"
            />
            {/* Hologram security overlay stamp */}
            <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-[#221b16]/85 backdrop-blur-xs text-[6.5px] font-mono text-[#f0eae1] border border-[#704a29]/40 flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5 text-[#10B981]" />
              <span>OFFICIAL</span>
            </div>
          </div>
          {/* Quick Pillar Pill */}
          <div className="mt-1 px-2 py-0.5 rounded bg-[#f0eae1] border border-[#d9cdbd] text-[7.5px] font-mono font-bold text-[#704a29]">
            SEM {student.semester.split(' ')[0]} &bull; SEC {student.section}
          </div>
        </div>

        {/* Student Academic & Identity Hierarchy */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
          {/* Name & USN */}
          <div>
            <h1 className="text-sm sm:text-[18px] font-serif font-bold text-[#2b241e] leading-snug tracking-tight">
              {student.fullName}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] sm:text-[10.5px] font-mono font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-[#704a29] text-[#fffefb]">
                USN: {student.usn}
              </span>
              <span className="text-[8px] sm:text-[9.5px] font-mono font-bold text-[#704a29]">
                {student.degree}
              </span>
            </div>
          </div>

          {/* Core Academic Metadata Grid */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1.5 pt-1.5 border-t border-[#d9cdbd] text-[8px] sm:text-[9.5px]">
            <div>
              <span className="block text-[7px] sm:text-[8px] uppercase tracking-wider font-semibold text-[#73685c]">
                Branch / Program
              </span>
              <p className="font-bold text-[#2b241e] leading-tight truncate">
                {student.branch}
              </p>
            </div>

            <div>
              <span className="block text-[7px] sm:text-[8px] uppercase tracking-wider font-semibold text-[#73685c]">
                Academic Session
              </span>
              <p className="font-bold text-[#2b241e] leading-tight">
                {student.academicYear}
              </p>
            </div>

            <div>
              <span className="block text-[7px] sm:text-[8px] uppercase tracking-wider font-semibold text-[#73685c]">
                Current Semester
              </span>
              <p className="font-semibold text-[#2b241e] leading-tight">
                {student.semester} (Sec {student.section})
              </p>
            </div>

            <div>
              <span className="block text-[7px] sm:text-[8px] uppercase tracking-wider font-semibold text-[#73685c]">
                Valid Through
              </span>
              <p className="font-semibold text-[#2b241e] leading-tight">
                {student.validThru}
              </p>
            </div>
          </div>
        </div>

        {/* Real Scannable Verification QR Code */}
        <div className="shrink-0 flex flex-col items-center justify-center pl-1 sm:pl-2 border-l border-[#d9cdbd]">
          <QrCodeView
            value={student.verification.verificationUrl}
            size={58}
            className="sm:w-[68px] sm:h-[68px]"
            darkColor="#221b16"
          />
          <span className="text-[6.5px] sm:text-[7.5px] font-mono font-bold text-[#704a29] mt-1 uppercase tracking-tight">
            Scan to Verify
          </span>
        </div>
      </div>

      {/* CARD BOTTOM BAR: Real Barcode + Directorate Stamp */}
      <div className="bg-[#f0eae1] px-3 sm:px-4 py-1.5 border-t border-[#d9cdbd] flex items-center justify-between gap-3">
        {/* Scannable Barcode with Human Readable USN */}
        <div className="w-44 sm:w-56 shrink-0">
          <BarcodeView value={student.usn} height={20} showText={true} />
        </div>

        {/* Security watermark stamp */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-[7px] sm:text-[8px] font-serif font-bold text-[#704a29]">
            <Sparkles className="w-2.5 h-2.5 text-[#a67c52]" />
            <span>DIRECTORATE OF ACADEMIC AFFAIRS</span>
          </div>
          <p className="text-[6.5px] sm:text-[7.5px] font-mono text-[#73685c] tracking-tight">
            Authorized Digital Student Credential
          </p>
        </div>
      </div>
    </div>
  );
};
