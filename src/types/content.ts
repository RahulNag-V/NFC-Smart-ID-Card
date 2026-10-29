import { StudentProfile } from '../data/student';
import { Project, FilterCategory } from '../data/projects';
import { YearAcademicData, SchoolRecord } from '../components/education/EducationSection';
import { SkillItem } from '../components/skills/SkillsSection';

export interface SocialChannelConfig {
  id: string;
  name: string;
  handle: string;
  actionText: string;
  url: string;
  brandColor: string;
  gradient?: string;
  visible: boolean;
}

export type ThemePresetName =
  | 'Classic Academic'
  | 'Premium Dark'
  | 'Minimal White'
  | 'Midnight Blue'
  | 'Emerald Professional'
  | 'Warm Paper'
  | 'Modern Glass'
  | 'Custom';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  ring: string;
  idCardBorder?: string;
  idCardBackground?: string;
}

export interface ThemeTypography {
  fontFamily: 'serif' | 'sans' | 'mono';
  headingFont: string;
  bodyFont: string;
  fontSizeScale: 'compact' | 'normal' | 'relaxed';
  letterSpacing: 'tight' | 'normal' | 'wide';
}

export interface ThemeLayout {
  pageWidth: 'compact' | 'standard' | 'wide';
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
  shadowIntensity: 'none' | 'subtle' | 'medium' | 'prominent';
  spacingDensity: 'compact' | 'normal' | 'spacious';
}

export interface ThemeBackground {
  type: 'solid' | 'gradient' | 'image';
  gradientType?: 'linear' | 'radial';
  gradientAngle?: number;
  gradientFrom?: string;
  gradientTo?: string;
  imageUrl?: string;
  overlayOpacity?: number;
}

export interface ThemeConfig {
  preset: ThemePresetName;
  colors: ThemeColors;
  typography: ThemeTypography;
  layout: ThemeLayout;
  background: ThemeBackground;
}

export type SectionType =
  | 'watermark'
  | 'id-card'
  | 'education'
  | 'skills'
  | 'disciplines'
  | 'featured-projects'
  | 'call-to-action'
  | 'custom-text-image';

export interface SectionConfig {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  description?: string;
  visible: boolean;
  order: number;
  customContent?: {
    heading: string;
    body: string;
    imageUrl?: string;
    imagePosition?: 'left' | 'right' | 'top';
    badgeText?: string;
  };
}

export interface VisibilitySettings {
  showPhone: boolean;
  showEmail: boolean;
  showPermanentAddress: boolean;
  showCurrentAddress: boolean;
  showBloodGroup: boolean;
  showDob: boolean;
  showEmergencyContact: boolean;
  showSgpaScores: boolean;
}

export interface SeoConfig {
  title: string;
  description: string;
  keywords: string;
  author: string;
  ogImage?: string;
  canonicalUrl: string;
}

export interface PublishedProfileData {
  student: StudentProfile;
  projects: Project[];
  academic: {
    engineering: YearAcademicData[];
    schooling: SchoolRecord[];
    certifications?: string[];
    achievements?: string[];
  };
  skills: SkillItem[];
  socialChannels: SocialChannelConfig[];
  sections: SectionConfig[];
  theme: ThemeConfig;
  visibility: VisibilitySettings;
  seo: SeoConfig;
  version: number;
  updatedAt: string;
  publishedAt: string;
}

export interface VersionSnapshot {
  id: string;
  version: number;
  timestamp: string;
  description: string;
  publishedBy: string;
  data: PublishedProfileData;
}
