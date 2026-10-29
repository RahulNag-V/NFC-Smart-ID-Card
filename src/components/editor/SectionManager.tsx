import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '../../context/SiteContentContext';
import { SectionConfig, SectionType } from '../../types/content';
import {
  X,
  Layers,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Copy,
  Pencil,
  Check,
} from 'lucide-react';

interface SectionManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SectionManager: React.FC<SectionManagerProps> = ({ isOpen, onClose }) => {
  const { activeContent, updateSections } = useSiteContent();
  const sections = activeContent.sections || [];

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const [editingDesc, setEditingDesc] = useState<string>('');

  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionType, setNewSectionType] = useState<SectionType>('custom-text-image');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionDesc, setNewSectionDesc] = useState('');

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const copy = [...sections];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    // re-assign orders
    copy.forEach((sec, idx) => {
      sec.order = idx + 1;
    });

    updateSections(copy);
  };

  const toggleVisibility = (id: string) => {
    const copy = sections.map((sec) => (sec.id === id ? { ...sec, visible: !sec.visible } : sec));
    updateSections(copy);
  };

  const handleDelete = (id: string, title: string) => {
    if (sections.length <= 1) {
      alert('Cannot delete all sections. At least one section must remain.');
      return;
    }
    if (window.confirm(`Delete section "${title}"?`)) {
      const copy = sections.filter((s) => s.id !== id);
      copy.forEach((sec, idx) => {
        sec.order = idx + 1;
      });
      updateSections(copy);
    }
  };

  const handleDuplicate = (section: SectionConfig) => {
    const duplicated: SectionConfig = {
      ...section,
      id: `sec-${Date.now()}`,
      title: `${section.title} (Copy)`,
      order: section.order + 1,
    };
    const copy = [...sections, duplicated];
    copy.sort((a, b) => a.order - b.order);
    copy.forEach((s, idx) => {
      s.order = idx + 1;
    });
    updateSections(copy);
  };

  const startEdit = (sec: SectionConfig) => {
    setEditingSectionId(sec.id);
    setEditingTitle(sec.title);
    setEditingDesc(sec.description || '');
  };

  const saveEdit = (id: string) => {
    const copy = sections.map((sec) =>
      sec.id === id ? { ...sec, title: editingTitle, description: editingDesc } : sec
    );
    updateSections(copy);
    setEditingSectionId(null);
  };

  const handleCreateCustomSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    const created: SectionConfig = {
      id: `custom-sec-${Date.now()}`,
      type: newSectionType,
      title: newSectionTitle,
      description: newSectionDesc,
      visible: true,
      order: sections.length + 1,
      customContent: {
        heading: newSectionTitle,
        body: newSectionDesc || 'Custom section details and summary content.',
      },
    };

    updateSections([...sections, created]);
    setIsAddingSection(false);
    setNewSectionTitle('');
    setNewSectionDesc('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[9990] md:hidden backdrop-blur-xs"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-[9995] w-full max-w-md bg-[#fffefb] border-l border-[#d9cdbd] shadow-2xl flex flex-col font-sans text-[#2b241e]"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#d9cdbd] flex items-center justify-between bg-[#fbf8f3]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#f0eae1] text-[#704a29] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold font-serif text-[#2b241e]">Section Manager</h2>
                  <p className="text-[11px] text-[#73685c]">Reorder, toggle visibility, and rename sections</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
                aria-label="Close sections"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-[#73685c] uppercase">Home Page Sections</span>
                <button
                  type="button"
                  onClick={() => setIsAddingSection((prev) => !prev)}
                  className="px-2.5 py-1 rounded-lg bg-[#704a29] text-white text-xs font-semibold flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingSection ? 'Cancel' : 'New Section'}</span>
                </button>
              </div>

              {/* Add New Section Drawer */}
              {isAddingSection && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleCreateCustomSection}
                  className="p-3.5 rounded-xl bg-[#fbf8f3] border-2 border-[#704a29] space-y-2.5 mb-3"
                >
                  <h4 className="text-xs font-bold text-[#704a29]">Add New Section</h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#52493e] mb-1">Section Type</label>
                    <select
                      value={newSectionType}
                      onChange={(e) => setNewSectionType(e.target.value as SectionType)}
                      className="w-full px-2.5 py-1.5 text-xs rounded bg-white border border-[#d9cdbd]"
                    >
                      <option value="custom-text-image">Custom Text &amp; Image Section</option>
                      <option value="disciplines">Core Disciplines Grid</option>
                      <option value="featured-projects">Featured Works Spotlight</option>
                      <option value="call-to-action">Navigation Call-to-Action</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#52493e] mb-1">Section Heading</label>
                    <input
                      type="text"
                      required
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="e.g. Research &amp; Publications"
                      className="w-full px-2.5 py-1.5 text-xs rounded bg-white border border-[#d9cdbd]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#52493e] mb-1">Description / Summary</label>
                    <textarea
                      rows={2}
                      value={newSectionDesc}
                      onChange={(e) => setNewSectionDesc(e.target.value)}
                      placeholder="Brief overview text..."
                      className="w-full px-2.5 py-1.5 text-xs rounded bg-white border border-[#d9cdbd]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 rounded-lg bg-[#704a29] text-white text-xs font-bold"
                  >
                    Insert Section
                  </button>
                </motion.form>
              )}

              {/* Sections List */}
              <div className="space-y-2">
                {sections.map((sec, index) => {
                  const isEditing = editingSectionId === sec.id;

                  return (
                    <div
                      key={sec.id}
                      className={`p-3 rounded-xl border transition-all ${
                        sec.visible
                          ? 'bg-[#fffefb] border-[#d9cdbd]'
                          : 'bg-[#f4efe8] border-dashed border-[#c5b8a5] opacity-75'
                      }`}
                    >
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="w-full px-2 py-1 text-xs rounded border border-[#704a29] bg-white font-bold"
                          />
                          <textarea
                            rows={2}
                            value={editingDesc}
                            onChange={(e) => setEditingDesc(e.target.value)}
                            placeholder="Optional description"
                            className="w-full px-2 py-1 text-xs rounded border border-[#d9cdbd] bg-white"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingSectionId(null)}
                              className="px-2 py-0.5 text-xs text-[#73685c]"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => saveEdit(sec.id)}
                              className="px-2.5 py-0.5 rounded bg-[#704a29] text-white text-xs font-semibold flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Save</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-[#f0eae1] text-[#704a29] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                                {index + 1}
                              </span>
                              <h4 className="text-xs font-bold text-[#2b241e] truncate">{sec.title}</h4>
                            </div>
                            {sec.description && (
                              <p className="text-[10px] text-[#73685c] truncate mt-0.5 pl-7">
                                {sec.description}
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Move Up */}
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => moveSection(index, 'up')}
                              className="p-1 text-[#73685c] hover:text-[#2b241e] disabled:opacity-20 cursor-pointer"
                              title="Move up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>

                            {/* Move Down */}
                            <button
                              type="button"
                              disabled={index === sections.length - 1}
                              onClick={() => moveSection(index, 'down')}
                              className="p-1 text-[#73685c] hover:text-[#2b241e] disabled:opacity-20 cursor-pointer"
                              title="Move down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Title */}
                            <button
                              type="button"
                              onClick={() => startEdit(sec)}
                              className="p-1 text-[#73685c] hover:text-[#704a29] cursor-pointer"
                              title="Rename section"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {/* Duplicate */}
                            <button
                              type="button"
                              onClick={() => handleDuplicate(sec)}
                              className="p-1 text-[#73685c] hover:text-[#704a29] cursor-pointer"
                              title="Duplicate section"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* Visibility Toggle */}
                            <button
                              type="button"
                              onClick={() => toggleVisibility(sec.id)}
                              className={`p-1 transition cursor-pointer ${
                                sec.visible ? 'text-emerald-700' : 'text-stone-400'
                              }`}
                              title={sec.visible ? 'Hide section' : 'Show section'}
                            >
                              {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>

                            {/* Delete (if custom or non-essential) */}
                            {sec.type !== 'id-card' && (
                              <button
                                type="button"
                                onClick={() => handleDelete(sec.id, sec.title)}
                                className="p-1 text-[#9c9184] hover:text-red-600 transition cursor-pointer"
                                title="Delete section"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
