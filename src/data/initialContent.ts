import { defaultStudentData } from './student';
import { allProjects } from './projects';
import { engineeringAcademicData, SchoolRecord } from '../components/education/EducationSection';
import { allSkills } from '../components/skills/SkillsSection';
import { PublishedProfileData, ThemeConfig, SectionConfig, SocialChannelConfig, VisibilitySettings, SeoConfig } from '../types/content';

export const defaultSchoolRecords: SchoolRecord[] = [
  {
    id: 'school-12th',
    qualification: 'Pre-University Course (PUC / 12th Standard)',
    subTitle: 'Physics, Chemistry, Mathematics & Computer Science (PCMC)',
    score: 94.2,
    scale: '%',
    board: 'Department of Pre-University Education, Karnataka',
    duration: '2022 – 2024',
  },
  {
    id: 'school-10th',
    qualification: 'Secondary School Leaving Certificate (SSLC / 10th Standard)',
    subTitle: 'General Sciences, Mathematics & Social Studies',
    score: 96.8,
    scale: '%',
    board: 'Karnataka Secondary Education Examination Board (KSEEB)',
    duration: '2020 – 2022',
  },
];

export const defaultSocialChannels: SocialChannelConfig[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    handle: '+91 9844616699',
    actionText: 'Direct Message on WhatsApp',
    url: 'https://wa.me/919844616699',
    brandColor: '#25D366',
    gradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    visible: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@__rahul_nag__',
    actionText: 'Redirect to Instagram Profile',
    url: 'https://www.instagram.com/__rahul_nag__?srtk=ODFpdHAxdHlud3Iw',
    brandColor: '#E1306C',
    gradient: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    visible: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'linkedin.com/in/rahulnagv',
    actionText: 'Connect on LinkedIn',
    url: 'https://www.linkedin.com/in/rahulnagv',
    brandColor: '#0A66C2',
    gradient: 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)',
    visible: true,
  },
  {
    id: 'github',
    name: 'GitHub',
    handle: 'github.com/RahulNag-V',
    actionText: 'Explore Repositories on GitHub',
    url: 'https://github.com/RahulNag-V',
    brandColor: '#181717',
    gradient: 'linear-gradient(135deg, #24292e 0%, #0d1117 100%)',
    visible: true,
  },
  {
    id: 'email',
    name: 'Direct Email',
    handle: 'rahulnagv.dev@gmail.com',
    actionText: 'Send Direct Email Note',
    url: 'mailto:rahulnagv.dev@gmail.com',
    brandColor: '#EA4335',
    gradient: 'linear-gradient(135deg, #EA4335 0%, #c5221f 100%)',
    visible: true,
  },
];

export const defaultSections: SectionConfig[] = [
  {
    id: 'sec-watermark',
    type: 'watermark',
    title: 'Page Watermark Header',
    visible: true,
    order: 1,
  },
  {
    id: 'sec-id-card',
    type: 'id-card',
    title: 'Vertical 3D Student ID Card',
    description: 'Interactive PVC Smart Card with front and back interactive 3D flip and export',
    visible: true,
    order: 2,
  },
  {
    id: 'sec-education',
    type: 'education',
    title: 'Academic Journey & Records',
    description: 'Detailed VTU engineering semesters, SGPA scores, and school records',
    visible: true,
    order: 3,
  },
  {
    id: 'sec-skills',
    type: 'skills',
    title: 'Technical Skills & Proficiencies',
    description: 'Engineering competencies categorized by languages, AI, and systems',
    visible: true,
    order: 4,
  },
  {
    id: 'sec-disciplines',
    type: 'disciplines',
    title: 'Core Disciplines',
    description: 'Physical & NFC Hardware, Tactile Design Systems, and High-Performance Cloud',
    visible: true,
    order: 5,
  },
  {
    id: 'sec-featured-projects',
    type: 'featured-projects',
    title: 'Featured Systems & Live Work',
    description: 'Curated projects highlighted on home view',
    visible: true,
    order: 6,
  },
  {
    id: 'sec-call-to-action',
    type: 'call-to-action',
    title: 'Navigation Actions',
    description: 'Quick links to Works portfolio and Contact inquiries',
    visible: true,
    order: 7,
  },
];

export const defaultTheme: ThemeConfig = {
  preset: 'Classic Academic',
  colors: {
    background: '#fbf8f3',
    foreground: '#2b241e',
    card: '#fffefb',
    cardForeground: '#2b241e',
    primary: '#a67c52',
    primaryForeground: '#ffffff',
    secondary: '#e5ded5',
    secondaryForeground: '#2b241e',
    muted: '#f0eae1',
    mutedForeground: '#73685c',
    accent: '#d9cdbd',
    accentForeground: '#2b241e',
    border: '#d9cdbd',
    ring: '#a67c52',
    idCardBorder: '#8c7860',
    idCardBackground: '#ffffff',
  },
  typography: {
    fontFamily: 'serif',
    headingFont: '"Times New Roman", Times, "Tinos", Georgia, serif',
    bodyFont: '"Times New Roman", Times, "Tinos", Georgia, serif',
    fontSizeScale: 'normal',
    letterSpacing: 'normal',
  },
  layout: {
    pageWidth: 'compact',
    borderRadius: 'medium',
    shadowIntensity: 'subtle',
    spacingDensity: 'normal',
  },
  background: {
    type: 'solid',
  },
};

export const defaultVisibility: VisibilitySettings = {
  showPhone: true,
  showEmail: true,
  showPermanentAddress: false, // Protected by default
  showCurrentAddress: true,
  showBloodGroup: false, // Protected by default
  showDob: true,
  showEmergencyContact: false,
  showSgpaScores: true,
};

export const defaultSeo: SeoConfig = {
  title: 'Rahul Nag V — NFC Smart ID Card & Digital Profile',
  description: 'Official digital identity, engineering projects, and academic credentials of Rahul Nag V (1BH24CS051), Computer Science & Engineering student at Bangalore Technological Institute.',
  keywords: 'Rahul Nag V, 1BH24CS051, BTI, NFC Smart ID Card, Computer Science, Portfolio, Bangalore Technological Institute',
  author: 'Rahul Nag V',
  ogImage: '/bti-logo.jpeg',
  canonicalUrl: 'https://rahulnagv-24cs051.web.app',
};

export const defaultInitialContent: PublishedProfileData = {
  student: defaultStudentData,
  projects: allProjects,
  academic: {
    engineering: engineeringAcademicData,
    schooling: defaultSchoolRecords,
    certifications: [
      'Visvesvaraya Technological University (VTU) Accredited Engineering Curriculum',
      'AICTE Approved Technical Programme Standard',
    ],
    achievements: [
      'First Class with Distinction Academic Standing across completed terms',
      'Codecircuit Hackathon 2025 Finalist Project Deployment',
    ],
  },
  skills: allSkills,
  socialChannels: defaultSocialChannels,
  sections: defaultSections,
  theme: defaultTheme,
  visibility: defaultVisibility,
  seo: defaultSeo,
  version: 1,
  updatedAt: new Date().toISOString(),
  publishedAt: new Date().toISOString(),
};
