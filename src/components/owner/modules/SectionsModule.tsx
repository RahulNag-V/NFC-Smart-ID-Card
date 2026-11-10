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
                className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${
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
                className="p-1.5 rounded-lg bg-[#f0eae1] hover:bg-[#e5ded5] text-[#2b241e] border border-[#d9cdbd] disabled:opacity-20 cursor-pointer shadow-2xs"
                title="Move Up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => moveSection(idx, 'down')}
                disabled={idx === sections.length - 1}
                className="p-1.5 rounded-lg bg-[#f0eae1] hover:bg-[#e5ded5] text-[#2b241e] border border-[#d9cdbd] disabled:opacity-20 cursor-pointer shadow-2xs"
                title="Move Down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>

              {section.id.startsWith('custom-sec-') && (
                <button
                  type="button"
                  onClick={() => handleDeleteSection(section.id)}
                  className="p-1.5 rounded-lg bg-[#fef2f2] hover:bg-[#fee2e2] text-[#bc473b] border border-[#fca5a5] cursor-pointer shadow-2xs"
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
      {!isAddingCustom ? (
        <button
          type="button"
          onClick={() => setIsAddingCustom(true)}
          className="w-full py-3.5 rounded-2xl bg-[#fffefb] border border-dashed border-[#d9cdbd] hover:border-[#704a29] text-xs font-bold text-[#704a29] hover:bg-[#f0eae1] transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Profile Section</span>
        </button>
      ) : (
        <form
          onSubmit={handleAddCustomSection}
          className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 space-y-4 shadow-md"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#d9cdbd]">
            <h3 className="text-sm font-bold text-[#2b241e]">Create Custom Profile Section</h3>
            <button
              type="button"
              onClick={() => setIsAddingCustom(false)}
              className="text-[#73685c] hover:text-[#2b241e] cursor-pointer"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
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
              className="w-full px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29]"
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
              className="w-full px-3.5 py-2 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingCustom(false)}
              className="px-4 py-2 rounded-xl bg-[#f0eae1] text-xs text-[#73685c] hover:bg-[#e5ded5] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-xs font-bold text-white shadow-xs cursor-pointer"
            >
              Create Section
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SectionsModule;
