import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Code2,
  Award,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Edit2,
  ExternalLink,
  Github,
  Check,
  X,
  Eye,
  EyeOff,
  Layers,
  Calendar,
  Clock,
  Sparkles,
  Building2,
  BookOpen,
  Upload,
  Image as ImageIcon,
  Loader2,
  ZoomIn,
  FileText,
  GripVertical,
  Move,
} from 'lucide-react';
import { useOwnerEditor } from '../../../context/OwnerEditorContext';
import { Project, ProjectCategory, FilterCategory } from '../../../data/projects';
import { SkillItem } from '../../skills/SkillsSection';
import { YearAcademicData, SemesterScore } from '../../education/EducationSection';
import { CertificateItem, CertificateEntry, normalizeCertificate } from '../../../types/content';

const projectCategoryOptions: ProjectCategory[] = [
  'Full-Stack Development · Event Management',
  'Web Development · Education',
  'Cybersecurity · Machine Learning',
  'Artificial Intelligence · Medical Imaging',
  'Web Development · Developer Tools',
  'Web Development · Travel & Booking',
  'Hardware & Cloud · Systems Architecture',
];

const visualTypeOptions: Project['visualType'][] = [
  'scanner',
  'apex',
  'netsentinel',
  'brain',
  'omniqr',
  'trails',
  'nfc',
];

const gradientOptions: Project['gradient'][] = [
  'vintage',
  'kraft',
  'orange',
  'gray',
  'purple',
  'green',
];

export const ProfessionalModule: React.FC = () => {
  const {
    draftContent,
    updateProjects,
    updateAcademic,
    updateSkills,
    updateVisibility,
    uploadMedia,
    showToast,
  } = useOwnerEditor();

  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'academic' | 'skills' | 'certifications'>('projects');

  // Editing Project Modal / Form State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState<boolean>(false);
  const [isUploadingProjectImg, setIsUploadingProjectImg] = useState<boolean>(false);
  const [isProjectDragOver, setIsProjectDragOver] = useState<boolean>(false);
  const projectFileInputRef = useRef<HTMLInputElement>(null);

  // New Skill Form State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillItem['category']>('Languages');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillItem['level']>('Advanced');
  const [newSkillDesc, setNewSkillDesc] = useState('');

  // Certificate Management State (supporting multiple image uploads & drag-and-drop)
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [isNewCert, setIsNewCert] = useState<boolean>(false);
  const [isUploadingCertImages, setIsUploadingCertImages] = useState<boolean>(false);
  const [isCertDragOver, setIsCertDragOver] = useState<boolean>(false);
  const [draggedCertImageIdx, setDraggedCertImageIdx] = useState<number | null>(null);
  const [dragOverCertImageIdx, setDragOverCertImageIdx] = useState<number | null>(null);
  const certFileInputRef = useRef<HTMLInputElement>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  const projects = draftContent.projects || [];
  const academic = draftContent.academic || { engineering: [], schooling: [], certifications: [], achievements: [] };
  const skills = draftContent.skills || [];
  const visibility = draftContent.visibility;

  // Reordering Projects
  const moveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const updated = [...projects];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    updateProjects(updated);
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    updateProjects(updated);
    showToast('Project removed.', 'info');
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.title.trim()) {
      showToast('Project title is required.', 'error');
      return;
    }

    if (isNewProject) {
      updateProjects([editingProject, ...projects]);
      showToast('New project added to portfolio.', 'success');
    } else {
      updateProjects(projects.map((p) => (p.id === editingProject.id ? editingProject : p)));
      showToast('Project updated.', 'success');
    }

    setEditingProject(null);
    setIsNewProject(false);
  };

  // Add Skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: SkillItem = {
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
      iconType: newSkillName.toLowerCase().replace(/[^a-z0-9]/g, ''),
      description: newSkillDesc.trim() || `${newSkillLevel} proficiency in ${newSkillName.trim()}`,
    };

    updateSkills([...skills, newSkill]);
    setNewSkillName('');
    setNewSkillDesc('');
    showToast(`Added ${newSkill.name} to skills.`, 'success');
  };

  const handleDeleteSkill = (name: string) => {
    updateSkills(skills.filter((s) => s.name !== name));
    showToast(`Removed skill ${name}.`, 'info');
  };

  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProject) return;
    setIsUploadingProjectImg(true);
    try {
      const url = await uploadMedia(file, 'projects');
      setEditingProject((prev) => (prev ? { ...prev, imageUrl: url } : null));
    } catch (err: any) {
      console.error('Project image upload failed:', err);
    } finally {
      setIsUploadingProjectImg(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleProjectDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProjectDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !editingProject) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please drop an image file (PNG, JPG, WEBP, SVG).', 'error');
      return;
    }
    setIsUploadingProjectImg(true);
    try {
      const url = await uploadMedia(file, 'projects');
      setEditingProject((prev) => (prev ? { ...prev, imageUrl: url } : null));
      showToast('Project media updated via drag & drop.', 'success');
    } catch (err: any) {
      console.error('Project image upload failed:', err);
    } finally {
      setIsUploadingProjectImg(false);
    }
  };

  // ================= CERTIFICATIONS MANAGEMENT (MULTI-IMAGE & DRAG-AND-DROP) =================
  const normalizedCertifications: CertificateItem[] = (academic.certifications || []).map((c, i) =>
    normalizeCertificate(c, i)
  );

  const handleOpenAddCert = () => {
    setEditingCert({
      id: `cert-${Date.now()}`,
      title: '',
      issuer: '',
      issueDate: '',
      credentialUrl: '',
      images: [],
    });
    setIsNewCert(true);
  };

  const handleOpenEditCert = (cert: CertificateItem) => {
    setEditingCert({ ...cert, images: [...(cert.images || [])] });
    setIsNewCert(false);
  };

  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !editingCert.title.trim()) {
      showToast('Certificate title is required.', 'error');
      return;
    }

    const currentList = [...normalizedCertifications];
    if (isNewCert) {
      const updated = [editingCert, ...currentList];
      updateAcademic({ ...academic, certifications: updated });
      showToast(`Added credential "${editingCert.title}".`, 'success');
    } else {
      const updated = currentList.map((c) => (c.id === editingCert.id ? editingCert : c));
      updateAcademic({ ...academic, certifications: updated });
      showToast(`Updated credential "${editingCert.title}".`, 'success');
    }

    setEditingCert(null);
    setIsNewCert(false);
  };

  const handleDeleteCert = (id: string) => {
    const updated = normalizedCertifications.filter((c) => c.id !== id);
    updateAcademic({ ...academic, certifications: updated });
    showToast('Credential removed.', 'info');
  };

  // Process multiple certificate image files (from file input or drag-and-drop)
  const processCertificateFiles = async (files: File[]) => {
    if (files.length === 0 || !editingCert) return;

    const imageFiles = files.filter(
      (file) => file.type.startsWith('image/') || /\.(png|jpe?g|webp|svg|gif|avif)$/i.test(file.name)
    );

    if (imageFiles.length === 0) {
      showToast('Please select or drop valid image files (PNG, JPG, WEBP, SVG).', 'error');
      return;
    }

    setIsUploadingCertImages(true);
    try {
      const newUrls: string[] = [];
      for (const file of imageFiles) {
        const url = await uploadMedia(file, 'certificates');
        newUrls.push(url);
      }
      setEditingCert((prev) =>
        prev
          ? {
              ...prev,
              images: [...(prev.images || []), ...newUrls],
            }
          : null
      );
      showToast(`Added ${newUrls.length} certificate image(s).`, 'success');
    } catch (err: any) {
      console.error('Cert image upload error:', err);
    } finally {
      setIsUploadingCertImages(false);
      if (certFileInputRef.current) certFileInputRef.current.value = '';
    }
  };

  const handleCertImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    await processCertificateFiles(files);
  };

  // Certificate Drag & Drop Handlers
  const handleCertDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes('Files') && !isCertDragOver) {
      setIsCertDragOver(true);
    }
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCertDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsCertDragOver(false);
  };

  const handleCertDropzoneDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCertDragOver(false);
    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    if (files.length > 0) {
      await processCertificateFiles(files);
    }
  };

  // Thumbnail Drag-to-Reorder Handlers
  const handleCertThumbDragStart = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    setDraggedCertImageIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleCertThumbDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedCertImageIdx === null || draggedCertImageIdx === index) return;
    setDragOverCertImageIdx(index);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCertThumbDragLeave = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    if (dragOverCertImageIdx === index) {
      setDragOverCertImageIdx(null);
    }
  };

  const handleCertThumbDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverCertImageIdx(null);

    // If reordering existing thumbnails:
    if (draggedCertImageIdx !== null) {
      if (draggedCertImageIdx === targetIndex || !editingCert) {
        setDraggedCertImageIdx(null);
        return;
      }
      const updatedImages = [...(editingCert.images || [])];
      const [moved] = updatedImages.splice(draggedCertImageIdx, 1);
      updatedImages.splice(targetIndex, 0, moved);
      setEditingCert({ ...editingCert, images: updatedImages });
      setDraggedCertImageIdx(null);
      showToast('Reordered certificate images.', 'info');
      return;
    }

    // If dropping new external file(s) on a thumbnail:
    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    if (files.length > 0) {
      await processCertificateFiles(files);
    }
  };

  const handleCertThumbDragEnd = () => {
    setDraggedCertImageIdx(null);
    setDragOverCertImageIdx(null);
  };

  const handleMoveCertImage = (fromIdx: number, toIdx: number) => {
    if (!editingCert || !editingCert.images) return;
    if (toIdx < 0 || toIdx >= editingCert.images.length) return;
    const updatedImages = [...editingCert.images];
    const [moved] = updatedImages.splice(fromIdx, 1);
    updatedImages.splice(toIdx, 0, moved);
    setEditingCert({ ...editingCert, images: updatedImages });
  };

  const handleRemoveCertImage = (imageIndex: number) => {
    if (!editingCert) return;
    const updatedImages = [...(editingCert.images || [])];
    updatedImages.splice(imageIndex, 1);
    setEditingCert({ ...editingCert, images: updatedImages });
    showToast('Image removed from credential.', 'info');
  };

  // ================= ACADEMIC YEARS & SEMESTER SGPA MANAGERS =================
  const recalculateAcademic = (engineeringList: YearAcademicData[]): YearAcademicData[] => {
    return engineeringList.map((year) => {
      const validSems = (year.semesters || []).filter(
        (s) => typeof s.sgpa === 'number' && s.sgpa > 0
      );
      const avg =
        validSems.length > 0
          ? Number((validSems.reduce((a, b) => a + b.sgpa, 0) / validSems.length).toFixed(2))
          : undefined;
      return {
        ...year,
        yearlyAverageSgpa: avg,
      };
    });
  };

  const handleUpdateYear = (yearIndex: number, patch: Partial<YearAcademicData>) => {
    const updated = [...(academic.engineering || [])];
    updated[yearIndex] = { ...updated[yearIndex], ...patch };
    const recalculated = recalculateAcademic(updated);
    updateAcademic({ ...academic, engineering: recalculated });
  };

  const handleAddYear = () => {
    const list = academic.engineering || [];
    const nextYearNum = list.length + 1;
    const suffix =
      nextYearNum === 1 ? 'st' : nextYearNum === 2 ? 'nd' : nextYearNum === 3 ? 'rd' : 'th';
    const newYear: YearAcademicData = {
      id: `be-year-${nextYearNum}-${Date.now()}`,
      yearTitle: `${nextYearNum}${suffix} Year B.E.`,
      program: 'Bachelor of Engineering (B.E.) — Computer Science & Engineering',
      institution: 'Bangalore Technological Institute (BTI)',
      duration: `${2023 + nextYearNum} – ${2024 + nextYearNum}`,
      status: nextYearNum <= 2 ? 'Completed' : 'In Progress',
      currentStatusLabel: `${nextYearNum * 2 - 1}${
        nextYearNum * 2 - 1 === 1 ? 'st' : nextYearNum * 2 - 1 === 2 ? 'nd' : nextYearNum * 2 - 1 === 3 ? 'rd' : 'th'
      } Semester Pursuing`,
      inProgressNote:
        nextYearNum > 2
          ? 'Currently enrolled in advanced coursework and laboratory practicals under VTU.'
          : undefined,
      semesters: [
        {
          semesterNumber: nextYearNum * 2 - 1,
          semesterName: `${nextYearNum * 2 - 1}${
            nextYearNum * 2 - 1 === 1
              ? 'st'
              : nextYearNum * 2 - 1 === 2
              ? 'nd'
              : nextYearNum * 2 - 1 === 3
              ? 'rd'
              : 'th'
          } Semester`,
          sgpa: 8.0,
          maxSgpa: 10.0,
        },
      ],
    };
    const updated = [...list, newYear];
    updateAcademic({ ...academic, engineering: recalculateAcademic(updated) });
    showToast(`Added ${newYear.yearTitle}.`, 'success');
  };

  const handleDeleteYear = (yearIndex: number) => {
    const updated = [...(academic.engineering || [])];
    const removedTitle = updated[yearIndex]?.yearTitle || 'Academic year';
    updated.splice(yearIndex, 1);
    updateAcademic({ ...academic, engineering: recalculateAcademic(updated) });
    showToast(`${removedTitle} removed.`, 'info');
  };

  const handleMoveYear = (yearIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? yearIndex - 1 : yearIndex + 1;
    const list = academic.engineering || [];
    if (targetIndex < 0 || targetIndex >= list.length) return;
    const updated = [...list];
    const [moved] = updated.splice(yearIndex, 1);
    updated.splice(targetIndex, 0, moved);
    updateAcademic({ ...academic, engineering: updated });
  };

  const handleAddSemester = (yearIndex: number) => {
    const updated = [...(academic.engineering || [])];
    const year = { ...updated[yearIndex] };
    const currentSems = [...(year.semesters || [])];
    const maxNum =
      currentSems.length > 0
        ? Math.max(...currentSems.map((s) => s.semesterNumber))
        : yearIndex * 2;
    const nextSemNum = maxNum + 1;
    const suffix =
      nextSemNum === 1 ? 'st' : nextSemNum === 2 ? 'nd' : nextSemNum === 3 ? 'rd' : 'th';

    currentSems.push({
      semesterNumber: nextSemNum,
      semesterName: `${nextSemNum}${suffix} Semester`,
      sgpa: 8.0,
      maxSgpa: 10.0,
    });

    year.semesters = currentSems;
    updated[yearIndex] = year;
    updateAcademic({ ...academic, engineering: recalculateAcademic(updated) });
    showToast(`Added ${nextSemNum}${suffix} Semester to ${year.yearTitle}.`, 'success');
  };

  const handleUpdateSemester = (
    yearIndex: number,
    semIndex: number,
    patch: Partial<SemesterScore>
  ) => {
    const updated = [...(academic.engineering || [])];
    const year = { ...updated[yearIndex] };
    const sems = [...(year.semesters || [])];
    sems[semIndex] = { ...sems[semIndex], ...patch };
    year.semesters = sems;
    updated[yearIndex] = year;
    updateAcademic({ ...academic, engineering: recalculateAcademic(updated) });
  };

  const handleDeleteSemester = (yearIndex: number, semIndex: number) => {
    const updated = [...(academic.engineering || [])];
    const year = { ...updated[yearIndex] };
    const sems = [...(year.semesters || [])];
    const removedName = sems[semIndex]?.semesterName || 'Semester';
    sems.splice(semIndex, 1);
    year.semesters = sems;
    updated[yearIndex] = year;
    updateAcademic({ ...academic, engineering: recalculateAcademic(updated) });
    showToast(`${removedName} removed.`, 'info');
  };

  // Cumulative CGPA calculation
  const allCompletedSemesters = (academic.engineering || [])
    .flatMap((y) => y.semesters || [])
    .filter((s) => typeof s.sgpa === 'number' && s.sgpa > 0);
  const totalSgpa = allCompletedSemesters.reduce((acc, curr) => acc + curr.sgpa, 0);
  const calculatedCgpa =
    allCompletedSemesters.length > 0 ? (totalSgpa / allCompletedSemesters.length).toFixed(2) : '7.62';

  return (
    <div className="space-y-8 max-w-4xl font-serif">
      {/* Module Title */}
      <div>
        <h2 className="text-xl font-bold text-[#2b241e] tracking-tight">
          Professional Credentials & Projects
        </h2>
        <p className="text-xs text-[#73685c] mt-1">
          Manage your engineering portfolio projects, academic semester records, technical skill proficiencies, and certifications.
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#fffefb] border border-[#d9cdbd] overflow-x-auto shadow-2xs">
        {[
          { id: 'projects', label: 'Projects Portfolio', icon: Briefcase, count: projects.length },
          { id: 'academic', label: 'Academics & SGPA', icon: GraduationCap, count: academic.engineering?.length || 0 },
          { id: 'skills', label: 'Technical Skills', icon: Code2, count: skills.length },
          { id: 'certifications', label: 'Certifications', icon: Award, count: academic.certifications?.length || 0 },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#704a29] text-white font-bold shadow-xs'
                  : 'text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1]'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-[#f0eae1] text-[#704a29]'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ================= PROJECTS SUB-MODULE ================= */}
      {activeSubTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold">
              Featured Engineering Projects ({projects.length})
            </h3>
            <button
              onClick={() => {
                setEditingProject({
                  id: `project-${Date.now()}`,
                  title: '',
                  description: '',
                  category: 'Full-Stack Development · Event Management',
                  filterCategories: ['Full-Stack', 'Web Apps'],
                  technologies: ['React', 'TypeScript'],
                  githubUrl: '',
                  liveUrl: '',
                  badgeColor: '#10B981',
                  gradient: 'green',
                  visualType: 'scanner',
                  featured: true,
                });
                setIsNewProject(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#704a29] text-white hover:bg-[#593a1f] font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Add New Project</span>
            </button>
          </div>

          {/* Project List */}
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl bg-[#fffefb] border border-[#d9cdbd] hover:border-[#704a29] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs overflow-hidden"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1 overflow-hidden">
                  {proj.imageUrl ? (
                    <img
                      src={proj.imageUrl}
                      alt={proj.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-xs border border-[#d9cdbd]"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs border border-[#d9cdbd]"
                      style={{
                        backgroundColor:
                          proj.badgeColor &&
                          proj.badgeColor !== '#ffffff' &&
                          proj.badgeColor !== '#fff' &&
                          proj.badgeColor.trim() !== ''
                            ? proj.badgeColor
                            : '#704a29',
                      }}
                    >
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      <h4 className="text-sm font-bold text-[#2b241e] break-words break-all">
                        {proj.title || 'Untitled Project'}
                      </h4>
                      {proj.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-[#f0eae1] text-[#704a29] text-[10px] font-bold border border-[#d9cdbd] shrink-0">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#73685c] line-clamp-2 mt-0.5 break-words break-all">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {proj.technologies?.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-[#fbf8f3] border border-[#d9cdbd] text-[10px] text-[#73685c] max-w-full truncate"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => moveProject(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg bg-[#f0eae1] hover:bg-[#e5ded5] text-[#2b241e] disabled:opacity-30 cursor-pointer shadow-2xs"
                    title="Move Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveProject(idx, 'down')}
                    disabled={idx === projects.length - 1}
                    className="p-1.5 rounded-lg bg-[#f0eae1] hover:bg-[#e5ded5] text-[#2b241e] disabled:opacity-30 cursor-pointer shadow-2xs"
                    title="Move Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingProject({ ...proj });
                      setIsNewProject(false);
                    }}
                    className="p-1.5 rounded-lg bg-[#f0eae1] hover:bg-[#e5ded5] text-[#704a29] border border-[#d9cdbd] cursor-pointer shadow-2xs"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProject(proj.id)}
                    className="p-1.5 rounded-lg bg-[#fef2f2] hover:bg-[#fee2e2] text-[#bc473b] border border-[#fca5a5] cursor-pointer shadow-2xs"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#d9cdbd]">
                <h3 className="text-base font-bold text-[#2b241e]">
                  {isNewProject ? 'Add Engineering Project' : 'Edit Project Details'}
                </h3>
                <button
                  onClick={() => setEditingProject(null)}
                  className="text-[#73685c] hover:text-[#2b241e] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    required
                    placeholder="e.g. SmartNFC Virtual Identity Platform"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-sm text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                    Category Specialization
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as ProjectCategory })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                  >
                    {projectCategoryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    placeholder="Concise overview of engineering architecture, problem statement, and impact..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-sm text-[#2b241e] focus:outline-none focus:border-[#704a29] resize-none"
                  />
                </div>

                {/* Project Screenshot / Media File Upload */}
                <div className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs uppercase tracking-wider text-[#704a29] font-bold flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Project Screenshot / Media File</span>
                    </label>
                    {editingProject.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setEditingProject({ ...editingProject, imageUrl: '' })}
                        className="text-[11px] text-[#bc473b] hover:underline cursor-pointer"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>

                  {editingProject.imageUrl ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.dataTransfer.types.includes('Files') && !isProjectDragOver) setIsProjectDragOver(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                        setIsProjectDragOver(false);
                      }}
                      onDrop={handleProjectDrop}
                      className={`relative w-full h-32 rounded-lg border overflow-hidden bg-white group shadow-2xs transition-all ${
                        isProjectDragOver ? 'border-[#704a29] ring-4 ring-[#704a29]/20' : 'border-[#d9cdbd]'
                      }`}
                    >
                      <img
                        src={editingProject.imageUrl}
                        alt="Project Media Preview"
                        className="w-full h-full object-cover"
                      />
                      {isProjectDragOver && (
                        <div className="absolute inset-0 bg-[#704a29]/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-10">
                          <Upload className="w-7 h-7 animate-bounce mb-1" />
                          <p className="text-xs font-bold">Drop to replace project image</p>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setLightboxImage({
                            url: editingProject.imageUrl || '',
                            title: editingProject.title || 'Project Asset',
                          })
                        }
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white gap-1.5 text-xs font-semibold cursor-pointer"
                      >
                        <ZoomIn className="w-4 h-4" />
                        <span>Enlarge Asset</span>
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.dataTransfer.types.includes('Files') && !isProjectDragOver) setIsProjectDragOver(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                        setIsProjectDragOver(false);
                      }}
                      onDrop={handleProjectDrop}
                      onClick={() => projectFileInputRef.current?.click()}
                      className={`p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        isProjectDragOver
                          ? 'border-[#704a29] bg-[#f5ede4] ring-4 ring-[#704a29]/15 scale-[1.01]'
                          : 'border-[#d9cdbd] bg-[#fffefb] hover:border-[#704a29] hover:bg-[#fbf8f3]'
                      }`}
                    >
                      <Upload className={`w-6 h-6 mb-1 ${isProjectDragOver ? 'text-[#704a29] animate-bounce' : 'text-[#73685c]'}`} />
                      <p className="text-xs text-[#73685c]">
                        {isProjectDragOver ? (
                          <span className="font-bold text-[#704a29]">Drop media file here!</span>
                        ) : (
                          <>Drag &amp; drop preview screenshot, or <span className="text-[#704a29] underline font-semibold">browse</span></>
                        )}
                      </p>
                      <span className="text-[10px] text-[#9c9184] mt-0.5">JPEG, PNG, WEBP or SVG up to 5MB</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <label className="px-3.5 py-1.5 rounded-lg bg-[#704a29] text-white hover:bg-[#593a1f] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0">
                      {isUploadingProjectImg ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose Media File</span>
                        </>
                      )}
                      <input
                        ref={projectFileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/svg+xml"
                        disabled={isUploadingProjectImg}
                        onChange={handleProjectImageUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="url"
                      value={editingProject.imageUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                      placeholder="Or paste image URL (https://...)"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#fffefb] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                      GitHub Repository
                    </label>
                    <input
                      type="url"
                      value={editingProject.githubUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                      Live Deployment URL
                    </label>
                    <input
                      type="url"
                      value={editingProject.liveUrl || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                    Technologies (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={editingProject.technologies.join(', ')}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    placeholder="React, TypeScript, Firebase, Tailwind"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                      Badge Color
                    </label>
                    <input
                      type="text"
                      value={editingProject.badgeColor}
                      onChange={(e) => setEditingProject({ ...editingProject, badgeColor: e.target.value })}
                      placeholder="#10B981"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                      Card Gradient
                    </label>
                    <select
                      value={editingProject.gradient}
                      onChange={(e) => setEditingProject({ ...editingProject, gradient: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    >
                      {gradientOptions.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featuredProj"
                    checked={editingProject.featured || false}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="rounded border-[#d9cdbd] text-[#704a29] focus:ring-[#704a29]"
                  />
                  <label htmlFor="featuredProj" className="text-xs text-[#73685c] cursor-pointer">
                    Feature this project prominently on the homepage
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#d9cdbd]">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-xl bg-[#f0eae1] hover:bg-[#e5ded5] text-xs text-[#73685c] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-xs font-bold text-white shadow-xs cursor-pointer"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= ACADEMICS & SGPA SUB-MODULE ================= */}
      {activeSubTab === 'academic' && (
        <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 space-y-6 shadow-2xs">
          {/* Header & Overall Metric Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#d9cdbd] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#704a29]" />
                <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold">
                  Engineering Semester Records & SGPA
                </h3>
              </div>
              <p className="text-xs text-[#73685c] mt-0.5">
                Manage academic grades, semester performance, and backface ID card visibility.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono px-3 py-1.5 rounded-full bg-[#f0eae1] border border-[#d9cdbd] text-[#704a29] font-bold shadow-2xs">
                Cumulative CGPA: {calculatedCgpa} / 10.0
              </span>

              <button
                type="button"
                onClick={() => updateVisibility({ showSgpaScores: !visibility.showSgpaScores })}
                className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs transition ${
                  visibility.showSgpaScores
                    ? 'bg-[#f2f8f2] border-[#86efac] text-[#166534] font-bold'
                    : 'bg-[#f0eae1] border-[#d9cdbd] text-[#73685c]'
                }`}
              >
                {visibility.showSgpaScores ? (
                  <Eye className="w-3.5 h-3.5 text-[#16a34a]" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-[#73685c]" />
                )}
                <span>{visibility.showSgpaScores ? 'Scores Visible' : 'Scores Hidden'}</span>
              </button>

              <button
                type="button"
                onClick={handleAddYear}
                className="px-3.5 py-1.5 rounded-lg bg-[#704a29] hover:bg-[#593a1f] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Year</span>
              </button>
            </div>
          </div>

          {/* Academic Years List */}
          <div className="space-y-5">
            {(academic.engineering || []).map((yearData, yIdx) => {
              const semesters = yearData.semesters || [];
              const isCompleted = yearData.status === 'Completed';

              return (
                <div
                  key={yearData.id || `year-${yIdx}`}
                  className="p-5 rounded-2xl bg-[#fbf8f3] border border-[#d9cdbd] space-y-4 shadow-2xs transition-all hover:border-[#b89574]"
                >
                  {/* Year Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#d9cdbd]/70 gap-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <input
                        type="text"
                        value={yearData.yearTitle}
                        onChange={(e) => handleUpdateYear(yIdx, { yearTitle: e.target.value })}
                        className="px-2.5 py-1 rounded-lg bg-[#fffefb] border border-[#d9cdbd] text-sm font-bold font-serif text-[#2b241e] focus:outline-none focus:border-[#704a29] max-w-[180px]"
                        placeholder="e.g. 3rd Year B.E."
                      />

                      <select
                        value={yearData.status}
                        onChange={(e) =>
                          handleUpdateYear(yIdx, {
                            status: e.target.value as 'Completed' | 'In Progress',
                          })
                        }
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold focus:outline-none cursor-pointer ${
                          isCompleted
                            ? 'bg-[#f2f8f2] border-[#86efac] text-[#166534]'
                            : 'bg-amber-50 border-amber-300 text-amber-800'
                        }`}
                      >
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                      </select>

                      {yearData.yearlyAverageSgpa ? (
                        <span className="text-xs font-mono font-bold text-[#704a29] bg-[#f0eae1] px-2 py-0.5 rounded border border-[#d9cdbd] whitespace-nowrap">
                          Avg: {yearData.yearlyAverageSgpa.toFixed(2)} / 10
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveYear(yIdx, 'up')}
                        disabled={yIdx === 0}
                        className="p-1 rounded bg-[#fffefb] border border-[#d9cdbd] text-[#73685c] hover:text-[#2b241e] disabled:opacity-30 cursor-pointer shadow-2xs"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveYear(yIdx, 'down')}
                        disabled={yIdx === (academic.engineering || []).length - 1}
                        className="p-1 rounded bg-[#fffefb] border border-[#d9cdbd] text-[#73685c] hover:text-[#2b241e] disabled:opacity-30 cursor-pointer shadow-2xs"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      {(academic.engineering || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteYear(yIdx)}
                          className="p-1 rounded bg-[#fffefb] hover:bg-[#fbf0ef] border border-[#d9cdbd] hover:border-[#f5c6c2] text-[#bc473b] cursor-pointer shadow-2xs"
                          title="Delete Year"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Year Sub-fields (Duration, Institution, Program) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#73685c] font-bold mb-1">
                        Academic Duration
                      </label>
                      <input
                        type="text"
                        value={yearData.duration || ''}
                        onChange={(e) => handleUpdateYear(yIdx, { duration: e.target.value })}
                        placeholder="e.g. 2026 – Present"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#fffefb] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#73685c] font-bold mb-1">
                        Institution / College
                      </label>
                      <input
                        type="text"
                        value={yearData.institution || ''}
                        onChange={(e) => handleUpdateYear(yIdx, { institution: e.target.value })}
                        placeholder="e.g. Bangalore Technological Institute (BTI)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#fffefb] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#73685c] font-bold mb-1">
                        Engineering Curriculum
                      </label>
                      <input
                        type="text"
                        value={yearData.program || ''}
                        onChange={(e) => handleUpdateYear(yIdx, { program: e.target.value })}
                        placeholder="e.g. B.E. — Computer Science & Engineering"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#fffefb] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                      />
                    </div>
                  </div>

                  {/* In-Progress specific controls */}
                  {!isCompleted && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-[#faf7f2] border border-[#e2d8cb] text-xs">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-[#73685c] font-bold mb-1">
                          Current Status Badge
                        </label>
                        <input
                          type="text"
                          value={yearData.currentStatusLabel || ''}
                          onChange={(e) =>
                            handleUpdateYear(yIdx, { currentStatusLabel: e.target.value })
                          }
                          placeholder="e.g. 5th Semester Pursuing"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#fffefb] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase tracking-wider text-[#73685c] font-bold mb-1">
                          In-Progress Status Note (Publicly Displayed)
                        </label>
                        <input
                          type="text"
                          value={yearData.inProgressNote || ''}
                          onChange={(e) =>
                            handleUpdateYear(yIdx, { inProgressNote: e.target.value })
                          }
                          placeholder="e.g. Currently enrolled in V Semester coursework and laboratory practicals under VTU."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#fffefb] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Semesters Sub-Grid */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[11px] uppercase tracking-wider text-[#73685c] font-bold">
                        Evaluated Semesters ({semesters.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddSemester(yIdx)}
                        className="px-2.5 py-1 rounded-lg bg-[#fffefb] hover:bg-[#f0eae1] border border-[#d9cdbd] text-xs text-[#704a29] font-bold flex items-center gap-1 cursor-pointer transition shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Semester</span>
                      </button>
                    </div>

                    {semesters.length === 0 ? (
                      <div className="p-4 rounded-xl bg-[#fffefb] border border-dashed border-[#d9cdbd] text-center space-y-2">
                        <p className="text-xs text-[#73685c]">
                          No semester grade evaluations added yet for {yearData.yearTitle}.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleAddSemester(yIdx)}
                          className="px-3 py-1.5 rounded-lg bg-[#704a29] hover:bg-[#593a1f] text-white text-xs font-semibold shadow-xs inline-flex items-center gap-1.5 cursor-pointer transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Semester Evaluation</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {semesters.map((sem, sIdx) => (
                          <div
                            key={sem.semesterNumber || `sem-${sIdx}`}
                            className="p-3 rounded-xl bg-[#fffefb] border border-[#d9cdbd] space-y-2 shadow-2xs relative group"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <input
                                type="text"
                                value={sem.semesterName || `Sem ${sem.semesterNumber}`}
                                onChange={(e) =>
                                  handleUpdateSemester(yIdx, sIdx, {
                                    semesterName: e.target.value,
                                  })
                                }
                                className="px-1.5 py-0.5 rounded bg-transparent border border-transparent hover:border-[#d9cdbd] focus:border-[#704a29] text-xs font-bold text-[#2b241e] focus:outline-none w-28"
                                placeholder="Semester Name"
                              />

                              <button
                                type="button"
                                onClick={() => handleDeleteSemester(yIdx, sIdx)}
                                className="p-1 rounded text-[#a89d91] hover:text-[#bc473b] hover:bg-[#fbf0ef] cursor-pointer transition opacity-60 group-hover:opacity-100"
                                title="Delete Semester"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#f0eae1]">
                              <span className="text-[10px] text-[#73685c] uppercase font-bold">
                                SGPA:
                              </span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  max="10"
                                  value={sem.sgpa}
                                  onChange={(e) =>
                                    handleUpdateSemester(yIdx, sIdx, {
                                      sgpa: parseFloat(e.target.value) || 0,
                                    })
                                  }
                                  className="w-16 px-1.5 py-1 rounded bg-[#fbf8f3] border border-[#d9cdbd] text-xs font-mono font-bold text-[#704a29] text-right focus:outline-none focus:border-[#704a29]"
                                />
                                <span className="text-[10px] text-[#8c6239] font-mono font-bold">
                                  /10.0
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-1">
                              <input
                                type="text"
                                value={sem.badge || ''}
                                onChange={(e) =>
                                  handleUpdateSemester(yIdx, sIdx, {
                                    badge: e.target.value,
                                  })
                                }
                                placeholder="Badge (e.g. Semester High)"
                                className="w-full text-[10px] px-1.5 py-0.5 rounded bg-[#fbf8f3] border border-[#d9cdbd]/60 text-[#704a29] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TECHNICAL SKILLS SUB-MODULE ================= */}
      {activeSubTab === 'skills' && (
        <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="pb-3 border-b border-[#d9cdbd]">
            <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold">
              Technical Skill Matrix ({skills.length})
            </h3>
            <p className="text-xs text-[#73685c] mt-0.5">
              Add programming languages, frameworks, cloud tooling, and system competencies.
            </p>
          </div>

          {/* Add Skill Form */}
          <form onSubmit={handleAddSkill} className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Skill name (e.g. Next.js, Rust, Docker)"
              className="flex-1 min-w-[180px] px-3.5 py-2 rounded-xl bg-[#fffefb] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
            />
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as any)}
              className="px-3.5 py-2 rounded-xl bg-[#fffefb] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
            >
              <option value="Languages">Languages</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="AI & ML">AI & ML</option>
              <option value="Hardware">Hardware</option>
              <option value="Tools">Tools</option>
            </select>
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value as any)}
              className="px-3.5 py-2 rounded-xl bg-[#fffefb] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
            >
              <option value="Advanced">Advanced</option>
              <option value="Proficient">Proficient</option>
              <option value="Hands-on">Hands-on</option>
              <option value="Specialized">Specialized</option>
            </select>
            <input
              type="text"
              value={newSkillDesc}
              onChange={(e) => setNewSkillDesc(e.target.value)}
              placeholder="Brief description (optional)"
              className="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-[#fffefb] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-xs font-bold text-white cursor-pointer shrink-0 ml-auto shadow-xs"
            >
              Add Skill
            </button>
          </form>

          {/* Skills Grid */}
          <div className="flex flex-wrap gap-2.5">
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="group pl-3 pr-2 py-1.5 rounded-xl bg-[#f0eae1] border border-[#d9cdbd] hover:border-[#704a29] flex items-center gap-2 transition shadow-2xs"
              >
                <span className="text-xs font-bold text-[#2b241e]">{skill.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-white text-[#704a29] border border-[#d9cdbd] font-semibold">
                  {skill.level}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(skill.name)}
                  className="text-[#73685c] hover:text-[#bc473b] transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= CERTIFICATIONS SUB-MODULE ================= */}
      {activeSubTab === 'certifications' && (
        <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#d9cdbd] gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#704a29]" />
                <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold">
                  Certifications &amp; Professional Credentials ({normalizedCertifications.length})
                </h3>
              </div>
              <p className="text-xs text-[#73685c] mt-0.5">
                Highlight verifiable licenses, academic honors, course completions, and multi-image certificate credentials.
              </p>
            </div>

            {!editingCert && (
              <button
                type="button"
                onClick={handleOpenAddCert}
                className="px-3.5 py-1.5 rounded-lg bg-[#704a29] text-white hover:bg-[#593a1f] font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>Add Credential</span>
              </button>
            )}
          </div>

          {/* Add / Edit Certificate Form Modal or Card */}
          <AnimatePresence>
            {editingCert && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSaveCert}
                className="p-5 sm:p-6 rounded-2xl bg-[#faf7f2] border-2 border-[#b89574] space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#d9cdbd]">
                  <h4 className="text-sm font-bold text-[#2b241e] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#704a29]" />
                    <span>{isNewCert ? 'Add New Certificate Credential' : 'Edit Certificate Credential'}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCert(null);
                      setIsNewCert(false);
                    }}
                    className="text-[#73685c] hover:text-[#2b241e] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73685c] font-bold mb-1">
                      Certificate / Credential Title *
                    </label>
                    <input
                      type="text"
                      value={editingCert.title}
                      onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                      required
                      placeholder="e.g. AWS Certified Solutions Architect | VTU Accredited Degree"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#fffefb] border border-[#d9cdbd] text-sm text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#73685c] font-bold mb-1">
                      Issuing Body / Authority
                    </label>
                    <input
                      type="text"
                      value={editingCert.issuer || ''}
                      onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                      placeholder="e.g. Visvesvaraya Technological University, AWS, Google"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#fffefb] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#73685c] font-bold mb-1">
                      Issue Date / Year
                    </label>
                    <input
                      type="text"
                      value={editingCert.issueDate || ''}
                      onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                      placeholder="e.g. 2024, May 2025"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#fffefb] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#73685c] font-bold mb-1">
                      Verification / Credential URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={editingCert.credentialUrl || ''}
                      onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                      placeholder="https://www.credly.com/badges/... or https://..."
                      className="w-full px-3 py-1.5 rounded-lg bg-[#fffefb] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>
                </div>

                {/* Multi-Image Certificate Upload Section with Drag & Drop */}
                <div
                  onDragOver={handleCertDragOver}
                  onDragEnter={handleCertDragOver}
                  onDragLeave={handleCertDragLeave}
                  onDrop={handleCertDropzoneDrop}
                  className={`p-4 rounded-xl bg-[#fffefb] border transition-all duration-200 space-y-3 ${
                    isCertDragOver
                      ? 'border-[#704a29] ring-4 ring-[#704a29]/15 bg-[#fbf6f0]'
                      : 'border-[#d9cdbd]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#704a29] font-bold flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Certificate Images &amp; Documents ({editingCert.images?.length || 0})</span>
                      </label>
                      <p className="text-[11px] text-[#73685c] mt-0.5">
                        Drag and drop certificate scans, diploma pages, or verification badges (multiple files allowed).
                      </p>
                    </div>

                    <label className="px-3 py-1.5 rounded-lg bg-[#704a29] text-white hover:bg-[#593a1f] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 transition-transform active:scale-95">
                      {isUploadingCertImages ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>+ Upload Images</span>
                        </>
                      )}
                      <input
                        ref={certFileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/svg+xml"
                        disabled={isUploadingCertImages}
                        onChange={handleCertImagesUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Thumbnail Grid with Drag-to-Reorder */}
                  {(editingCert.images && editingCert.images.length > 0) ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#73685c] px-0.5">
                        <span className="flex items-center gap-1 font-medium">
                          <GripVertical className="w-3.5 h-3.5 text-[#a67c52]" />
                          Drag and drop thumbnails to reorder
                        </span>
                        <span className="text-[10px] text-[#a67c52] font-semibold">
                          #1 is credential cover
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {editingCert.images.map((imgUrl, imgIdx) => {
                          const isBeingDragged = draggedCertImageIdx === imgIdx;
                          const isDragTarget = dragOverCertImageIdx === imgIdx;

                          return (
                            <div
                              key={imgIdx}
                              draggable={!isUploadingCertImages}
                              onDragStart={(e) => handleCertThumbDragStart(e, imgIdx)}
                              onDragOver={(e) => handleCertThumbDragOver(e, imgIdx)}
                              onDragLeave={(e) => handleCertThumbDragLeave(e, imgIdx)}
                              onDrop={(e) => handleCertThumbDrop(e, imgIdx)}
                              onDragEnd={handleCertThumbDragEnd}
                              className={`relative group rounded-xl border overflow-hidden bg-[#fbf8f3] aspect-4/3 shadow-2xs transition-all duration-150 cursor-grab active:cursor-grabbing select-none ${
                                isBeingDragged
                                  ? 'opacity-30 border-2 border-dashed border-[#704a29] scale-95'
                                  : isDragTarget
                                  ? 'border-2 border-[#704a29] ring-2 ring-[#704a29]/30 scale-105 z-10'
                                  : 'border-[#d9cdbd] hover:border-[#704a29] hover:shadow-xs'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Certificate asset ${imgIdx + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                              />

                              {/* Order Badge */}
                              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/65 text-white text-[9px] font-mono font-bold backdrop-blur-xs flex items-center gap-1">
                                <span>#{imgIdx + 1}</span>
                                {imgIdx === 0 && <span className="text-[#f5d58b] text-[8px] uppercase tracking-wider">Cover</span>}
                              </div>

                              {/* Drag Grip Handle */}
                              <div className="absolute top-1.5 right-1.5 p-1 rounded bg-black/50 text-white/90 backdrop-blur-xs opacity-70 group-hover:opacity-100 transition">
                                <GripVertical className="w-3 h-3" />
                              </div>

                              {/* Hover Overlay Actions */}
                              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 p-2">
                                {imgIdx > 0 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveCertImage(imgIdx, imgIdx - 1);
                                    }}
                                    className="p-1.5 rounded-lg bg-white/90 text-[#2b241e] hover:bg-white cursor-pointer shadow-xs"
                                    title="Move Left"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5 -rotate-90" />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLightboxImage({ url: imgUrl, title: `${editingCert.title} (Image ${imgIdx + 1})` });
                                  }}
                                  className="p-1.5 rounded-lg bg-white/90 text-[#2b241e] hover:bg-white cursor-pointer shadow-xs"
                                  title="Enlarge Image"
                                >
                                  <ZoomIn className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveCertImage(imgIdx);
                                  }}
                                  className="p-1.5 rounded-lg bg-[#fef2f2] text-[#bc473b] hover:bg-white cursor-pointer shadow-xs"
                                  title="Delete Image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>

                                {editingCert.images && imgIdx < editingCert.images.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveCertImage(imgIdx, imgIdx + 1);
                                    }}
                                    className="p-1.5 rounded-lg bg-white/90 text-[#2b241e] hover:bg-white cursor-pointer shadow-xs"
                                    title="Move Right"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* Add More Drop Target in Grid */}
                        <div
                          onClick={() => certFileInputRef.current?.click()}
                          className={`rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center cursor-pointer aspect-4/3 transition-all duration-200 group ${
                            isCertDragOver
                              ? 'border-[#704a29] bg-[#f5ede4] ring-2 ring-[#704a29]/30 scale-[1.02]'
                              : 'border-[#d9cdbd] bg-[#fbf8f3] hover:border-[#704a29] hover:bg-[#f6eee4]'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-full bg-[#f0eae1] flex items-center justify-center text-[#704a29] mb-1 group-hover:scale-110 group-hover:bg-[#704a29] group-hover:text-white transition">
                            <Plus className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-[#704a29]">Add More</span>
                          <span className="text-[9px] text-[#73685c] mt-0.5">Drop files or click</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Empty State: Full Drag & Drop Zone */
                    <div
                      onClick={() => certFileInputRef.current?.click()}
                      className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group ${
                        isCertDragOver
                          ? 'border-[#704a29] bg-[#f5ede4] ring-4 ring-[#704a29]/15 scale-[1.01]'
                          : 'border-[#d9cdbd] bg-[#fbf8f3] hover:border-[#704a29] hover:bg-[#f7efe6]'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isCertDragOver
                          ? 'bg-[#704a29] text-white scale-110 shadow-sm animate-bounce'
                          : 'bg-[#f0eae1] text-[#704a29] group-hover:scale-105 group-hover:bg-[#e7dfd5]'
                      }`}>
                        <Upload className="w-5 h-5" />
                      </div>
                      
                      {isCertDragOver ? (
                        <>
                          <p className="text-xs font-bold text-[#704a29]">Drop certificate images to attach now!</p>
                          <span className="text-[10px] text-[#704a29]/80 mt-0.5 font-medium">Release files to start uploading</span>
                        </>
                      ) : (
                        <>
                          <p className="text-xs font-semibold text-[#2b241e]">
                            Drag and drop certificate scans or badge images here, or <span className="text-[#704a29] underline decoration-[#c59b27] decoration-2 underline-offset-2 font-bold">browse</span>
                          </p>
                          <span className="text-[10px] text-[#73685c] mt-1">
                            Supports PNG, JPG, WEBP, SVG • Multiple files allowed
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#d9cdbd]">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCert(null);
                      setIsNewCert(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#f0eae1] hover:bg-[#e5ded5] text-xs text-[#73685c] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-xs font-bold text-white shadow-xs cursor-pointer"
                  >
                    Save Credential
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Cert List */}
          <div className="space-y-3">
            {normalizedCertifications.map((cert) => {
              const hasImages = cert.images && cert.images.length > 0;
              return (
                <div
                  key={cert.id}
                  className="p-4 sm:p-5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] hover:border-[#b89574] transition space-y-3 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-[#f0eae1] border border-[#d9cdbd] flex items-center justify-center text-[#704a29] shrink-0 shadow-2xs">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-[#2b241e] break-words break-all">{cert.title}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#73685c]">
                          {cert.issuer && <span className="font-semibold text-[#704a29]">{cert.issuer}</span>}
                          {cert.issuer && cert.issueDate && <span>&bull;</span>}
                          {cert.issueDate && <span>{cert.issueDate}</span>}
                          {cert.credentialUrl && (
                            <>
                              <span>&bull;</span>
                              <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[#704a29] hover:underline font-semibold"
                              >
                                <span>Verify</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        hasImages
                          ? 'bg-[#f0eae1] text-[#704a29] border-[#d9cdbd]'
                          : 'bg-[#fffefb] text-[#9c9184] border-[#d9cdbd]'
                      }`}>
                        {hasImages ? `📷 ${cert.images.length} Image${cert.images.length > 1 ? 's' : ''}` : 'No images'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenEditCert(cert)}
                        className="p-1.5 rounded-lg bg-[#fffefb] hover:bg-[#f0eae1] text-[#704a29] border border-[#d9cdbd] cursor-pointer shadow-2xs"
                        title="Edit Credential & Manage Images"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCert(cert.id)}
                        className="p-1.5 rounded-lg bg-[#fffefb] hover:bg-[#fef2f2] text-[#bc473b] border border-[#d9cdbd] hover:border-[#fca5a5] cursor-pointer shadow-2xs"
                        title="Delete Credential"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Image Thumbnails Strip */}
                  {hasImages && (
                    <div className="pt-2 border-t border-[#d9cdbd]/60 flex items-center gap-2.5 overflow-x-auto pb-1">
                      {cert.images.map((img, iIdx) => (
                        <div
                          key={iIdx}
                          onClick={() => setLightboxImage({ url: img, title: `${cert.title} (Scan #${iIdx + 1})` })}
                          className="relative w-16 h-12 rounded-lg border border-[#d9cdbd] overflow-hidden bg-white shrink-0 cursor-pointer hover:border-[#704a29] transition group shadow-2xs"
                          title="Click to Enlarge"
                        >
                          <img src={img} alt={`Asset ${iIdx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <ZoomIn className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Global Image Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <div
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl max-h-[90vh] bg-[#fffefb] rounded-2xl border border-[#d9cdbd] overflow-hidden shadow-2xl flex flex-col cursor-default"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#d9cdbd] bg-[#fbf8f3]">
                <h4 className="text-xs font-bold text-[#2b241e] font-serif truncate max-w-[80%]">
                  {lightboxImage.title}
                </h4>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="p-1 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 bg-neutral-900/5 flex items-center justify-center overflow-auto max-h-[80vh]">
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-sm"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfessionalModule;
