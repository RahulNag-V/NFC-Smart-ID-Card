import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Mail,
  Phone,
  Globe,
  Upload,
  Camera,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  Check,
  AlertCircle,
  FileText,
  Droplets,
  Calendar,
  Home,
  GraduationCap,
  RotateCcw,
} from 'lucide-react';
import { useOwnerEditor } from '../../../context/OwnerEditorContext';
import { defaultStudentData } from '../../../data/student';
import { defaultVisibility } from '../../../data/initialContent';

// Image validation and fast client-side canvas compression utility
export const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function validateAndCompressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<File> {
  // 1. File Type Validation
  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type. Please upload a PNG, JPG, or WebP image.');
  }

  // 2. File Size Validation (Max 5MB)
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    throw new Error('File size exceeds the 5MB limit. Please choose a smaller image.');
  }

  // 3. Fast Client-side Resize & Compression (1200px max, 0.8 quality WebP/JPEG)
  const { maxWidth = 1200, maxHeight = 1000, quality = 0.8 } = options;

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return file;
  }

  if (file.type === 'image/svg+xml') {
    return file;
  }

  let sourceWidth = 0;
  let sourceHeight = 0;
  let bitmap: ImageBitmap | null = null;
  let fallbackImg: HTMLImageElement | null = null;

  // Use createImageBitmap off the main thread to avoid UI lag
  try {
    if (typeof createImageBitmap === 'function') {
      bitmap = await createImageBitmap(file);
      sourceWidth = bitmap.width;
      sourceHeight = bitmap.height;
    } else {
      throw new Error('createImageBitmap not supported');
    }
  } catch {
    const objectUrl = URL.createObjectURL(file);
    try {
      fallbackImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = objectUrl;
      });
      sourceWidth = fallbackImg.width;
      sourceHeight = fallbackImg.height;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  // If already compact and within bounds, avoid re-encoding
  if (sourceWidth <= maxWidth && sourceHeight <= maxHeight && file.size < 250 * 1024) {
    if (bitmap) bitmap.close();
    return file;
  }

  // Calculate proportional dimensions
  let targetWidth = sourceWidth;
  let targetHeight = sourceHeight;

  if (targetWidth > maxWidth) {
    targetHeight = Math.round((targetHeight * maxWidth) / targetWidth);
    targetWidth = maxWidth;
  }
  if (targetHeight > maxHeight) {
    targetWidth = Math.round((targetWidth * maxHeight) / targetHeight);
    targetHeight = maxHeight;
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    if (bitmap) bitmap.close();
    return file;
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  if (bitmap) {
    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    bitmap.close();
  } else if (fallbackImg) {
    ctx.drawImage(fallbackImg, 0, 0, targetWidth, targetHeight);
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return resolve(file);
        }
        const ext = blob.type === 'image/webp' ? '.webp' : '.jpg';
        const baseName = file.name.replace(/\.[^/.]+$/, '');
        const compressedFile = new File([blob], `${baseName}${ext}`, {
          type: blob.type || 'image/webp',
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      },
      'image/webp',
      quality
    );
  });
}

export const BasicInfoModule: React.FC = () => {
  const {
    draftContent,
    updateBasicInfo,
    updateVisibility,
    updateAcademic,
    uploadMedia,
    showToast,
  } = useOwnerEditor();

  const student = draftContent?.student || defaultStudentData;
  const visibility = draftContent?.visibility || defaultVisibility;
  const academic = draftContent?.academic || { engineering: [], schooling: [], certifications: [], achievements: [] };

  const handleUpdateSemesterSgpa = (semNumber: number, newSgpa: number) => {
    const updatedEngineering = (academic.engineering || []).map((year) => {
      if (!year.semesters) return year;
      let hasSem = false;
      const updatedSems = year.semesters.map((sem) => {
        if (sem.semesterNumber === semNumber) {
          hasSem = true;
          return { ...sem, sgpa: newSgpa };
        }
        return sem;
      });
      if (hasSem) {
        const validSems = updatedSems.filter((s) => typeof s.sgpa === 'number');
        const avg =
          validSems.length > 0
            ? Number((validSems.reduce((a, b) => a + b.sgpa, 0) / validSems.length).toFixed(2))
            : year.yearlyAverageSgpa;
        return { ...year, semesters: updatedSems, yearlyAverageSgpa: avg };
      }
      return year;
    });

    updateAcademic({
      ...academic,
      engineering: updatedEngineering,
    });
  };

  const allCompletedSemesters = (academic.engineering || [])
    .flatMap((y) => y.semesters || [])
    .filter((s) => typeof s.sgpa === 'number');

  const calculatedCgpa =
    allCompletedSemesters.length > 0
      ? (allCompletedSemesters.reduce((acc, s) => acc + s.sgpa, 0) / allCompletedSemesters.length).toFixed(2)
      : '7.62';

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [optimisticCoverUrl, setOptimisticCoverUrl] = useState<string | null>(null);
  const [optimisticPhotoUrl, setOptimisticPhotoUrl] = useState<string | null>(null);
  const [failedCoverFile, setFailedCoverFile] = useState<File | null>(null);

  const activeCoverObjectUrlRef = useRef<string | null>(null);
  const activePhotoObjectUrlRef = useRef<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs on component unmount
  useEffect(() => {
    return () => {
      if (activeCoverObjectUrlRef.current) {
        URL.revokeObjectURL(activeCoverObjectUrlRef.current);
      }
      if (activePhotoObjectUrlRef.current) {
        URL.revokeObjectURL(activePhotoObjectUrlRef.current);
      }
    };
  }, []);

  const displayCoverUrl = optimisticCoverUrl || student.coverUrl;
  const displayPhotoUrl = optimisticPhotoUrl || student.photoUrl || '/src/assets/student-photo.png';

  const processAndUploadCover = async (file: File) => {
    // 1. Validation
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      showToast('Unsupported file type. Please upload a PNG, JPG, or WebP image.', 'error');
      return;
    }
    if (file.size > MAX_IMAGE_FILE_SIZE) {
      showToast('File size exceeds the 5MB limit. Please choose a smaller image.', 'error');
      return;
    }

    // 2. Instant Optimistic Preview (< 50ms)
    if (activeCoverObjectUrlRef.current) {
      URL.revokeObjectURL(activeCoverObjectUrlRef.current);
      activeCoverObjectUrlRef.current = null;
    }
    const previewUrl = URL.createObjectURL(file);
    activeCoverObjectUrlRef.current = previewUrl;
    setOptimisticCoverUrl(previewUrl);
    setFailedCoverFile(null);
    setIsUploadingCover(true);

    // 3. Fast Client-side Resize, Compression & Upload with 15s Timeout
    try {
      const uploadTask = (async () => {
        const compressedFile = await validateAndCompressImage(file, {
          maxWidth: 1200,
          maxHeight: 1000,
          quality: 0.8,
        });
        return await uploadMedia(compressedFile, 'cover');
      })();

      const timeoutTask = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Upload timed out after 15 seconds. Please try again.')), 15000)
      );

      const uploadedUrl = await Promise.race([uploadTask, timeoutTask]);
      updateBasicInfo({ coverUrl: uploadedUrl });
      showToast('Cover backdrop updated successfully.', 'success');
      setFailedCoverFile(null);
    } catch (err: any) {
      // Revert smoothly to previous backdrop and store failed file for Retry
      setOptimisticCoverUrl(null);
      setFailedCoverFile(file);
      showToast(err?.message || 'Failed to upload cover backdrop. Click Retry on the banner to attempt again.', 'error');
    } finally {
      setIsUploadingCover(false);
      if (activeCoverObjectUrlRef.current) {
        URL.revokeObjectURL(activeCoverObjectUrlRef.current);
        activeCoverObjectUrlRef.current = null;
      }
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  };

  const processAndUploadPhoto = async (file: File) => {
    if (!VALID_IMAGE_TYPES.includes(file.type)) {
      showToast('Unsupported file type. Please upload a PNG, JPG, or WebP image.', 'error');
      return;
    }
    if (file.size > MAX_IMAGE_FILE_SIZE) {
      showToast('File size exceeds the 5MB limit. Please choose a smaller image.', 'error');
      return;
    }

    if (activePhotoObjectUrlRef.current) {
      URL.revokeObjectURL(activePhotoObjectUrlRef.current);
      activePhotoObjectUrlRef.current = null;
    }
    const previewUrl = URL.createObjectURL(file);
    activePhotoObjectUrlRef.current = previewUrl;
    setOptimisticPhotoUrl(previewUrl);
    setIsUploadingPhoto(true);

    try {
      const uploadTask = (async () => {
        const compressedFile = await validateAndCompressImage(file, {
          maxWidth: 600,
          maxHeight: 600,
          quality: 0.85,
        });
        return await uploadMedia(compressedFile, 'profile');
      })();

      const timeoutTask = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Profile photo upload timed out. Please try again.')), 15000)
      );

      const uploadedUrl = await Promise.race([uploadTask, timeoutTask]);
      updateBasicInfo({ photoUrl: uploadedUrl });
      showToast('Profile photo updated successfully.', 'success');
    } catch (err: any) {
      setOptimisticPhotoUrl(null);
      showToast(err?.message || 'Failed to update profile photo.', 'error');
    } finally {
      setIsUploadingPhoto(false);
      if (activePhotoObjectUrlRef.current) {
        URL.revokeObjectURL(activePhotoObjectUrlRef.current);
        activePhotoObjectUrlRef.current = null;
      }
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processAndUploadPhoto(file);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processAndUploadCover(file);
    }
  };

  const handleCoverDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processAndUploadCover(file);
    }
  };

  const handlePhotoDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPhoto(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processAndUploadPhoto(file);
    }
  };

  const handleResetCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeCoverObjectUrlRef.current) {
      URL.revokeObjectURL(activeCoverObjectUrlRef.current);
      activeCoverObjectUrlRef.current = null;
    }
    setOptimisticCoverUrl(null);
    setFailedCoverFile(null);
    updateBasicInfo({ coverUrl: '' });
    showToast('Cover backdrop restored to default.', 'info');
  };

  return (
    <div className="space-y-8 max-w-4xl font-serif">
      {/* Module Title */}
      <div>
        <h2 className="text-xl font-bold text-[#2b241e] tracking-tight">
          Basic Identity & Contact Information
        </h2>
        <p className="text-xs text-[#73685c] mt-1">
          Manage your official identity card representation, headline, biography, and public contact visibility.
        </p>
      </div>

      {/* Avatar & Cover Imagery Card */}
      <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] overflow-hidden shadow-2xs">
        {/* Interactive Drag-and-Drop Cover Banner Area */}
        <div
          onClick={() => coverInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer.types.includes('Files') && !isDraggingCover) {
              setIsDraggingCover(true);
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDraggingCover(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.currentTarget.contains(e.relatedTarget as Node)) return;
            setIsDraggingCover(false);
          }}
          onDrop={handleCoverDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              coverInputRef.current?.click();
            }
          }}
          className={`h-40 sm:h-52 w-full relative transition-all duration-200 select-none cursor-pointer group outline-none overflow-hidden ${
            displayCoverUrl
              ? 'bg-[#2b241e]'
              : 'border-2 border-dashed border-stone-300/80 hover:border-amber-900/50 bg-gradient-to-r from-[#f0eae1] via-[#f7f2ea] to-[#f0eae1]'
          } ${
            isDraggingCover
              ? 'bg-amber-900/10 border-2 border-dashed border-amber-900 scale-[0.99] ring-4 ring-amber-900/10'
              : ''
          }`}
          title={
            displayCoverUrl
              ? 'Click or drag & drop to change cover backdrop'
              : 'Click or drag & drop image to set cover backdrop'
          }
        >
          {/* Subtle Non-Blocking Top Progress Bar while uploading */}
          {isUploadingCover && (
            <div className="absolute top-0 inset-x-0 h-1 bg-black/20 overflow-hidden z-30 pointer-events-none">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '250%' }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                className="h-full w-1/2 bg-[#704a29]"
              />
            </div>
          )}

          {/* Subtle Progress Pill in Top-Left Corner (Non-blocking) */}
          {isUploadingCover && (
            <div className="absolute top-3 left-3 z-30 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-xs font-sans flex items-center gap-2 shadow-md pointer-events-none animate-fade-in">
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="font-medium text-[11px] tracking-wide">Saving cover backdrop...</span>
            </div>
          )}

          {/* Failed Upload Alert Pill with Retry Button */}
          {failedCoverFile && !isUploadingCover && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-3 left-3 z-30 px-3 py-1.5 rounded-full bg-[#bc473b]/90 backdrop-blur-md border border-white/30 text-white text-xs font-sans flex items-center gap-2 shadow-md"
            >
              <AlertCircle className="w-3.5 h-3.5 text-white" />
              <span className="text-[11px] font-medium">Upload failed</span>
              <button
                type="button"
                onClick={() => processAndUploadCover(failedCoverFile)}
                className="px-2 py-0.5 rounded-full bg-white text-[#bc473b] hover:bg-[#fff5f5] text-[10px] font-bold transition cursor-pointer ml-1 active:scale-95"
              >
                Retry
              </button>
            </div>
          )}

          {/* Active Drag-Over Highlight State Overlay */}
          {isDraggingCover && (
            <div className="absolute inset-0 bg-amber-900/15 backdrop-blur-xs z-20 flex flex-col items-center justify-center text-[#704a29] p-4 text-center pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-[#704a29] text-white flex items-center justify-center shadow-md mb-2 animate-bounce">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold font-serif text-[#704a29]">
                Drop image to update cover backdrop
              </p>
              <p className="text-[11px] text-[#73685c] mt-0.5">
                PNG, JPG, or WebP up to 5MB
              </p>
            </div>
          )}

          {/* Uploaded Image or Empty/Default State */}
          {displayCoverUrl ? (
            <>
              <img
                src={displayCoverUrl}
                alt="Profile Cover Backdrop"
                className="w-full h-full object-cover"
              />
              {/* Subtle top scrim for toolbar contrast */}
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

              {/* Uploaded Image Toolbar (Top-Right Corner) */}
              <div
                className="absolute top-3 right-3 flex items-center gap-2 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isUploadingCover}
                  className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white backdrop-blur-md border border-[#d9cdbd] hover:border-[#704a29] text-xs font-semibold text-[#2b241e] transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                  title="Choose a new cover image"
                >
                  <Upload className="w-3.5 h-3.5 text-[#704a29]" />
                  <span>Change Cover</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetCover}
                  disabled={isUploadingCover}
                  className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-[#fef2f2] backdrop-blur-md border border-[#d9cdbd] hover:border-[#bc473b] text-xs font-semibold text-[#bc473b] transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                  title="Remove custom cover and restore default backdrop"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#bc473b]" />
                  <span>Reset / Remove</span>
                </button>
              </div>
            </>
          ) : (
            /* Default / Empty State Prompt */
            !isDraggingCover && (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                <div className="w-10 h-10 rounded-2xl bg-[#fffefb] border border-[#d9cdbd] flex items-center justify-center text-[#704a29] shadow-2xs mb-2 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-5 h-5 text-[#704a29]" />
                </div>
                <h4 className="text-sm font-bold text-[#2b241e] font-serif tracking-wide">
                  Default Identity Backdrop
                </h4>
                <p className="text-xs text-[#73685c] mt-1 max-w-sm">
                  Drag &amp; drop cover image here, or click to browse (PNG, JPG, WebP &bull; Max 5MB)
                </p>
              </div>
            )
          )}

          <input
            type="file"
            ref={coverInputRef}
            onChange={handleCoverUpload}
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
          />
        </div>

        {/* Profile Avatar & Quick Name Header */}
        <div className="p-6 sm:p-8 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
          <div className="flex items-end gap-4">
            {/* Overlapping Profile Photo Box with Drag-and-Drop */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                photoInputRef.current?.click();
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer.types.includes('Files') && !isDraggingPhoto) {
                  setIsDraggingPhoto(true);
                }
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDraggingPhoto(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                setIsDraggingPhoto(false);
              }}
              onDrop={handlePhotoDrop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  photoInputRef.current?.click();
                }
              }}
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#fffefb] border-4 border-[#fffefb] overflow-hidden shadow-md relative cursor-pointer group transition-all select-none ${
                isDraggingPhoto
                  ? 'ring-4 ring-amber-900 bg-amber-900/20 scale-105'
                  : 'hover:shadow-lg'
              }`}
              title="Click or drag & drop to update profile photo"
            >
              {/* Profile Image */}
              <img
                src={displayPhotoUrl}
                alt={student.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
              />

              {/* Uploading State */}
              {isUploadingPhoto && (
                <div className="absolute inset-0 bg-[#2b241e]/70 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 pointer-events-none">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mb-1" />
                  <span className="text-[10px] font-bold">Saving...</span>
                </div>
              )}

              {/* Active Drag-Over Overlay */}
              {isDraggingPhoto && !isUploadingPhoto && (
                <div className="absolute inset-0 bg-amber-900/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 p-1 text-center pointer-events-none">
                  <Camera className="w-6 h-6 animate-bounce mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Drop Photo</span>
                </div>
              )}

              {/* Hover Overlay ("Update Photo") */}
              {!isDraggingPhoto && !isUploadingPhoto && (
                <div className="absolute inset-0 bg-black/45 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 cursor-pointer">
                  <Camera className="w-4 h-4 text-white" />
                  <span>Update Photo</span>
                </div>
              )}

              {/* Permanent Camera Badge on Bottom-Right */}
              <div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#704a29] border-2 border-white text-white flex items-center justify-center shadow-md pointer-events-none group-hover:scale-110 transition-transform"
                title="Update Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </div>

              <input
                type="file"
                ref={photoInputRef}
                onChange={handlePhotoUpload}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
            </div>

            <div className="mb-2">
              <h3 className="text-lg font-bold text-[#2b241e]">
                {student.fullName || 'Full Name'}
              </h3>
              <p className="text-xs text-[#704a29] font-semibold">
                USN: {student.usn} &bull; {student.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-[#f0eae1] hover:bg-[#e5ded5] border border-[#d9cdbd] text-xs font-semibold text-[#704a29] transition cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Replace Photo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 space-y-6 shadow-2xs">
        <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold pb-3 border-b border-[#d9cdbd]">
          Primary Identity Attributes
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-2">
              Full Legal Name
            </label>
            <input
              type="text"
              value={student.fullName || ''}
              onChange={(e) => updateBasicInfo({ fullName: e.target.value })}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-base md:text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20 scroll-mt-24 transition-colors"
              placeholder="e.g. Rahul N A"
            />
          </div>

          {/* Student ID / USN */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-2">
              University Seat No. (USN / ID)
            </label>
            <input
              type="text"
              value={student.usn || ''}
              onChange={(e) => updateBasicInfo({ usn: e.target.value })}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-base md:text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20 scroll-mt-24 transition-colors"
              placeholder="e.g. 1BT24CS051"
            />
          </div>

          {/* Department / Branch */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-2">
              Department / Discipline
            </label>
            <input
              type="text"
              value={student.department || ''}
              onChange={(e) => updateBasicInfo({ department: e.target.value })}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-base md:text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20 scroll-mt-24 transition-colors"
              placeholder="e.g. Computer Science & Engineering"
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-2">
              Institution / Organization
            </label>
            <input
              type="text"
              value={student.college?.name || ''}
              onChange={(e) =>
                updateBasicInfo({
                  college: {
                    ...student.college,
                    name: e.target.value,
                  },
                })
              }
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-base md:text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20 scroll-mt-24 transition-colors"
              placeholder="e.g. Bangalore Technological Institute"
            />
          </div>
        </div>

        {/* Professional Headline (LinkedIn Style) */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-2">
            Professional Headline
          </label>
          <input
            type="text"
            value={student.headline || ''}
            onChange={(e) => updateBasicInfo({ headline: e.target.value })}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-base md:text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20 scroll-mt-24 transition-colors"
            placeholder="e.g. Computer Science Scholar | Full-Stack Architect & AI Systems Researcher"
          />
          <p className="text-[11px] text-[#73685c] mt-1.5">
            Appears prominently on public profile cards and preview snippets.
          </p>
        </div>

        {/* Biography (Instagram & LinkedIn Style) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs uppercase tracking-wider text-[#73685c] font-bold">
              Professional Biography
            </label>
            <span className="text-[11px] text-[#73685c]">
              {(student.biography || '').length} / 500 characters
            </span>
          </div>
          <textarea
            rows={4}
            value={student.biography || ''}
            onChange={(e) => updateBasicInfo({ biography: e.target.value })}
            maxLength={500}
            className="w-full px-4 py-3 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-base md:text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20 resize-none leading-relaxed scroll-mt-24 transition-colors"
            placeholder="Write a concise overview of your engineering passions, technical domain expertise, and career aspirations..."
          />
        </div>
      </div>

      {/* Contact & Location Details */}
      <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 space-y-6 shadow-2xs">
        <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold pb-3 border-b border-[#d9cdbd]">
          Contact & Location Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Email */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider text-[#73685c] font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#704a29]" />
                Contact Email
              </label>
              <button
                type="button"
                onClick={() => updateVisibility({ showEmail: !visibility.showEmail })}
                className="text-[11px] flex items-center gap-1 cursor-pointer transition text-[#704a29] font-semibold"
              >
                {visibility.showEmail ? (
                  <>
                    <Eye className="w-3 h-3 text-[#16a34a]" />
                    <span className="text-[#16a34a]">Public</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 text-[#73685c]" />
                    <span className="text-[#73685c]">Hidden</span>
                  </>
                )}
              </button>
            </div>
            <input
              type="email"
              value={student.email || ''}
              onChange={(e) => updateBasicInfo({ email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20"
              placeholder="e.g. rahulnagv.dev@gmail.com"
            />
          </div>

          {/* Phone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-wider text-[#73685c] font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#704a29]" />
                Phone Number
              </label>
              <button
                type="button"
                onClick={() => updateVisibility({ showPhone: !visibility.showPhone })}
                className="text-[11px] flex items-center gap-1 cursor-pointer transition text-[#704a29] font-semibold"
              >
                {visibility.showPhone ? (
                  <>
                    <Eye className="w-3 h-3 text-[#16a34a]" />
                    <span className="text-[#16a34a]">Public</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3 text-[#73685c]" />
                    <span className="text-[#73685c]">Hidden</span>
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              value={student.phone || ''}
              onChange={(e) => updateBasicInfo({ phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20"
              placeholder="e.g. +91 98765 43210"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#704a29]" />
              Geographic Location
            </label>
            <input
              type="text"
              value={student.location || student.currentAddress || ''}
              onChange={(e) => updateBasicInfo({ location: e.target.value, currentAddress: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20"
              placeholder="e.g. Bengaluru, Karnataka, India"
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#704a29]" />
              Personal Website URL
            </label>
            <input
              type="url"
              value={student.websiteUrl || ''}
              onChange={(e) => updateBasicInfo({ websiteUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20"
              placeholder="https://rahulnagv-24cs051.web.app"
            />
          </div>
        </div>

        {/* PVC ID Card Backface Attributes & Privacy Controls Section */}
        <div className="pt-6 border-t border-[#d9cdbd] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#d9cdbd]/60">
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#704a29] font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#704a29]" />
                PVC ID Card Backface & Academic Privacy Controls
              </h4>
              <p className="text-[11px] text-[#73685c] mt-0.5">
                Edit the exact values printed on your physical card and toggle sensitive visibility for public visitors.
              </p>
            </div>
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#f0eae1] border border-[#d9cdbd] text-[#704a29] font-bold">
                Cumulative CGPA: {calculatedCgpa} / 10.0
              </span>
            </div>
          </div>

          {/* Quick Visibility Controls Bar (Matches Card Backface Toggles) */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#73685c] font-bold mb-2">
              Privacy Masking Quick Toggles
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  key: 'showBloodGroup',
                  label: 'Blood Group',
                  val: visibility.showBloodGroup,
                  display: student.bloodGroup || 'O+',
                },
                {
                  key: 'showDob',
                  label: 'Date of Birth',
                  val: visibility.showDob,
                  display: student.dateOfBirth || '14/05/2003',
                },
                {
                  key: 'showPermanentAddress',
                  label: 'Permanent Address',
                  val: visibility.showPermanentAddress,
                  display: 'Home Address',
                },
                {
                  key: 'showSgpaScores',
                  label: 'Academic SGPA',
                  val: visibility.showSgpaScores,
                  display: `${calculatedCgpa} CGPA`,
                },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => updateVisibility({ [item.key]: !item.val })}
                  className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer shadow-2xs ${
                    item.val
                      ? 'bg-[#f0eae1] border-[#704a29] text-[#704a29] font-bold'
                      : 'bg-[#fffefb] border-[#d9cdbd] text-[#73685c] hover:border-[#a67c52]'
                  }`}
                  title={`Toggle ${item.label} visibility for public visitors`}
                >
                  <div className="min-w-0 pr-1">
                    <span className="text-xs block truncate">{item.label}</span>
                    <span className="text-[10px] block opacity-75 font-normal truncate mt-0.5">
                      {item.val ? 'Publicly Visible' : 'Protected (Masked)'}
                    </span>
                  </div>
                  {item.val ? (
                    <Check className="w-3.5 h-3.5 text-[#704a29] shrink-0" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-[#a89d91] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Full Inline Editable Format for All 4 Fields */}
          <div className="space-y-4 pt-2">
            <label className="block text-[11px] uppercase tracking-wider text-[#73685c] font-bold">
              Editable Formats & Attribute Values
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Blood Group Editable Field */}
              <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-[#73685c] font-bold flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-[#991b1b]" />
                    Blood Group
                  </label>
                  <button
                    type="button"
                    onClick={() => updateVisibility({ showBloodGroup: !visibility.showBloodGroup })}
                    className={`text-[10.5px] px-2 py-0.5 rounded-md border flex items-center gap-1 cursor-pointer transition font-semibold ${
                      visibility.showBloodGroup
                        ? 'bg-[#f2f8f2] border-[#86efac] text-[#166534]'
                        : 'bg-[#fffefb] border-[#d9cdbd] text-[#73685c]'
                    }`}
                  >
                    {visibility.showBloodGroup ? (
                      <Eye className="w-3 h-3 text-[#16a34a]" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-[#73685c]" />
                    )}
                    <span>{visibility.showBloodGroup ? 'Public' : 'Protected'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={
                      ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].includes(student.bloodGroup)
                        ? student.bloodGroup
                        : 'custom'
                    }
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        updateBasicInfo({ bloodGroup: e.target.value });
                      }
                    }}
                    className="col-span-1 px-2.5 py-2 rounded-xl bg-[#fffefb] border border-[#d9cdbd] text-xs font-bold text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                    <option value="custom">Other...</option>
                  </select>

                  <input
                    type="text"
                    value={student.bloodGroup || ''}
                    onChange={(e) => updateBasicInfo({ bloodGroup: e.target.value })}
                    placeholder="e.g. O+"
                    className="col-span-2 px-3 py-2 rounded-xl bg-[#fffefb] border border-[#d9cdbd] text-xs font-mono font-bold text-[#991b1b] focus:outline-none focus:border-[#704a29]"
                  />
                </div>

                <div className="flex items-center justify-between text-[10.5px] text-[#73685c] pt-1.5 border-t border-[#d9cdbd]/60">
                  <span>Public Visitor Display:</span>
                  <span className="font-mono font-bold text-[#2b241e]">
                    {visibility.showBloodGroup ? student.bloodGroup || 'O+' : '•• (Protected)'}
                  </span>
                </div>
              </div>

              {/* 2. Date of Birth (DOB) Editable Field */}
              <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-[#73685c] font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#704a29]" />
                    Date of Birth (DOB)
                  </label>
                  <button
                    type="button"
                    onClick={() => updateVisibility({ showDob: !visibility.showDob })}
                    className={`text-[10.5px] px-2 py-0.5 rounded-md border flex items-center gap-1 cursor-pointer transition font-semibold ${
                      visibility.showDob
                        ? 'bg-[#f2f8f2] border-[#86efac] text-[#166534]'
                        : 'bg-[#fffefb] border-[#d9cdbd] text-[#73685c]'
                    }`}
                  >
                    {visibility.showDob ? (
                      <Eye className="w-3 h-3 text-[#16a34a]" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-[#73685c]" />
                    )}
                    <span>{visibility.showDob ? 'Public' : 'Protected'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <input
                    type="text"
                    value={student.dateOfBirth || ''}
                    onChange={(e) => updateBasicInfo({ dateOfBirth: e.target.value })}
                    placeholder="14/05/2003 or YYYY-MM-DD"
                    className="col-span-3 px-3 py-2 rounded-xl bg-[#fffefb] border border-[#d9cdbd] text-xs font-mono text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                  />
                  <input
                    type="date"
                    onChange={(e) => {
                      if (e.target.value) {
                        const [yyyy, mm, dd] = e.target.value.split('-');
                        updateBasicInfo({ dateOfBirth: `${dd}/${mm}/${yyyy}` });
                      }
                    }}
                    className="col-span-2 px-2 py-2 rounded-xl bg-[#fffefb] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29] cursor-pointer"
                    title="Select Date using Calendar Picker"
                  />
                </div>

                <div className="flex items-center justify-between text-[10.5px] text-[#73685c] pt-1.5 border-t border-[#d9cdbd]/60">
                  <span>Public Visitor Display:</span>
                  <span className="font-mono font-bold text-[#2b241e]">
                    {visibility.showDob ? student.dateOfBirth || '14/05/2003' : '••/••/•••• (Protected)'}
                  </span>
                </div>
              </div>

              {/* 3. Permanent Residential Address (Full Row) */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-[#73685c] font-bold flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-[#704a29]" />
                    Permanent Domicile Address (PVC Card Backface)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      updateVisibility({ showPermanentAddress: !visibility.showPermanentAddress })
                    }
                    className={`text-[10.5px] px-2 py-0.5 rounded-md border flex items-center gap-1 cursor-pointer transition font-semibold ${
                      visibility.showPermanentAddress
                        ? 'bg-[#f2f8f2] border-[#86efac] text-[#166534]'
                        : 'bg-[#fffefb] border-[#d9cdbd] text-[#73685c]'
                    }`}
                  >
                    {visibility.showPermanentAddress ? (
                      <Eye className="w-3 h-3 text-[#16a34a]" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-[#73685c]" />
                    )}
                    <span>
                      {visibility.showPermanentAddress ? 'Public Address' : 'Protected (Masked)'}
                    </span>
                  </button>
                </div>

                <textarea
                  rows={2}
                  value={student.permanentAddress || ''}
                  onChange={(e) => updateBasicInfo({ permanentAddress: e.target.value })}
                  placeholder="e.g. No. 1127, Masidikere, B. Kanaboor, Narasimharajapura, Chikkamagaluru, Karnataka - 577112, India"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#fffefb] border border-[#d9cdbd] text-xs text-[#2b241e] focus:outline-none focus:border-[#704a29] leading-relaxed resize-none"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10.5px] text-[#73685c] pt-1.5 border-t border-[#d9cdbd]/60 gap-1">
                  <span>Public Visitor View:</span>
                  <span className="font-sans italic text-[#704a29] truncate max-w-xl">
                    {visibility.showPermanentAddress
                      ? student.permanentAddress || 'Not specified'
                      : '••••••••••••••, Narasimharajapura, Chikkamagaluru, Karnataka - 577112'}
                  </span>
                </div>
              </div>

              {/* 4. Academic Semester SGPA & CGPA Editable Format (Full Row) */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#704a29]" />
                    <div>
                      <label className="text-xs uppercase tracking-wider text-[#704a29] font-bold block">
                        Academic Semester SGPA Scores & Grade Points
                      </label>
                      <span className="text-[11px] text-[#73685c]">
                        Edit SGPA grade point scores evaluated under the VTU CBCS Scheme (10.0 scale).
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => updateVisibility({ showSgpaScores: !visibility.showSgpaScores })}
                    className={`text-[10.5px] px-2.5 py-1 rounded-md border flex items-center gap-1.5 cursor-pointer transition font-semibold self-start sm:self-auto ${
                      visibility.showSgpaScores
                        ? 'bg-[#f2f8f2] border-[#86efac] text-[#166534]'
                        : 'bg-[#fffefb] border-[#d9cdbd] text-[#73685c]'
                    }`}
                  >
                    {visibility.showSgpaScores ? (
                      <Eye className="w-3 h-3 text-[#16a34a]" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-[#73685c]" />
                    )}
                    <span>{visibility.showSgpaScores ? 'Scores Visible' : 'Scores Masked'}</span>
                  </button>
                </div>

                {/* Semester SGPA Input Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  {allCompletedSemesters.map((sem) => (
                    <div
                      key={sem.semesterNumber}
                      className="p-3 rounded-xl bg-[#fffefb] border border-[#d9cdbd] flex flex-col justify-between shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#2b241e]">
                          {sem.semesterName || `Semester ${sem.semesterNumber}`}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#f0eae1] text-[#704a29] font-mono font-bold">
                          /10.0
                        </span>
                      </div>

                      <div className="my-1">
                        <label className="block text-[10px] text-[#73685c] mb-1">
                          Evaluated SGPA:
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          value={sem.sgpa}
                          onChange={(e) =>
                            handleUpdateSemesterSgpa(
                              sem.semesterNumber,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-2.5 py-1 rounded-lg bg-[#fbf8f3] border border-[#d9cdbd] text-sm font-mono font-bold text-[#704a29] text-center focus:outline-none focus:border-[#704a29]"
                        />
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-[#73685c] pt-1 border-t border-[#d9cdbd]/50">
                        <span>Visitor:</span>
                        <span className="font-mono font-bold text-[#2b241e]">
                          {visibility.showSgpaScores ? `${sem.sgpa.toFixed(2)}` : '•.• (Masked)'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Academic CGPA Overview */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#73685c] pt-2 border-t border-[#d9cdbd]/60 gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[#2b241e]">Cumulative CGPA:</span>
                    <span className="font-mono font-bold text-[#704a29]">{calculatedCgpa} / 10.0</span>
                    <span className="text-[10px] text-[#166534] bg-[#f2f8f2] px-1.5 py-0.5 rounded border border-[#86efac]">
                      First Class with Distinction
                    </span>
                  </div>
                  <span className="text-[10px] text-[#73685c]">
                    {visibility.showSgpaScores
                      ? '✓ Published to Education Section & Academic Journey'
                      : '🔒 Hidden on Public Portfolio view'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoModule;
