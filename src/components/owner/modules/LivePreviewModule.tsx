import React from 'react';
import {
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { useOwnerEditor } from '../../../context/OwnerEditorContext';
import { PublicPortfolioView } from '../../public/PublicPortfolioView';
import { SmartphoneFrame } from '../SmartphoneFrame';

export const LivePreviewModule: React.FC = () => {
  const {
    draftContent,
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
            Real-time interactive preview of what visitors and NFC tap recipients see on their mobile phones.
          </p>
        </div>

        {/* Locked Mobile Mockup Badge (NFC Scan Focus) */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#f0eae1] border border-[#d9cdbd] text-xs font-sans text-[#704a29]">
          <Smartphone className="w-4 h-4 text-[#704a29]" />
          <span className="font-semibold">Mobile Smartphone Preview (NFC Tap View)</span>
        </div>

        {/* Quick Publish Action */}
        {isDirty && (
          <button
            onClick={() => publishLive()}
            disabled={isPublishing}
            className="px-4 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 min-h-[44px] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isPublishing ? 'Publishing...' : 'Publish These Changes'}</span>
          </button>
        )}
      </div>

      {/* Preview Viewport Frame - Exclusively Locked to Realistic Smartphone Mockup */}
      <div className="w-full flex justify-center py-4 overflow-hidden">
        <SmartphoneFrame frameHeightClass="h-[780px] sm:h-[820px]">
          <PublicPortfolioView contentOverride={draftContent} isLivePreview={true} />
        </SmartphoneFrame>
      </div>
    </div>
  );
};

export default LivePreviewModule;
