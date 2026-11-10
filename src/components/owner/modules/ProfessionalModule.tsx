import React, { useState } from 'react';
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
} from 'lucide-react';
import { useOwnerEditor } from '../../../context/OwnerEditorContext';
import { Project, ProjectCategory, FilterCategory } from '../../../data/projects';
import { SkillItem } from '../../skills/SkillsSection';
import { YearAcademicData, SemesterScore } from '../../education/EducationSection';

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
    showToast,
  } = useOwnerEditor();

  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'academic' | 'skills' | 'certifications'>('projects');

  // Editing Project Modal / Form State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState<boolean>(false);

  // New Skill Form State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillItem['category']>('Languages');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillItem['level']>('Advanced');
  const [newSkillDesc, setNewSkillDesc] = useState('');

  // New Certification State
  const [newCertTitle, setNewCertTitle] = useState('');

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

  // Certifications
  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle.trim()) return;

    const currentCerts = academic.certifications || [];
    updateAcademic({
      ...academic,
      certifications: [...currentCerts, newCertTitle.trim()],
    });
    setNewCertTitle('');
    showToast('Certification added.', 'success');
  };

  const handleDeleteCert = (index: number) => {
    const currentCerts = [...(academic.certifications || [])];
    currentCerts.splice(index, 1);
    updateAcademic({
      ...academic,
      certifications: currentCerts,
    });
    showToast('Certification deleted.', 'info');
  };

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
                className="p-4 rounded-xl bg-[#fffefb] border border-[#d9cdbd] hover:border-[#704a29] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs border border-[#d9cdbd]"
                    style={{ backgroundColor: proj.badgeColor || '#704a29' }}
                  >
                    <Code2 className="w-6 h-6 text-white" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#2b241e]">{proj.title}</h4>
                      {proj.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-[#f0eae1] text-[#704a29] text-[10px] font-bold border border-[#d9cdbd]">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#73685c] line-clamp-1 mt-0.5">{proj.description}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {proj.technologies?.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-[#fbf8f3] border border-[#d9cdbd] text-[10px] text-[#73685c]"
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
          <div className="flex items-center justify-between pb-3 border-b border-[#d9cdbd]">
            <div>
              <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold">
                Engineering Semester Records & SGPA
              </h3>
              <p className="text-xs text-[#73685c] mt-0.5">
                Manage academic grades, semester performance, and backface ID card visibility.
              </p>
            </div>

            <button
              type="button"
              onClick={() => updateVisibility({ showSgpaScores: !visibility.showSgpaScores })}
              className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                visibility.showSgpaScores
                  ? 'bg-[#f2f8f2] border-[#86efac] text-[#166534] font-bold'
                  : 'bg-[#f0eae1] border-[#d9cdbd] text-[#73685c]'
              }`}
            >
              {visibility.showSgpaScores ? <Eye className="w-3.5 h-3.5 text-[#16a34a]" /> : <EyeOff className="w-3.5 h-3.5 text-[#73685c]" />}
              <span>{visibility.showSgpaScores ? 'Scores Visible' : 'Scores Hidden'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {academic.engineering?.map((yearData, yIdx) => (
              <div key={yearData.id || yearData.yearTitle} className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#2b241e]">{yearData.yearTitle}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#f0eae1] text-[#704a29] border border-[#d9cdbd] font-bold">
                    {yearData.status}
                  </span>
                </div>
                <p className="text-xs text-[#73685c]">{yearData.duration} &bull; {yearData.institution}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#d9cdbd]">
                  {(yearData.semesters || []).map((sem, sIdx) => (
                    <div key={sem.semesterNumber} className="flex items-center justify-between p-2 rounded-lg bg-[#fffefb] border border-[#d9cdbd]">
                      <span className="text-xs text-[#73685c]">{sem.semesterName || `Sem ${sem.semesterNumber}`}</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={sem.sgpa}
                        onChange={(e) => {
                          const updated = [...academic.engineering];
                          if (updated[yIdx]?.semesters?.[sIdx]) {
                            updated[yIdx].semesters![sIdx].sgpa = parseFloat(e.target.value) || 0;
                            updateAcademic({ ...academic, engineering: updated });
                          }
                        }}
                        className="w-16 px-1.5 py-0.5 rounded bg-[#fbf8f3] border border-[#d9cdbd] text-xs font-bold text-[#704a29] text-right focus:outline-none focus:border-[#704a29]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
          <div className="pb-3 border-b border-[#d9cdbd]">
            <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold">
              Certifications & Professional Credentials
            </h3>
            <p className="text-xs text-[#73685c] mt-0.5">
              Highlight verifiable licenses, academic honors, and course completions.
            </p>
          </div>

          {/* Add Cert Form */}
          <form onSubmit={handleAddCert} className="flex items-center gap-3">
            <input
              type="text"
              value={newCertTitle}
              onChange={(e) => setNewCertTitle(e.target.value)}
              placeholder="e.g. AWS Certified Solutions Architect | Google Cloud Associate"
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-xs font-bold text-white cursor-pointer shrink-0 shadow-xs"
            >
              Add Credential
            </button>
          </form>

          {/* Cert List */}
          <div className="space-y-2.5">
            {(academic.certifications || []).map((cert, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] flex items-center justify-between gap-4 shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-[#704a29] shrink-0" />
                  <span className="text-xs font-semibold text-[#2b241e]">{cert}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCert(idx)}
                  className="p-1 rounded-lg text-[#73685c] hover:text-[#bc473b] transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalModule;
