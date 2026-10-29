import React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Calendar,
  School,
  CheckCircle2,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { InlineEditPopover } from '../editor/InlineEditPopover';

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
  const { activeContent, updateAcademic, isEditMode } = useSiteContent();

  const engineering = activeContent?.academic?.engineering || engineeringAcademicData;
  const schooling = activeContent?.academic?.schooling || schoolEducationData;
  const showSgpa = isEditMode || activeContent?.visibility?.showSgpaScores !== false;

  // Compute overall CGPA dynamically from completed semesters
  const completedSemesters: SemesterScore[] = [];
  engineering.forEach((yr) => {
    if (yr.semesters) {
      completedSemesters.push(...yr.semesters);
    }
  });

  const totalSgpa = completedSemesters.reduce((acc, curr) => acc + curr.sgpa, 0);
  const calculatedCgpa = completedSemesters.length > 0 ? totalSgpa / completedSemesters.length : 7.62;

  const handleUpdateSemesterSgpa = (yearIndex: number, semIndex: number, newSgpa: number) => {
    const copy = JSON.parse(JSON.stringify(engineering));
    if (copy[yearIndex]?.semesters?.[semIndex]) {
      copy[yearIndex].semesters[semIndex].sgpa = Number(newSgpa);
      // recalculate year average
      const semList = copy[yearIndex].semesters;
      const yrAvg = semList.reduce((acc: number, s: SemesterScore) => acc + s.sgpa, 0) / semList.length;
      copy[yearIndex].yearlyAverageSgpa = yrAvg;
      updateAcademic({ engineering: copy });
    }
  };

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
                        <InlineEditPopover
                          value={year.currentStatusLabel || '5th Semester Pursuing'}
                          label="Current Status"
                          onSave={(label) => {
                            const copy = [...engineering];
                            copy[yearIndex].currentStatusLabel = label;
                            updateAcademic({ engineering: copy });
                          }}
                        >
                          {year.currentStatusLabel || '5th Semester Pursuing'}
                        </InlineEditPopover>
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
                  <InlineEditPopover
                    value={year.program}
                    label="Program Title"
                    onSave={(val) => {
                      const copy = [...engineering];
                      copy[yearIndex].program = val;
                      updateAcademic({ engineering: copy });
                    }}
                  >
                    {year.program}
                  </InlineEditPopover>{' '}
                  &bull;{' '}
                  <span className="text-[#704a29] font-medium">
                    {year.institution}
                  </span>
                </p>
              </div>

              {/* 3rd Year B.E. In-Progress Content */}
              {isThirdYearPursuing ? (
                <div className="mt-3.5 p-3.5 rounded-xl bg-[#faf7f2]/70 border border-[#e2d8cb] shadow-2xs space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <h4 className="text-xs sm:text-sm font-serif font-bold text-[#2b241e]">
                        5th Semester
                      </h4>
                      <span className="text-[8.5px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Currently Pursuing
                      </span>
                    </div>
                    <p className="text-[11px] text-[#524538] font-sans leading-relaxed">
                      <InlineEditPopover
                        value={year.inProgressNote || ''}
                        label="In Progress Note"
                        type="textarea"
                        onSave={(note) => {
                          const copy = [...engineering];
                          copy[yearIndex].inProgressNote = note;
                          updateAcademic({ engineering: copy });
                        }}
                      >
                        {year.inProgressNote}
                      </InlineEditPopover>
                    </p>
                  </div>

                  <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#fffefb] border border-[#d9cdbd]">
                    <span className="text-[8.5px] font-mono uppercase font-semibold text-[#73685c]">
                      Academic Evaluation
                    </span>
                    <span className="text-[10.5px] font-mono font-bold text-[#704a29] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8c6239]" />
                      Grade Pending Semester Close
                    </span>
                  </div>
                </div>
              ) : (
                /* 1st & 2nd Year Semester-wise SGPA Score Cards with subtle progress indicators */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
                  {year.semesters?.map((sem, semIndex) => {
                    const percent = (sem.sgpa / sem.maxSgpa) * 100;

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
                                  <InlineEditPopover
                                    value={sem.sgpa}
                                    label={`${sem.semesterName} SGPA`}
                                    type="number"
                                    onSave={(score) => handleUpdateSemesterSgpa(yearIndex, semIndex, score)}
                                  >
                                    {sem.sgpa.toFixed(2)}
                                  </InlineEditPopover>
                                </span>
                                <span className="text-xs font-bold text-[#8c6239]">
                                  /{sem.maxSgpa} SGPA
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
                  <InlineEditPopover
                    value={item.subTitle}
                    label="School Subtitle"
                    onSave={(sub) => {
                      const copy = [...schooling];
                      copy[idx].subTitle = sub;
                      updateAcademic({ schooling: copy });
                    }}
                  >
                    {item.subTitle}
                  </InlineEditPopover>
                </h4>

                <p className="text-[11px] text-[#524538] font-sans mt-1">
                  {item.board}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#d9cdbd]/60 flex items-baseline justify-between">
                <span className="text-[10px] font-mono uppercase text-[#73685c] font-semibold">
                  Board Score
                </span>
                <div className="flex items-baseline gap-0.5 font-mono">
                  <span className="text-xl sm:text-2xl font-black text-[#704a29] tracking-tight">
                    <InlineEditPopover
                      value={item.score}
                      label="Board Score"
                      type="number"
                      onSave={(sc) => {
                        const copy = [...schooling];
                        copy[idx].score = Number(sc);
                        updateAcademic({ schooling: copy });
                      }}
                    >
                      {item.score.toFixed(2)}
                    </InlineEditPopover>
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
    </section>
  );
};
