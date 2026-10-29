import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useSiteContent, ViewportMode } from '../../context/SiteContentContext';
import {
  Pencil,
  Eye,
  Undo2,
  Redo2,
  Save,
  Send,
  Palette,
  Layers,
  History,
  Download,
  LogOut,
  Monitor,
  Tablet,
  Smartphone,
  Sliders,
  CheckCircle2,
  Loader2,
  Sparkles,
  Lock,
} from 'lucide-react';

interface EditorTopToolbarProps {
  onOpenSidebar: () => void;
  onOpenAppearance: () => void;
  onOpenSections: () => void;
  onOpenHistory: () => void;
  onOpenExport: () => void;
}

export const EditorTopToolbar: React.FC<EditorTopToolbarProps> = ({
  onOpenSidebar,
  onOpenAppearance,
  onOpenSections,
  onOpenHistory,
  onOpenExport,
}) => {
  const { isOwner, openLoginModal, logout, user } = useAuth();
  const {
    isEditMode,
    setIsEditMode,
    viewportMode,
    setViewportMode,
    hasUnsavedChanges,
    lastSaved,
    isSaving,
    isPublishing,
    canUndo,
    canRedo,
    undo,
    redo,
    saveDraft,
    publishChanges,
    discardDraft,
  } = useSiteContent();

  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);

  // If NOT owner, render discreet floating Owner Login button
  if (!isOwner) {
    return (
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openLoginModal}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#fffefb]/90 hover:bg-[#704a29] text-[#704a29] hover:text-[#fffefb] border border-[#d9cdbd] hover:border-[#704a29] shadow-lg backdrop-blur-md text-xs font-semibold transition-all cursor-pointer"
          title="Owner Portal Sign In"
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-xs transition-all duration-300 overflow-hidden whitespace-nowrap">
            Owner Sign In
          </span>
        </motion.button>
      </div>
    );
  }

  const handlePublish = async () => {
    if (window.confirm('Ready to publish live? Changes will become immediately visible to all visitors.')) {
      try {
        await publishChanges();
        setPublishSuccess(true);
        setTimeout(() => setPublishSuccess(false), 4000);
      } catch (err) {
        alert('Failed to publish changes.');
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#fffefb]/95 border-b border-[#d9cdbd] backdrop-blur-md shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Mode Switcher & Status */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-0.5 rounded-xl bg-[#f0eae1] border border-[#d9cdbd]">
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isEditMode
                    ? 'bg-[#704a29] text-white shadow-xs'
                    : 'text-[#73685c] hover:text-[#2b241e]'
                }`}
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !isEditMode
                    ? 'bg-[#704a29] text-white shadow-xs'
                    : 'text-[#73685c] hover:text-[#2b241e]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>

            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#73685c]">
              <span
                className={`w-2 h-2 rounded-full ${
                  hasUnsavedChanges ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                }`}
              />
              <span>
                {hasUnsavedChanges
                  ? 'Unsaved changes'
                  : lastSaved
                  ? `Saved at ${lastSaved}`
                  : 'All changes synced'}
              </span>
            </div>
          </div>

          {/* Center: Viewport Controls & Undo/Redo */}
          <div className="flex items-center gap-2">
            {/* Viewport switchers */}
            <div className="hidden md:flex items-center p-0.5 rounded-lg bg-[#f0eae1] border border-[#d9cdbd]">
              <button
                type="button"
                onClick={() => setViewportMode('desktop')}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  viewportMode === 'desktop' ? 'bg-[#fffefb] text-[#704a29] shadow-2xs' : 'text-[#73685c]'
                }`}
                title="Desktop View (100%)"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('tablet')}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  viewportMode === 'tablet' ? 'bg-[#fffefb] text-[#704a29] shadow-2xs' : 'text-[#73685c]'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                className={`p-1.5 rounded-md transition cursor-pointer ${
                  viewportMode === 'mobile' ? 'bg-[#fffefb] text-[#704a29] shadow-2xs' : 'text-[#73685c]'
                }`}
                title="Mobile View (390px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Undo / Redo */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                className="p-1.5 rounded-lg text-[#52493e] hover:bg-[#f0eae1] disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                className="p-1.5 rounded-lg text-[#52493e] hover:bg-[#f0eae1] disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer disabled:cursor-not-allowed"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Panel Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onOpenSidebar}
                className="px-2.5 py-1.5 rounded-lg bg-[#f0eae1] hover:bg-[#e6dcce] text-xs font-semibold text-[#704a29] flex items-center gap-1.5 transition cursor-pointer"
                title="Google Forms Editor Sidebar"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Editor Sidebar</span>
              </button>

              <button
                type="button"
                onClick={onOpenAppearance}
                className="px-2.5 py-1.5 rounded-lg bg-[#f0eae1] hover:bg-[#e6dcce] text-xs font-semibold text-[#704a29] flex items-center gap-1.5 transition cursor-pointer"
                title="Appearance & Themes"
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Appearance</span>
              </button>

              <button
                type="button"
                onClick={onOpenSections}
                className="px-2.5 py-1.5 rounded-lg bg-[#f0eae1] hover:bg-[#e6dcce] text-xs font-semibold text-[#704a29] flex items-center gap-1.5 transition cursor-pointer"
                title="Section Manager"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Sections</span>
              </button>
            </div>
          </div>

          {/* Right: Actions & Owner Account */}
          <div className="flex items-center gap-1.5">
            {/* Save Draft */}
            <button
              type="button"
              onClick={saveDraft}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-xl bg-[#fffefb] hover:bg-[#f0eae1] border border-[#d9cdbd] text-xs font-semibold text-[#2b241e] flex items-center gap-1.5 transition shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Draft</span>
            </button>

            {/* Publish Live */}
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-3.5 py-1.5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isPublishing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Publish Live</span>
            </button>

            {/* Version History */}
            <button
              type="button"
              onClick={onOpenHistory}
              className="p-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
              title="Version History & Restore"
            >
              <History className="w-4 h-4" />
            </button>

            {/* Backup / Export */}
            <button
              type="button"
              onClick={onOpenExport}
              className="p-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
              title="Backup / JSON Export & Import"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              className="p-1.5 rounded-lg text-[#991b1b] hover:bg-[#fef2f2] transition cursor-pointer ml-1"
              title="Sign Out of Owner Mode"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Publish Toast Notification */}
      <AnimatePresence>
        {publishSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-[99999] px-5 py-2.5 rounded-full bg-[#15803d] text-white text-xs font-semibold shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Successfully Published! The public profile is now live.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
