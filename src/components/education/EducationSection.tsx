import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Calendar,
  School,
  CheckCircle2,
  Sparkles,
  Clock,
  Award,
  ExternalLink,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { normalizeCertificate, CertificateItem } from '../../types/content';

// ================= ACADEMIC DATA REPOSITORY =================
export interface SemesterScore {
  semesterNumber: number;
  semesterName: string;
  sgpa: number;
  maxSgpa: number;
  badge?: string;
}

export interface YearAcademicData {
  id: string;
  yearTitle: string;
  program: string;
  institution: string;
  duration: string;
  status: 'Completed' | 'In Progress';
  yearlyAverageSgpa?: number;
  currentStatusLabel?: string;
  semesters?: SemesterScore[];
  inProgressNote?: string;
}

export interface SchoolRecord {
  id: string;
  qualification: string;
  subTitle: string;
  score: number;
  scale: '%';
  board: string;
  duration: string;
  institution?: string;
}

// 1st Year, 2nd Year & 3rd Year B.E. Academic Records
export const engineeringAcademicData: YearAcademicData[] = [
  {
    id: 'be-year-3',
    yearTitle: '3rd Year B.E.',
    program: 'Bachelor of Engineering (B.E.) — Computer Science & Engineering',
    institution: 'Bangalore Technological Institute (BTI)',
    duration: '2026 – Present',
    status: 'In Progress',
    currentStatusLabel: '5th Semester Pursuing',
    inProgressNote:
      'Currently enrolled in V Semester coursework and laboratory practicals under VTU. Semester evaluations are actively in progress.',
  },
  {
    id: 'be-year-2',
    yearTitle: '2nd Year B.E.',
    program: 'Bachelor of Engineering (B.E.) — Computer Science & Engineering',
    institution: 'Bangalore Technological Institute (BTI)',
    duration: '2025 – 2026',
    status: 'Completed',
    yearlyAverageSgpa: 7.86,
    semesters: [
      {
        semesterNumber: 3,
        semesterName: '3rd Semester',
        sgpa: 7.71,
        maxSgpa: 10.0,
      },
      {
        semesterNumber: 4,
        semesterName: '4th Semester',
        sgpa: 8.00,
        maxSgpa: 10.0,
        badge: 'Semester High',
      },
    ],
  },
  {
    id: 'be-year-1',
    yearTitle: '1st Year B.E.',
    program: 'Basic Engineering Sciences & Foundational Computing',
    institution: 'Bangalore Technological Institute (BTI)',
    duration: '2024 – 2025',
    status: 'Completed',
    yearlyAverageSgpa: 7.38,
    semesters: [
      {
        semesterNumber: 1,
        semesterName: '1st Semester',
        sgpa: 7.15,
        maxSgpa: 10.0,
      },
      {
        semesterNumber: 2,
        semesterName: '2nd Semester',
        sgpa: 7.60,
        maxSgpa: 10.0,
      },
    ],
  },
];

export const schoolEducationData: SchoolRecord[] = [
  {
    id: 'school-12th',
    qualification: '12th Standard',
    subTitle: 'Pre-University Course (PUC II / Higher Secondary)',
    score: 80.64,
    scale: '%',
    board: 'Department of Pre-University Education, Karnataka State Board',
    duration: '2022 – 2024',
  },
  {
    id: 'school-10th',
    qualification: '10th Standard',
    subTitle: 'Secondary School Leaving Certificate (SSLC)',
    score: 80.33,
    scale: '%',
    board: 'Karnataka Secondary Education Examination Board (KSEEB)',
    duration: '2020 – 2022',
  },
];

// ================= MAIN COMPONENT =================
export const EducationSection: React.FC = () => {
  const { activeContent } = useSiteContent();

  const engineering = activeContent?.academic?.engineering || engineeringAcademicData;
  const schooling = activeContent?.academic?.schooling || schoolEducationData;
  const showSgpa = activeContent?.visibility?.showSgpaScores !== false;

  const rawCertifications = activeContent?.academic?.certifications || [];
  const certifications: CertificateItem[] = rawCertifications.map((c, i) => normalizeCertificate(c, i));

  const [activeModal, setActiveModal] = useState<{
    images: string[];
    currentIndex: number;
    title: string;
  } | null>(null);

  // Compute overall CGPA dynamically from completed semesters
  const completedSemesters: SemesterScore[] = [];
  engineering.forEach((yr) => {
    if (yr.semesters) {
      completedSemesters.push(...yr.semesters);
    }
  });

  const totalSgpa = completedSemesters.reduce((acc, curr) => acc + curr.sgpa, 0);
  const calculatedCgpa = completedSemesters.length > 0 ? totalSgpa / completedSemesters.length : 7.62;

  return (
    <section className="space-y-3.5 pt-3 text-[#1e1713]">
      {/* 1. EDUCATION SECTION HEADER WITH PROMINENT OVERALL CGPA BADGE */}
      <div className="p-4 rounded-2xl bg-[#fffefb] border border-[#d9cdbd] shadow-2xs space-y-3">
        {/* Top: Heading & Academic Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#704a29] text-[#fffefb] flex items-center justify-center shrink-0 shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#1e1713]">
                Education
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f4ece1] text-[#704a29] border border-[#d9cdbd] font-semibold">
                <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                B.E. CSE
              </span>
            </div>
            <p className="text-xs text-[#73685c] font-sans truncate sm:whitespace-normal">
              Academic progression, degree semesters &amp; scholastic records
            </p>
          </div>
        </div>

        {/* Bottom: Dedicated Overall CGPA Metric Ribbon */}
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#faf7f2] via-[#f5ede2] to-[#fbf8f3] border border-[#704a29]/40 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#704a29] block leading-tight">
                Overall CGPA
              </span>
              <span className="text-[9.5px] font-sans font-medium text-[#73685c] block truncate">
                Calculated average across {completedSemesters.length} completed semesters
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-1 pl-3.5 border-l border-[#d9cdbd] shrink-0">
            {showSgpa ? (
              <>
                <span className="font-mono text-2xl font-black text-[#704a29] tracking-tight">
                  {calculatedCgpa.toFixed(2)}
                </span>
                <span className="font-mono text-xs font-bold text-[#8c6239]">
                  /10.0
                </span>
              </>
            ) : (
              <span className="font-mono text-xs font-bold text-[#73685c]">
                Verified on File
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. ENGINEERING DEGREE SECTIONS (3rd Year, 2nd Year, 1st Year B.E.) */}
      <div className="space-y-3.5">
        {engineering.map((year, yearIndex) => {
          const isThirdYearPursuing = year.status === 'In Progress';

          return (
            <motion.div
              key={year.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.35, delay: yearIndex * 0.08 }}
              className={`p-4 sm:p-5 rounded-2xl bg-[#fffefb] border shadow-2xs transition-all ${
                isThirdYearPursuing
                  ? 'border-[#704a29]/60 hover:border-[#704a29]'
                  : 'border-[#d9cdbd] hover:border-[#b89574]'
              }`}
            >
              {/* Year Header */}
              <div className="flex flex-col gap-2.5 pb-3.5 border-b border-[#f0eae1]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-mono font-black text-[#704a29]">
                        {year.yearTitle.split(' ')[0]}
                      </span>
                      <span className="text-[7.5px] font-mono uppercase font-bold text-[#8c6239]">
                        YEAR
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#1e1713]">
                        {year.yearTitle}
                      </h3>
                      <span className="text-[10px] font-mono text-[#73685c] flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-[#8c6239]" />
                        {year.duration}
                      </span>
                    </div>
                  </div>

                  {/* Right Badge */}
                  {isThirdYearPursuing ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 shadow-2xs shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-mono font-bold text-emerald-900 whitespace-nowrap">
                        {year.currentStatusLabel || '5th Semester Pursuing'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] shadow-2xs shrink-0">
                      <span className="text-[8.5px] font-mono uppercase font-bold text-[#73685c] whitespace-nowrap">
                        Avg
                      </span>
                      <div className="h-4 w-[1px] bg-[#d9cdbd]" />
                      <div className="flex items-baseline gap-0.5 font-mono">
                        <span className="text-base font-black text-[#704a29]">
                          {showSgpa ? year.yearlyAverageSgpa?.toFixed(2) : '•.•'}
                        </span>
                        <span className="text-[10px] font-bold text-[#8c6239]">
                          /10
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-xs text-[#524538] font-sans leading-relaxed">
                  {year.program}{' '}
                  &bull;{' '}
                  <span className="text-[#704a29] font-medium">
                    {year.institution}
                  </span>
                </p>
              </div>

              {/* In-Progress Content Notice (if applicable) */}
              {isThirdYearPursuing && (
                <div className="mt-3.5 p-3.5 rounded-xl bg-[#faf7f2]/70 border border-[#e2d8cb] shadow-2xs space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <h4 className="text-xs sm:text-sm font-serif font-bold text-[#2b241e]">
                        {year.currentStatusLabel || 'Currently Pursuing Coursework'}
                      </h4>
                      <span className="text-[8.5px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        In Progress
                      </span>
                    </div>
                    {year.inProgressNote && (
                      <p className="text-[11px] text-[#524538] font-sans leading-relaxed">
                        {year.inProgressNote}
                      </p>
                    )}
                  </div>

                  {(!year.semesters || year.semesters.length === 0) && (
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#fffefb] border border-[#d9cdbd]">
                      <span className="text-[8.5px] font-mono uppercase font-semibold text-[#73685c]">
                        Academic Evaluation
                      </span>
                      <span className="text-[10.5px] font-mono font-bold text-[#704a29] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#8c6239]" />
                        Grade Pending Semester Close
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Semester-wise SGPA Score Cards */}
              {year.semesters && year.semesters.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
                  {year.semesters.map((sem) => {
                    const max = sem.maxSgpa || 10.0;
                    const percent = Math.min(100, Math.max(0, (sem.sgpa / max) * 100));

                    return (
                      <div
                        key={sem.semesterNumber}
                        className="p-3 sm:p-3.5 rounded-xl bg-[#faf7f2]/70 border border-[#e2d8cb] hover:bg-[#faf7f2] transition-colors relative overflow-hidden group shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#704a29]" />
                            <h4 className="text-xs sm:text-sm font-serif font-bold text-[#2b241e]">
                              {sem.semesterName}
                            </h4>
                          </div>

                          {sem.badge && (
                            <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                              {sem.badge}
                            </span>
                          )}
                        </div>

                        {/* Score Figure */}
                        <div className="flex items-baseline justify-between mb-1.5">
                          <span className="text-[10px] font-mono uppercase text-[#73685c] font-semibold">
                            Semester SGPA
                          </span>
                          <div className="flex items-baseline gap-0.5 font-mono">
                            {showSgpa ? (
                              <>
                                <span className="text-lg sm:text-xl font-black text-[#704a29]">
                                  {sem.sgpa.toFixed(2)}
                                </span>
                                <span className="text-xs font-bold text-[#8c6239]">
                                  /{max} SGPA
                                </span>
                              </>
                            ) : (
                              <span className="text-xs font-bold text-[#73685c]">
                                Protected
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Progress Indicator Track */}
                        <div className="w-full h-1.5 bg-[#e8dfd3] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${percent}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="h-full rounded-full bg-gradient-to-r from-[#8c6239] to-[#704a29]"
                          />
                        </div>
                        {/* Performance Footnote */}
                        <div className="flex items-center justify-between text-[9px] font-mono text-[#8c6239] mt-1.5">
                          <span>Scale: 0.0 – 10.0</span>
                          <span className="font-bold">
                            {percent.toFixed(1)}% Performance Index
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 3. SCHOOL EDUCATION SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.16 }}
        className="p-4 sm:p-5 rounded-2xl bg-[#fffefb] border border-[#d9cdbd] shadow-2xs"
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-[#f0eae1]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#f4ece1] border border-[#d9cdbd] flex items-center justify-center text-[#704a29] shrink-0">
              <School className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#1e1713]">
                School Education
              </h3>
              <p className="text-xs text-[#73685c] font-sans">
                Foundational scholastic milestones (10th &amp; 12th Standard)
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono text-[#704a29] font-bold px-2.5 py-0.5 rounded-full bg-[#f4ece1] border border-[#d9cdbd] whitespace-nowrap shrink-0">
            {schooling.length} Credentials
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
          {schooling.map((item, idx) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 rounded-xl bg-[#faf7f2]/70 border border-[#e2d8cb] hover:bg-[#faf7f2] transition-all flex flex-col justify-between shadow-2xs group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#f4ece1] text-[#704a29] border border-[#d9cdbd]">
                    {item.qualification}
                  </span>
                  <span className="text-[9.5px] font-mono text-[#73685c]">
                    {item.duration}
                  </span>
                </div>

                <h4 className="text-sm font-serif font-bold text-[#1e1713] mt-2 leading-snug">
                  {item.subTitle}
                </h4>

                {item.institution && (
                  <p className="text-[11.5px] font-medium text-[#704a29] mt-1">
                    {item.institution}
                  </p>
                )}

                <p className="text-[11px] text-[#524538] font-sans mt-0.5">
                  {item.board}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#d9cdbd]/60 flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase text-[#73685c] font-semibold">
                  Board Score
                </span>
                <div className="flex items-baseline gap-0.5 font-mono">
                  <span className="text-xl sm:text-2xl font-black text-[#704a29] tracking-tight">
                    {item.score.toFixed(2)}
                  </span>
                  <span className="text-sm font-extrabold text-[#8c6239]">
                    {item.scale}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 4. CERTIFICATIONS & PROFESSIONAL CREDENTIALS */}
      {certifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#fffefb] border border-[#d9cdbd] shadow-2xs space-y-3.5"
        >
          <div className="flex items-center justify-between pb-3.5 border-b border-[#f0eae1]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#f4ece1] border border-[#d9cdbd] flex items-center justify-center text-[#704a29] shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#1e1713]">
                  Certifications &amp; Credentials
                </h3>
                <p className="text-xs text-[#73685c] font-sans">
                  Accredited licenses, academic honors &amp; verified document scans
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono text-[#704a29] font-bold px-2.5 py-0.5 rounded-full bg-[#f4ece1] border border-[#d9cdbd] whitespace-nowrap shrink-0">
              {certifications.length} Credentials
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {certifications.map((cert) => {
              const hasImages = cert.images && cert.images.length > 0;
              return (
                <div
                  key={cert.id}
                  className="p-3.5 sm:p-4 rounded-xl bg-[#faf7f2]/70 border border-[#e2d8cb] hover:bg-[#faf7f2] transition-all flex flex-col justify-between shadow-2xs group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {cert.issuer && (
                          <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#f4ece1] text-[#704a29] border border-[#d9cdbd]">
                            {cert.issuer}
                          </span>
                        )}
                        {cert.issueDate && (
                          <span className="text-[9.5px] font-mono text-[#73685c]">
                            {cert.issueDate}
                          </span>
                        )}
                      </div>

                      {hasImages && (
                        <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                          📷 {cert.images.length} {cert.images.length === 1 ? 'Scan' : 'Scans'}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-serif font-bold text-[#1e1713] mt-2 leading-snug break-words">
                      {cert.title}
                    </h4>
                  </div>

                  {/* Multi-Image Document Gallery Preview */}
                  {hasImages && (
                    <div className="mt-3 pt-2.5 border-t border-[#d9cdbd]/60">
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {cert.images.map((imgUrl, imgIdx) => (
                          <div
                            key={imgIdx}
                            onClick={() =>
                              setActiveModal({
                                images: cert.images,
                                currentIndex: imgIdx,
                                title: `${cert.title} — Document #${imgIdx + 1}`,
                              })
                            }
                            className="relative w-16 h-12 rounded-lg border border-[#d9cdbd] overflow-hidden bg-white shrink-0 cursor-pointer hover:border-[#704a29] transition group/thumb shadow-2xs"
                            title="Click to view full certificate scan"
                          >
                            <img
                              src={imgUrl}
                              alt={`${cert.title} scan ${imgIdx + 1}`}
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition duration-300"
                            />
                            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/thumb:opacity-100 transition flex items-center justify-center">
                              <ZoomIn className="w-3.5 h-3.5 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External verification URL button */}
                  {cert.credentialUrl && (
                    <div className="mt-2 pt-2 border-t border-[#d9cdbd]/40 flex justify-end">
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#704a29] hover:underline"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Fullscreen Certificate Lightbox Modal */}
      <AnimatePresence>
        {activeModal && (
          <div
            onClick={() => setActiveModal(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 cursor-zoom-out"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[92vh] bg-[#fffefb] rounded-2xl border border-[#d9cdbd] overflow-hidden shadow-2xl flex flex-col cursor-default"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#d9cdbd] bg-[#fbf8f3]">
                <div className="flex items-center gap-2 min-w-0 pr-4">
                  <Award className="w-4 h-4 text-[#704a29] shrink-0" />
                  <h4 className="text-xs sm:text-sm font-bold text-[#2b241e] font-serif truncate">
                    {activeModal.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-mono text-[#73685c] font-semibold">
                    {activeModal.currentIndex + 1} / {activeModal.images.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="p-1 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Image Display */}
              <div className="relative p-2 sm:p-4 bg-neutral-900/5 flex items-center justify-center overflow-auto max-h-[78vh]">
                <img
                  src={activeModal.images[activeModal.currentIndex]}
                  alt="Full resolution certificate document"
                  className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-sm"
                />

                {/* Prev / Next controls if multiple images */}
                {activeModal.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModal((prev) =>
                          prev
                            ? {
                                ...prev,
                                currentIndex:
                                  (prev.currentIndex - 1 + prev.images.length) % prev.images.length,
                              }
                            : null
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer shadow-md transition"
                      title="Previous scan"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModal((prev) =>
                          prev
                            ? {
                                ...prev,
                                currentIndex: (prev.currentIndex + 1) % prev.images.length,
                              }
                            : null
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer shadow-md transition"
                      title="Next scan"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
