import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Cpu,
  Layers,
  Database,
  Brain,
  Nfc,
  Wrench,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface SkillItem {
  name: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'AI & ML' | 'Hardware' | 'Tools';
  level: 'Advanced' | 'Proficient' | 'Hands-on' | 'Specialized';
  experienceYears?: string;
  iconType: string;
  description: string;
}

// Complete skills catalog (Top 10 prioritized by CSE & Software Engineering relevance)
export const allSkills: SkillItem[] = [
  // --- TOP 10 PRIORITIZED SKILLS ---
  {
    name: 'Python',
    category: 'Languages',
    level: 'Advanced',
    iconType: 'python',
    description: 'PyTorch deep learning, data analysis, scientific computing & backend scripting',
  },
  {
    name: 'TypeScript',
    category: 'Languages',
    level: 'Advanced',
    iconType: 'ts',
    description: 'Strict typing, robust frontends, scalable Node.js architecture & SDKs',
  },
  {
    name: 'JavaScript (ES6+)',
    category: 'Languages',
    level: 'Advanced',
    iconType: 'js',
    description: 'Modern asynchronous workflows, DOM engineering, Web APIs & Node runtimes',
  },
  {
    name: 'C / C++',
    category: 'Languages',
    level: 'Proficient',
    iconType: 'cpp',
    description: 'Data structures, algorithm complexity, memory management & pointer logic',
  },
  {
    name: 'SQL',
    category: 'Languages',
    level: 'Advanced',
    iconType: 'sql',
    description: 'Relational query design, indexing, joins, migrations & PostgreSQL schema modeling',
  },
  {
    name: 'React 18 / 19',
    category: 'Frontend',
    level: 'Advanced',
    iconType: 'react',
    description: 'Hooks, custom state orchestration, suspense, functional architecture & SPA flows',
  },
  {
    name: 'Node.js & Express',
    category: 'Backend',
    level: 'Advanced',
    iconType: 'node',
    description: 'RESTful API endpoints, middleware pipelines, JWT auth & backend microservices',
  },
  {
    name: 'Supabase & PostgreSQL',
    category: 'Backend',
    level: 'Advanced',
    iconType: 'supabase',
    description: 'Row Level Security (RLS), real-time subscriptions, edge functions & storage',
  },
  {
    name: 'PyTorch',
    category: 'AI & ML',
    level: 'Advanced',
    iconType: 'pytorch',
    description: 'Tensor pipelines, autograd, customized loss functions & neural network training',
  },
  {
    name: 'Git & GitHub',
    category: 'Tools',
    level: 'Advanced',
    iconType: 'git',
    description: 'Branching strategies, CI/CD actions, pull requests, semantic versioning & merges',
  },

  // --- ADDITIONAL SPECIALIZED & ECOSYSTEM SKILLS (Revealed on 'See More') ---
  {
    name: 'HTML5 & Modern CSS3',
    category: 'Languages',
    level: 'Advanced',
    iconType: 'css',
    description: 'Semantic accessibility, CSS grid/flexbox, print media styles & layout engines',
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    level: 'Advanced',
    iconType: 'tailwind',
    description: 'Design systems, tokens, responsive ergonomics & bespoke vintage aesthetics',
  },
  {
    name: 'Framer Motion',
    category: 'Frontend',
    level: 'Advanced',
    iconType: 'motion',
    description: 'Spring physics, layout transitions, liquid morphing menus & 3D card flips',
  },
  {
    name: 'Vite Ecosystem',
    category: 'Frontend',
    level: 'Advanced',
    iconType: 'vite',
    description: 'Lightning-fast HMR, Rollup optimization, chunk splitting & modern tooling',
  },
  {
    name: 'Firebase & Cloud Firestore',
    category: 'Backend',
    level: 'Advanced',
    iconType: 'firebase',
    description: 'Firebase Hosting, security rules auditing, NoSQL Firestore & real-time sync',
  },
  {
    name: 'Vision Transformers (ViT)',
    category: 'AI & ML',
    level: 'Specialized' as any,
    iconType: 'vit',
    description: '3D UNETR, attention mechanisms & multi-modal medical volumetric segmentation',
  },
  {
    name: 'MONAI & NiBabel',
    category: 'AI & ML',
    level: 'Specialized' as any,
    iconType: 'monai',
    description: 'Medical imaging pipelines, 3D MRI preprocessing & volumetric spatial transforms',
  },
  {
    name: 'scikit-learn & ML',
    category: 'AI & ML',
    level: 'Proficient',
    iconType: 'sklearn',
    description: 'Isolation Forests, anomaly detection, statistical evaluations & clustering models',
  },
  {
    name: 'NFC & RFID Protocols',
    category: 'Hardware',
    level: 'Specialized' as any,
    iconType: 'nfc',
    description: 'ISO/IEC 14443 Type A/B, NDEF records, dynamic cloud redirection & chip encoding',
  },
  {
    name: 'Arduino & Microcontrollers',
    category: 'Hardware',
    level: 'Hands-on',
    iconType: 'arduino',
    description: 'Embedded C/C++, serial communications, GPIO sensors & hardware prototyping',
  },
  {
    name: 'WebUSB & Serial APIs',
    category: 'Hardware',
    level: 'Proficient',
    iconType: 'webusb',
    description: 'Direct browser-to-hardware communication, peripheral controllers & card readers',
  },
  {
    name: 'Linux / Bash',
    category: 'Tools',
    level: 'Proficient',
    iconType: 'linux',
    description: 'Shell scripting, file permissions, server configuration & command line proficiency',
  },
  {
    name: 'Docker Containerization',
    category: 'Tools',
    level: 'Hands-on',
    iconType: 'docker',
    description: 'Dockerfiles, multi-stage builds, container isolation & local development stacks',
  },
  {
    name: 'Vitest & Testing',
    category: 'Tools',
    level: 'Proficient',
    iconType: 'test',
    description: 'Unit testing, TDD workflows, component mock assertion & snapshot testing',
  },
];

type SkillCategory = 'All' | 'Languages' | 'Frontend' | 'Backend' | 'AI & ML' | 'Hardware' | 'Tools';

import { useSiteContent } from '../../context/SiteContentContext';

export const SkillsSection: React.FC = () => {
  const { activeContent } = useSiteContent();
  const currentSkills = activeContent?.skills || allSkills;
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('All');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const categories: SkillCategory[] = [
    'All',
    'Languages',
    'Frontend',
    'Backend',
    'AI & ML',
    'Hardware',
    'Tools',
  ];

  const filteredSkills =
    activeCategory === 'All'
      ? currentSkills
      : currentSkills.filter((s) => s.category === activeCategory);

  // Show top 10 skills by default; expand to show all when isExpanded is true
  const displayedSkills =
    isExpanded || filteredSkills.length <= 10
      ? filteredSkills
      : filteredSkills.slice(0, 10);

  const hasMoreSkills = filteredSkills.length > 10;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Languages':
        return <Code2 className="w-3.5 h-3.5 text-[#704a29]" />;
      case 'Frontend':
        return <Layers className="w-3.5 h-3.5 text-[#8c4e34]" />;
      case 'Backend':
        return <Database className="w-3.5 h-3.5 text-[#10B981]" />;
      case 'AI & ML':
        return <Brain className="w-3.5 h-3.5 text-[#7c3aed]" />;
      case 'Hardware':
        return <Nfc className="w-3.5 h-3.5 text-[#d97706]" />;
      case 'Tools':
        return <Wrench className="w-3.5 h-3.5 text-[#2563eb]" />;
      default:
        return <Cpu className="w-3.5 h-3.5 text-[#704a29]" />;
    }
  };

  return (
    <section id="skills-section" className="space-y-3 pt-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#f4ece1] border border-[#d9cdbd] flex items-center justify-center text-[#704a29]">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-bold font-serif text-[#2b241e] uppercase tracking-wider">
              Technical Competencies &bull; Skills
            </h2>
            <p className="text-[10px] text-[#73685c] font-sans">
              Interactive Skill Cards &bull; Top 10 by Default
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#704a29] font-bold px-2.5 py-0.5 rounded-full bg-[#f4ece1] border border-[#d9cdbd] whitespace-nowrap shrink-0">
          {hasMoreSkills && !isExpanded
            ? `Top 10 of ${filteredSkills.length}`
            : `${filteredSkills.length} Skills`}
        </span>
      </div>

      {/* Category Filter Pills (Clean wrap, no horizontal scrollbar) */}
      <div className="flex flex-wrap items-center gap-1.5 px-1 select-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#704a29] text-[#fffefb] font-bold shadow-xs'
                  : 'bg-[#fffefb] border border-[#d9cdbd] text-[#73685c] hover:text-[#2b241e] hover:border-[#a67c52]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Animated Skills Grid with Card Hover Animations */}
      <motion.div
        layout
        id="skills-grid"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1"
      >
        <AnimatePresence mode="popLayout">
          {displayedSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
              transition={{
                duration: 0.22,
                delay: Math.min(index * 0.02, 0.2),
                type: 'spring',
                stiffness: 300,
                damping: 24,
              }}
              whileHover={{
                y: -4,
                scale: 1.015,
                boxShadow:
                  '0 12px 24px -10px rgba(112, 74, 41, 0.2), 0 0 0 1.5px rgba(112, 74, 41, 0.45)',
                transition: { duration: 0.18, ease: 'easeOut' },
              }}
              whileTap={{ scale: 0.98 }}
              className="group p-3 rounded-xl bg-[#fffefb] border border-[#d9cdbd] hover:border-[#704a29] transition-colors relative cursor-pointer overflow-hidden shadow-2xs select-none"
            >
              {/* Category Icon and Skill Name */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] flex items-center justify-center shrink-0 group-hover:bg-[#f4ece1] transition-colors">
                    {getCategoryIcon(skill.category)}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-[13px] font-bold font-serif text-[#2b241e] group-hover:text-[#704a29] transition-colors leading-tight">
                      {skill.name}
                    </h3>
                    <span className="text-[9px] font-mono text-[#8c6239] uppercase font-semibold">
                      {skill.category}
                    </span>
                  </div>
                </div>

                {/* Skill Level Badge */}
                <span
                  className={`text-[8.5px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    skill.level === 'Advanced'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : skill.level === 'Specialized'
                      ? 'bg-purple-50 text-purple-800 border-purple-200'
                      : 'bg-[#fbf8f3] text-[#704a29] border-[#d9cdbd]'
                  }`}
                >
                  {skill.level}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-[#5c5247] mt-2 leading-relaxed font-sans line-clamp-2">
                {skill.description}
              </p>

              {/* Bottom Subtle Micro-Interaction Accent Line */}
              <div className="mt-2.5 h-[2px] w-full rounded-full bg-[#f0eae1] overflow-hidden">
                <motion.div
                  className="h-full bg-[#704a29]"
                  initial={{ width: 0 }}
                  whileInView={{
                    width:
                      skill.level === 'Advanced'
                        ? '95%'
                        : skill.level === 'Specialized'
                        ? '90%'
                        : '80%',
                  }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.05 }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* SEE MORE / SEE LESS ACTION BUTTON */}
      {hasMoreSkills && (
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-controls="skills-grid"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#fffefb] hover:bg-[#f4ece1] text-[#704a29] border border-[#d9cdbd] hover:border-[#704a29] text-xs font-serif font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#704a29]/30"
          >
            <span>
              {isExpanded ? 'See Less' : `See More (${filteredSkills.length - 10} More Skills)`}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#704a29]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#704a29]" />
            )}
          </button>
        </div>
      )}
    </section>
  );
};
