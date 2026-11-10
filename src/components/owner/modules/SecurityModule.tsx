import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Mail,
  AlertTriangle,
  RefreshCw,
  LogOut,
  CheckCircle2,
  Database,
  Smartphone,
  Eye,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useOwnerEditor } from '../../../context/OwnerEditorContext';
import { CONFIGURED_OWNER_EMAIL } from '../../../lib/firebase';

interface SecurityModuleProps {
  onLogout: () => void;
}

export const SecurityModule: React.FC<SecurityModuleProps> = ({ onLogout }) => {
  const { user, isOwner, sendResetEmail, isFirebaseConnected } = useAuth();
  const { showToast, discardChanges } = useOwnerEditor();

  const [isResetting, setIsResetting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handlePasswordReset = async () => {
    setIsResetting(true);
    try {
      const emailToSend = user?.email || CONFIGURED_OWNER_EMAIL;
      const res = await sendResetEmail(emailToSend);
      if (res.success) {
        setResetSent(true);
        showToast('Password reset link dispatched to your owner inbox.', 'success');
      } else {
        showToast(res.error || 'Failed to dispatch password reset link.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error triggering reset.', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const handleClearLocalDrafts = () => {
    discardChanges();
    try {
      localStorage.removeItem('ananta_sparsha_draft_content');
      showToast('Local offline drafts cleared.', 'info');
    } catch { }
  };

  return (
    <div className="space-y-8 max-w-4xl font-serif">
      {/* Module Title */}
      <div>
        <h2 className="text-xl font-bold text-[#2b241e] tracking-tight">
          Security, Access Control & Session Governance
        </h2>
        <p className="text-xs text-[#73685c] mt-1">
          Review cryptographic access controls, database security enforcement, active credentials, and session management.
        </p>
      </div>

      {/* Security Architecture Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Allowlist & Owner Auth */}
        <div className="p-5 rounded-2xl bg-[#fffefb] border border-[#d9cdbd] space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="w-9 h-9 rounded-xl bg-[#f0eae1] border border-[#d9cdbd] flex items-center justify-center text-[#704a29]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#f2f8f2] border border-[#86efac] text-[10px] text-[#166534] font-bold">
              Active & Enforced
            </span>
          </div>

          <h3 className="text-sm font-bold text-[#2b241e]">Owner Allowlist Enforcement</h3>
          <p className="text-xs text-[#73685c] leading-relaxed">
            Only explicit allowlisted identity <code className="text-[#704a29] font-bold text-[11px]">{CONFIGURED_OWNER_EMAIL}</code> can authenticate and access dashboard controls.
          </p>

          <div className="pt-2 border-t border-[#d9cdbd] text-[11px] text-[#73685c]">
            UID / Role: <span className="text-[#2b241e] font-semibold">{user?.uid || 'Verified Ananta Owner'}</span>
          </div>
        </div>

        {/* Database Security Rules */}
        <div className="p-5 rounded-2xl bg-[#fffefb] border border-[#d9cdbd] space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="w-9 h-9 rounded-xl bg-[#f0eae1] border border-[#d9cdbd] flex items-center justify-center text-[#704a29]">
              <Database className="w-5 h-5" />
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#f2f8f2] border border-[#86efac] text-[10px] text-[#166534] font-bold">
              Firestore Hardened
            </span>
          </div>

          <h3 className="text-sm font-bold text-[#2b241e]">Cloud Firestore Security Rules</h3>
          <p className="text-xs text-[#73685c] leading-relaxed">
            Public clients are granted read-only access to published profiles. Private drafts and mutations strictly require cryptographic owner verification.
          </p>

          <div className="pt-2 border-t border-[#d9cdbd] text-[11px] text-[#73685c]">
            Storage & Subcollections: <span className="text-[#166534] font-semibold">Protected (&lt; 1MB Bound)</span>
          </div>
        </div>
      </div>

      {/* Account Password Reset Card */}
      <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 space-y-4 shadow-2xs">
        <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#704a29]" />
          Master Credential Management
        </h3>
        <p className="text-xs text-[#73685c] max-w-xl">
          Request a secure password reset link sent to your registered email address ({CONFIGURED_OWNER_EMAIL}).
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handlePasswordReset}
            disabled={isResetting}
            className="px-4 py-2.5 rounded-xl bg-[#f0eae1] hover:bg-[#e5ded5] border border-[#d9cdbd] text-xs font-semibold text-[#2b241e] flex items-center gap-2 transition cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <Mail className="w-4 h-4 text-[#704a29]" />
            <span>{isResetting ? 'Dispatching...' : 'Dispatch Password Reset Link'}</span>
          </button>
          {resetSent && (
            <span className="text-xs text-[#166534] flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Reset email dispatched!
            </span>
          )}
        </div>
      </div>

      {/* Cache & Maintenance */}
      <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 space-y-4 shadow-2xs">
        <h3 className="text-xs uppercase tracking-wider text-[#73685c] font-bold flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#704a29]" />
          Local Drafts & Session Purge
        </h3>
        <p className="text-xs text-[#73685c]">
          Discard local browser working drafts and force synchronization with the last published live version.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleClearLocalDrafts}
            className="px-4 py-2 rounded-xl bg-[#f0eae1] hover:bg-[#e5ded5] border border-[#d9cdbd] text-xs text-[#73685c] hover:text-[#2b241e] transition cursor-pointer shadow-2xs"
          >
            Clear Local Draft Cache
          </button>
        </div>
      </div>

      {/* Sign Out Action Card */}
      <div className="p-6 rounded-2xl bg-[#fef2f2] border border-[#fca5a5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h4 className="text-sm font-bold text-[#991b1b]">Terminate Active Owner Session</h4>
          <p className="text-xs text-[#991b1b]/80 mt-0.5">
            Logs out this device and revokes cryptographic session keys.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-[#bc473b] hover:bg-[#991b1b] text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default SecurityModule;
