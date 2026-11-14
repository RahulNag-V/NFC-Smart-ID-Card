import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  EyeOff,
  Clock,
  ArrowRight,
  Shield,
  Loader2,
  X,
  Phone,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useOwnerEditor } from '../../../context/OwnerEditorContext';
import { CONFIGURED_OWNER_EMAIL } from '../../../lib/firebase';
import { validatePassword, maskPhoneNumber, normalizePhoneNumber } from '../../../lib/passwordValidator';

interface SecurityModuleProps {
  onLogout: () => void;
}

export const SecurityModule: React.FC<SecurityModuleProps> = ({ onLogout }) => {
  const {
    user,
    isOwner,
    sendResetEmail,
    registeredPhone,
    isPhoneVerified,
    lastPasswordChange,
    sendPhoneVerificationOtp,
    verifyPhoneOtpAndLink,
    changePasswordWithPhoneOtp,
    updateOwnerPhoneNumber,
  } = useAuth();
  const { showToast, discardChanges } = useOwnerEditor();

  // Modal Visibility States
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showPhoneUpdateModal, setShowPhoneUpdateModal] = useState<boolean>(false);
  const [showPhoneVerifyModal, setShowPhoneVerifyModal] = useState<boolean>(false);

  // Email Reset State
  const [isResettingEmail, setIsResettingEmail] = useState<boolean>(false);
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);

  // ================= PASSWORD CHANGE MODAL STATE =================
  const [pwStep, setPwStep] = useState<'otp' | 'new-password' | 'success'>('otp');
  const [pwOtpCode, setPwOtpCode] = useState<string>('');
  const [pwConfirmationResult, setPwConfirmationResult] = useState<any>(null);
  const [isSendingPwOtp, setIsSendingPwOtp] = useState<boolean>(false);
  const [isVerifyingPwOtp, setIsVerifyingPwOtp] = useState<boolean>(false);
  const [pwCooldown, setPwCooldown] = useState<number>(0);
  const [pwError, setPwError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSavingPassword, setIsSavingPassword] = useState<boolean>(false);

  const passwordVal = validatePassword(newPassword, confirmPassword);

  // ================= UPDATE PHONE MODAL STATE =================
  const [updatePhoneStep, setUpdatePhoneStep] = useState<'input' | 'otp' | 'success'>('input');
  const [newPhoneInput, setNewPhoneInput] = useState<string>('+91 ');
  const [updateOtpCode, setUpdateOtpCode] = useState<string>('');
  const [updateConfirmationResult, setUpdateConfirmationResult] = useState<any>(null);
  const [isSendingUpdateOtp, setIsSendingUpdateOtp] = useState<boolean>(false);
  const [isVerifyingUpdateOtp, setIsVerifyingUpdateOtp] = useState<boolean>(false);
  const [updateCooldown, setUpdateCooldown] = useState<number>(0);
  const [updatePhoneError, setUpdatePhoneError] = useState<string | null>(null);

  // Cooldown timers
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (pwCooldown > 0) {
      timer = setInterval(() => setPwCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [pwCooldown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (updateCooldown > 0) {
      timer = setInterval(() => setUpdateCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [updateCooldown]);

  // ================= HANDLERS =================

  // 1. Password Reset Link via Email
  const handleEmailPasswordReset = async () => {
    setIsResettingEmail(true);
    try {
      const emailToSend = user?.email || CONFIGURED_OWNER_EMAIL;
      const res = await sendResetEmail(emailToSend);
      if (res.success) {
        setResetEmailSent(true);
        showToast('Password reset link dispatched to your owner inbox.', 'success');
      } else {
        showToast(res.error || 'Failed to dispatch password reset link.', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error triggering reset.', 'error');
    } finally {
      setIsResettingEmail(false);
    }
  };

  // 2. Open Change Password Flow
  const handleOpenChangePassword = async () => {
    setPwStep('otp');
    setPwOtpCode('');
    setPwError(null);
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordModal(true);
    // Auto-send OTP to registered phone
    await handleSendPasswordOtp();
  };

  const handleSendPasswordOtp = async () => {
    if (pwCooldown > 0 || isSendingPwOtp) return;
    setIsSendingPwOtp(true);
    setPwError(null);

    try {
      const res = await sendPhoneVerificationOtp(registeredPhone, 'recaptcha-pw-container');
      if (res.success && res.confirmationResult) {
        setPwConfirmationResult(res.confirmationResult);
        setPwCooldown(60);
        showToast('6-digit security code sent to ' + maskPhoneNumber(registeredPhone), 'info');
      } else {
        setPwError(res.error || 'Failed to dispatch OTP. Please retry.');
      }
    } catch (err: any) {
      setPwError(err?.message || 'Network error dispatching OTP.');
    } finally {
      setIsSendingPwOtp(false);
    }
  };

  const handleVerifyPwOtpAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwOtpCode || pwOtpCode.trim().length !== 6) {
      setPwError('Please enter the complete 6-digit confirmation code.');
      return;
    }
    setIsVerifyingPwOtp(true);
    setPwError(null);

    try {
      // Test verify confirmation code
      await pwConfirmationResult.confirm(pwOtpCode.trim());
      setPwStep('new-password');
    } catch (err: any) {
      if (err.code === 'auth/invalid-verification-code') {
        setPwError('Incorrect verification code. Please check your SMS and retry.');
      } else if (err.code === 'auth/code-expired') {
        setPwError('Verification code has expired. Please request a new OTP.');
      } else {
        setPwError(err?.message || 'Verification failed. Please retry.');
      }
    } finally {
      setIsVerifyingPwOtp(false);
    }
  };

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordVal.isValid) {
      setPwError('Please satisfy all 5 password complexity criteria.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match. Please verify.');
      return;
    }

    setIsSavingPassword(true);
    setPwError(null);

    try {
      const res = await changePasswordWithPhoneOtp(pwConfirmationResult, pwOtpCode, newPassword);
      if (res.success) {
        setPwStep('success');
        showToast('Password changed successfully! Keep your credentials safe.', 'success');
      } else {
        setPwError(res.error || 'Failed to update password.');
      }
    } catch (err: any) {
      setPwError(err?.message || 'An unexpected error occurred updating password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  // 3. Open Update Phone Number Flow
  const handleOpenUpdatePhone = () => {
    setUpdatePhoneStep('input');
    setNewPhoneInput('+91 ');
    setUpdateOtpCode('');
    setUpdatePhoneError(null);
    setShowPhoneUpdateModal(true);
  };

  const handleSendUpdatePhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizePhoneNumber(newPhoneInput);
    if (clean.length < 10) {
      setUpdatePhoneError('Please enter a valid international phone number (+91...).');
      return;
    }

    setIsSendingUpdateOtp(true);
    setUpdatePhoneError(null);

    try {
      const res = await sendPhoneVerificationOtp(clean, 'recaptcha-update-container');
      if (res.success && res.confirmationResult) {
        setUpdateConfirmationResult(res.confirmationResult);
        setUpdatePhoneStep('otp');
        setUpdateCooldown(60);
        showToast('OTP sent to ' + clean, 'info');
      } else {
        setUpdatePhoneError(res.error || 'Failed to dispatch OTP to new phone number.');
      }
    } catch (err: any) {
      setUpdatePhoneError(err?.message || 'Error dispatching OTP.');
    } finally {
      setIsSendingUpdateOtp(false);
    }
  };

  const handleVerifyNewPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateOtpCode || updateOtpCode.trim().length !== 6) {
      setUpdatePhoneError('Please enter the 6-digit confirmation code.');
      return;
    }

    setIsVerifyingUpdateOtp(true);
    setUpdatePhoneError(null);

    try {
      const clean = normalizePhoneNumber(newPhoneInput);
      const res = await updateOwnerPhoneNumber(updateConfirmationResult, updateOtpCode, clean);
      if (res.success) {
        setUpdatePhoneStep('success');
        showToast('Phone number successfully updated and linked!', 'success');
      } else {
        setUpdatePhoneError(res.error || 'Phone update failed.');
      }
    } catch (err: any) {
      setUpdatePhoneError(err?.message || 'Failed to confirm new phone number.');
    } finally {
      setIsVerifyingUpdateOtp(false);
    }
  };

  // 4. Quick Verify Current Registered Phone
  const handleQuickVerifyPhone = async () => {
    setShowPhoneVerifyModal(true);
    setPwOtpCode('');
    setPwError(null);
    setIsSendingPwOtp(true);
    try {
      const res = await sendPhoneVerificationOtp(registeredPhone, 'recaptcha-verify-phone-container');
      if (res.success && res.confirmationResult) {
        setPwConfirmationResult(res.confirmationResult);
        setPwCooldown(60);
        showToast('Verification code sent to ' + registeredPhone, 'info');
      } else {
        setPwError(res.error || 'Failed to send OTP.');
      }
    } catch (err: any) {
      setPwError(err?.message || 'Error triggering phone OTP.');
    } finally {
      setIsSendingPwOtp(false);
    }
  };

  const handleConfirmQuickVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwOtpCode || pwOtpCode.trim().length !== 6) {
      setPwError('Please enter the 6-digit verification code.');
      return;
    }
    setIsVerifyingPwOtp(true);
    setPwError(null);

    try {
      const res = await verifyPhoneOtpAndLink(pwConfirmationResult, pwOtpCode);
      if (res.success) {
        setShowPhoneVerifyModal(false);
        showToast('Phone number verified and linked to owner account!', 'success');
      } else {
        setPwError(res.error || 'Verification failed.');
      }
    } catch (err: any) {
      setPwError(err?.message || 'Error verifying phone.');
    } finally {
      setIsVerifyingPwOtp(false);
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
      {/* Invisible reCAPTCHA Mount Nodes */}
      <div id="recaptcha-pw-container" className="hidden" />
      <div id="recaptcha-update-container" className="hidden" />
      <div id="recaptcha-verify-phone-container" className="hidden" />

      {/* Module Title */}
      <div>
        <h2 className="text-xl font-bold text-[#2b241e] tracking-tight">
          Account Security &amp; Credentials Governance
        </h2>
        <p className="text-xs text-[#73685c] mt-1">
          Review cryptographic access controls, phone authentication verification, password management, and active session governance.
        </p>
      </div>

      {/* ================= PRIMARY SECTION 1: ACCOUNT SECURITY ================= */}
      <section aria-labelledby="section-account-security" className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-4 sm:p-6 lg:p-8 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d9cdbd]">
          <div>
            <h3 id="section-account-security" className="text-base font-bold text-[#2b241e] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#704a29]" />
              Account Security
            </h3>
            <p className="text-xs text-[#73685c] mt-0.5">
              Verified single-owner credentials for private identity management.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#f2f8f2] border border-[#86efac] text-xs font-semibold text-[#166534] flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner Authorized</span>
            </span>
          </div>
        </div>

        {/* Identity Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Registered Email Card */}
          <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#73685c] font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#704a29]" />
                Registered Email Address
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f2f8f2] text-[#166534] font-bold border border-[#86efac]">
                Primary Login
              </span>
            </div>
            <p className="text-sm font-bold text-[#2b241e] font-mono break-all">
              {user?.email || CONFIGURED_OWNER_EMAIL}
            </p>
            <p className="text-[11px] text-[#73685c]">
              Authorized allowlist account bound to Ananta Sparsha administration.
            </p>
          </div>

          {/* Registered Phone Card */}
          <div className="p-4 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#73685c] font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#704a29]" />
                Registered Phone Number
              </span>
              {isPhoneVerified ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f2f8f2] text-[#166534] font-bold border border-[#86efac] flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Verified &amp; Linked
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#fef9c3] text-[#854d0e] font-bold border border-[#fde047] flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Verification Pending
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-[#2b241e] font-mono">
              {registeredPhone}
            </p>
            <div className="flex items-center gap-2 pt-1">
              {!isPhoneVerified ? (
                <button
                  type="button"
                  onClick={handleQuickVerifyPhone}
                  className="text-[11px] text-[#704a29] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Verify Phone Number (OTP)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenUpdatePhone}
                  className="text-[11px] text-[#704a29] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Update Phone Number</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Security Info & Recent Activity */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#f0eae1]/50 border border-[#d9cdbd] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#73685c] min-w-0">
            <Clock className="w-4 h-4 text-[#704a29] shrink-0" />
            <span className="break-words">
              Last password change:{' '}
              <strong className="text-[#2b241e]">
                {lastPasswordChange
                  ? new Date(lastPasswordChange).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'Default Provisioned Master Key'}
              </strong>
            </span>
          </div>

          <div className="text-[11px] font-mono text-[#73685c] shrink-0">
            UID: <span className="text-[#2b241e] font-semibold">{user?.uid || 'local-owner'}</span>
          </div>
        </div>

        {/* Primary Security Actions Toolbar */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
          {/* Change Password (OTP-Gated) */}
          <button
            type="button"
            onClick={handleOpenChangePassword}
            className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
          >
            <KeyRound className="w-4 h-4 shrink-0" />
            <span>Change Master Password</span>
          </button>

          {/* Update Phone Number */}
          <button
            type="button"
            onClick={handleOpenUpdatePhone}
            className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-[#fffefb] hover:bg-[#f0eae1] border border-[#d9cdbd] text-[#2b241e] text-xs font-semibold flex items-center gap-2 shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-[#704a29] shrink-0" />
            <span>Update Phone Number</span>
          </button>

          {/* Dispatch Email Reset Link */}
          <button
            type="button"
            onClick={handleEmailPasswordReset}
            disabled={isResettingEmail}
            className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-[#fffefb] hover:bg-[#f0eae1] border border-[#d9cdbd] text-[#73685c] hover:text-[#2b241e] text-xs font-medium flex items-center gap-2 shadow-2xs transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Mail className="w-4 h-4 text-[#704a29] shrink-0" />
            <span>{isResettingEmail ? 'Dispatching...' : 'Dispatch Email Reset Link'}</span>
          </button>
        </div>
      </section>

      {/* Security Architecture Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Allowlist & Owner Auth */}
        <div className="p-5 rounded-2xl bg-[#fffefb] border border-[#d9cdbd] space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="w-9 h-9 rounded-xl bg-[#f0eae1] border border-[#d9cdbd] flex items-center justify-center text-[#704a29]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#f2f8f2] border border-[#86efac] text-[10px] text-[#166534] font-bold">
              Active &amp; Enforced
            </span>
          </div>

          <h3 className="text-sm font-bold text-[#2b241e]">Cryptographic Role Governance</h3>
          <p className="text-xs text-[#73685c] leading-relaxed">
            Multi-factor phone verification and allowlist identity matching guarantee only authorized administrator edits profile data.
          </p>

          <div className="pt-2 border-t border-[#d9cdbd] text-[11px] text-[#73685c]">
            Authentication: <span className="text-[#2b241e] font-semibold">Firebase Phone &amp; Email Provider</span>
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
            Public clients are granted read-only access to published profiles. Private drafts and mutations strictly require owner verification.
          </p>

          <div className="pt-2 border-t border-[#d9cdbd] text-[11px] text-[#73685c]">
            Storage &amp; Subcollections: <span className="text-[#166534] font-semibold">Protected (&lt; 1MB Bound)</span>
          </div>
        </div>
      </div>

      {/* Cache & Maintenance */}
      <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] p-6 sm:p-8 space-y-4 shadow-2xs">
        <h3 className="text-xs uppercase tracking-wider text-[#704a29] font-bold flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#704a29]" />
          Local Drafts &amp; Session Purge
        </h3>
        <p className="text-xs text-[#73685c]">
          Discard local browser working drafts and force synchronization with the last published live version.
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
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
          type="button"
          onClick={onLogout}
          className="px-4 py-2 rounded-xl bg-[#bc473b] hover:bg-[#991b1b] text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-xs active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of Dashboard</span>
        </button>
      </div>

      {/* ================= MODAL 1: CHANGE PASSWORD (OTP GATED) ================= */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-[#fffefb] border border-[#d9cdbd] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#704a29] font-bold">
                  Multi-Factor Credential Protection
                </span>
                <h3 className="text-xl font-bold text-[#2b241e] mt-0.5">
                  Change Master Password
                </h3>
                <p className="text-xs text-[#73685c] mt-1">
                  {pwStep === 'otp' && 'Step 1 of 2: Verify your registered phone number via OTP.'}
                  {pwStep === 'new-password' && 'Step 2 of 2: Enter and confirm your new high-security password.'}
                  {pwStep === 'success' && 'Password updated successfully.'}
                </p>
              </div>

              {pwError && (
                <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fca5a5] text-xs text-[#991b1b] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{pwError}</span>
                </div>
              )}

              {/* STEP 1: OTP VERIFICATION */}
              {pwStep === 'otp' && (
                <form onSubmit={handleVerifyPwOtpAndProceed} className="space-y-4">
                  <div className="p-3 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs space-y-1">
                    <p className="text-[#73685c]">
                      A 6-digit confirmation code is sent to:
                    </p>
                    <p className="font-bold text-[#2b241e] font-mono text-sm">
                      {registeredPhone}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2b241e] mb-1.5">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      placeholder="123456"
                      value={pwOtpCode}
                      onChange={(e) => setPwOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 text-center text-lg font-mono tracking-widest rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={handleSendPasswordOtp}
                      disabled={pwCooldown > 0 || isSendingPwOtp}
                      className="text-[#704a29] font-bold hover:underline disabled:opacity-50 cursor-pointer"
                    >
                      {isSendingPwOtp ? (
                        'Sending OTP...'
                      ) : pwCooldown > 0 ? (
                        `Resend code in ${pwCooldown}s`
                      ) : (
                        'Resend OTP Code'
                      )}
                    </button>
                    <span className="text-[11px] text-[#73685c]">Firebase Phone Auth</span>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-[#73685c] hover:bg-[#f0eae1] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={pwOtpCode.length !== 6 || isVerifyingPwOtp}
                      className="px-4 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      {isVerifyingPwOtp ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify &amp; Continue</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: ENTER NEW PASSWORD */}
              {pwStep === 'new-password' && (
                <form onSubmit={handleSubmitNewPassword} className="space-y-4">
                  <div className="p-2.5 rounded-xl bg-[#f2f8f2] border border-[#86efac] text-xs text-[#166534] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16a34a]" />
                    <span>Phone verified with Firebase. Enter your new password below.</span>
                  </div>

                  {/* New Password Field */}
                  <div>
                    <label className="block text-xs font-bold text-[#2b241e] mb-1">
                      New Master Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 12 characters..."
                        required
                        className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#73685c] hover:text-[#2b241e] cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Meter */}
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-[#73685c]">Password Strength:</span>
                        <span
                          className={`font-bold ${
                            passwordVal.score === 4
                              ? 'text-[#16a34a]'
                              : passwordVal.score >= 2
                              ? 'text-[#d97706]'
                              : 'text-[#dc2626]'
                          }`}
                        >
                          {passwordVal.strengthLabel}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#e5ded5] rounded-full overflow-hidden flex gap-0.5">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordVal.score === 0
                              ? 'w-0'
                              : passwordVal.score === 1
                              ? 'w-1/4 bg-[#dc2626]'
                              : passwordVal.score === 2
                              ? 'w-2/4 bg-[#ea580c]'
                              : passwordVal.score === 3
                              ? 'w-3/4 bg-[#d97706]'
                              : 'w-full bg-[#16a34a]'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Checklist of 5 Requirements */}
                    <div className="grid grid-cols-2 gap-1.5 mt-2.5 text-[10px]">
                      <div className={`flex items-center gap-1 ${passwordVal.hasMinLength ? 'text-[#166534]' : 'text-[#73685c]'}`}>
                        {passwordVal.hasMinLength ? <Check className="w-3 h-3 text-[#16a34a]" /> : <span className="w-3 h-3 text-center">&bull;</span>}
                        <span>12+ characters</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordVal.hasUpperCase ? 'text-[#166534]' : 'text-[#73685c]'}`}>
                        {passwordVal.hasUpperCase ? <Check className="w-3 h-3 text-[#16a34a]" /> : <span className="w-3 h-3 text-center">&bull;</span>}
                        <span>1+ uppercase letter</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordVal.hasLowerCase ? 'text-[#166534]' : 'text-[#73685c]'}`}>
                        {passwordVal.hasLowerCase ? <Check className="w-3 h-3 text-[#16a34a]" /> : <span className="w-3 h-3 text-center">&bull;</span>}
                        <span>1+ lowercase letter</span>
                      </div>
                      <div className={`flex items-center gap-1 ${passwordVal.hasNumber ? 'text-[#166534]' : 'text-[#73685c]'}`}>
                        {passwordVal.hasNumber ? <Check className="w-3 h-3 text-[#16a34a]" /> : <span className="w-3 h-3 text-center">&bull;</span>}
                        <span>1+ number (0-9)</span>
                      </div>
                      <div className={`flex items-center gap-1 col-span-2 ${passwordVal.hasSpecialChar ? 'text-[#166534]' : 'text-[#73685c]'}`}>
                        {passwordVal.hasSpecialChar ? <Check className="w-3 h-3 text-[#16a34a]" /> : <span className="w-3 h-3 text-center">&bull;</span>}
                        <span>1+ special character (!@#$%^&amp;*...)</span>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-xs font-bold text-[#2b241e] mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password..."
                        required
                        className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#73685c] hover:text-[#2b241e] cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && (
                      <p
                        className={`text-[10px] mt-1 flex items-center gap-1 ${
                          newPassword === confirmPassword ? 'text-[#166534]' : 'text-[#dc2626]'
                        }`}
                      >
                        {newPassword === confirmPassword ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Passwords match</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            <span>Passwords do not match</span>
                          </>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-[#73685c] hover:bg-[#f0eae1] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!passwordVal.isValid || isSavingPassword}
                      className="px-4 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      {isSavingPassword ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating Firebase Auth...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Save New Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: SUCCESS CONFIRMATION */}
              {pwStep === 'success' && (
                <div className="py-4 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#f2f8f2] border border-[#86efac] text-[#16a34a] flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#2b241e]">Password Successfully Changed!</h4>
                    <p className="text-xs text-[#73685c] mt-1 max-w-xs mx-auto leading-relaxed">
                      Your master credentials have been updated in Firebase Authentication. Your active session is secure.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    Return to Security Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 2: UPDATE PHONE NUMBER ================= */}
      <AnimatePresence>
        {showPhoneUpdateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-[#fffefb] border border-[#d9cdbd] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowPhoneUpdateModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#704a29] font-bold">
                  Owner Multi-Factor Device
                </span>
                <h3 className="text-xl font-bold text-[#2b241e] mt-0.5">
                  Update Registered Phone Number
                </h3>
                <p className="text-xs text-[#73685c] mt-1">
                  Updates the multi-factor recovery phone number on your existing owner account.
                </p>
              </div>

              {updatePhoneError && (
                <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fca5a5] text-xs text-[#991b1b] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{updatePhoneError}</span>
                </div>
              )}

              {updatePhoneStep === 'input' && (
                <form onSubmit={handleSendUpdatePhoneOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2b241e] mb-1">
                      New Phone Number (E.164 International Format)
                    </label>
                    <input
                      type="tel"
                      value={newPhoneInput}
                      onChange={(e) => setNewPhoneInput(e.target.value)}
                      placeholder="+91 98446 16699"
                      required
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    />
                    <p className="text-[10px] text-[#73685c] mt-1">
                      Include country code (e.g. +91 for India, +1 for USA). An SMS OTP will be dispatched.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPhoneUpdateModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-[#73685c] hover:bg-[#f0eae1] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSendingUpdateOtp}
                      className="px-4 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      {isSendingUpdateOtp ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Dispatching OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Verification OTP</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {updatePhoneStep === 'otp' && (
                <form onSubmit={handleVerifyNewPhone} className="space-y-4">
                  <div className="p-3 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs">
                    <span className="text-[#73685c]">Enter the 6-digit confirmation code sent to: </span>
                    <strong className="text-[#2b241e] font-mono">{newPhoneInput}</strong>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2b241e] mb-1">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      placeholder="123456"
                      value={updateOtpCode}
                      onChange={(e) => setUpdateOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 text-center text-lg font-mono tracking-widest rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                      required
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setUpdatePhoneStep('input')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-[#73685c] hover:bg-[#f0eae1] transition cursor-pointer"
                    >
                      Change Number
                    </button>
                    <button
                      type="submit"
                      disabled={updateOtpCode.length !== 6 || isVerifyingUpdateOtp}
                      className="px-4 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      {isVerifyingUpdateOtp ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm &amp; Link</span>
                          <Check className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {updatePhoneStep === 'success' && (
                <div className="py-4 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#f2f8f2] border border-[#86efac] text-[#16a34a] flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#2b241e]">Phone Number Updated!</h4>
                    <p className="text-xs text-[#73685c] mt-1 max-w-xs mx-auto leading-relaxed">
                      Your registered phone number is now linked to your owner account. Your UID and access permissions are preserved.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPhoneUpdateModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#704a29] hover:bg-[#593a1f] text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 3: QUICK PHONE VERIFICATION ================= */}
      <AnimatePresence>
        {showPhoneVerifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-[#fffefb] border border-[#d9cdbd] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowPhoneVerifyModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#704a29] font-bold">
                  Device Authentication
                </span>
                <h3 className="text-xl font-bold text-[#2b241e] mt-0.5">
                  Verify Registered Phone Number
                </h3>
                <p className="text-xs text-[#73685c] mt-1">
                  Enter the 6-digit verification code dispatched to your registered device.
                </p>
              </div>

              {pwError && (
                <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fca5a5] text-xs text-[#991b1b] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{pwError}</span>
                </div>
              )}

              <form onSubmit={handleConfirmQuickVerify} className="space-y-4">
                <div className="p-3 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs">
                  <span className="text-[#73685c]">Registered phone: </span>
                  <strong className="text-[#2b241e] font-mono">{registeredPhone}</strong>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2b241e] mb-1">
                    6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    placeholder="123456"
                    value={pwOtpCode}
                    onChange={(e) => setPwOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2.5 text-center text-lg font-mono tracking-widest rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPhoneVerifyModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#73685c] hover:bg-[#f0eae1] transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pwOtpCode.length !== 6 || isVerifyingPwOtp}
                    className="px-4 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    {isVerifyingPwOtp ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm &amp; Link</span>
                        <Check className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecurityModule;
