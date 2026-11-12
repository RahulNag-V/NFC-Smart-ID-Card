import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  UserCheck,
  Palette,
  Briefcase,
  Share2,
  Layers,
  Smartphone,
  ShieldCheck,
  LogOut,
  Sparkles,
  Save,
  RotateCcw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  User,
  QrCode,
  Eye,
  Copy,
  Check,
  ChevronDown,
  Lock,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOwnerEditor, DashboardTab } from '../../context/OwnerEditorContext';
import { CONFIGURED_OWNER_EMAIL } from '../../lib/firebase';
import { OverviewModule } from './modules/OverviewModule';
import { BasicInfoModule } from './modules/BasicInfoModule';
import { AppearanceModule } from './modules/AppearanceModule';
import { ProfessionalModule } from './modules/ProfessionalModule';
import { SocialLinksModule } from './modules/SocialLinksModule';
import { SectionsModule } from './modules/SectionsModule';
import { LivePreviewModule } from './modules/LivePreviewModule';
import { SecurityModule } from './modules/SecurityModule';
import { PublicPortfolioView } from '../public/PublicPortfolioView';
import { QrCodeView } from '../id-card/QrCodeView';
import { VerticalStudentIdCard } from '../id-card/VerticalStudentIdCard';
import { SmartphoneFrame } from './SmartphoneFrame';

interface OwnerDashboardProps {
  onNavigatePublic: () => void;
  onLogout: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  onNavigatePublic,
  onLogout,
}) => {
  const { user, isOwner, loading: authLoading, logout } = useAuth();
  const {
    draftContent,
    publishedContent,
    isDirty,
    isSaving,
    isPublishing,
    activeTab,
    setActiveTab,
    saveDraft,
    publishLive,
    discardChanges,
    toast,
    dismissToast,
    showToast,
  } = useOwnerEditor();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [splitPreviewOpen, setSplitPreviewOpen] = useState(false);
  const [isPublicMode, setIsPublicMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ananta_smart_id_public_mode') !== 'false';
    } catch {
      return true;
    }
  });
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showShareQrModal, setShowShareQrModal] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [copiedHandle, setCopiedHandle] = useState(false);
  const [copiedQrLink, setCopiedQrLink] = useState(false);
  const [headerPhotoError, setHeaderPhotoError] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const studentPhoto = draftContent.student?.photoUrl;
  const studentName = draftContent.student?.fullName?.trim() || '';
  const shortHandle = 'rahulnagv';

  useEffect(() => {
    setHeaderPhotoError(false);
  }, [studentPhoto]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const publicShareUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://rahulnagv-21cs051.web.app';

  const handleCopyHandle = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(publicShareUrl);
      }
      setCopiedHandle(true);
      showToast('Copied Smart ID link (@rahulnagv) to clipboard.', 'success');
      setTimeout(() => setCopiedHandle(false), 2000);
    } catch {
      showToast('Link: ' + publicShareUrl, 'info');
    }
  };

  const handleCopyShareUrl = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(publicShareUrl);
      }
      setCopiedQrLink(true);
      showToast('Public portfolio link copied to clipboard.', 'success');
      setTimeout(() => setCopiedQrLink(false), 2000);
    } catch {
      showToast('Link: ' + publicShareUrl, 'info');
    }
  };

  const togglePublicMode = () => {
    const nextState = !isPublicMode;
    setIsPublicMode(nextState);
    try {
      localStorage.setItem('ananta_smart_id_public_mode', String(nextState));
    } catch {}
    if (nextState) {
      showToast('Public Mode: ON • Smart ID is unlocked and publicly active.', 'success');
    } else {
      showToast('Public Mode: OFF • Smart ID locked to private.', 'info');
    }
  };

  const handleLogoutAction = async () => {
    await logout();
    onLogout();
  };

  const navItems = [
    { id: 'overview' as DashboardTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'basic-info' as DashboardTab, label: 'Edit Profile', icon: UserCheck },
    { id: 'appearance' as DashboardTab, label: 'Appearance', icon: Palette },
    { id: 'professional' as DashboardTab, label: 'Professional Info', icon: Briefcase },
    { id: 'social' as DashboardTab, label: 'Social Links', icon: Share2 },
    { id: 'sections' as DashboardTab, label: 'Profile Sections', icon: Layers },
    { id: 'preview' as DashboardTab, label: 'Live Preview', icon: Smartphone },
    { id: 'security' as DashboardTab, label: 'Security & Access', icon: ShieldCheck },
  ];

  if (authLoading) {
    return (
      <div className="h-screen w-screen bg-[#fbf8f3] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#704a29]/30 border-t-[#704a29] rounded-full animate-spin" />
          <span className="text-xs font-serif text-[#73685c]">Verifying Owner Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#fbf8f3] text-[#2b241e] flex flex-col font-serif antialiased selection:bg-[#704a29]/20">
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            onClick={dismissToast}
            className="fixed top-5 right-5 z-50 max-w-md cursor-pointer"
          >
            <div
              className={`p-4 rounded-xl shadow-lg backdrop-blur-md border flex items-start gap-3 ${
                toast.type === 'success'
                  ? 'bg-[#f2f8f2] border-[#86efac] text-[#14532d]'
                  : toast.type === 'error'
                  ? 'bg-[#fef2f2] border-[#fca5a5] text-[#991b1b]'
                  : 'bg-[#fffefb] border-[#d9cdbd] text-[#2b241e]'
              }`}
            >
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0 mt-0.5" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#dc2626] shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#704a29] shrink-0 mt-0.5" />}
              <div className="text-xs leading-relaxed">{toast.message}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= FIXED TOP HEADER BAR ================= */}
      <header className="h-16 shrink-0 bg-[#fffefb]/95 backdrop-blur-md border-b border-[#d9cdbd] px-3 sm:px-6 flex items-center justify-between z-40">
        {/* Left Side: Hamburger Menu + Student Personal Identity & Status */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile Menu Toggle Button (40x40px Touch Target) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden w-10 h-10 rounded-xl bg-[#f0eae1] hover:bg-[#e4ddd2] text-[#73685c] hover:text-[#2b241e] flex items-center justify-center cursor-pointer shrink-0 transition"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Student Profile Photo / Avatar with Verified Dot Badge (36x36px) */}
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#704a29] text-[#fffefb] flex items-center justify-center shadow-xs overflow-hidden border border-[#d9cdbd]/60">
              {studentPhoto && !headerPhotoError ? (
                <img
                  src={studentPhoto}
                  alt={studentName || 'Student Avatar'}
                  className="w-full h-full object-cover"
                  onError={() => setHeaderPhotoError(true)}
                />
              ) : (
                <User className="w-5 h-5 text-[#f0eae1]" />
              )}
            </div>
            {/* Green active/verified dot badge on bottom-right corner */}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#16a34a] border-2 border-[#fffefb] rounded-full shadow-xs"
              title="Verified & Active"
            />
          </div>

          {/* Student Name & Status Line */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {studentName ? (
                <span className="text-xs font-bold tracking-wider text-[#704a29] uppercase font-serif truncate max-w-[110px] sm:max-w-[160px] md:max-w-xs block">
                  {studentName}
                </span>
              ) : null}
              <span className="px-1.5 py-0.5 rounded-full bg-[#f0eae1] border border-[#d9cdbd] text-[9.5px] font-sans font-medium text-[#73685c] tracking-normal shrink-0">
                Owner
              </span>
            </div>

            {/* Desktop Only Status Line (Hidden on Mobile to Prevent Awkward Wrapping & Overflow) */}
            <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#73685c] mt-0.5">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] inline-block" />
                Verified Digital ID &bull; Active
              </span>
              <span className="text-[#d9cdbd]">&bull;</span>
              <button
                type="button"
                onClick={handleCopyHandle}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#f0eae1] hover:bg-[#e4ddd2] text-[#704a29] font-mono text-[10px] transition cursor-pointer border border-[#d9cdbd]/60"
                title="Click to copy shortened ID handle link"
              >
                <span>@rahulnagv</span>
                {copiedHandle ? (
                  <Check className="w-2.5 h-2.5 text-[#16a34a]" />
                ) : (
                  <Copy className="w-2.5 h-2.5 opacity-70" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Actions & Profile */}
        <div className="flex items-center gap-2">
          {/* Mobile Right Controls: Compact ON Pill + Single Eye Preview Button */}
          <div className="flex md:hidden items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={togglePublicMode}
              className={`px-2.5 py-1 rounded-full border text-xs font-sans font-medium flex items-center gap-1 transition cursor-pointer shadow-2xs ${
                isPublicMode
                  ? 'bg-[#f2f8f2] border-[#86efac] text-[#15803d]'
                  : 'bg-[#fef2f2] border-[#fca5a5] text-[#b91c1c]'
              }`}
              title={
                isPublicMode
                  ? 'Public Mode is ON • Tap to lock'
                  : 'Public Mode is OFF • Tap to unlock'
              }
            >
              {isPublicMode ? (
                <Globe className="w-3.5 h-3.5 text-[#16a34a]" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-[#dc2626]" />
              )}
              <span className="font-bold text-[10.5px]">{isPublicMode ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="w-9 h-9 rounded-xl bg-[#fffefb] hover:bg-[#f0eae1] text-[#704a29] border border-[#d9cdbd] transition flex items-center justify-center cursor-pointer shadow-2xs"
              title="Preview ID Card"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Right Controls (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-2 sm:gap-2.5">
            {/* Draft Staged indicator and actions when changes exist */}
            {isDirty && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#fef9c3] border border-[#fde047] text-[11px] text-[#854d0e]">
                  <span className="w-2 h-2 rounded-full bg-[#d97706] animate-pulse" />
                  <span>Unsaved Changes</span>
                </div>
                <button
                  onClick={discardChanges}
                  className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#f0eae1] hover:bg-[#e5ded5] text-xs text-[#73685c] hover:text-[#2b241e] border border-[#d9cdbd] transition flex items-center gap-1 cursor-pointer"
                  title="Discard Unsaved Changes"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Discard</span>
                </button>
                <button
                  onClick={() => saveDraft()}
                  disabled={isSaving}
                  className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#fffefb] hover:bg-[#f0eae1] text-xs text-[#2b241e] border border-[#d9cdbd] transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Save Draft (Private)"
                >
                  <Save className="w-3.5 h-3.5 text-[#704a29]" />
                  <span className="hidden md:inline">{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
                <button
                  onClick={() => publishLive()}
                  disabled={isPublishing}
                  className="px-2.5 sm:px-3 py-1 rounded-lg bg-[#16a34a] hover:bg-[#15803d] text-white font-medium text-xs tracking-wide shadow-xs active:scale-95 transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Publish Live"
                >
                  <Sparkles className="w-3 h-3 text-white" />
                  <span className="hidden sm:inline">{isPublishing ? 'Publishing...' : 'Publish'}</span>
                </button>
              </div>
            )}

            {/* Public Mode Status Toggle Pill (ON / OFF switch) */}
            <button
              type="button"
              onClick={togglePublicMode}
              className={`px-2.5 py-1 sm:px-3 sm:py-1 rounded-full border text-xs font-sans font-medium flex items-center gap-1.5 transition cursor-pointer shadow-2xs ${
                isPublicMode
                  ? 'bg-[#f2f8f2] border-[#86efac] text-[#15803d] hover:bg-[#e6f4e6]'
                  : 'bg-[#fef2f2] border-[#fca5a5] text-[#b91c1c] hover:bg-[#fee2e2]'
              }`}
              title={
                isPublicMode
                  ? 'Public Mode is ON • Tap to lock to private'
                  : 'Public Mode is OFF (Locked) • Tap to unlock'
              }
            >
              {isPublicMode ? (
                <Globe className="w-3.5 h-3.5 text-[#16a34a]" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-[#dc2626]" />
              )}
              <span className="hidden sm:inline text-[11px]">Public Mode</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isPublicMode ? 'bg-[#16a34a] text-white' : 'bg-[#dc2626] text-white'
                }`}
              >
                {isPublicMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Secondary Outline Button: "Preview ID" (with eye icon) */}
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#fffefb] hover:bg-[#f0eae1] text-xs text-[#2b241e] border border-[#d9cdbd] transition flex items-center gap-1.5 cursor-pointer shadow-2xs font-medium"
              title="Preview Smart ID Card"
            >
              <Eye className="w-3.5 h-3.5 text-[#704a29]" />
              <span className="hidden md:inline">Preview ID</span>
            </button>

            {/* Primary Solid Dark-Brown Button: "Share QR" (with QR code icon) */}
            <button
              type="button"
              onClick={() => setShowShareQrModal(true)}
              className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#704a29] hover:bg-[#593a1f] text-white font-medium text-xs tracking-wide shadow-xs active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
              title="Share Smart ID QR Code"
            >
              <QrCode className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Share QR</span>
            </button>

            {/* Compact User Avatar/Initials Dropdown Pill ("RN") on far right */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-full bg-[#f0eae1] hover:bg-[#e4ddd2] border border-[#d9cdbd] text-xs transition cursor-pointer shadow-2xs"
                title="Account Menu"
                aria-expanded={userMenuOpen}
              >
                <div className="w-6 h-6 rounded-full bg-[#704a29] text-[#fffefb] font-bold text-[10px] flex items-center justify-center font-sans tracking-tight shadow-xs">
                  RN
                </div>
                <ChevronDown
                  className={`w-3 h-3 text-[#73685c] transition-transform duration-200 ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu Modal / Popover */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-[#fffefb] border border-[#d9cdbd] rounded-2xl shadow-xl z-50 p-3 space-y-2 font-sans"
                  >
                    {/* Account Summary Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-[#d9cdbd]/60">
                      <div className="w-10 h-10 rounded-full bg-[#704a29] text-white font-bold text-sm flex items-center justify-center font-serif shadow-xs shrink-0">
                        RN
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#2b241e] font-serif truncate">
                          {draftContent.student?.fullName || 'Rahul Nag V'}
                        </div>
                        <div className="text-[11px] text-[#73685c] truncate">
                          {CONFIGURED_OWNER_EMAIL}
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                          <span className="text-[10px] uppercase font-bold text-[#16a34a] tracking-wider">
                            Owner &bull; Full Access
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sign Out Action directly below header divider */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogoutAction();
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl text-xs text-[#bc473b] hover:bg-[#fef2f2] transition flex items-center gap-2.5 cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-[#bc473b]" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ================= BODY WRAPPER (SIDEBAR IS FIXED, ONLY MAIN SCROLLS) ================= */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* ================= MOBILE SLIDE-OUT NAVIGATION DRAWER (ANIMATED) ================= */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop with Blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
                aria-hidden="true"
              />

              {/* Slide-out Drawer Panel */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-[#fffefb] border-r border-[#d9cdbd] shadow-2xl z-50 flex flex-col justify-between lg:hidden overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation Drawer"
              >
                {/* Drawer Top Header: Full Student Identity */}
                <div className="p-4 sm:p-5 border-b border-[#d9cdbd] bg-[#FAF7F2]">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#f0eae1] border border-[#d9cdbd] text-[10px] font-sans font-medium text-[#73685c]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                      <span>Owner Console</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-8 h-8 rounded-lg bg-[#f0eae1] hover:bg-[#e4ddd2] text-[#73685c] hover:text-[#2b241e] flex items-center justify-center transition cursor-pointer"
                      aria-label="Close menu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-[#704a29] text-[#fffefb] flex items-center justify-center shadow-xs overflow-hidden border border-[#d9cdbd]">
                        {studentPhoto && !headerPhotoError ? (
                          <img
                            src={studentPhoto}
                            alt={studentName || 'Student Profile'}
                            className="w-full h-full object-cover"
                            onError={() => setHeaderPhotoError(true)}
                          />
                        ) : (
                          <User className="w-6 h-6 text-[#f5efe6]" />
                        )}
                      </div>
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#16a34a] border-2 border-[#fffefb]"
                        title="Active / Verified"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-[#2b241e] font-serif uppercase tracking-wider truncate">
                        {studentName || 'Rahul Nag V'}
                      </h3>
                      <p className="text-[11px] text-[#73685c] truncate">
                        {CONFIGURED_OWNER_EMAIL}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#73685c]">
                        <span className="text-[#16a34a] font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
                          Verified Digital ID
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Handle Copy Button */}
                  <div className="mt-3 pt-2.5 border-t border-[#d9cdbd]/60 flex items-center justify-between">
                    <span className="text-[11px] text-[#73685c] font-sans">Public Handle:</span>
                    <button
                      type="button"
                      onClick={handleCopyHandle}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#fffefb] hover:bg-[#f0eae1] border border-[#d9cdbd] text-[11px] text-[#704a29] font-medium font-mono cursor-pointer transition"
                    >
                      {copiedHandle ? (
                        <>
                          <Check className="w-3 h-3 text-[#16a34a]" />
                          <span className="text-[#16a34a]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#73685c]" />
                          <span>@{shortHandle}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Drawer Navigation List */}
                <div className="p-3.5 space-y-1 overflow-y-auto flex-1 font-sans">
                  {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs transition cursor-pointer min-h-[44px] ${
                          isActive
                            ? 'bg-[#704a29] text-white font-bold shadow-xs'
                            : 'text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1]'
                        }`}
                      >
                        <item.icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-white' : 'text-[#704a29]'
                          }`}
                        />
                        <span className="truncate tracking-wide text-[12.5px] font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Drawer Footer Actions */}
                <div className="p-3.5 border-t border-[#d9cdbd] bg-[#FAF7F2] space-y-2 font-sans shrink-0">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowShareQrModal(true);
                      }}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#fffefb] hover:bg-[#f0eae1] border border-[#d9cdbd] text-xs font-medium text-[#704a29] transition cursor-pointer min-h-[44px]"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Share QR</span>
                    </button>
                    <a
                      href={publicShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#fffefb] hover:bg-[#f0eae1] border border-[#d9cdbd] text-xs font-medium text-[#704a29] transition cursor-pointer min-h-[44px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Public Site</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogoutAction();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs text-[#bc473b] hover:bg-[#fef2f2] transition cursor-pointer font-medium min-h-[44px]"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[#bc473b]" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ================= FIXED STATIONARY DESKTOP SIDEBAR ================= */}
        <aside
          className={`h-full shrink-0 bg-[#fffefb] border-r border-[#d9cdbd] flex flex-col justify-between transition-all duration-300 z-30 hidden lg:flex ${
            sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
          }`}
        >
          {/* Sidebar Nav Items */}
          <div className="p-4 space-y-1 overflow-y-auto flex-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs transition cursor-pointer ${
                    isActive
                      ? 'bg-[#704a29] text-white font-bold shadow-xs'
                      : 'text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1]'
                  }`}
                  title={item.label}
                >
                  <item.icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-[#704a29]'
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="truncate tracking-wide">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Controls */}
          <div className="hidden lg:block p-3 border-t border-[#d9cdbd] shrink-0 bg-[#fffefb]">
            {/* Collapse / Expand Button (Desktop Only) */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-full flex items-center justify-center p-2 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
              title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <div className="flex items-center gap-2 text-xs">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Collapse Menu</span>
                </div>
              )}
            </button>
          </div>
        </aside>

        {/* ================= PRIMARY CONTENT AREA (ONLY THIS REGION SCROLLS) ================= */}
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden p-3.5 sm:p-6 md:p-8 bg-[#fbf8f3]">
          <div className="max-w-5xl mx-auto pb-32 sm:pb-28 md:pb-24">
            {activeTab === 'overview' && <OverviewModule onNavigateTab={setActiveTab} />}
            {activeTab === 'basic-info' && <BasicInfoModule />}
            {activeTab === 'appearance' && <AppearanceModule />}
            {activeTab === 'professional' && <ProfessionalModule />}
            {activeTab === 'social' && <SocialLinksModule />}
            {activeTab === 'sections' && <SectionsModule />}
            {activeTab === 'preview' && <LivePreviewModule />}
            {activeTab === 'security' && <SecurityModule onLogout={handleLogoutAction} />}
          </div>
        </main>

        {/* ================= OPTIONAL DESKTOP SPLIT PREVIEW PANE ================= */}
        {splitPreviewOpen && (
          <aside className="hidden xl:flex w-[480px] h-full border-l border-[#d9cdbd] bg-[#fbf8f3] flex-col overflow-hidden shrink-0">
            <div className="p-3 border-b border-[#d9cdbd] bg-[#fffefb] flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#704a29] font-semibold">
                <Smartphone className="w-3.5 h-3.5" />
                Live Split Preview
              </span>
              <button
                onClick={() => setSplitPreviewOpen(false)}
                className="text-[#73685c] hover:text-[#2b241e] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
              <SmartphoneFrame>
                <PublicPortfolioView contentOverride={draftContent} isLivePreview={true} />
              </SmartphoneFrame>
            </div>
          </aside>
        )}
      </div>

      {/* ================= PREVIEW ID MODAL ================= */}
      <AnimatePresence>
        {showPreviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowPreviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#fffefb] border border-[#d9cdbd] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden my-8"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[#d9cdbd] flex items-center justify-between bg-[#fbf8f3]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#704a29] text-white flex items-center justify-center shadow-xs">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2b241e] font-serif uppercase tracking-wider">
                      Smart ID Card Preview
                    </h3>
                    <p className="text-[11px] text-[#73685c]">
                      Interactive rendering of your physical & digital Smart ID
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ID Card Display Area */}
              <div className="p-6 bg-[#fbf8f3] flex flex-col items-center justify-center min-h-[460px]">
                <div className="scale-90 sm:scale-100 transition-transform origin-center">
                  <VerticalStudentIdCard
                    student={draftContent.student}
                    isOwner={true}
                    onEditProfile={() => {
                      setShowPreviewModal(false);
                      setActiveTab('basic-info');
                    }}
                  />
                </div>
                <p className="text-[11px] text-[#73685c] mt-3 font-sans">
                  Tap or hover over the card to flip between front face and PVC backface.
                </p>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-[#d9cdbd] bg-[#fffefb] flex items-center justify-between gap-3 font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setShowPreviewModal(false);
                    setActiveTab('basic-info');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#704a29] hover:bg-[#f0eae1] transition cursor-pointer"
                >
                  Edit Card Details
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPreviewModal(false);
                      onNavigatePublic();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#f0eae1] hover:bg-[#e4ddd2] text-xs font-medium text-[#2b241e] transition cursor-pointer flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Portfolio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(false)}
                    className="px-4 py-1.5 rounded-lg bg-[#704a29] hover:bg-[#593a1f] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= SHARE QR CODE MODAL ================= */}
      <AnimatePresence>
        {showShareQrModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowShareQrModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#fffefb] border border-[#d9cdbd] rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden my-8"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-[#d9cdbd] flex items-center justify-between bg-[#fbf8f3]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#704a29] text-white flex items-center justify-center shadow-xs">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2b241e] font-serif uppercase tracking-wider">
                      Share Smart ID QR
                    </h3>
                    <p className="text-[11px] text-[#73685c]">
                      Scan to instantly access public profile
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowShareQrModal(false)}
                  className="p-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* QR Code Presentation Area */}
              <div className="p-6 bg-[#fffefb] flex flex-col items-center text-center space-y-4">
                <div className="p-4 rounded-2xl bg-[#fffefb] border-2 border-[#d9cdbd] shadow-md">
                  <QrCodeView
                    value={publicShareUrl}
                    size={170}
                    darkColor="#2b241e"
                    lightColor="#ffffff"
                  />
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#2b241e] font-serif">
                    {draftContent.student?.fullName || 'Rahul Nag V'}
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f0eae1] text-[11px] font-mono text-[#704a29] font-bold">
                    @rahulnagv
                  </div>
                </div>

                {/* URL Copy Bar */}
                <div className="w-full flex items-center gap-2 p-2 rounded-xl bg-[#f0eae1] border border-[#d9cdbd] text-xs font-mono">
                  <span className="truncate flex-1 text-left text-[#704a29] text-[11px] select-all">
                    {publicShareUrl}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyShareUrl}
                    className="px-2.5 py-1 rounded-lg bg-[#704a29] text-white hover:bg-[#593a1f] flex items-center gap-1 font-sans text-xs font-medium cursor-pointer shrink-0 transition"
                  >
                    {copiedQrLink ? (
                      <Check className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedQrLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-[#d9cdbd] bg-[#fbf8f3] flex items-center justify-between gap-3 font-sans">
                <a
                  href={publicShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-[#fffefb] hover:bg-[#f0eae1] border border-[#d9cdbd] text-xs font-medium text-[#2b241e] transition cursor-pointer flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open URL</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowShareQrModal(false)}
                  className="px-4 py-1.5 rounded-lg bg-[#704a29] hover:bg-[#593a1f] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MOBILE STICKY BOTTOM SAVE & ACTION BAR ================= */}
      <aside
        className="md:hidden fixed bottom-0 inset-x-0 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#d9cdbd] px-4 py-2.5 flex items-center justify-between z-40 shadow-lg"
        aria-label="Mobile Save and Action Controls"
      >
        {/* Left Side: Secondary Quick Icons (Discard/Undo & Save Draft + Unsaved indicator) */}
        <div className="flex items-center gap-2">
          {/* Discard / Undo button */}
          <button
            type="button"
            onClick={discardChanges}
            disabled={!isDirty || isSaving || isPublishing}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition cursor-pointer ${
              isDirty && !isSaving && !isPublishing
                ? 'bg-[#fffefb] hover:bg-[#f0eae1] text-[#73685c] hover:text-[#2b241e] border-[#d9cdbd] shadow-2xs'
                : 'bg-[#f5efe6]/50 text-[#b3a89b] border-[#e2d8cb] cursor-not-allowed opacity-50'
            }`}
            title="Discard Unsaved Changes"
            aria-label="Discard changes"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Quick Draft Save / Stash button */}
          <button
            type="button"
            onClick={() => saveDraft()}
            disabled={!isDirty || isSaving || isPublishing}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition cursor-pointer ${
              isSaving
                ? 'bg-[#fef9c3] border-[#fde047] text-[#854d0e]'
                : isDirty
                ? 'bg-[#fffefb] hover:bg-[#f0eae1] text-[#704a29] border-[#d9cdbd] shadow-2xs'
                : 'bg-[#f5efe6]/50 text-[#b3a89b] border-[#e2d8cb] cursor-not-allowed opacity-50'
            }`}
            title="Save Draft (Private)"
            aria-label="Save Draft"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#854d0e]" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#704a29]" />
            )}
          </button>

          {/* Unsaved Changes indicator */}
          {isDirty && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#fef9c3] border border-[#fde047] text-[10px] text-[#854d0e] font-sans font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-pulse" />
              <span>Unsaved</span>
            </div>
          )}
        </div>

        {/* Right Side: Prominent Full-Height Save Changes Button */}
        <button
          type="button"
          onClick={() => publishLive()}
          disabled={isPublishing || isSaving}
          className="h-10 px-5 rounded-xl bg-[#704a29] hover:bg-[#593a1f] active:scale-[0.98] text-[#fffefb] font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition font-sans min-w-[125px] justify-center disabled:opacity-50"
        >
          {isPublishing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </aside>
    </div>
  );
};

export default OwnerDashboard;
