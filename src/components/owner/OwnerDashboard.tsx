import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  UserCheck,
  Palette,
  Briefcase,
  Share2,
  Layers,
  QrCode,
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
  Columns,
  Shield,
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
import { NfcQrModule } from './modules/NfcQrModule';
import { LivePreviewModule } from './modules/LivePreviewModule';
import { SecurityModule } from './modules/SecurityModule';
import { PublicPortfolioView } from '../public/PublicPortfolioView';

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
  } = useOwnerEditor();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [splitPreviewOpen, setSplitPreviewOpen] = useState(false);

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
    { id: 'nfc-qr' as DashboardTab, label: 'NFC & QR Management', icon: QrCode },
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
      <header className="h-16 shrink-0 bg-[#fffefb]/95 backdrop-blur-md border-b border-[#d9cdbd] px-4 sm:px-6 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#f0eae1] text-[#73685c] hover:text-[#2b241e] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#704a29] text-white flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-widest text-[#704a29] uppercase">
                  ANANTA SPARSHA
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#f0eae1] border border-[#d9cdbd] text-[10px] text-[#73685c]">
                  Owner Console
                </span>
              </div>
              <p className="text-[11px] text-[#73685c] hidden sm:block">
                Smart Identity &bull; {CONFIGURED_OWNER_EMAIL}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Publication State */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Status Indicator Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0eae1] border border-[#d9cdbd] text-xs">
            {isDirty ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#d97706] animate-pulse" />
                <span className="text-[#854d0e] font-semibold">Draft Staged</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#16a34a]" />
                <span className="text-[#166534] font-semibold">Live Synced</span>
              </>
            )}
          </div>

          {/* Discard Changes (if dirty) */}
          {isDirty && (
            <button
              onClick={discardChanges}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#f0eae1] hover:bg-[#e5ded5] text-xs text-[#73685c] hover:text-[#2b241e] border border-[#d9cdbd] transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Discard Unsaved Changes"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Discard</span>
            </button>
          )}

          {/* Save Draft Button */}
          <button
            onClick={() => saveDraft()}
            disabled={isSaving}
            className="p-2 sm:px-3.5 sm:py-1.5 rounded-lg bg-[#fffefb] hover:bg-[#f0eae1] text-xs text-[#2b241e] border border-[#d9cdbd] transition flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
            title="Save Draft (Private)"
          >
            <Save className="w-3.5 h-3.5 text-[#704a29]" />
            <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          {/* Publish Live Button */}
          <button
            onClick={() => publishLive()}
            disabled={isPublishing}
            className="px-3.5 sm:px-4 py-1.5 rounded-lg bg-[#704a29] hover:bg-[#593a1f] text-white font-semibold text-xs tracking-wide shadow-xs active:scale-95 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>{isPublishing ? 'Publishing...' : 'Publish Live'}</span>
          </button>

          {/* Toggle Split Preview (Desktop) */}
          <button
            onClick={() => setSplitPreviewOpen(!splitPreviewOpen)}
            className={`hidden xl:flex items-center gap-1.5 p-2 rounded-lg border text-xs transition cursor-pointer shadow-2xs ${
              splitPreviewOpen
                ? 'bg-[#704a29] text-white border-[#704a29] font-semibold'
                : 'bg-[#fffefb] border-[#d9cdbd] text-[#73685c] hover:text-[#2b241e]'
            }`}
            title="Toggle Split Screen Live Preview"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split Preview</span>
          </button>

          {/* View Public Site */}
          <button
            onClick={onNavigatePublic}
            className="p-2 rounded-lg bg-[#fffefb] hover:bg-[#f0eae1] text-[#73685c] hover:text-[#2b241e] border border-[#d9cdbd] transition cursor-pointer shadow-2xs"
            title="View Public Portfolio"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ================= BODY WRAPPER (SIDEBAR IS FIXED, ONLY MAIN SCROLLS) ================= */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* ================= FIXED STATIONARY SIDEBAR ================= */}
        <aside
          className={`h-full shrink-0 bg-[#fffefb] border-r border-[#d9cdbd] flex flex-col justify-between transition-all duration-300 z-30 ${
            mobileMenuOpen
              ? 'fixed inset-y-0 left-0 w-64 shadow-2xl'
              : 'hidden lg:flex'
          } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
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
                    setMobileMenuOpen(false);
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
                  {(!sidebarCollapsed || mobileMenuOpen) && (
                    <span className="truncate tracking-wide">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Controls */}
          <div className="p-4 border-t border-[#d9cdbd] space-y-2 shrink-0 bg-[#fffefb]">
            {/* Collapse / Expand Button (Desktop Only) */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex w-full items-center justify-center p-2 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
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

            {/* Logout Action Button */}
            <button
              onClick={handleLogoutAction}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs text-[#bc473b] hover:bg-[#fef2f2] transition cursor-pointer font-medium"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {(!sidebarCollapsed || mobileMenuOpen) && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-20 bg-black/40 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* ================= PRIMARY CONTENT AREA (ONLY THIS REGION SCROLLS) ================= */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-8 bg-[#fbf8f3]">
          <div className="max-w-5xl mx-auto pb-24">
            {activeTab === 'overview' && <OverviewModule onNavigateTab={setActiveTab} />}
            {activeTab === 'basic-info' && <BasicInfoModule />}
            {activeTab === 'appearance' && <AppearanceModule />}
            {activeTab === 'professional' && <ProfessionalModule />}
            {activeTab === 'social' && <SocialLinksModule />}
            {activeTab === 'sections' && <SectionsModule />}
            {activeTab === 'nfc-qr' && <NfcQrModule />}
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
            <div className="flex-1 overflow-y-auto p-4">
              <div className="w-[390px] mx-auto min-h-[760px] rounded-[36px] border-8 border-[#2b241e] bg-background shadow-xl relative scrollbar-none overflow-y-auto">
                <PublicPortfolioView contentOverride={draftContent} isLivePreview={true} />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
