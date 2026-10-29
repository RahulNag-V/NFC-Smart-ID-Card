import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadMediaFile } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Loader2,
  Trash2,
  Copy,
  AlertCircle,
} from 'lucide-react';

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (url: string) => void;
  title?: string;
  category?: 'profile' | 'projects' | 'id-card' | 'backgrounds';
}

export const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = 'Media Manager & Image Upload',
  category = 'profile',
}) => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleUpload = async (file: File) => {
    setErrorMessage(null);
    try {
      setIsUploading(true);
      const url = await uploadMediaFile(file, category, user?.uid || 'owner');
      setUploadedUrl(url);
      if (onSelectImage) {
        onSelectImage(url);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
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
          className="relative z-10 w-full max-w-md bg-[#fffefb] border border-[#d9cdbd] rounded-2xl shadow-2xl p-6 text-[#2b241e] font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#d9cdbd]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#f0eae1] text-[#704a29] flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-serif text-[#2b241e]">{title}</h3>
                <p className="text-[11px] text-[#73685c]">Supports JPEG, PNG, WebP, SVG up to 5MB</p>
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

          {/* Body */}
          <div className="py-4 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-[#704a29] bg-[#f0eae1]/50 scale-[0.99]'
                  : 'border-[#d9cdbd] hover:border-[#704a29] bg-[#fbf8f3]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-full bg-[#f0eae1] text-[#704a29] flex items-center justify-center shadow-2xs">
                {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
              </div>

              <div>
                <p className="text-xs font-bold text-[#2b241e]">
                  {isUploading ? 'Uploading and optimizing...' : 'Click to browse or drag & drop'}
                </p>
                <p className="text-[11px] text-[#73685c] mt-0.5">
                  Organized safely by owner UID and media type
                </p>
              </div>
            </div>

            {/* Uploaded Preview */}
            {uploadedUrl && (
              <div className="p-3 rounded-xl bg-[#f0eae1]/50 border border-[#d9cdbd] flex items-center gap-3">
                <img
                  src={uploadedUrl}
                  alt="Uploaded preview"
                  className="w-12 h-12 rounded-lg object-cover border border-[#d9cdbd]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#15803d] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Upload Ready</span>
                  </p>
                  <p className="text-[10px] text-[#73685c] truncate font-mono mt-0.5">{uploadedUrl}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1 rounded-lg bg-[#704a29] text-white text-xs font-semibold"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
