import React, { useState, useRef } from 'react';
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
} from 'lucide-react';
import { useOwnerEditor } from '../../../context/OwnerEditorContext';

export const BasicInfoModule: React.FC = () => {
  const {
    draftContent,
    updateBasicInfo,
    updateVisibility,
    uploadMedia,
    showToast,
  } = useOwnerEditor();

  const student = draftContent.student;
  const visibility = draftContent.visibility;

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const url = await uploadMedia(file, 'profile');
      updateBasicInfo({ photoUrl: url });
      showToast('Profile photo uploaded successfully.', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to upload profile photo.', 'error');
    } finally {
      setIsUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const url = await uploadMedia(file, 'cover');
      updateBasicInfo({ coverUrl: url });
      showToast('Cover image updated successfully.', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to upload cover banner.', 'error');
    } finally {
      setIsUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
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
        {/* Cover Banner Area */}
        <div className="h-40 sm:h-48 w-full bg-[#f0eae1] relative group">
          {student.coverUrl ? (
            <img
              src={student.coverUrl}
              alt="Profile Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#f0eae1] via-[#f7f2ea] to-[#f0eae1] flex items-center justify-center">
              <span className="text-xs text-[#73685c] flex items-center gap-1.5 font-semibold">
                <ImageIcon className="w-4 h-4 text-[#704a29]" />
                Default Identity Backdrop
              </span>
            </div>
          )}

          {/* Cover upload overlay button */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={isUploadingCover}
              className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-[#d9cdbd] text-xs font-bold text-[#2b241e] hover:bg-white transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Upload className="w-3.5 h-3.5 text-[#704a29]" />
              <span>{isUploadingCover ? 'Uploading...' : 'Change Cover Banner'}</span>
            </button>
            <input
              type="file"
              ref={coverInputRef}
              onChange={handleCoverUpload}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
          </div>
        </div>

        {/* Profile Avatar & Quick Name Header */}
        <div className="p-6 sm:p-8 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
          <div className="flex items-end gap-4">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#fffefb] border-4 border-[#fffefb] overflow-hidden shadow-md">
                <img
                  src={student.photoUrl || '/src/assets/student-photo.png'}
                  alt={student.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </div>

              {/* Avatar upload trigger */}
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-white" />
                <span>{isUploadingPhoto ? '...' : 'Upload'}</span>
              </button>
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
              className="px-3 py-1.5 rounded-lg bg-[#f0eae1] hover:bg-[#e5ded5] border border-[#d9cdbd] text-xs font-semibold text-[#704a29] transition cursor-pointer shadow-2xs"
            >
              Replace Photo
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
              className="w-full px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20"
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
              className="w-full px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20"
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
              className="w-full px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20"
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
              className="w-full px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20"
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
            className="w-full px-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20"
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
            className="w-full px-4 py-3 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/20 resize-none leading-relaxed"
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

        {/* Visibility Controls for ID Card Details */}
        <div className="pt-4 border-t border-[#d9cdbd]">
          <h4 className="text-xs uppercase tracking-wider text-[#73685c] font-bold mb-3 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#704a29]" />
            PVC ID Card Backface Privacy Controls
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'showBloodGroup', label: 'Blood Group', val: visibility.showBloodGroup },
              { key: 'showDob', label: 'Date of Birth', val: visibility.showDob },
              { key: 'showPermanentAddress', label: 'Permanent Address', val: visibility.showPermanentAddress },
              { key: 'showSgpaScores', label: 'Academic SGPA', val: visibility.showSgpaScores },
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
              >
                <span className="text-xs">{item.label}</span>
                {item.val ? <Check className="w-3.5 h-3.5 text-[#704a29]" /> : <EyeOff className="w-3.5 h-3.5 text-[#a89d91]" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoModule;
