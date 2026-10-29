import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  PublishedProfileData,
  ThemeConfig,
  SectionConfig,
  SocialChannelConfig,
  VisibilitySettings,
  SeoConfig,
  VersionSnapshot,
} from '../types/content';
import { defaultInitialContent } from '../data/initialContent';
import { StudentProfile } from '../data/student';
import { Project } from '../data/projects';
import { SkillItem } from '../components/skills/SkillsSection';
import { YearAcademicData, SchoolRecord } from '../components/education/EducationSection';
import {
  fetchPublishedProfile,
  fetchDraftProfile,
  saveDraftToStorage,
  publishProfileLive,
  fetchVersionHistory,
} from '../lib/firebase';
import { useAuth } from './AuthContext';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

interface SiteContentContextType {
  publishedContent: PublishedProfileData;
  draftContent: PublishedProfileData;
  activeContent: PublishedProfileData;
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  hasUnsavedChanges: boolean;
  lastSaved: string | null;
  isSaving: boolean;
  isPublishing: boolean;
  canUndo: boolean;
  canRedo: boolean;
  versions: VersionSnapshot[];
  undo: () => void;
  redo: () => void;
  saveDraft: () => Promise<void>;
  publishChanges: () => Promise<VersionSnapshot>;
  discardDraft: () => void;
  restoreVersion: (snapshot: VersionSnapshot) => Promise<void>;
  exportBackup: () => string;
  importBackup: (jsonStr: string) => Promise<{ success: boolean; error?: string }>;
  
  // Specific updater helpers
  updateStudent: (updates: Partial<StudentProfile>) => void;
  updateProjects: (projects: Project[]) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  updateAcademic: (updates: {
    engineering?: YearAcademicData[];
    schooling?: SchoolRecord[];
    certifications?: string[];
    achievements?: string[];
  }) => void;
  updateSkills: (skills: SkillItem[]) => void;
  updateSocialChannels: (channels: SocialChannelConfig[]) => void;
  updateSections: (sections: SectionConfig[]) => void;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  updateVisibility: (updates: Partial<VisibilitySettings>) => void;
  updateSeo: (updates: Partial<SeoConfig>) => void;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

const MAX_HISTORY_LENGTH = 50;

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOwner, user } = useAuth();
  const [publishedContent, setPublishedContent] = useState<PublishedProfileData>(defaultInitialContent);
  const [draftContent, setDraftContent] = useState<PublishedProfileData>(defaultInitialContent);
  const [isEditMode, setIsEditModeState] = useState<boolean>(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);

  // Bounded History Stacks for Undo / Redo
  const undoStackRef = useRef<PublishedProfileData[]>([]);
  const redoStackRef = useRef<PublishedProfileData[]>([]);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  // Sync canUndo/canRedo state
  const syncHistoryState = () => {
    setCanUndo(undoStackRef.current.length > 0);
    setCanRedo(redoStackRef.current.length > 0);
  };

  // Load initial content from Firestore or local storage
  useEffect(() => {
    async function loadInitial() {
      const pub = await fetchPublishedProfile('rahulnagv');
      setPublishedContent(pub);
      const draft = await fetchDraftProfile('rahulnagv');
      if (draft) {
        setDraftContent(draft);
      } else {
        setDraftContent(pub);
      }
      const vers = await fetchVersionHistory('rahulnagv');
      setVersions(vers);
    }
    loadInitial();
  }, []);

  // When owner signs in/out, manage edit mode safely
  useEffect(() => {
    if (!isOwner) {
      setIsEditModeState(false);
      setViewportMode('desktop');
    }
  }, [isOwner]);

  const setIsEditMode = (mode: boolean) => {
    if (mode && !isOwner) {
      return; // Only authorized owner can enter edit mode
    }
    setIsEditModeState(mode);
  };

  // Apply theme tokens directly to CSS custom properties
  useEffect(() => {
    const activeTheme = isEditMode ? draftContent.theme : publishedContent.theme;
    if (!activeTheme) return;

    const root = document.documentElement;
    const { colors, typography, layout } = activeTheme;

    // Colors
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.foreground);
    root.style.setProperty('--card', colors.card);
    root.style.setProperty('--card-foreground', colors.cardForeground);
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-foreground', colors.primaryForeground);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--secondary-foreground', colors.secondaryForeground);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--muted-foreground', colors.mutedForeground);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--accent-foreground', colors.accentForeground);
    root.style.setProperty('--border', colors.border);
    root.style.setProperty('--ring', colors.ring);

    // Border Radius
    const radiusMap = {
      none: '0px',
      small: '0.25rem',
      medium: '0.5rem',
      large: '0.85rem',
      full: '9999px',
    };
    root.style.setProperty('--radius', radiusMap[layout.borderRadius || 'medium']);

    // Typography Fonts
    if (typography) {
      root.style.setProperty('--font-heading', typography.headingFont);
      root.style.setProperty('--font-body', typography.bodyFont);
    }
  }, [isEditMode, draftContent.theme, publishedContent.theme]);

  // Push to history stack before mutating state
  const pushToHistory = (previousData: PublishedProfileData) => {
    undoStackRef.current.push(JSON.parse(JSON.stringify(previousData)));
    if (undoStackRef.current.length > MAX_HISTORY_LENGTH) {
      undoStackRef.current.shift();
    }
    // Clear redo stack on new branch
    redoStackRef.current = [];
    syncHistoryState();
  };

  const mutateDraft = useCallback(
    (updater: (prev: PublishedProfileData) => PublishedProfileData) => {
      setDraftContent((prev) => {
        pushToHistory(prev);
        const next = updater(prev);
        setHasUnsavedChanges(true);
        return next;
      });
    },
    []
  );

  const undo = () => {
    if (undoStackRef.current.length === 0) return;
    const previous = undoStackRef.current.pop()!;
    redoStackRef.current.push(JSON.parse(JSON.stringify(draftContent)));
    setDraftContent(previous);
    setHasUnsavedChanges(true);
    syncHistoryState();
  };

  const redo = () => {
    if (redoStackRef.current.length === 0) return;
    const next = redoStackRef.current.pop()!;
    undoStackRef.current.push(JSON.parse(JSON.stringify(draftContent)));
    setDraftContent(next);
    setHasUnsavedChanges(true);
    syncHistoryState();
  };

  // Keyboard shortcuts for Undo (Ctrl+Z) and Redo (Ctrl+Y / Ctrl+Shift+Z)
  useEffect(() => {
    if (!isEditMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, draftContent]);

  // Specific domain updaters
  const updateStudent = (updates: Partial<StudentProfile>) => {
    mutateDraft((prev) => ({
      ...prev,
      student: { ...prev.student, ...updates },
    }));
  };

  const updateProjects = (projects: Project[]) => {
    mutateDraft((prev) => ({
      ...prev,
      projects,
    }));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    mutateDraft((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const addProject = (project: Project) => {
    mutateDraft((prev) => ({
      ...prev,
      projects: [project, ...prev.projects],
    }));
  };

  const deleteProject = (id: string) => {
    mutateDraft((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  };

  const updateAcademic = (updates: {
    engineering?: YearAcademicData[];
    schooling?: SchoolRecord[];
    certifications?: string[];
    achievements?: string[];
  }) => {
    mutateDraft((prev) => ({
      ...prev,
      academic: {
        engineering: updates.engineering || prev.academic.engineering,
        schooling: updates.schooling || prev.academic.schooling,
        certifications: updates.certifications ?? prev.academic.certifications,
        achievements: updates.achievements ?? prev.academic.achievements,
      },
    }));
  };

  const updateSkills = (skills: SkillItem[]) => {
    mutateDraft((prev) => ({
      ...prev,
      skills,
    }));
  };

  const updateSocialChannels = (channels: SocialChannelConfig[]) => {
    mutateDraft((prev) => ({
      ...prev,
      socialChannels: channels,
    }));
  };

  const updateSections = (sections: SectionConfig[]) => {
    mutateDraft((prev) => ({
      ...prev,
      sections,
    }));
  };

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    mutateDraft((prev) => ({
      ...prev,
      theme: { ...prev.theme, ...updates },
    }));
  };

  const updateVisibility = (updates: Partial<VisibilitySettings>) => {
    mutateDraft((prev) => ({
      ...prev,
      visibility: { ...prev.visibility, ...updates },
    }));
  };

  const updateSeo = (updates: Partial<SeoConfig>) => {
    mutateDraft((prev) => ({
      ...prev,
      seo: { ...prev.seo, ...updates },
    }));
  };

  // Save Draft
  const saveDraft = async () => {
    setIsSaving(true);
    try {
      await saveDraftToStorage('rahulnagv', draftContent, user?.uid || 'owner');
      setHasUnsavedChanges(false);
      setLastSaved(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error saving draft:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Publish
  const publishChanges = async (): Promise<VersionSnapshot> => {
    setIsPublishing(true);
    try {
      const snapshot = await publishProfileLive('rahulnagv', draftContent, user?.uid || 'owner');
      setPublishedContent(snapshot.data);
      setDraftContent(snapshot.data);
      setHasUnsavedChanges(false);
      setLastSaved(new Date().toLocaleTimeString());
      setVersions((prev) => [snapshot, ...prev]);
      return snapshot;
    } catch (err) {
      console.error('Error publishing profile:', err);
      throw err;
    } finally {
      setIsPublishing(false);
    }
  };

  // Discard draft and revert to published
  const discardDraft = () => {
    if (window.confirm('Are you sure you want to discard unsaved draft changes? This cannot be undone.')) {
      pushToHistory(draftContent);
      setDraftContent(JSON.parse(JSON.stringify(publishedContent)));
      setHasUnsavedChanges(false);
    }
  };

  // Restore previous version
  const restoreVersion = async (snapshot: VersionSnapshot) => {
    if (window.confirm(`Restore version ${snapshot.version} from ${snapshot.timestamp}?`)) {
      pushToHistory(draftContent);
      const restored = JSON.parse(JSON.stringify(snapshot.data));
      setDraftContent(restored);
      setHasUnsavedChanges(true);
    }
  };

  // Backup and Export JSON
  const exportBackup = (): string => {
    const backup = {
      exportVersion: 1,
      exportedAt: new Date().toISOString(),
      content: draftContent,
    };
    return JSON.stringify(backup, null, 2);
  };

  // Import Backup
  const importBackup = async (jsonStr: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.content || !parsed.content.student || !parsed.content.projects) {
        return { success: false, error: 'Invalid backup file structure.' };
      }
      pushToHistory(draftContent);
      setDraftContent(parsed.content);
      setHasUnsavedChanges(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to parse JSON backup.' };
    }
  };

  const activeContent = isEditMode ? draftContent : publishedContent;

  return (
    <SiteContentContext.Provider
      value={{
        publishedContent,
        draftContent,
        activeContent,
        isEditMode,
        setIsEditMode,
        viewportMode,
        setViewportMode,
        hasUnsavedChanges,
        lastSaved,
        isSaving,
        isPublishing,
        canUndo,
        canRedo,
        versions,
        undo,
        redo,
        saveDraft,
        publishChanges,
        discardDraft,
        restoreVersion,
        exportBackup,
        importBackup,
        updateStudent,
        updateProjects,
        updateProject,
        addProject,
        deleteProject,
        updateAcademic,
        updateSkills,
        updateSocialChannels,
        updateSections,
        updateTheme,
        updateVisibility,
        updateSeo,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};
