import React from 'react';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Github,
  QrCode,
  Zap,
  ShieldCheck,
  BrainCircuit,
  Compass,
  Radio,
  ScanLine,
  Trash2,
} from 'lucide-react';
import { Project } from '../../data/projects';
import { useSiteContent } from '../../context/SiteContentContext';
import { InlineEditPopover } from '../editor/InlineEditPopover';

// Dedicated decorative vector banners tailored to each project's domain
function ProjectVisualBanner({ type, badgeColor }: { type: Project['visualType']; badgeColor: string }) {
  switch (type) {
    case 'scanner':
      return (
        <div className="relative w-full h-32 rounded-xl bg-gradient-to-br from-[#10B981]/10 via-[#fbf8f3] to-[#d9cdbd]/30 border border-[#d9cdbd] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:12px_12px] opacity-25" />
          <div className="relative z-10 flex items-center gap-3 px-4 py-2 rounded-xl bg-[#fffefb]/90 border border-[#10B981]/30 shadow-xs backdrop-blur-xs">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <ScanLine className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#10B981] uppercase">
                  TICKET VALIDATED
                </span>
              </div>
              <p className="text-xs font-mono text-[#2b241e] font-semibold mt-0.5">
                QR &bull; Offline Sync
              </p>
            </div>
          </div>
          {/* Decorative scanline beam */}
          <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#10B981]/60 to-transparent" />
        </div>
      );

    case 'brain':
      return (
        <div className="relative w-full h-32 rounded-xl bg-gradient-to-br from-[#7c3aed]/10 via-[#fbf8f3] to-[#d9cdbd]/30 border border-[#d9cdbd] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#7c3aed_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />
          <div className="relative z-10 flex items-center gap-3 px-4 py-2 rounded-xl bg-[#fffefb]/90 border border-[#7c3aed]/30 shadow-xs backdrop-blur-xs">
            <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/15 text-[#7c3aed] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#7c3aed] uppercase">
                3D UNETR &bull; BraTS MRI
              </span>
              <p className="text-xs font-mono text-[#2b241e] font-semibold mt-0.5">
                Masked Self-Distillation
              </p>
            </div>
          </div>
        </div>
      );

    case 'netsentinel':
      return (
        <div className="relative w-full h-32 rounded-xl bg-gradient-to-br from-[#bc473b]/10 via-[#fbf8f3] to-[#d9cdbd]/30 border border-[#d9cdbd] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#bc473b_1px,transparent_1px)] [background-size:12px_12px] opacity-25" />
          <div className="relative z-10 flex items-center gap-3 px-4 py-2 rounded-xl bg-[#fffefb]/90 border border-[#bc473b]/30 shadow-xs backdrop-blur-xs">
            <div className="w-10 h-10 rounded-lg bg-[#bc473b]/15 text-[#bc473b] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#bc473b] uppercase">
                PCAP Anomaly Engine
              </span>
              <p className="text-xs font-mono text-[#2b241e] font-semibold mt-0.5">
                Isolation Forest ML
              </p>
            </div>
          </div>
        </div>
      );

    case 'omniqr':
      return (
        <div className="relative w-full h-32 rounded-xl bg-gradient-to-br from-[#750923]/10 via-[#fbf8f3] to-[#d9cdbd]/30 border border-[#d9cdbd] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#750923_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />
          <div className="relative z-10 flex items-center gap-3 px-4 py-2 rounded-xl bg-[#fffefb]/90 border border-[#750923]/30 shadow-xs backdrop-blur-xs">
            <div className="w-10 h-10 rounded-lg bg-[#750923]/15 text-[#750923] flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#750923] uppercase">
                Burgundy Elegance
              </span>
              <p className="text-xs font-mono text-[#2b241e] font-semibold mt-0.5">
                Multi-Format Matrix Generator
              </p>
            </div>
          </div>
        </div>
      );

    case 'apex':
      return (
        <div className="relative w-full h-32 rounded-xl bg-gradient-to-br from-[#704a29]/10 via-[#fbf8f3] to-[#d9cdbd]/30 border border-[#d9cdbd] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#704a29_1px,transparent_1px)] [background-size:12px_12px] opacity-25" />
          <div className="relative z-10 flex items-center gap-3 px-4 py-2 rounded-xl bg-[#fffefb]/90 border border-[#704a29]/30 shadow-xs backdrop-blur-xs">
            <div className="w-10 h-10 rounded-lg bg-[#704a29]/15 text-[#704a29] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#704a29] uppercase">
                Speed &bull; Combo Streak
              </span>
              <p className="text-xs font-mono text-[#2b241e] font-semibold mt-0.5">
                Aptitude Challenge Platform
              </p>
            </div>
          </div>
        </div>
      );

    case 'nfc':
      return (
        <div className="relative w-full h-32 rounded-xl bg-gradient-to-br from-[#a67c52]/10 via-[#fbf8f3] to-[#d9cdbd]/30 border border-[#d9cdbd] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#a67c52_1px,transparent_1px)] [background-size:12px_12px] opacity-25" />
          <div className="relative z-10 flex items-center gap-3 px-4 py-2 rounded-xl bg-[#fffefb]/90 border border-[#a67c52]/30 shadow-xs backdrop-blur-xs">
            <div className="w-10 h-10 rounded-lg bg-[#a67c52]/15 text-[#a67c52] flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#a67c52] uppercase">
                13.56 MHz Touchpoint
              </span>
              <p className="text-xs font-mono text-[#2b241e] font-semibold mt-0.5">
                Smart NFC Cloud Gateway
              </p>
            </div>
          </div>
        </div>
      );

    case 'trails':
    default:
      return (
        <div className="relative w-full h-32 rounded-xl bg-gradient-to-br from-[#10B981]/10 via-[#fbf8f3] to-[#d9cdbd]/30 border border-[#d9cdbd] overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />
          <div className="relative z-10 flex items-center gap-3 px-4 py-2 rounded-xl bg-[#fffefb]/90 border border-[#10B981]/30 shadow-xs backdrop-blur-xs">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#10B981] uppercase">
                Hackathon 2025
              </span>
              <p className="text-xs font-mono text-[#2b241e] font-semibold mt-0.5">
                Travel Booking &bull; Itineraries
              </p>
            </div>
          </div>
        </div>
      );
  }
}

export function ProjectCard({ project }: { project: Project }) {
  const { isEditMode, updateProject, deleteProject } = useSiteContent();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col justify-between h-full w-full rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-[#a67c52]/60 transition-all duration-300 relative overflow-hidden"
    >
      {/* Edit mode delete action */}
      {isEditMode && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`Delete project "${project.title}"?`)) {
              deleteProject(project.id);
            }
          }}
          className="absolute top-3 right-3 z-30 p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition shadow-2xs cursor-pointer"
          title="Delete project"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}

      <div>
        {/* Visual Domain Banner */}
        <div className="mb-4">
          <ProjectVisualBanner type={project.visualType} badgeColor={project.badgeColor} />
        </div>

        {/* Category Badge */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fbf8f3] border border-[#d9cdbd] px-2.5 py-0.5 text-[11px] font-medium text-[#2b241e]">
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: project.badgeColor }}
          />
          <span>{project.category}</span>
        </div>

        {/* Project Title */}
        <h3 className="text-lg sm:text-xl font-bold font-serif text-[#2b241e] mb-2 tracking-tight group-hover:text-[#704a29] transition-colors">
          <InlineEditPopover
            value={project.title}
            label="Project Title"
            onSave={(title) => updateProject(project.id, { title })}
          >
            {project.title}
          </InlineEditPopover>
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#73685c] leading-relaxed mb-4">
          <InlineEditPopover
            value={project.description}
            label="Project Description"
            type="textarea"
            onSave={(desc) => updateProject(project.id, { description: desc })}
          >
            {project.description}
          </InlineEditPopover>
        </p>

        {/* Technology Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-[#fbf8f3] text-[#52493e] border border-[#d9cdbd]/80"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer: GitHub and Live Demo */}
      <div className="pt-3 border-t border-[#f0eae1] flex items-center justify-between gap-2 text-xs">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#fbf8f3] hover:bg-[#f0eae1] text-[#2b241e] border border-[#d9cdbd] font-semibold transition active:scale-95"
            aria-label={`View ${project.title} source code on GitHub`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>Source</span>
          </a>
        ) : (
          <span className="text-[11px] text-[#9c9184] font-mono">Internal</span>
        )}

        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#704a29] hover:bg-[#593a1f] text-[#fffefb] font-semibold shadow-2xs transition active:scale-95"
            aria-label={`Open live demo for ${project.title}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span>Live Demo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="text-[11px] text-[#9c9184] font-mono italic">
            Codebase / Model
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default ProjectCard;
