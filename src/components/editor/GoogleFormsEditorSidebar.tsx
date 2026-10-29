import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '../../context/SiteContentContext';
import {
  X,
  User,
  GraduationCap,
  Briefcase,
  Share2,
  Shield,
  Search,
  Plus,
  Trash2,
  Check,
  Eye,
  EyeOff,
  Upload,
  CreditCard,
} from 'lucide-react';
import { Project, FilterCategory } from '../../data/projects';
import { uploadMediaFile } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

interface GoogleFormsEditorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'profile' | 'idcard' | 'academic' | 'projects' | 'social' | 'visibility';

export const GoogleFormsEditorSidebar: React.FC<GoogleFormsEditorSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    activeContent,
    updateStudent,
    updateProjects,
    updateProject,
    addProject,
    deleteProject,
    updateAcademic,
    updateSocialChannels,
    updateVisibility,
  } = useSiteContent();

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    category: 'Full-Stack Development · Event Management',
    filterCategories: ['Full-Stack', 'Web Apps'],
    description: '',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    badgeColor: '#10B981',
    gradient: 'green',
    visualType: 'scanner',
    featured: false,
  });

  const student = activeContent.student;
  const visibility = activeContent.visibility;

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title?.trim() || !newProject.description?.trim()) return;

    const created: Project = {
      id: `project-${Date.now()}`,
      title: newProject.title,
      category: (newProject.category as any) || 'Full-Stack Development · Event Management',
      filterCategories: (newProject.filterCategories as any) || ['Full-Stack'],
      description: newProject.description,
      technologies: typeof newProject.technologies === 'string'
        ? (newProject.technologies as string).split(',').map((t) => t.trim())
        : newProject.technologies || ['React'],
      githubUrl: newProject.githubUrl || '',
      liveUrl: newProject.liveUrl || '',
      badgeColor: newProject.badgeColor || '#704a29',
      gradient: newProject.gradient || 'vintage',
      visualType: newProject.visualType || 'scanner',
      featured: Boolean(newProject.featured),
    };

    addProject(created);
    setIsAddingProject(false);
    setNewProject({
      title: '',
      category: 'Full-Stack Development · Event Management',
      filterCategories: ['Full-Stack', 'Web Apps'],
      description: '',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      badgeColor: '#10B981',
      gradient: 'green',
      visualType: 'scanner',
      featured: false,
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadMediaFile(file, 'profile', user?.uid || 'owner');
      updateStudent({ photoUrl: url });
    } catch (err: any) {
      alert(err.message || 'Failed to upload photo.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[9990] md:hidden backdrop-blur-xs"
          />

          {/* Drawer Sidebar */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-[9995] w-full max-w-md bg-[#fffefb] border-l border-[#d9cdbd] shadow-2xl flex flex-col font-sans text-[#2b241e]"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#d9cdbd] flex items-center justify-between bg-[#fbf8f3]">
              <div>
                <h2 className="text-sm font-bold font-serif text-[#2b241e]">Google Forms Content Editor</h2>
                <p className="text-[11px] text-[#73685c]">Edit profile fields, projects, and visibility rules</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Google Forms Tab Bar */}
            <div className="flex items-center gap-1 p-2 bg-[#f0eae1]/60 border-b border-[#d9cdbd] overflow-x-auto text-xs no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#fffefb] text-[#704a29] shadow-2xs border border-[#d9cdbd]'
                    : 'text-[#73685c] hover:text-[#2b241e]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('idcard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                  activeTab === 'idcard'
                    ? 'bg-[#fffefb] text-[#704a29] shadow-2xs border border-[#d9cdbd]'
                    : 'text-[#73685c] hover:text-[#2b241e]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>ID Card</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('academic')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                  activeTab === 'academic'
                    ? 'bg-[#fffefb] text-[#704a29] shadow-2xs border border-[#d9cdbd]'
                    : 'text-[#73685c] hover:text-[#2b241e]'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Academic</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('projects')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                  activeTab === 'projects'
                    ? 'bg-[#fffefb] text-[#704a29] shadow-2xs border border-[#d9cdbd]'
                    : 'text-[#73685c] hover:text-[#2b241e]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Projects ({activeContent.projects.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('social')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                  activeTab === 'social'
                    ? 'bg-[#fffefb] text-[#704a29] shadow-2xs border border-[#d9cdbd]'
                    : 'text-[#73685c] hover:text-[#2b241e]'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Contacts</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('visibility')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                  activeTab === 'visibility'
                    ? 'bg-[#fffefb] text-[#704a29] shadow-2xs border border-[#d9cdbd]'
                    : 'text-[#73685c] hover:text-[#2b241e]'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Privacy</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* TAB 1: PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  {/* Photo Uploader */}
                  <div className="p-3 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] flex items-center gap-3">
                    <img
                      src={student.photoUrl}
                      alt={student.fullName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#704a29] shadow-xs"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#2b241e]">Profile Photograph</p>
                      <p className="text-[10px] text-[#73685c] mb-1.5">Displayed on ID card and headers</p>
                      <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#fffefb] border border-[#d9cdbd] hover:border-[#704a29] text-[11px] font-semibold text-[#704a29] cursor-pointer">
                        <Upload className="w-3 h-3" />
                        <span>Upload New</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#52493e] mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={student.fullName}
                      onChange={(e) => updateStudent({ fullName: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#52493e] mb-1">Student USN</label>
                      <input
                        type="text"
                        value={student.usn}
                        onChange={(e) => updateStudent({ usn: e.target.value, studentId: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] font-mono focus:outline-none focus:border-[#704a29]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#52493e] mb-1">Section</label>
                      <input
                        type="text"
                        value={student.section}
                        onChange={(e) => updateStudent({ section: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#52493e] mb-1">Department</label>
                    <input
                      type="text"
                      value={student.department}
                      onChange={(e) => updateStudent({ department: e.target.value, branch: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#52493e] mb-1">Semester</label>
                      <input
                        type="text"
                        value={student.semester}
                        onChange={(e) => updateStudent({ semester: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#52493e] mb-1">Academic Year</label>
                      <input
                        type="text"
                        value={student.academicYear}
                        onChange={(e) => updateStudent({ academicYear: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#52493e] mb-1">Blood Group</label>
                      <input
                        type="text"
                        value={student.bloodGroup}
                        onChange={(e) => updateStudent({ bloodGroup: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#52493e] mb-1">Date of Birth</label>
                      <input
                        type="text"
                        value={student.dateOfBirth}
                        onChange={(e) => updateStudent({ dateOfBirth: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#52493e] mb-1">Official Student Email</label>
                    <input
                      type="email"
                      value={student.email}
                      onChange={(e) => updateStudent({ email: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#52493e] mb-1">Official Student Phone</label>
                    <input
                      type="text"
                      value={student.phone}
                      onChange={(e) => updateStudent({ phone: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#52493e] mb-1">Permanent Address</label>
                    <textarea
                      rows={2}
                      value={student.permanentAddress}
                      onChange={(e) => updateStudent({ permanentAddress: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: ID CARD */}
              {activeTab === 'idcard' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-[#f0eae1]/50 border border-[#d9cdbd] text-xs text-[#73685c]">
                    Configure card front/back labels, verification seals, and institutional details.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#52493e] mb-1">Institution Name</label>
                    <input
                      type="text"
                      value={student.college.name}
                      onChange={(e) =>
                        updateStudent({
                          college: { ...student.college, name: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#52493e] mb-1">Institution Tagline</label>
                    <input
                      type="text"
                      value={student.college.tagline}
                      onChange={(e) =>
                        updateStudent({
                          college: { ...student.college, tagline: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#52493e] mb-1">College Code</label>
                      <input
                        type="text"
                        value={student.college.code}
                        onChange={(e) =>
                          updateStudent({
                            college: { ...student.college, code: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#52493e] mb-1">Verification Code</label>
                      <input
                        type="text"
                        value={student.verification.verificationCode}
                        onChange={(e) =>
                          updateStudent({
                            verification: { ...student.verification, verificationCode: e.target.value },
                          })
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#52493e] mb-1">Affiliation Statement</label>
                    <input
                      type="text"
                      value={student.college.affiliations}
                      onChange={(e) =>
                        updateStudent({
                          college: { ...student.college, affiliations: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#52493e] mb-1">Accreditation Statement</label>
                    <input
                      type="text"
                      value={student.college.accreditation}
                      onChange={(e) =>
                        updateStudent({
                          college: { ...student.college, accreditation: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: ACADEMIC */}
              {activeTab === 'academic' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold font-serif uppercase tracking-wider text-[#73685c]">
                      Engineering Records (VTU)
                    </h3>
                  </div>

                  {activeContent.academic.engineering.map((rec, index) => (
                    <div key={rec.id} className="p-3 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#704a29]">{rec.yearTitle}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0eae1] font-mono text-[#52493e]">
                          {rec.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#73685c] mb-0.5">Program / Degree</label>
                        <input
                          type="text"
                          value={rec.program}
                          onChange={(e) => {
                            const copy = [...activeContent.academic.engineering];
                            copy[index] = { ...copy[index], program: e.target.value };
                            updateAcademic({ engineering: copy });
                          }}
                          className="w-full px-2.5 py-1 text-xs rounded bg-white border border-[#d9cdbd]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#73685c] mb-0.5">Current Status / Progress Note</label>
                        <input
                          type="text"
                          value={rec.currentStatusLabel || ''}
                          onChange={(e) => {
                            const copy = [...activeContent.academic.engineering];
                            copy[index] = { ...copy[index], currentStatusLabel: e.target.value };
                            updateAcademic({ engineering: copy });
                          }}
                          className="w-full px-2.5 py-1 text-xs rounded bg-white border border-[#d9cdbd]"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 border-t border-[#d9cdbd]">
                    <h3 className="text-xs font-bold font-serif uppercase tracking-wider text-[#73685c] mb-2">
                      School Records (10th & 12th)
                    </h3>
                    {activeContent.academic.schooling.map((school, idx) => (
                      <div key={school.id} className="p-3 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] mb-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{school.qualification}</span>
                          <span className="text-xs font-mono font-bold text-[#166534] bg-emerald-50 px-2 py-0.5 rounded">
                            {school.score}%
                          </span>
                        </div>
                        <input
                          type="number"
                          step="0.1"
                          value={school.score}
                          onChange={(e) => {
                            const copy = [...activeContent.academic.schooling];
                            copy[idx] = { ...copy[idx], score: parseFloat(e.target.value) || 0 };
                            updateAcademic({ schooling: copy });
                          }}
                          className="w-full px-2.5 py-1 text-xs rounded bg-white border border-[#d9cdbd]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#73685c] uppercase">Projects List</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingProject((prev) => !prev)}
                      className="px-2.5 py-1 rounded-lg bg-[#704a29] text-white text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAddingProject ? 'Cancel' : 'Add Project'}</span>
                    </button>
                  </div>

                  {/* Add Project Form */}
                  {isAddingProject && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      onSubmit={handleCreateProject}
                      className="p-3.5 rounded-xl bg-[#fbf8f3] border-2 border-[#704a29] space-y-3"
                    >
                      <h4 className="text-xs font-bold text-[#704a29]">Create New Project</h4>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#52493e] mb-1">Title</label>
                        <input
                          type="text"
                          required
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          placeholder="e.g. Next-Gen NFC Reader"
                          className="w-full px-2.5 py-1 text-xs rounded bg-white border border-[#d9cdbd]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#52493e] mb-1">Description</label>
                        <textarea
                          rows={2}
                          required
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          placeholder="Brief technical summary..."
                          className="w-full px-2.5 py-1 text-xs rounded bg-white border border-[#d9cdbd]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#52493e] mb-1">Technologies (comma-separated)</label>
                        <input
                          type="text"
                          value={Array.isArray(newProject.technologies) ? newProject.technologies.join(', ') : newProject.technologies}
                          onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value as any })}
                          placeholder="React, TypeScript, PyTorch"
                          className="w-full px-2.5 py-1 text-xs rounded bg-white border border-[#d9cdbd]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#52493e] mb-1">GitHub URL</label>
                          <input
                            type="url"
                            value={newProject.githubUrl || ''}
                            onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                            placeholder="https://github.com/..."
                            className="w-full px-2.5 py-1 text-xs rounded bg-white border border-[#d9cdbd]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#52493e] mb-1">Live URL</label>
                          <input
                            type="url"
                            value={newProject.liveUrl || ''}
                            onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-2.5 py-1 text-xs rounded bg-white border border-[#d9cdbd]"
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={newProject.featured || false}
                          onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                          className="rounded text-[#704a29]"
                        />
                        <span className="text-xs font-semibold text-[#2b241e]">Feature on Home View</span>
                      </label>
                      <button
                        type="submit"
                        className="w-full py-1.5 rounded-lg bg-[#704a29] text-white text-xs font-bold"
                      >
                        Add to Portfolio
                      </button>
                    </motion.form>
                  )}

                  {/* Existing Projects */}
                  <div className="space-y-2.5">
                    {activeContent.projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-3 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] hover:border-[#704a29] transition space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: proj.badgeColor }}
                              />
                              <h4 className="text-xs font-bold text-[#2b241e]">{proj.title}</h4>
                            </div>
                            <p className="text-[11px] text-[#73685c] line-clamp-1 mt-0.5">{proj.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete project "${proj.title}"?`)) {
                                deleteProject(proj.id);
                              }
                            }}
                            className="p-1 text-[#9c9184] hover:text-[#991b1b] transition"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-[#73685c] pt-1 border-t border-[#f0eae1]">
                          <span>{proj.technologies.slice(0, 3).join(', ')}</span>
                          <button
                            type="button"
                            onClick={() => updateProject(proj.id, { featured: !proj.featured })}
                            className={`px-2 py-0.5 rounded font-semibold ${
                              proj.featured ? 'bg-[#704a29] text-white' : 'bg-[#f0eae1] text-[#73685c]'
                            }`}
                          >
                            {proj.featured ? 'Featured' : 'Standard'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SOCIAL CHANNELS */}
              {activeTab === 'social' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#73685c]">
                    Configure contact channel URLs, display labels, and public visibility.
                  </p>
                  {activeContent.socialChannels.map((channel, idx) => (
                    <div key={channel.id} className="p-3 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#2b241e]">{channel.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...activeContent.socialChannels];
                            copy[idx] = { ...copy[idx], visible: !copy[idx].visible };
                            updateSocialChannels(copy);
                          }}
                          className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded ${
                            channel.visible
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {channel.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{channel.visible ? 'Visible' : 'Hidden'}</span>
                        </button>
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#73685c]">Handle / Display Text</label>
                        <input
                          type="text"
                          value={channel.handle}
                          onChange={(e) => {
                            const copy = [...activeContent.socialChannels];
                            copy[idx] = { ...copy[idx], handle: e.target.value };
                            updateSocialChannels(copy);
                          }}
                          className="w-full px-2 py-1 text-xs rounded bg-white border border-[#d9cdbd]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#73685c]">Target URL / Link</label>
                        <input
                          type="text"
                          value={channel.url}
                          onChange={(e) => {
                            const copy = [...activeContent.socialChannels];
                            copy[idx] = { ...copy[idx], url: e.target.value };
                            updateSocialChannels(copy);
                          }}
                          className="w-full px-2 py-1 text-xs rounded bg-white border border-[#d9cdbd]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 6: PRIVACY & VISIBILITY */}
              {activeTab === 'visibility' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#f0eae1]/60 border border-[#d9cdbd] text-xs text-[#73685c]">
                    Control which sensitive personal and academic fields are publicly visible on your smart NFC profile.
                  </div>

                  <div className="space-y-2">
                    {[
                      { key: 'showPhone', label: 'Display Phone Number Publicly' },
                      { key: 'showEmail', label: 'Display Email Address Publicly' },
                      { key: 'showCurrentAddress', label: 'Display Current Bengaluru Address' },
                      { key: 'showPermanentAddress', label: 'Display Permanent Hometown Address' },
                      { key: 'showBloodGroup', label: 'Display Blood Group' },
                      { key: 'showDob', label: 'Display Date of Birth' },
                      { key: 'showEmergencyContact', label: 'Display Emergency Contact Details' },
                      { key: 'showSgpaScores', label: 'Display Exact VTU SGPA Scores' },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className="p-3 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] flex items-center justify-between cursor-pointer hover:border-[#704a29] transition"
                      >
                        <span className="text-xs font-semibold text-[#2b241e]">{label}</span>
                        <input
                          type="checkbox"
                          checked={Boolean((visibility as any)[key])}
                          onChange={(e) => updateVisibility({ [key]: e.target.checked })}
                          className="rounded text-[#704a29] w-4 h-4 cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
