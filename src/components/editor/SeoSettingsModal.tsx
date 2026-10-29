import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '../../context/SiteContentContext';
import { Search, X, Check, Globe, AlertCircle } from 'lucide-react';

interface SeoSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SeoSettingsModal: React.FC<SeoSettingsModalProps> = ({ isOpen, onClose }) => {
  const { activeContent, updateSeo } = useSiteContent();
  const seo = activeContent.seo;

  const [title, setTitle] = useState(seo.title);
  const [description, setDescription] = useState(seo.description);
  const [keywords, setKeywords] = useState(seo.keywords);
  const [canonicalUrl, setCanonicalUrl] = useState(seo.canonicalUrl);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSeo({
      title,
      description,
      keywords,
      canonicalUrl,
    });
    // Update document title immediately
    if (typeof document !== 'undefined') {
      document.title = title;
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1a1410]/70 backdrop-blur-sm cursor-pointer"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-lg bg-[#fffefb] border border-[#d9cdbd] rounded-2xl shadow-2xl p-6 text-[#2b241e] font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#d9cdbd]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#f0eae1] text-[#704a29] flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-serif text-[#2b241e]">SEO &amp; Metadata Settings</h3>
                <p className="text-[11px] text-[#73685c]">Page titles, descriptions, and search indexing</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="py-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#52493e] mb-1">Page Title Tag</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#52493e] mb-1">Meta Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#52493e] mb-1">Meta Keywords</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#52493e] mb-1">Canonical URL</label>
              <input
                type="url"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e]"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#f0eae1]/60 border border-[#d9cdbd] text-[11px] text-[#73685c] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Note: In client-rendered Single Page Applications (SPAs), dynamic DOM metadata updates browser title and metadata dynamically. For server-rendered crawlers (like WhatsApp or Twitter bot scrapers), the initial static HTML in <code className="font-mono bg-[#ede1cc] px-1 py-0.5 rounded">index.html</code> serves the primary baseline metadata.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs text-[#73685c] hover:bg-[#f0eae1] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#704a29] hover:bg-[#5a3a1f] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                {saved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{saved ? 'Updated SEO' : 'Save SEO Changes'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
