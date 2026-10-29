import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Check, X, Upload } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';
import { uploadMediaFile } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';

interface InlineEditPopoverProps {
  value: string | number;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'url' | 'select' | 'image';
  options?: string[];
  placeholder?: string;
  onSave: (val: any) => void;
  children?: React.ReactNode;
  className?: string;
  pencilPosition?: 'inline' | 'top-right' | 'relative';
}

export const InlineEditPopover: React.FC<InlineEditPopoverProps> = ({
  value,
  label,
  type = 'text',
  options = [],
  placeholder = '',
  onSave,
  children,
  className = '',
  pencilPosition = 'inline',
}) => {
  const { isEditMode } = useSiteContent();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [draftValue, setDraftValue] = useState<string | number>(value);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setDraftValue(value);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, value]);

  if (!isEditMode) {
    return <>{children || value}</>;
  }

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draftValue);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setDraftValue(value);
    setIsOpen(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadMediaFile(file, 'profile', user?.uid || 'owner');
      setDraftValue(url);
      onSave(url);
      setIsOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative group/inline inline-flex items-center gap-1.5 ${className}`}>
      {children || <span>{value}</span>}

      {/* Unobtrusive Pencil Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setDraftValue(value);
          setIsOpen(true);
        }}
        className={`p-1 rounded-md bg-[#f0eae1] hover:bg-[#704a29] text-[#704a29] hover:text-[#fffefb] border border-[#d9cdbd] shadow-2xs transition-all cursor-pointer select-none opacity-80 group-hover/inline:opacity-100 scale-90 hover:scale-100 ${
          pencilPosition === 'top-right' ? 'absolute top-1 right-1 z-30' : ''
        }`}
        title={`Edit ${label}`}
        aria-label={`Edit ${label}`}
      >
        <Pencil className="w-3 h-3" />
      </button>

      {/* Editing Popover Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="absolute z-[9999] top-full left-0 mt-1.5 w-80 max-w-[calc(100vw-2rem)] p-3.5 bg-[#fffefb] border border-[#d9cdbd] rounded-xl shadow-2xl text-[#2b241e] font-sans"
          >
            <form onSubmit={handleCommit} className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#f0eae1] pb-1.5">
                <span className="text-[11px] font-bold font-serif uppercase tracking-wider text-[#73685c]">
                  Edit {label}
                </span>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="p-1 rounded-md text-[#9c9184] hover:text-[#2b241e] hover:bg-[#f0eae1]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {type === 'textarea' ? (
                <textarea
                  rows={4}
                  value={draftValue as string}
                  onChange={(e) => setDraftValue(e.target.value)}
                  placeholder={placeholder}
                  autoFocus
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                />
              ) : type === 'select' ? (
                <select
                  value={draftValue as string}
                  onChange={(e) => setDraftValue(e.target.value)}
                  autoFocus
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                >
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : type === 'image' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={draftValue as string}
                      onChange={(e) => setDraftValue(e.target.value)}
                      placeholder="Image URL or upload below"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e]"
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-1.5 px-3 rounded-lg bg-[#f0eae1] hover:bg-[#e6dcce] text-xs font-semibold text-[#704a29] border border-[#d9cdbd] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Uploading Image...' : 'Upload Image from Device'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <input
                  type={type === 'number' ? 'number' : type === 'url' ? 'url' : 'text'}
                  value={draftValue}
                  onChange={(e) => setDraftValue(type === 'number' ? Number(e.target.value) : e.target.value)}
                  placeholder={placeholder}
                  autoFocus
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                />
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-2.5 py-1 rounded-md text-[11px] text-[#73685c] hover:bg-[#f0eae1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-md bg-[#704a29] hover:bg-[#593a1f] text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>Apply</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
