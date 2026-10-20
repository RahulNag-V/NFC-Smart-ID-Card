import React from 'react';
import { StudentProfile, maskPhone, maskEmail, maskAddress, maskBloodGroup } from '../../data/student';
import { CollegeEmblem } from './CollegeEmblem';
import { QrCodeView } from './QrCodeView';
import { Phone, Mail, MapPin, Heart, AlertCircle, ShieldAlert } from 'lucide-react';

interface StudentIdCardBackProps {
  student: StudentProfile;
  isSensitiveVisible: boolean;
}

export const StudentIdCardBack: React.FC<StudentIdCardBackProps> = ({
  student,
  isSensitiveVisible,
}) => {
  return (
    <div
      id="student-id-card-back"
      className="relative w-full aspect-[1.586/1] max-w-[540px] mx-auto rounded-2xl bg-[#221b16] text-[#fffefb] shadow-2xl border-2 border-[#704a29]/50 overflow-hidden flex flex-col justify-between font-sans select-none print:shadow-none print:border print:border-[#221b16]"
      style={{
        boxShadow: '0 20px 40px -15px rgba(34, 27, 22, 0.4), 0 0 0 1px rgba(112, 74, 41, 0.35)',
      }}
    >
      {/* Background Microprint & Watermark */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />
      <div className="absolute right-4 bottom-4 opacity-10 pointer-events-none">
        <CollegeEmblem size={160} monochrome={true} />
      </div>

      {/* TOP HEADER: Terms & Verification Header */}
      <div className="bg-[#1a1410] px-3 sm:px-4 py-2 border-b border-[#704a29]/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CollegeEmblem size={24} className="shrink-0" />
          <div>
            <h3 className="text-[9px] sm:text-[11px] font-serif font-bold uppercase tracking-wider text-[#fffefb]">
              TERMS &amp; EMERGENCY IDENTIFIER
            </h3>
            <p className="text-[6.5px] sm:text-[8px] text-[#d9cdbd]">
              Student Safety &bull; Medical &bull; Campus Administration
            </p>
          </div>
        </div>

        {/* Blood Group Highlight Stamp */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#bc473b]/25 border border-[#bc473b]/40">
          <Heart className="w-3 h-3 text-[#bc473b] fill-[#bc473b]" />
          <span className="text-[7px] sm:text-[8px] font-mono uppercase text-[#e5ded5]">Blood Group:</span>
          <strong className="text-[9px] sm:text-[11px] font-mono font-extrabold text-[#fee2e2]">
            {maskBloodGroup(student.bloodGroup, isSensitiveVisible)}
          </strong>
        </div>
      </div>

      {/* CARD BACK MAIN CONTENT */}
      <div className="flex-1 p-3 sm:p-4 grid grid-cols-12 gap-3 relative z-10 text-[8px] sm:text-[9.5px]">
        {/* Left Column: Student Contact & Address */}
        <div className="col-span-8 flex flex-col justify-between space-y-2">
          <div className="space-y-1.5">
            {/* Phone & Email */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-start gap-1.5">
                <Phone className="w-3 h-3 text-[#a67c52] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="block text-[6.5px] sm:text-[7.5px] font-mono uppercase tracking-wider text-[#d9cdbd]">
                    Emergency Contact
                  </span>
                  <p className="font-mono font-semibold text-white truncate">
                    {maskPhone(student.phone, isSensitiveVisible)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <Mail className="w-3 h-3 text-[#a67c52] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="block text-[6.5px] sm:text-[7.5px] font-mono uppercase tracking-wider text-[#d9cdbd]">
                    Official Student Mail
                  </span>
                  <p className="font-mono font-semibold text-white truncate">
                    {maskEmail(student.email, isSensitiveVisible)}
                  </p>
                </div>
              </div>
            </div>

            {/* Residential / Permanent Address */}
            <div className="flex items-start gap-1.5 pt-1 border-t border-white/10">
              <MapPin className="w-3 h-3 text-[#a67c52] shrink-0 mt-0.5" />
              <div>
                <span className="block text-[6.5px] sm:text-[7.5px] font-mono uppercase tracking-wider text-[#d9cdbd]">
                  Permanent Residential Address
                </span>
                <p className="text-[#f0eae1] leading-tight">
                  {maskAddress(student.permanentAddress, isSensitiveVisible)}
                </p>
              </div>
            </div>
          </div>

          {/* Institutional Regulations Notice */}
          <div className="p-1.5 rounded-lg bg-black/25 border border-white/10 text-[6.5px] sm:text-[7.5px] text-[#e5ded5] leading-tight">
            <p className="font-semibold text-white flex items-center gap-1 mb-0.5">
              <AlertCircle className="w-2.5 h-2.5 text-[#a67c52]" />
              <span>Institutional Card Conditions:</span>
            </p>
            This card is non-transferable property of {student.college.name}. If found, please return to the Administrative Block, {student.college.address}, {student.college.city} or call security: {student.college.phone}.
          </div>
        </div>

        {/* Right Column: Verification QR & Authorized Signatory */}
        <div className="col-span-4 flex flex-col justify-between items-center pl-2 border-l border-white/10">
          {/* Verification QR */}
          <div className="flex flex-col items-center">
            <QrCodeView
              value={student.verification.verificationUrl}
              size={56}
              className="sm:w-[64px] sm:h-[64px]"
              darkColor="#221b16"
              lightColor="#fffefb"
            />
            <span className="text-[6.5px] sm:text-[7.5px] font-mono font-bold text-[#f0eae1] mt-1 text-center">
              VALIDITY VERIFIER
            </span>
          </div>

          {/* Authorized Signature Simulation */}
          <div className="w-full flex flex-col items-center pt-1 border-t border-white/10">
            <div className="font-serif italic font-bold text-xs sm:text-sm text-[#f0eae1] tracking-tight">
              K. S. Narayanan
            </div>
            <span className="text-[6px] sm:text-[7px] font-mono uppercase tracking-widest text-[#d9cdbd]">
              Registrar / Controller
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER BAND: Issue & Validity Stamps */}
      <div className="bg-[#1a1410] px-3 sm:px-4 py-1.5 border-t border-[#704a29]/40 flex items-center justify-between text-[7px] sm:text-[8px] font-mono">
        <div className="flex items-center gap-3">
          <span>
            ISSUED: <strong className="text-white">{student.issueDate}</strong>
          </span>
          <span>
            VALID THRU: <strong className="text-[#f0eae1]">{student.validThru}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#10B981]">
          <ShieldAlert className="w-2.5 h-2.5" />
          <span className="font-bold">VTU CBCS RECOGNIZED</span>
        </div>
      </div>
    </div>
  );
};
