import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Palette,
  Briefcase,
  Share2,
  Sliders,
  Layers,
} from 'lucide-react';
import { useOwnerEditor, DashboardTab } from '../../../context/OwnerEditorContext';

interface OverviewModuleProps {
  onNavigateTab: (tab: DashboardTab) => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({ onNavigateTab }) => {
  const {
    draftContent,
    publishedContent,
    isDirty,
    profileCompletionPercentage,
    publishLive,
    isPublishing,
    showToast,
  } = useOwnerEditor();

  const [copied, setCopied] = React.useState(false);

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/`
    : 'https://rahulnagv-24cs051.web.app/';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      showToast('Public portfolio URL copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy URL.', 'error');
    }
  };

  const formattedPublishedDate = publishedContent.publishedAt
    ? new Date(publishedContent.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Default Edition';

  return (
    <div className="space-y-8 max-w-5xl font-serif">
      {/* Top Welcome / Status Hero */}
      <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle warm paper watermark */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#f5eee6]/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#f0eae1] border border-[#d9cdbd] text-[10px] uppercase tracking-widest text-[#704a29] font-bold">
                Ananta Sparsha Architecture
              </span>
              {isDirty ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fef9c3] border border-[#fde047] text-[10px] text-[#854d0e] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-pulse" />
                  Draft Changes Staged
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f2f8f2] border border-[#86efac] text-[10px] text-[#166534] font-semibold">
                  <CheckCircle2 className="w-3 h-3 text-[#16a34a]" />
                  Live Synced
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#2b241e] tracking-tight">
              Welcome back, {draftContent.student.fullName || 'Rahul'}
            </h1>
            <p className="text-xs sm:text-sm text-[#73685c] max-w-xl leading-relaxed">
              Manage your contactless smart identity card, professional portfolio, theme aesthetics, and dynamic NFC routing from this private dashboard.
            </p>
          </div>

          {/* Quick Publish / Preview Action */}
          <div className="flex flex-wrap items-center gap-3">
            {isDirty && (
              <button
                onClick={() => publishLive()}
                disabled={isPublishing}
                className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#704a29] hover:bg-[#593a1f] shadow-xs active:scale-95 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{isPublishing ? 'Publishing...' : 'Publish Draft to Live NFC'}</span>
              </button>
            )}

            <button
              onClick={() => onNavigateTab('security')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#2b241e] bg-[#f0eae1] hover:bg-[#e5ded5] border border-[#d9cdbd] transition flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#704a29]" />
              <span>Security & Access</span>
            </button>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="mt-8 pt-6 border-t border-[#d9cdbd] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#73685c] font-bold">Profile Edition</p>
            <p className="text-sm font-bold text-[#2b241e] mt-1">v{publishedContent.version || 1}.0 Production</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#73685c] font-bold">Last Published</p>
            <p className="text-sm font-semibold text-[#704a29] mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {formattedPublishedDate}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#73685c] font-bold">Active Theme</p>
            <p className="text-sm font-bold text-[#2b241e] mt-1">{draftContent.theme.preset || 'Classic Academic'}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#73685c] font-bold">NFC Hardware</p>
            <p className="text-sm font-semibold text-[#16a34a] mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
              Permanent & Active
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Profile Completion & Permanent URL Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Completion Card */}
        <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-[#73685c] font-bold">Profile Completion</span>
              <span className="text-xs font-bold text-[#704a29]">{profileCompletionPercentage}%</span>
            </div>

            <div className="w-full h-2 rounded-full bg-[#f0eae1] overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profileCompletionPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-[#704a29] rounded-full"
              />
            </div>

            <p className="text-xs text-[#73685c] leading-relaxed">
              {profileCompletionPercentage === 100
                ? 'Your smart identity card and professional portfolio are fully populated and presentation-ready.'
                : 'Complete all professional details, projects, and contact channels for an optimal NFC tap impression.'}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#d9cdbd] flex items-center justify-between text-xs">
            <span className="text-[#73685c]">Projects: <b className="text-[#2b241e]">{draftContent.projects?.length || 0}</b></span>
            <span className="text-[#73685c]">Skills: <b className="text-[#2b241e]">{draftContent.skills?.length || 0}</b></span>
            <span className="text-[#73685c]">Socials: <b className="text-[#2b241e]">{draftContent.socialChannels?.filter(c => c.visible).length || 0}</b></span>
          </div>
        </div>

        {/* Permanent Public NFC URL Card */}
        <div className="lg:col-span-2 rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider text-[#73685c] font-bold">
                Permanent Smart NFC & QR Destination
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#f2f8f2] border border-[#86efac] text-[10px] text-[#166534] font-semibold">
                NFC Immutable
              </span>
            </div>

            <p className="text-xs text-[#73685c] mb-4 leading-relaxed">
              This permanent URL is encoded on your physical Ananta Sparsha PVC card. All updates published in this dashboard update what visitors see without changing or reprogramming your physical card.
            </p>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd]">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="w-full bg-transparent text-xs text-[#704a29] font-semibold focus:outline-none select-all px-2"
              />
              <button
                onClick={handleCopyUrl}
                className="px-3 py-1.5 rounded-lg bg-[#fffefb] hover:bg-[#f0eae1] border border-[#d9cdbd] text-xs text-[#2b241e] flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-2xs"
                title="Copy URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#16a34a]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-[#fffefb] hover:bg-[#f0eae1] border border-[#d9cdbd] text-[#2b241e] transition shrink-0 shadow-2xs"
                title="Open Public Site in New Tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#d9cdbd] flex items-center justify-between">
            <span className="text-xs text-[#73685c] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#704a29]" />
              Public visitors cannot view dashboard or editing controls.
            </span>
            <button
              onClick={() => onNavigateTab('security')}
              className="text-xs text-[#704a29] hover:underline flex items-center gap-1 transition cursor-pointer font-bold"
            >
              <span>Security Settings</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div>
        <h2 className="text-xs uppercase tracking-wider text-[#73685c] font-bold mb-4">
          Identity Management Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              tab: 'basic-info' as DashboardTab,
              title: 'Basic Information',
              desc: 'Name, headline, biography, location, and visibility settings.',
              icon: Sliders,
              tag: `${draftContent.student.fullName || 'Profile'}`,
            },
            {
              tab: 'appearance' as DashboardTab,
              title: 'Appearance & Themes',
              desc: 'Curated color palettes, serif/sans fonts, borders, and cover styling.',
              icon: Palette,
              tag: draftContent.theme.preset,
            },
            {
              tab: 'professional' as DashboardTab,
              title: 'Professional & Projects',
              desc: 'Projects portfolio, academic records, SGPA, and technical skills.',
              icon: Briefcase,
              tag: `${draftContent.projects?.length || 0} Projects`,
            },
            {
              tab: 'social' as DashboardTab,
              title: 'Social & Connect Links',
              desc: 'LinkedIn, GitHub, WhatsApp, Instagram, and custom outbound links.',
              icon: Share2,
              tag: `${draftContent.socialChannels?.filter(c => c.visible).length || 0} Active`,
            },
            {
              tab: 'sections' as DashboardTab,
              title: 'Profile Sections',
              desc: 'Enable/disable sections, reorder presentation flow, add custom sections.',
              icon: Layers,
              tag: `${draftContent.sections?.filter(s => s.visible).length || 0} Enabled`,
            },
            {
              tab: 'security' as DashboardTab,
              title: 'Security & Access',
              desc: 'Passcode management, active sessions, and access control audit logs.',
              icon: ShieldCheck,
              tag: 'Protected',
            },
          ].map((item) => (
            <motion.div
              key={item.tab}
              whileHover={{ y: -2 }}
              onClick={() => onNavigateTab(item.tab)}
              className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] hover:border-[#704a29] p-5 cursor-pointer transition duration-200 group flex flex-col justify-between shadow-2xs hover:shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#f0eae1] border border-[#d9cdbd] flex items-center justify-center text-[#704a29] group-hover:bg-[#704a29] group-hover:text-white transition">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0eae1] border border-[#d9cdbd] text-[#73685c] font-semibold">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#2b241e] group-hover:text-[#704a29] transition">
                  {item.title}
                </h3>
                <p className="text-xs text-[#73685c] mt-1 line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#d9cdbd] flex items-center justify-between text-xs text-[#73685c] group-hover:text-[#704a29] transition">
                <span className="font-semibold text-[11px]">Edit Settings</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewModule;
