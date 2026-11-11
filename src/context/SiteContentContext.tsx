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
    try {
      const activeTheme = publishedContent?.theme || defaultInitialContent.theme;
      if (!activeTheme) return;

      const root = document.documentElement;
      const colors = activeTheme.colors || defaultInitialContent.theme.colors;
      const typography = activeTheme.typography || defaultInitialContent.theme.typography;
      const layout = activeTheme.layout || defaultInitialContent.theme.layout;

      // Colors
      if (colors) {
        if (colors.background) root.style.setProperty('--background', colors.background);
        if (colors.foreground) root.style.setProperty('--foreground', colors.foreground);
        if (colors.card) root.style.setProperty('--card', colors.card);
        if (colors.cardForeground) root.style.setProperty('--card-foreground', colors.cardForeground);
        if (colors.primary) root.style.setProperty('--primary', colors.primary);
        if (colors.primaryForeground) root.style.setProperty('--primary-foreground', colors.primaryForeground);
        if (colors.secondary) root.style.setProperty('--secondary', colors.secondary);
        if (colors.secondaryForeground) root.style.setProperty('--secondary-foreground', colors.secondaryForeground);
        if (colors.muted) root.style.setProperty('--muted', colors.muted);
        if (colors.mutedForeground) root.style.setProperty('--muted-foreground', colors.mutedForeground);
        if (colors.accent) root.style.setProperty('--accent', colors.accent);
        if (colors.accentForeground) root.style.setProperty('--accent-foreground', colors.accentForeground);
        if (colors.border) root.style.setProperty('--border', colors.border);
        if (colors.ring) root.style.setProperty('--ring', colors.ring);
      }

      // Border Radius
      const radiusMap: Record<string, string> = {
        none: '0px',
        small: '0.25rem',
        medium: '0.5rem',
        large: '0.85rem',
        full: '9999px',
      };
      if (layout) {
        root.style.setProperty('--radius', radiusMap[layout.borderRadius || 'medium'] || '0.5rem');
      }

      // Typography Fonts
      if (typography) {
        if (typography.headingFont) {
          root.style.setProperty('--font-heading', typography.headingFont);
          root.style.setProperty('--font-family', typography.headingFont);
        }
        if (typography.bodyFont) {
          root.style.setProperty('--font-body', typography.bodyFont);
        }
      }
    } catch (e) {
      console.warn('Theme style application notice:', e);
    }
  }, [publishedContent?.theme]);

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
