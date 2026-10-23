import React from 'react';
import { StudentProfile, maskPhone, maskEmail, maskAddress, maskBloodGroup } from '../../data/student';
import { CollegeEmblem } from './CollegeEmblem';
import {
  User,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Building2,
  School,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';

interface StudentInfoSectionsProps {
  student: StudentProfile;
  isSensitiveVisible: boolean;
  onToggleSensitive: () => void;
}

export const StudentInfoSections: React.FC<StudentInfoSectionsProps> = ({
  student,
  isSensitiveVisible,
  onToggleSensitive,
}) => {
  return (
    <div className="w-full space-y-8 mt-10">
      {/* ================= SECTION 1: STUDENT PROFILE ================= */}
      <section id="student-profile" className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f0eae1] gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#704a29] text-[#fffefb] flex items-center justify-center shrink-0 shadow-2xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2b241e]">
                Student Profile
              </h2>
              <p className="text-xs text-[#73685c]">
                Primary identity credentials and enrollment profile.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              {student.enrollmentStatus}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#f0eae1] border border-[#d9cdbd] text-[#704a29] text-xs font-mono font-bold">
              {student.studentId}
            </span>
          </div>
        </div>

        {/* Profile Card Layout with Photo & Structured Data */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
          {/* Portrait Preview */}
          <div className="md:col-span-3 flex flex-col items-center">
            <div className="relative w-32 h-36 rounded-xl overflow-hidden border-2 border-[#704a29] bg-[#f8f5ee] shadow-xs">
              <img
                src={student.photoUrl}
                alt={student.fullName}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-1.5 inset-x-1.5 py-0.5 rounded bg-[#221b16]/85 backdrop-blur-xs text-[9px] font-mono font-bold text-center text-[#f0eae1]">
                ID VERIFIED
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#73685c] mt-2">Biometric Photo ID</span>
          </div>

          {/* Definition List Grid */}
          <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
              <span className="text-[10px] uppercase font-mono font-bold text-[#73685c] tracking-wider block">
                Full Legal Name
              </span>
              <p className="text-sm font-serif font-bold text-[#2b241e] mt-0.5">
                {student.fullName}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
              <span className="text-[10px] uppercase font-mono font-bold text-[#73685c] tracking-wider block">
                University Seat No. (USN)
              </span>
              <p className="text-sm font-mono font-extrabold text-[#704a29] mt-0.5">
                {student.usn}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
              <span className="text-[10px] uppercase font-mono font-bold text-[#73685c] tracking-wider block">
                Branch / Specialization
              </span>
              <p className="text-sm font-semibold text-[#2b241e] mt-0.5 truncate">
                {student.branch}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
              <span className="text-[10px] uppercase font-mono font-bold text-[#73685c] tracking-wider block">
                Current Semester &amp; Section
              </span>
              <p className="text-sm font-semibold text-[#2b241e] mt-0.5">
                {student.semester} &bull; Section {student.section}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
              <span className="text-[10px] uppercase font-mono font-bold text-[#73685c] tracking-wider block">
                Academic Session
              </span>
              <p className="text-sm font-semibold text-[#2b241e] mt-0.5">
                {student.academicYear}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
              <span className="text-[10px] uppercase font-mono font-bold text-[#73685c] tracking-wider block">
                Blood Group
              </span>
              <p className="text-sm font-mono font-bold text-[#bc473b] mt-0.5">
                {maskBloodGroup(student.bloodGroup, isSensitiveVisible)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: ACADEMIC DETAILS ================= */}
      <section id="academic-details" className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-5 sm:p-7 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f0eae1]">
          <div className="w-10 h-10 rounded-xl bg-[#704a29] text-[#fffefb] flex items-center justify-center shrink-0 shadow-2xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2b241e]">
              Academic Information
            </h2>
            <p className="text-xs text-[#73685c]">
              Institutional registration, degree program, and syllabus scheme.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
            <span className="text-[10px] font-mono uppercase font-bold text-[#73685c] tracking-wider block">
              Registered Degree
            </span>
            <p className="text-xs font-semibold text-[#2b241e] mt-1">
              {student.degree}
            </p>
            <p className="text-[11px] text-[#73685c] mt-0.5">Four-Year Undergraduate</p>
          </div>

          <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
            <span className="text-[10px] font-mono uppercase font-bold text-[#73685c] tracking-wider block">
              Academic Department
            </span>
            <p className="text-xs font-semibold text-[#2b241e] mt-1">
              {student.department}
            </p>
            <p className="text-[11px] text-[#73685c] mt-0.5">School of Computing</p>
          </div>

          <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
            <span className="text-[10px] font-mono uppercase font-bold text-[#73685c] tracking-wider block">
              Curriculum Scheme
            </span>
            <p className="text-xs font-semibold text-[#2b241e] mt-1">
              {student.curriculum}
            </p>
            <p className="text-[11px] text-[#73685c] mt-0.5">VTU Scheme 2024</p>
          </div>

          <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
            <span className="text-[10px] font-mono uppercase font-bold text-[#73685c] tracking-wider block">
              Enrollment Timeline
            </span>
            <p className="text-xs font-semibold text-[#2b241e] mt-1">
              {student.issueDate} &ndash; {student.validThru}
            </p>
            <p className="text-[11px] text-[#10B981] font-mono font-semibold mt-0.5">In Good Standing</p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: CONTACT & PRIVACY DETAILS ================= */}
      <section id="contact-details" className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f0eae1] gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#704a29] text-[#fffefb] flex items-center justify-center shrink-0 shadow-2xs">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2b241e]">
                Contact &amp; Residential Information
              </h2>
              <p className="text-xs text-[#73685c]">
                Emergency contact channels and registered addresses.
              </p>
            </div>
          </div>

          {/* Privacy Toggle Control */}
          <button
            type="button"
            onClick={onToggleSensitive}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
              isSensitiveVisible
                ? 'bg-[#bc473b]/10 text-[#bc473b] border-[#bc473b]/30 hover:bg-[#bc473b]/20'
                : 'bg-[#704a29] text-[#fffefb] border-[#704a29] hover:bg-[#593a1f]'
            }`}
          >
            {isSensitiveVisible ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Mask Private Data</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Reveal Private Data</span>
              </>
            )}
          </button>
        </div>

        {/* Privacy Advisory Banner */}
        <div className="mt-4 p-3 rounded-xl bg-[#f0eae1]/60 border border-[#d9cdbd] text-xs text-[#73685c] flex items-start gap-2.5">
          <span className="p-1 rounded-md bg-[#fffefb] border border-[#d9cdbd] text-[#704a29] shrink-0 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
          </span>
          <p className="leading-relaxed">
            <strong>Privacy Protection Notice:</strong> In compliance with collegiate data governance standards, sensitive student contact numbers and permanent street addresses are masked on public view by default. Use the toggle above to reveal details.
          </p>
        </div>

        {/* Contact Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#fffefb] border border-[#d9cdbd] text-[#704a29] shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase font-bold text-[#73685c] tracking-wider block">
                Primary Phone / WhatsApp
              </span>
              <p className="text-xs font-mono font-bold text-[#2b241e] mt-1">
                {maskPhone(student.phone, isSensitiveVisible)}
              </p>
              <span className="text-[10px] text-[#73685c]">Registered Student Mobile</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#fffefb] border border-[#d9cdbd] text-[#704a29] shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase font-bold text-[#73685c] tracking-wider block">
                Email Communications
              </span>
              <p className="text-xs font-mono font-bold text-[#2b241e] mt-1 truncate">
                {maskEmail(student.email, isSensitiveVisible)}
              </p>
              <span className="text-[10px] text-[#73685c]">Academic Dispatch &amp; Alerts</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#fffefb] border border-[#d9cdbd] text-[#704a29] shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#73685c] tracking-wider block">
                Current Local Residence
              </span>
              <p className="text-xs text-[#2b241e] font-medium mt-1 leading-snug">
                {maskAddress(student.currentAddress, isSensitiveVisible)}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#fffefb] border border-[#d9cdbd] text-[#704a29] shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#73685c] tracking-wider block">
                Permanent Domicile Address
              </span>
              <p className="text-xs text-[#2b241e] font-medium mt-1 leading-snug">
                {maskAddress(student.permanentAddress, isSensitiveVisible)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: COLLEGE INFORMATION ================= */}
      <section id="college-details" className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-5 sm:p-7 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f0eae1]">
          <div className="w-10 h-10 rounded-xl bg-[#704a29] text-[#fffefb] flex items-center justify-center shrink-0 shadow-2xs">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2b241e]">
              College Information
            </h2>
            <p className="text-xs text-[#73685c]">
              Recognized institution details, accreditations, and administrative helpline.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 items-center">
          {/* Emblem & Code */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-xl bg-[#221b16] text-[#fffefb] text-center border border-[#704a29]/40 shadow-xs">
            <CollegeEmblem size={64} />
            <h3 className="text-xs font-serif font-bold mt-3 text-[#fffefb] uppercase tracking-tight">
              {student.college.name}
            </h3>
            <span className="mt-1 px-2.5 py-0.5 rounded-full bg-white/10 text-[#f0eae1] text-[10px] font-mono font-bold">
              INSTITUTE CODE: {student.college.code}
            </span>
            <p className="text-[10px] text-[#d9cdbd] mt-2 font-serif italic">
              &ldquo;{student.college.tagline}&rdquo;
            </p>
          </div>

          {/* Institution Directory */}
          <div className="md:col-span-8 space-y-3">
            <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
              <span className="text-[10px] font-mono uppercase font-bold text-[#73685c] tracking-wider block">
                Campus Location &amp; Postal Address
              </span>
              <p className="text-xs font-semibold text-[#2b241e] mt-0.5">
                {student.college.address}, {student.college.city}, {student.college.state} &ndash; {student.college.pincode}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
                <span className="text-[10px] font-mono uppercase font-bold text-[#73685c] tracking-wider block">
                  University Affiliation
                </span>
                <p className="text-xs font-medium text-[#2b241e] mt-0.5">
                  {student.college.affiliations}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
                <span className="text-[10px] font-mono uppercase font-bold text-[#73685c] tracking-wider block">
                  Statutory Accreditation
                </span>
                <p className="text-xs font-medium text-[#2b241e] mt-0.5">
                  {student.college.accreditation}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
                <span className="text-[10px] font-mono uppercase font-bold text-[#73685c] tracking-wider block">
                  Campus Control Helpline
                </span>
                <p className="text-xs font-mono font-semibold text-[#2b241e] mt-0.5">
                  {student.college.phone}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]/60">
                <span className="text-[10px] font-mono uppercase font-bold text-[#73685c] tracking-wider block">
                  Registrar Secretariat
                </span>
                <p className="text-xs font-mono font-semibold text-[#2b241e] mt-0.5">
                  {student.college.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: STUDENT ID VERIFICATION ================= */}
      <section id="verification" className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-5 sm:p-7 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-[#f0eae1]">
          <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2b241e]">
              Student Credential Verification
            </h2>
            <p className="text-xs text-[#73685c]">
              Real-time validation protocol and cryptographic audit trail.
            </p>
          </div>
        </div>

        <div className="mt-6 p-5 rounded-2xl bg-[#221b16] text-[#fffefb] border border-[#704a29]/50 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center text-[#10B981] shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#f0eae1] font-bold uppercase tracking-wider">
                  STATUS: {student.verification.status}
                </span>
                <h3 className="text-base font-serif font-bold text-[#fffefb]">
                  Officially Validated Institutional Record
                </h3>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono self-start sm:self-auto">
              ID: {student.verification.verificationCode}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
            <div>
              <span className="text-[10px] font-mono text-[#d9cdbd] uppercase block">Verified By</span>
              <p className="font-semibold text-white mt-0.5">{student.verification.verifiedBy}</p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#d9cdbd] uppercase block">Cryptographic Hash</span>
              <p className="font-mono text-[#f0eae1] mt-0.5 truncate">{student.verification.hash}</p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-[#d9cdbd] uppercase block">Validation Scope</span>
              <p className="font-semibold text-white mt-0.5">{student.verification.lastVerified}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#d9cdbd]">
            <p>
              Verification URL: <strong className="text-white font-mono">{student.verification.verificationUrl}</strong>
            </p>
            <span className="text-[#10B981] font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              SSL &bull; Authenticated Credential
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-4 text-[11px] text-[#73685c] leading-relaxed text-center sm:text-left">
          <strong>Academic Disclaimer:</strong> This digital identity card functions as a verified mobile credential for campus access, library privileges, laboratory entry, and student privileges for the academic period 2024–2028. For official degree transcripts, please consult the College Controller of Examinations.
        </p>
      </section>
    </div>
  );
};
