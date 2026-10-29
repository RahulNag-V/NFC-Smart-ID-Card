import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteContent } from '../../context/SiteContentContext';
import { VersionSnapshot } from '../../types/content';
import { History, X, RotateCcw, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { versions, restoreVersion, publishedContent } = useSiteContent();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#1a1410]/70 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-lg bg-[#fffefb] border border-[#d9cdbd] rounded-2xl shadow-2xl p-6 text-[#2b241e] font-sans max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#d9cdbd]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#f0eae1] text-[#704a29] flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-serif text-[#2b241e]">Published Version History</h3>
                <p className="text-[11px] text-[#73685c]">
                  Active published version: v{publishedContent.version || 1}
                </p>
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

          {/* List */}
          <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
            {versions.length === 0 ? (
              <div className="p-8 text-center text-[#73685c] space-y-2">
                <Clock className="w-8 h-8 mx-auto text-[#a67c52]" />
                <p className="text-xs font-semibold text-[#2b241e]">No historical snapshots yet</p>
                <p className="text-[11px]">
                  When you click &apos;Publish Live&apos;, a versioned snapshot of your profile and theme will be archived here.
                </p>
              </div>
            ) : (
              versions.map((ver) => {
                const isCurrent = ver.version === publishedContent.version;
                const formattedDate = new Date(ver.timestamp).toLocaleString();

                return (
                  <div
                    key={ver.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-[#fbf5ee] border-[#704a29] ring-1 ring-[#704a29]/30'
                        : 'bg-[#fffefb] border-[#d9cdbd] hover:border-[#a67c52]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-[#704a29] text-white text-[10px] font-mono font-bold">
                            v{ver.version}
                          </span>
                          <span className="text-xs font-bold text-[#2b241e]">{ver.description}</span>
                          {isCurrent && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Current</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#73685c] mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formattedDate}</span>
                        </p>
                        <p className="text-[10px] text-[#9c9184] mt-0.5">
                          {ver.data.projects.length} Projects &bull; Theme: {ver.data.theme.preset}
                        </p>
                      </div>

                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => {
                            restoreVersion(ver);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#fffefb] hover:bg-[#704a29] text-[#704a29] hover:text-white border border-[#d9cdbd] hover:border-[#704a29] text-xs font-semibold flex items-center gap-1 transition shadow-2xs active:scale-95 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-3 border-t border-[#d9cdbd] text-right">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#f0eae1] text-xs font-semibold text-[#52493e] hover:bg-[#e6dcce] cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
