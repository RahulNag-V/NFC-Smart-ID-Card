import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { PublishedProfileData, SocialChannelConfig, SectionConfig, ThemeConfig, VisibilitySettings } from '../types/content';
import { defaultInitialContent } from '../data/initialContent';
import { StudentProfile } from '../data/student';
import { Project } from '../data/projects';
import { SkillItem } from '../components/skills/SkillsSection';
import {
  fetchPublishedProfile,
  fetchDraftProfile,
  saveDraftProfile,
  publishProfile,
  uploadOwnerMediaFile,
  CONFIGURED_OWNER_EMAIL,
} from '../lib/firebase';
import { useAuth } from './AuthContext';

export type DashboardTab =
  | 'overview'
  | 'basic-info'
  | 'appearance'
  | 'professional'
  | 'social'
  | 'sections'
  | 'nfc-qr'
  | 'preview'
  | 'security';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface OwnerEditorContextType {
  draftContent: PublishedProfileData;
  publishedContent: PublishedProfileData;
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  lastSaved: Date | null;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  setPreviewDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: () => void;
  updateBasicInfo: (patch: Partial<StudentProfile>) => void;
  updateAppearance: (patch: Partial<ThemeConfig>) => void;
  updateProjects: (projects: Project[]) => void;
  updateAcademic: (academic: PublishedProfileData['academic']) => void;
  updateSkills: (skills: SkillItem[]) => void;
  updateSocialChannels: (channels: SocialChannelConfig[]) => void;
  updateSections: (sections: SectionConfig[]) => void;
  updateVisibility: (patch: Partial<VisibilitySettings>) => void;
  updateSeo: (patch: Partial<PublishedProfileData['seo']>) => void;
  saveDraft: () => Promise<boolean>;
  publishLive: () => Promise<boolean>;
  discardChanges: () => void;
  uploadMedia: (file: File, folder: 'profile' | 'cover' | 'projects' | 'badges') => Promise<string>;
  profileCompletionPercentage: number;
}

const OwnerEditorContext = createContext<OwnerEditorContextType | undefined>(undefined);

export const OwnerEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [publishedContent, setPublishedContent] = useState<PublishedProfileData>(defaultInitialContent);
  const [draftContent, setDraftContent] = useState<PublishedProfileData>(defaultInitialContent);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Load both published and existing draft on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [pub, draft] = await Promise.all([
          fetchPublishedProfile('rahulnagv'),
          fetchDraftProfile('rahulnagv'),
        ]);

        if (isMounted) {
          setPublishedContent(pub);
          if (draft) {
            setDraftContent(draft);
            // Check if draft has modifications compared to published
            const draftStr = JSON.stringify(draft);
            const pubStr = JSON.stringify(pub);
            setIsDirty(draftStr !== pubStr);
          } else {
            setDraftContent(pub);
            setIsDirty(false);
          }
        }
      } catch (err) {
        console.warn('Error initial loading owner profile data:', err);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Mark dirty whenever draft changes
  const checkDirtyState = useCallback((newDraft: PublishedProfileData) => {
    const draftStr = JSON.stringify(newDraft);
    const pubStr = JSON.stringify(publishedContent);
    setIsDirty(draftStr !== pubStr);
  }, [publishedContent]);

  const updateBasicInfo = useCallback((patch: Partial<StudentProfile>) => {
    setDraftContent((prev) => {
      const next = {
        ...prev,
        student: {
          ...prev.student,
          ...patch,
        },
      };
      checkDirtyState(next);
      return next;
    });
  }, [checkDirtyState]);

  const updateAppearance = useCallback((patch: Partial<ThemeConfig>) => {
    setDraftContent((prev) => {
      const next = {
        ...prev,
        theme: {
          ...prev.theme,
          ...patch,
          colors: {
            ...prev.theme.colors,
            ...(patch.colors || {}),
          },
          typography: {
            ...prev.theme.typography,
            ...(patch.typography || {}),
          },
          layout: {
            ...prev.theme.layout,
            ...(patch.layout || {}),
          },
          background: {
            ...prev.theme.background,
            ...(patch.background || {}),
          },
        },
      };
      checkDirtyState(next);
      return next;
    });
  }, [checkDirtyState]);

  const updateProjects = useCallback((projects: Project[]) => {
    setDraftContent((prev) => {
      const next = { ...prev, projects };
      checkDirtyState(next);
      return next;
    });
  }, [checkDirtyState]);

  const updateAcademic = useCallback((academic: PublishedProfileData['academic']) => {
    setDraftContent((prev) => {
      const next = { ...prev, academic };
      checkDirtyState(next);
      return next;
    });
  }, [checkDirtyState]);

  const updateSkills = useCallback((skills: SkillItem[]) => {
    setDraftContent((prev) => {
      const next = { ...prev, skills };
      checkDirtyState(next);
      return next;
    });
  }, [checkDirtyState]);

  const updateSocialChannels = useCallback((channels: SocialChannelConfig[]) => {
    setDraftContent((prev) => {
      const next = { ...prev, socialChannels: channels };
      checkDirtyState(next);
      return next;
    });
  }, [checkDirtyState]);

  const updateSections = useCallback((sections: SectionConfig[]) => {
    setDraftContent((prev) => {
      const next = { ...prev, sections };
      checkDirtyState(next);
      return next;
    });
  }, [checkDirtyState]);

  const updateVisibility = useCallback((patch: Partial<VisibilitySettings>) => {
    setDraftContent((prev) => {
      const next = {
        ...prev,
        visibility: {
          ...prev.visibility,
          ...patch,
        },
      };
      checkDirtyState(next);
      return next;
    });
  }, [checkDirtyState]);

  const updateSeo = useCallback((patch: Partial<PublishedProfileData['seo']>) => {
    setDraftContent((prev) => {
      const next = {
        ...prev,
        seo: {
          ...prev.seo,
          ...patch,
        },
      };
      checkDirtyState(next);
      return next;
    });
  }, [checkDirtyState]);

  const saveDraft = useCallback(async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const now = new Date();
      const updatedDraft: PublishedProfileData = {
        ...draftContent,
        updatedAt: now.toISOString(),
      };
      await saveDraftProfile('rahulnagv', updatedDraft, user?.uid);
      setLastSaved(now);
      showToast('Draft changes saved securely.', 'success');
      return true;
    } catch (err: any) {
      console.error('Failed to save draft:', err);
      showToast(err?.message || 'Failed to save draft.', 'error');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [draftContent, user, showToast]);

  const publishLive = useCallback(async (): Promise<boolean> => {
    setIsPublishing(true);
    try {
      const updatedLive = await publishProfile('rahulnagv', draftContent, user?.uid || 'owner');
      setPublishedContent(updatedLive);
      setDraftContent(updatedLive);
      setIsDirty(false);
      setLastSaved(new Date());
      showToast('Profile published successfully! All NFC tags & QR codes now serve this live edition.', 'success');
      return true;
    } catch (err: any) {
      console.error('Failed to publish live:', err);
      showToast(err?.message || 'Failed to publish changes.', 'error');
      return false;
    } finally {
      setIsPublishing(false);
    }
  }, [draftContent, user, showToast]);

  const discardChanges = useCallback(() => {
    setDraftContent(publishedContent);
    setIsDirty(false);
    showToast('Unsaved changes discarded. Reverted to currently published edition.', 'info');
  }, [publishedContent, showToast]);

  const uploadMedia = useCallback(
    async (file: File, folder: 'profile' | 'cover' | 'projects' | 'badges'): Promise<string> => {
      try {
        const url = await uploadOwnerMediaFile(file, folder, user?.uid || 'owner');
        showToast('Image uploaded successfully.', 'success');
        return url;
      } catch (err: any) {
        showToast(err?.message || 'Image upload failed.', 'error');
        throw err;
      }
    },
    [user, showToast]
  );

  // Calculate profile completion percentage
  const profileCompletionPercentage = useMemo(() => {
    let score = 0;
    const s = draftContent.student;
    if (s.fullName) score += 10;
    if (s.headline) score += 10;
    if (s.biography) score += 15;
    if (s.photoUrl) score += 15;
    if (s.email && s.phone) score += 10;
    if (draftContent.projects && draftContent.projects.length >= 3) score += 15;
    if (draftContent.skills && draftContent.skills.length >= 5) score += 10;
    if (draftContent.socialChannels && draftContent.socialChannels.some((c) => c.visible)) score += 15;
    return Math.min(100, score);
  }, [draftContent]);

  return (
    <OwnerEditorContext.Provider
      value={{
        draftContent,
        publishedContent,
        isDirty,
        isSaving,
        isPublishing,
        lastSaved,
        activeTab,
        setActiveTab,
        previewDevice,
        setPreviewDevice,
        toast,
        showToast,
        dismissToast,
        updateBasicInfo,
        updateAppearance,
        updateProjects,
        updateAcademic,
        updateSkills,
        updateSocialChannels,
        updateSections,
        updateVisibility,
        updateSeo,
        saveDraft,
        publishLive,
        discardChanges,
        uploadMedia,
        profileCompletionPercentage,
      }}
    >
      {children}
    </OwnerEditorContext.Provider>
  );
};

export const useOwnerEditor = () => {
  const context = useContext(OwnerEditorContext);
  if (!context) {
    throw new Error('useOwnerEditor must be used within an OwnerEditorProvider');
  }
  return context;
};
