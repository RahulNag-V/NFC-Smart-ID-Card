import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCard } from './components/ui/project-card';
import FloatingMenu, { MenuItem } from './components/ui/liquid-morph-floating-menu';
import { FilterCategory, Project } from './data/projects';
import { VerticalStudentIdCard } from './components/id-card/VerticalStudentIdCard';
import { EducationSection } from './components/education/EducationSection';
import { SkillsSection } from './components/skills/SkillsSection';
import { dispatchMultiChannelNote } from './lib/notificationService';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteContentProvider, useSiteContent } from './context/SiteContentContext';
import { EditorTopToolbar } from './components/editor/EditorTopToolbar';
import { OwnerLoginModal } from './components/editor/OwnerLoginModal';
import { GoogleFormsEditorSidebar } from './components/editor/GoogleFormsEditorSidebar';
import { AppearanceCustomizer } from './components/editor/AppearanceCustomizer';
import { SectionManager } from './components/editor/SectionManager';
import { VersionHistoryModal } from './components/editor/VersionHistoryModal';
import { ExportImportModal } from './components/editor/ExportImportModal';
import { InlineEditPopover } from './components/editor/InlineEditPopover';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Globe,
  Send,
  Nfc,
  Layers,
  Zap,
  ChevronDown,
  SlidersHorizontal,
  Check,
  X,
  Loader2,
  Plus,
} from 'lucide-react';

// Custom Brand Glyphs
const WhatsAppGlyph = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const InstagramGlyph = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedInGlyph = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const GitHubGlyph = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
  </svg>
);

const GmailGlyph = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const getChannelGlyph = (id: string, className = "w-5 h-5 text-white") => {
  switch (id) {
    case 'whatsapp':
      return <WhatsAppGlyph className={className} />;
    case 'instagram':
      return <InstagramGlyph className={className} />;
    case 'linkedin':
      return <LinkedInGlyph className={className} />;
    case 'github':
      return <GitHubGlyph className={className} />;
    case 'email':
      return <GmailGlyph className={className} />;
    default:
      return <Globe className={className} />;
  }
};

type PageTab = 'home' | 'works' | 'contact';

// Category Filter Options
const filterOptions: { label: string; value: FilterCategory }[] = [
  { label: 'All Projects', value: 'All' },
  { label: 'Full-Stack', value: 'Full-Stack' },
  { label: 'AI / ML', value: 'AI / ML' },
  { label: 'Cybersecurity', value: 'Cybersecurity' },
  { label: 'Web Apps', value: 'Web Apps' },
];

// Standalone Full-Width Bold Watermark Component
function PageWatermark({ text }: { text: 'HOME' | 'WORKS' | 'CONTACT' }) {
  const configs = {
    HOME: { viewBox: '0 2 295 76', y: 72, size: 98, spacing: '-4px' },
    WORKS: { viewBox: '0 2 365 76', y: 72, size: 96, spacing: '-4px' },
    CONTACT: { viewBox: '0 2 475 76', y: 72, size: 94, spacing: '-4px' },
  };

  const { viewBox, y, size, spacing } = configs[text];

  return (
    <div
      className="-mx-4 w-[calc(100%+2rem)] px-1 overflow-hidden select-none pointer-events-none mt-1 mb-4"
      aria-hidden="true"
    >
      <svg
        viewBox={viewBox}
        className="w-full h-auto block"
        preserveAspectRatio="xMidYMid meet"
      >
        <text
          x="50%"
          y={y}
          textAnchor="middle"
          fill="#a67c52"
          fillOpacity="0.22"
          style={{
            fontFamily: '"Times New Roman", Times, "Tinos", Georgia, serif',
            fontWeight: 900,
            fontSize: `${size}px`,
            letterSpacing: spacing,
          }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
}

function AppInner() {
  const { isOwner, openLoginModal } = useAuth();
  const { activeContent, viewportMode, isEditMode, setIsEditMode } = useSiteContent();

  const [activePage, setActivePage] = useState<PageTab>('home');
  const [messageSent, setMessageSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [activeClickedId, setActiveClickedId] = useState<string | null>(null);
  const [socialTransition, setSocialTransition] = useState<any | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isSectionsOpen, setIsSectionsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const projects = activeContent.projects || [];
  const socialChannels = (activeContent.socialChannels || []).filter((c) => c.visible);

  const getCategoryCount = (cat: FilterCategory) => {
    if (cat === 'All') return projects.length;
    return projects.filter((p) => p.filterCategories.includes(cat)).length;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  const filteredProjects = selectedFilter === 'All'
    ? projects
    : projects.filter((p) => p.filterCategories.includes(selectedFilter));

  // Sync with URL hash and check preview params
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'works' || hash === 'contact' || hash === 'home') {
        setActivePage(hash as PageTab);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);

    const params = new URLSearchParams(window.location.search);
    const previewId = params.get('preview');
    if (previewId) {
      const target = socialChannels.find((c) => c.id === previewId) || socialChannels[0];
      if (target) setSocialTransition(target);
    }

    return () => window.removeEventListener('hashchange', syncHash);
  }, [socialChannels]);

  const navigateTo = (page: PageTab) => {
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelSocialTransition = () => {
    if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setSocialTransition(null);
    setActiveClickedId(null);
  };

  const handleSocialTransition = (channel: any) => {
    cancelSocialTransition();
    setActiveClickedId(channel.id);
    setSocialTransition(channel);
    redirectTimerRef.current = setTimeout(() => {
      try {
        const opened = window.open(channel.url, '_blank', 'noopener,noreferrer');
        if (!opened) {
          window.location.href = channel.url;
        }
      } catch {
        window.location.href = channel.url;
      }
      closeTimerRef.current = setTimeout(() => {
        setSocialTransition(null);
        setActiveClickedId(null);
      }, 500);
    }, 1000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await Promise.race([
        dispatchMultiChannelNote({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
        new Promise((resolve) => setTimeout(resolve, 3500)),
      ]);

      setMessageSent(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Submission error:', err);
      setMessageSent(true);
      setFormData({ name: '', email: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuItems: MenuItem[] = [
    {
      label: 'Home',
      isActive: activePage === 'home',
      onClick: () => navigateTo('home'),
    },
    {
      label: 'Works',
      isActive: activePage === 'works',
      onClick: () => navigateTo('works'),
    },
    {
      label: 'Contact',
      isActive: activePage === 'contact',
      onClick: () => navigateTo('contact'),
    },
  ];

  const pageVariants = {
    initial: { opacity: 0, y: -45 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] as const },
    },
    exit: {
      opacity: 0,
      y: 40,
      transition: { duration: 0.2, ease: [0.36, 0, 0.66, 0] as const },
    },
  };

  // Viewport simulator container styles
  const getViewportWrapperClass = () => {
    if (viewportMode === 'mobile') {
      return 'max-w-[390px] mx-auto my-6 rounded-[2.5rem] shadow-2xl border-8 border-[#221a14] overflow-hidden bg-background ring-1 ring-black/10';
    }
    if (viewportMode === 'tablet') {
      return 'max-w-[768px] mx-auto my-6 rounded-2xl shadow-xl border-4 border-[#704a29]/30 overflow-hidden bg-background';
    }
    return 'w-full';
  };

  // Sections on Home view
  const activeSections = (activeContent.sections || [])
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-[#704a29]/20 font-sans pb-32 overflow-x-hidden transition-colors duration-300">
      {/* Editor Top Toolbar */}
      <EditorTopToolbar
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenAppearance={() => setIsAppearanceOpen(true)}
        onOpenSections={() => setIsSectionsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Editor Modals */}
      <OwnerLoginModal />
      <GoogleFormsEditorSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AppearanceCustomizer isOpen={isAppearanceOpen} onClose={() => setIsAppearanceOpen(false)} />
      <SectionManager isOpen={isSectionsOpen} onClose={() => setIsSectionsOpen(false)} />
      <VersionHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <ExportImportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />

      {/* Viewport Frame Container */}
      <div className={getViewportWrapperClass()}>
        <div
          className={`w-full mx-auto px-4 pt-5 sm:pt-7 transition-all duration-300 ${
            activePage === 'works' && viewportMode === 'desktop' ? 'max-w-6xl' : 'max-w-md'
          }`}
        >
          {/* Dynamic Page Views with Smooth Transition */}
          <AnimatePresence mode="wait">
            {/* ================= PAGE 1: HOME ================= */}
            {activePage === 'home' && (
              <motion.div
                key="home"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                {/* Dynamically render configured sections in order */}
                {activeSections.map((section) => {
                  switch (section.type) {
                    case 'watermark':
                      return <PageWatermark key={section.id} text="HOME" />;

                    case 'id-card':
                      return (
                        <div key={section.id} className="relative">
                          <VerticalStudentIdCard student={activeContent.student} />
                        </div>
                      );

                    case 'education':
                      return (
                        <div key={section.id}>
                          <EducationSection />
                        </div>
                      );

                    case 'skills':
                      return (
                        <div key={section.id}>
                          <SkillsSection />
                        </div>
                      );

                    case 'disciplines':
                      return (
                        <div key={section.id} className="space-y-3">
                          <h2 className="text-xs font-bold font-serif text-[#73685c] uppercase tracking-wider px-1">
                            {section.title || 'Core Disciplines'}
                          </h2>

                          <div className="grid grid-cols-1 gap-3">
                            <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-3 shadow-2xs">
                              <div className="p-2 rounded-lg bg-background border border-border text-[#a67c52] shrink-0">
                                <Nfc className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold font-serif text-foreground">
                                  Physical &amp; NFC Hardware
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                  Programmable NFC cards, Google Review stands, and dynamic cloud routing without rewriting tags.
                                </p>
                              </div>
                            </div>

                            <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-3 shadow-2xs">
                              <div className="p-2 rounded-lg bg-background border border-border text-[#704a29] shrink-0">
                                <Layers className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold font-serif text-foreground">
                                  Tactile Design Systems
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                  Warm editorial layouts with typographic rhythm, paper textures, and micro-interactions.
                                </p>
                              </div>
                            </div>

                            <div className="p-4 rounded-xl bg-card border border-border flex items-start gap-3 shadow-2xs">
                              <div className="p-2 rounded-lg bg-background border border-border text-[#10B981] shrink-0">
                                <Zap className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold font-serif text-foreground">
                                  High-Performance Cloud
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                  Sub-second global load times, zero bloat, and resilient serverless architectures.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );

                    case 'featured-projects':
                      return (
                        <div key={section.id} className="space-y-3 pt-1">
                          <div className="flex items-center justify-between px-1">
                            <h2 className="text-xs font-bold font-serif text-[#73685c] uppercase tracking-wider">
                              {section.title || 'Featured Systems • Live Work'}
                            </h2>
                            <button
                              type="button"
                              onClick={() => navigateTo('works')}
                              className="text-[11px] font-semibold text-[#704a29] hover:underline cursor-pointer"
                            >
                              View All ({projects.length})
                            </button>
                          </div>

                          <div className="flex flex-col gap-3">
                            {projects
                              .filter((p) => p.featured)
                              .slice(0, 3)
                              .map((project) => (
                                <div
                                  key={project.id}
                                  onClick={() => navigateTo('works')}
                                  className="p-4 rounded-xl bg-card border border-border hover:border-[#704a29] transition-all cursor-pointer group shadow-2xs"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <span
                                          className="w-2 h-2 rounded-full"
                                          style={{ backgroundColor: project.badgeColor }}
                                        />
                                        <span className="text-[10px] font-mono text-muted-foreground font-medium">
                                          {project.category}
                                        </span>
                                      </div>
                                      <h4 className="text-sm font-bold font-serif text-foreground group-hover:text-[#704a29] transition-colors">
                                        {project.title}
                                      </h4>
                                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                                        {project.description}
                                      </p>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-[#704a29] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
                                  </div>
                                  <div className="flex flex-wrap gap-1.5 mt-3">
                                    {project.technologies.slice(0, 4).map((tech) => (
                                      <span
                                        key={tech}
                                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-background text-foreground border border-border/70"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                    {project.technologies.length > 4 && (
                                      <span className="text-[10px] font-mono text-muted-foreground self-center">
                                        +{project.technologies.length - 4} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      );

                    case 'custom-text-image':
                      return (
                        <div key={section.id} className="p-4 rounded-xl bg-card border border-border shadow-2xs space-y-2">
                          <h3 className="text-sm font-bold font-serif text-foreground">
                            {section.customContent?.heading || section.title}
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {section.customContent?.body || section.description}
                          </p>
                        </div>
                      );

                    case 'call-to-action':
                      return (
                        <div key={section.id} className="pt-2 flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => navigateTo('works')}
                            className="w-full py-3 px-4 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
                          >
                            <span>Explore All Selected Works ({projects.length} Projects)</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => navigateTo('contact')}
                            className="w-full py-2.5 px-4 rounded-xl bg-card hover:bg-muted text-foreground border border-border hover:border-[#704a29] text-xs font-semibold transition active:scale-98 cursor-pointer shadow-2xs"
                          >
                            <span>Direct Inquiries &bull; Contact</span>
                          </button>
                        </div>
                      );

                    default:
                      return null;
                  }
                })}
              </motion.div>
            )}

            {/* ================= PAGE 2: WORKS ================= */}
            {activePage === 'works' && (
              <motion.div
                key="works"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <PageWatermark text="WORKS" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground tracking-tight">
                      Selected Works
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Full-stack systems, deep learning research, cybersecurity architectures, and developer tools.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span className="px-3.5 py-1.5 rounded-full bg-muted border border-border text-xs text-[#704a29] font-mono font-bold shadow-2xs">
                      {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
                    </span>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        className="px-3 py-1.5 rounded-full bg-[#704a29] text-white text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Project</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Dropdown */}
                <div className="relative z-20" ref={filterDropdownRef}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      id="category-filter-dropdown-btn"
                      onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
                      className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-card border border-border hover:border-[#704a29] text-foreground text-xs font-medium shadow-2xs hover:shadow-xs transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#704a29]/20"
                      aria-expanded={isFilterDropdownOpen}
                      aria-haspopup="listbox"
                    >
                      <div className="w-5 h-5 rounded-md bg-muted text-[#704a29] flex items-center justify-center shrink-0">
                        <SlidersHorizontal className="w-3 h-3" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-semibold text-foreground">
                          {filterOptions.find((f) => f.value === selectedFilter)?.label || 'All Projects'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-muted text-[11px] font-mono font-bold text-[#704a29]">
                        {filteredProjects.length}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 ease-out ${
                          isFilterDropdownOpen ? 'rotate-180 text-[#704a29]' : ''
                        }`}
                      />
                    </button>

                    {selectedFilter !== 'All' && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        type="button"
                        onClick={() => setSelectedFilter('All')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-[#704a29] text-xs font-medium transition-colors border border-border cursor-pointer"
                      >
                        <span>Show All ({projects.length})</span>
                        <X className="w-3 h-3" />
                      </motion.button>
                    )}
                  </div>

                  <AnimatePresence>
                    {isFilterDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute z-30 left-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-card border border-border shadow-xl p-1.5 space-y-0.5 backdrop-blur-md"
                        role="listbox"
                      >
                        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border flex items-center justify-between">
                          <span>Filter by Category</span>
                          <span>{projects.length} Total</span>
                        </div>

                        <div className="py-1">
                          {filterOptions.map((filter) => {
                            const isSelected = selectedFilter === filter.value;
                            const count = getCategoryCount(filter.value);
                            return (
                              <button
                                key={filter.value}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                  setSelectedFilter(filter.value);
                                  setIsFilterDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 select-none cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#704a29] text-white font-semibold shadow-2xs'
                                    : 'text-foreground hover:bg-muted font-medium'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
                                      isSelected
                                        ? 'border-white bg-white/20'
                                        : 'border-border bg-white'
                                    }`}
                                  >
                                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                  </div>
                                  <span>{filter.label}</span>
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                    isSelected
                                      ? 'bg-white/25 text-white'
                                      : 'bg-muted text-[#704a29]'
                                  }`}
                                >
                                  {count}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Project Grid */}
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  <AnimatePresence>
                    {filteredProjects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {filteredProjects.length === 0 && (
                  <div className="p-12 text-center rounded-2xl bg-card border border-border text-muted-foreground space-y-2">
                    <p className="text-sm font-serif font-bold text-foreground">No projects in this category</p>
                    <p className="text-xs">Select another category filter or click &apos;All Projects&apos;.</p>
                    <button
                      type="button"
                      onClick={() => setSelectedFilter('All')}
                      className="mt-3 px-4 py-2 rounded-lg bg-[#704a29] text-white text-xs font-semibold cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  </div>
                )}

                <div className="pt-8 text-center">
                  <button
                    type="button"
                    onClick={() => navigateTo('contact')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border hover:border-[#704a29] text-xs font-semibold text-[#704a29] transition-all shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <span>Ready to collaborate? Go to Contact page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ================= PAGE 3: CONTACT ================= */}
            {activePage === 'contact' && (
              <motion.div
                key="contact"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <PageWatermark text="CONTACT" />

                <div>
                  <h1 className="text-xl font-bold font-serif text-foreground tracking-tight">
                    Direct Inquiries
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Reach out for architectural advisory, NFC hardware rollouts, or design collaborations.
                  </p>
                </div>

                {/* Social Networks Touchpoints */}
                <div className="space-y-3">
                  <div className="px-1 flex items-center justify-between">
                    <h3 className="text-xs font-bold font-serif text-[#73685c] uppercase tracking-wider">
                      Connected Networks &bull; Direct Access
                    </h3>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-[11px] font-semibold text-[#704a29] hover:underline"
                      >
                        Manage Links
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {socialChannels.map((channel) => {
                      const isClicked = activeClickedId === channel.id;
                      return (
                        <a
                          key={channel.id}
                          href={channel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                              e.preventDefault();
                              handleSocialTransition(channel);
                            }
                          }}
                          className={`w-full p-3.5 rounded-2xl border transition-all duration-300 shadow-xs flex items-center justify-between group active:scale-[0.98] text-left relative overflow-hidden cursor-pointer ${
                            isClicked
                              ? 'text-white border-transparent shadow-lg ring-2 ring-white/50'
                              : 'bg-card border-border hover:border-[#a67c52]'
                          }`}
                          style={{
                            background: isClicked
                              ? channel.gradient || channel.brandColor
                              : undefined,
                          }}
                        >
                          <div className="flex items-center gap-3.5 relative z-10">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-xs shrink-0 transition-all duration-300 group-hover:scale-105"
                              style={{
                                background: channel.gradient || channel.brandColor,
                              }}
                            >
                              {getChannelGlyph(channel.id)}
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4
                                  className={`text-sm font-bold font-serif tracking-tight ${
                                    isClicked ? 'text-white' : 'text-foreground'
                                  }`}
                                >
                                  {channel.name}
                                </h4>
                                {!isClicked && (
                                  <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ background: channel.brandColor }}
                                  />
                                )}
                              </div>
                              <p
                                className={`text-xs font-mono font-semibold mt-0.5 ${
                                  isClicked ? 'text-white/95' : 'text-muted-foreground'
                                }`}
                              >
                                {channel.handle}
                              </p>
                              <p
                                className={`text-[10px] font-sans ${
                                  isClicked ? 'text-white/80' : 'text-muted-foreground/80'
                                }`}
                              >
                                {channel.actionText}
                              </p>
                            </div>
                          </div>

                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 relative z-10 shrink-0 text-white shadow-2xs group-hover:scale-110"
                            style={{
                              background: channel.gradient || channel.brandColor,
                            }}
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Quick Note Form */}
                <div className="rounded-2xl bg-card border border-border p-6 shadow-xs">
                  <h3 className="text-sm font-bold font-serif text-foreground mb-1">
                    Send a Quick Note
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Leave a brief message and I'll get back to you within 24 hours.
                  </p>

                  {messageSent ? (
                    <div className="p-5 rounded-xl bg-[#f2f8f2] border border-[#bbf7d0] text-center space-y-2 text-xs text-[#166534] animate-in fade-in zoom-in-95 duration-200">
                      <div className="w-10 h-10 rounded-full bg-[#dcfce7] border border-[#86efac] flex items-center justify-center mx-auto text-[#16a34a] shadow-2xs">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#14532d]">Note Dispatched Directly!</p>
                        <p className="text-[11.5px] text-[#166534] mt-1 leading-relaxed">
                          {activeContent.student.fullName} has received your message via multi-channel notification (Email, SMS &amp; WhatsApp alert).
                        </p>
                        <p className="text-[10px] text-[#4b7a54] mt-1.5 font-mono">
                          Direct In-Place Delivery &bull; Zero External Redirects
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setMessageSent(false)}
                          className="px-3.5 py-1.5 text-[11px] font-semibold text-[#14532d] bg-white rounded-lg border border-[#86efac] hover:bg-[#eaf5ea] transition shadow-2xs cursor-pointer"
                        >
                          Send Another Note
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSendMessage} className="space-y-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          disabled={isSubmitting}
                          className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#a67c52] disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          disabled={isSubmitting}
                          className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#a67c52] disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <textarea
                          rows={3}
                          placeholder="Project overview or questions..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          disabled={isSubmitting}
                          className="w-full px-3 py-2 text-xs rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#a67c52] disabled:opacity-60"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 rounded-lg bg-foreground hover:opacity-90 disabled:opacity-50 text-background text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Dispatching Alert...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Dispatch Message</span>
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-center text-muted-foreground pt-0.5">
                        Direct delivery &bull; Triggers Email, SMS &amp; WhatsApp alerts without leaving the page
                      </p>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <footer className="mt-12 text-center text-[11px] text-muted-foreground">
            <p className="text-[10px] text-muted-foreground/80">
              &copy; {new Date().getFullYear()} {activeContent.student.fullName} &bull; All rights reserved.
            </p>
          </footer>
        </div>
      </div>

      {/* Full-Screen Center Color Flood Transition */}
      <AnimatePresence>
        {socialTransition && (
          <motion.div
            key="social-flood"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={cancelSocialTransition}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden pointer-events-auto cursor-pointer"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0, opacity: 0.95 }}
                animate={{ scale: 45, opacity: 1 }}
                exit={{ opacity: 0, scale: 50 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
                className="w-28 h-28 rounded-full shadow-2xl"
                style={{
                  background: socialTransition.gradient || socialTransition.brandColor,
                }}
              />
            </div>

            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.38, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative z-20 flex flex-col items-center justify-center text-center px-6 py-8 w-full max-w-sm mx-auto select-none"
            >
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-2xl mb-4 border border-white/30">
                {getChannelGlyph(socialTransition.id, 'w-12 h-12 text-white')}
              </div>

              <h3 className="text-2xl font-bold font-serif text-white tracking-tight drop-shadow-md text-center">
                {socialTransition.name}
              </h3>
              <p className="text-xs font-mono text-white/90 mt-1 max-w-xs drop-shadow text-center">
                {socialTransition.handle}
              </p>

              <a
                href={socialTransition.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-5 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/25 backdrop-blur-md text-xs font-semibold text-white tracking-wide shadow-lg hover:bg-white/35 transition cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
                <span>Redirecting to {socialTransition.name}...</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Menu */}
      <FloatingMenu
        items={menuItems}
        accentColor="#704a29"
        darkColor="#221b16"
        activeLabel={activePage.toUpperCase()}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <SiteContentProvider>
        <AppInner />
      </SiteContentProvider>
    </AuthProvider>
  );
}

export default App;
