import React, { createContext, useContext, useState, useEffect } from 'react';
import { PublishedProfileData } from '../types/content';
import { defaultInitialContent } from '../data/initialContent';
import { fetchPublishedProfile } from '../lib/firebase';

interface SiteContentContextType {
  publishedContent: PublishedProfileData;
  activeContent: PublishedProfileData;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publishedContent, setPublishedContent] = useState<PublishedProfileData>(defaultInitialContent);

  // Load published content from Firestore or local fallback
  useEffect(() => {
    async function loadContent() {
      const pub = await fetchPublishedProfile('rahulnagv');
      setPublishedContent(pub);
    }
    loadContent();
  }, []);

  // Apply theme tokens directly to CSS custom properties
  useEffect(() => {
    const activeTheme = publishedContent.theme;
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
  }, [publishedContent.theme]);

  const activeContent = publishedContent;

  return (
    <SiteContentContext.Provider
      value={{
        publishedContent,
        activeContent,
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
