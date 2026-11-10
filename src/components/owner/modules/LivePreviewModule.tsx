import React from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  ExternalLink,
  RotateCw,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useOwnerEditor } from '../../../context/OwnerEditorContext';
import { PublicPortfolioView } from '../../public/PublicPortfolioView';

export const LivePreviewModule: React.FC = () => {
  const {
    draftContent,
    previewDevice,
    setPreviewDevice,
    isDirty,
    publishLive,
    isPublishing,
  } = useOwnerEditor();

  return (
    <div className="space-y-6 max-w-6xl font-serif">
      {/* Top Preview Controls Bar */}
      <div className="p-4 rounded-2xl bg-[#fffefb] border border-[#d9cdbd] flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#2b241e]">Live Profile Simulator</h2>
            {isDirty ? (
              <span className="px-2 py-0.5 rounded-full bg-[#fef9c3] border border-[#fde047] text-[10px] text-[#854d0e] font-semibold">
                Draft State Active
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-[#f2f8f2] border border-[#86efac] text-[10px] text-[#166534] font-semibold">
                Live Synced
              </span>
            )}
          </div>
          <p className="text-xs text-[#73685c] mt-0.5">
            Real-time interactive preview of what visitors and NFC tap recipients see.
          </p>
        </div>

        {/* Device Viewport Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f0eae1] border border-[#d9cdbd]">
          <button
            type="button"
            onClick={() => setPreviewDevice('mobile')}
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer ${
              previewDevice === 'mobile'
                ? 'bg-[#704a29] text-white font-bold shadow-xs'
                : 'text-[#73685c] hover:text-[#2b241e]'
            }`}
            title="Mobile iPhone Frame (390px)"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Mobile (390px)</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice('tablet')}
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer ${
              previewDevice === 'tablet'
                ? 'bg-[#704a29] text-white font-bold shadow-xs'
                : 'text-[#73685c] hover:text-[#2b241e]'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden sm:inline">Tablet (768px)</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewDevice('desktop')}
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer ${
              previewDevice === 'desktop'
                ? 'bg-[#704a29] text-white font-bold shadow-xs'
                : 'text-[#73685c] hover:text-[#2b241e]'
            }`}
            title="Full Width Responsive"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
        </div>

        {/* Quick Publish Action */}
        {isDirty && (
          <button
            onClick={() => publishLive()}
            disabled={isPublishing}
            className="px-4 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPublishing ? 'Publishing...' : 'Publish These Changes'}</span>
          </button>
        )}
      </div>

      {/* Preview Viewport Frame */}
      <div className="w-full flex justify-center py-4 overflow-hidden">
        {previewDevice === 'mobile' && (
          <div className="w-[390px] min-h-[780px] max-h-[880px] overflow-y-auto rounded-[42px] border-[10px] border-[#2b241e] bg-background shadow-xl relative scrollbar-none">
            {/* Dynamic Island / Notch */}
            <div className="sticky top-0 z-50 flex justify-center pt-2 pb-1 bg-transparent pointer-events-none">
              <div className="w-24 h-5 bg-[#2b241e] rounded-full" />
            </div>
            <PublicPortfolioView contentOverride={draftContent} isLivePreview={true} />
          </div>
        )}

        {previewDevice === 'tablet' && (
          <div className="w-[768px] min-h-[850px] max-h-[920px] overflow-y-auto rounded-3xl border-8 border-[#2b241e] bg-background shadow-xl relative scrollbar-none">
            <PublicPortfolioView contentOverride={draftContent} isLivePreview={true} />
          </div>
        )}

        {previewDevice === 'desktop' && (
          <div className="w-full min-h-[850px] rounded-2xl border border-[#d9cdbd] bg-background shadow-xl relative overflow-hidden">
            <PublicPortfolioView contentOverride={draftContent} isLivePreview={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreviewModule;
