import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useOwnerEditor } from '../../../context/OwnerEditorContext';
import { SectionConfig, SectionType } from '../../../types/content';

export const SectionsModule: React.FC = () => {
  const { draftContent, updateSections, showToast } = useOwnerEditor();
  const sections = draftContent.sections || [];

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customHeading, setCustomHeading] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [customBadge, setCustomBadge] = useState('');

  const toggleSection = (id: string) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    updateSections(updated);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= sections.length) return;
    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    const normalized = updated.map((s, idx) => ({ ...s, order: idx + 1 }));
    updateSections(normalized);
  };

  const handleAddCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHeading.trim()) return;

    const newSec: SectionConfig = {
      id: `custom-sec-${Date.now()}`,
      type: 'custom-text-image',
      title: customHeading.trim(),
      subtitle: customBadge.trim() || undefined,
      description: customBody.trim(),
      visible: true,
      order: sections.length + 1,
      customContent: {
        heading: customHeading.trim(),
        body: customBody.trim(),
        badgeText: customBadge.trim(),
      },
    };

    updateSections([...sections, newSec]);
    setCustomHeading('');
    setCustomBody('');
    setCustomBadge('');
    setIsAddingCustom(false);
    showToast('Custom section added.', 'success');
  };

  const handleDeleteSection = (id: string) => {
    updateSections(sections.filter((s) => s.id !== id));
    showToast('Section removed.', 'info');
  };

  return (
    <div className="space-y-8 max-w-4xl font-serif">
      {/* Module Title */}
      <div>
        <h2 className="text-xl font-bold text-[#2b241e] tracking-tight">
          Profile Presentation Sections
        </h2>
        <p className="text-xs text-[#73685c] mt-1">
          Organize the visual hierarchy of your public profile. Enable, disable, reorder sections, or inject custom rich text cards.
        </p>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className={`p-4 rounded-2xl border transition duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs ${
              section.visible
                ? 'bg-[#fffefb] border-[#d9cdbd] hover:border-[#704a29]'
                : 'bg-[#fbf8f3] border-[#d9cdbd]/60 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-[#f0eae1] border border-[#d9cdbd] flex items-center justify-center text-xs font-bold text-[#704a29]">
                {idx + 1}
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#2b241e]">{section.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f0eae1] border border-[#d9cdbd] text-[#73685c]">
                    {section.type}
                  </span>
                </div>
                {section.description && (
                  <p className="text-xs text-[#73685c] line-clamp-1 mt-0.5">{section.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900/30 ${
                  section.visible
                    ? 'bg-[#f2f8f2] border-[#86efac] text-[#166534] font-bold'
                    : 'bg-[#f0eae1] border-[#d9cdbd] text-[#73685c]'
                }`}
              >
                {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{section.visible ? 'Visible' : 'Hidden'}</span>
              </button>

              <button
                type="button"
                onClick={() => moveSection(idx, 'up')}
                disabled={idx === 0}
                className="w-11 h-11 min-h-[44px] rounded-xl bg-[#f0eae1] hover:bg-[#e5ded5] text-[#2b241e] border border-[#d9cdbd] disabled:opacity-20 cursor-pointer shadow-2xs flex items-center justify-center transition-all duration-200 active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900/30"
                title="Move Up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => moveSection(idx, 'down')}
                disabled={idx === sections.length - 1}
                className="w-11 h-11 min-h-[44px] rounded-xl bg-[#f0eae1] hover:bg-[#e5ded5] text-[#2b241e] border border-[#d9cdbd] disabled:opacity-20 cursor-pointer shadow-2xs flex items-center justify-center transition-all duration-200 active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900/30"
                title="Move Down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              {section.id.startsWith('custom-sec-') && (
                <button
                  type="button"
                  onClick={() => handleDeleteSection(section.id)}
                  className="w-11 h-11 min-h-[44px] rounded-xl bg-[#fef2f2] hover:bg-[#fee2e2] text-[#bc473b] border border-[#fca5a5] cursor-pointer shadow-2xs flex items-center justify-center transition-all duration-200 active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900/30"
                  title="Delete Custom Section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Section Trigger / Form */}
      <AnimatePresence mode="wait">
        {!isAddingCustom ? (
          <motion.button
            key="add-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            type="button"
            onClick={() => setIsAddingCustom(true)}
            className="w-full min-h-[44px] py-3.5 rounded-2xl bg-[#fffefb] border border-dashed border-[#d9cdbd] hover:border-[#704a29] text-xs font-bold text-[#704a29] hover:bg-[#f0eae1] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Profile Section</span>
          </motion.button>
        ) : (
          <motion.form
            key="custom-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onSubmit={handleAddCustomSection}
            className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-5 sm:p-6 space-y-4 shadow-md"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#d9cdbd]">
              <h3 className="text-sm font-bold text-[#2b241e]">Create Custom Profile Section</h3>
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                Section Heading
              </label>
              <input
                type="text"
                value={customHeading}
                onChange={(e) => setCustomHeading(e.target.value)}
                placeholder="e.g. Research Publications or Leadership & Volunteering"
                required
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-base md:text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29] focus-visible:ring-2 focus-visible:ring-amber-900/30 transition-colors duration-200 scroll-mt-24"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                Badge / Subtitle (Optional)
              </label>
              <input
                type="text"
                value={customBadge}
                onChange={(e) => setCustomBadge(e.target.value)}
                placeholder="e.g. IEEE / ACM / Campus Ambassador"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-base md:text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29] focus-visible:ring-2 focus-visible:ring-amber-900/30 transition-colors duration-200 scroll-mt-24"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-1.5">
                Section Body Content
              </label>
              <textarea
                rows={3}
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                placeholder="Detailed description or content..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-base md:text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29] focus-visible:ring-2 focus-visible:ring-amber-900/30 transition-colors duration-200 resize-none scroll-mt-24"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingCustom(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#f0eae1] text-xs text-[#73685c] hover:bg-[#e5ded5] transition cursor-pointer active:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-xs font-bold text-white shadow-xs transition cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-amber-900/30"
              >
                Create Section
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SectionsModule;
