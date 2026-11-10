import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Loader2,
  Shield,
  Phone,
  Smartphone,
  Check,
  X,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CONFIGURED_OWNER_EMAIL, CONFIGURED_OWNER_PHONE } from '../../lib/firebase';
import { validatePassword, maskPhoneNumber, normalizePhoneNumber } from '../../lib/passwordValidator';

interface OwnerLoginProps {
  onLoginSuccess: () => void;
  onNavigatePublic: () => void;
}

export const OwnerLogin: React.FC<OwnerLoginProps> = ({ onLoginSuccess, onNavigatePublic }) => {
  const {
    login,
    sendResetEmail,
    lockoutRemaining,
    isOwner,
    registeredPhone,
    sendPhoneVerificationOtp,
    recoverPasswordWithPhoneOtp,
  } = useAuth();

  const [email, setEmail] = useState<string>(CONFIGURED_OWNER_EMAIL);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Recovery Modal State
  const [showRecoveryModal, setShowRecoveryModal] = useState<boolean>(false);
  const [recoveryMethod, setRecoveryMethod] = useState<'menu' | 'email' | 'phone'>('menu');
  const [recoveryPhoneInput, setRecoveryPhoneInput] = useState<string>(registeredPhone || CONFIGURED_OWNER_PHONE);
  const [recoveryStep, setRecoveryStep] = useState<'input' | 'otp' | 'new-password' | 'success'>('input');
  const [recoveryOtp, setRecoveryOtp] = useState<string>('');
  const [recoveryConfirmation, setRecoveryConfirmation] = useState<any>(null);
  const [recoveryNewPass, setRecoveryNewPass] = useState<string>('');
  const [recoveryConfirmPass, setRecoveryConfirmPass] = useState<string>('');
  const [showRecoveryNewPass, setShowRecoveryNewPass] = useState<boolean>(false);
  const [isDispatchingRecovery, setIsDispatchingRecovery] = useState<boolean>(false);
  const [recoveryCooldown, setRecoveryCooldown] = useState<number>(0);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  const recoveryPassVal = validatePassword(recoveryNewPass, recoveryConfirmPass);

  // Cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (recoveryCooldown > 0) {
      timer = setInterval(() => setRecoveryCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [recoveryCooldown]);

  // If already logged in as owner, immediately redirect
  useEffect(() => {
    if (isOwner) {
      onLoginSuccess();
    }
  }, [isOwner, onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your authorized owner email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        onLoginSuccess();
      } else {
        let msg = res.error || 'Authentication failed. Please verify credentials.';
        if (msg.includes('configuration-not-found') || msg.includes('auth/configuration-not-found')) {
          msg = 'Firebase Authentication has not been enabled in the Firebase Console. Please enable Email/Password under Authentication > Sign-in method in Firebase Console.';
        }
        setErrorMessage(msg);
      }
    } catch (err: any) {
      let msg = err?.message || 'An unexpected error occurred during authentication.';
      if (msg.includes('configuration-not-found')) {
        msg = 'Firebase Authentication has not been enabled in the Firebase Console. Please enable Email/Password under Authentication > Sign-in method in Firebase Console.';
      }
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenRecovery = () => {
    setRecoveryMethod('menu');
    setRecoveryStep('input');
    setRecoveryError(null);
    setRecoveryOtp('');
    setRecoveryNewPass('');
    setRecoveryConfirmPass('');
    setShowRecoveryModal(true);
  };

  const handleEmailRecovery = async () => {
    setIsDispatchingRecovery(true);
    setRecoveryError(null);
    try {
      const res = await sendResetEmail(email.trim() || CONFIGURED_OWNER_EMAIL);
      if (res.success) {
        setRecoveryStep('success');
      } else {
        setRecoveryError(res.error || 'Failed to dispatch password reset email.');
      }
    } catch (err: any) {
      setRecoveryError(err?.message || 'Failed to send recovery email.');
    } finally {
      setIsDispatchingRecovery(false);
    }
  };

  const handleSendPhoneRecoveryOtp = async () => {
    const cleanInput = normalizePhoneNumber(recoveryPhoneInput);
    const cleanRegistered = normalizePhoneNumber(registeredPhone || CONFIGURED_OWNER_PHONE);

    if (cleanInput !== cleanRegistered) {
      setRecoveryError('This phone number is not linked to the authorized owner account.');
      return;
    }

    setIsDispatchingRecovery(true);
    setRecoveryError(null);

    try {
      const res = await sendPhoneVerificationOtp(cleanInput, 'recaptcha-login-recovery-container');
      if (res.success && res.confirmationResult) {
        setRecoveryConfirmation(res.confirmationResult);
        setRecoveryStep('otp');
        setRecoveryCooldown(60);
      } else {
        setRecoveryError(res.error || 'Failed to dispatch recovery OTP.');
      }
    } catch (err: any) {
      setRecoveryError(err?.message || 'Error requesting phone verification.');
    } finally {
      setIsDispatchingRecovery(false);
    }
  };

  const handleVerifyRecoveryOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryOtp || recoveryOtp.trim().length !== 6) {
      setRecoveryError('Please enter the complete 6-digit confirmation code.');
      return;
    }
    setIsDispatchingRecovery(true);
    setRecoveryError(null);

    try {
      await recoveryConfirmation.confirm(recoveryOtp.trim());
      setRecoveryStep('new-password');
    } catch (err: any) {
      if (err.code === 'auth/invalid-verification-code') {
        setRecoveryError('Incorrect OTP code. Please check your SMS and retry.');
      } else if (err.code === 'auth/code-expired') {
        setRecoveryError('Verification code expired. Please request a new OTP.');
      } else {
        setRecoveryError(err?.message || 'Verification failed. Please retry.');
      }
    } finally {
      setIsDispatchingRecovery(false);
    }
  };

  const handleFinishPhoneRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryPassVal.isValid) {
      setRecoveryError('Please satisfy all password criteria.');
      return;
    }

    setIsDispatchingRecovery(true);
    setRecoveryError(null);

    try {
      const res = await recoverPasswordWithPhoneOtp(recoveryConfirmation, recoveryOtp, recoveryNewPass);
      if (res.success) {
        setShowRecoveryModal(false);
        onLoginSuccess();
      } else {
        setRecoveryError(res.error || 'Password update failed.');
      }
    } catch (err: any) {
      setRecoveryError(err?.message || 'Failed to complete recovery.');
    } finally {
      setIsDispatchingRecovery(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf8f3] text-[#2b241e] flex flex-col items-center justify-center p-4 relative overflow-hidden font-serif selection:bg-[#704a29]/20">
      {/* Invisible reCAPTCHA container for login page */}
      <div id="recaptcha-login-recovery-container" className="hidden" />

      {/* Background Ambience with subtle watermark */}
      <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-10">
        <svg viewBox="0 0 500 120" className="w-full max-w-2xl h-auto">
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#704a29"
            style={{
              fontFamily: '"Times New Roman", Times, "Tinos", Georgia, serif',
              fontWeight: 900,
              fontSize: '48px',
              letterSpacing: '12px',
            }}
          >
            ANANTA SPARSHA
          </text>
        </svg>
      </div>

      {/* Public Site Back Link */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={onNavigatePublic}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#fffefb] border border-[#d9cdbd] hover:border-[#704a29] text-xs font-semibold text-[#2b241e] transition-colors shadow-2xs cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#704a29] group-hover:-translate-x-0.5 transition-transform" />
          <span>View Public Profile</span>
        </button>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md my-8"
      >
        <div className="rounded-2xl bg-[#fffefb] border border-[#d9cdbd] shadow-xl p-8 sm:p-10 relative overflow-hidden">
          {/* Subtle warm accent trim */}
          <div className="absolute top-0 inset-x-0 h-1 bg-[#704a29]" />

          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#704a29] text-white flex items-center justify-center shadow-md">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#fbf8f3] border border-[#704a29] flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-[#704a29]" />
              </div>
            </div>

            <span className="text-[11px] uppercase tracking-widest text-[#704a29] font-bold mb-1">
              ANANTA SPARSHA
            </span>
            <h1 className="text-2xl font-bold text-[#2b241e] tracking-tight">
              Owner Console
            </h1>
            <p className="text-xs text-[#73685c] mt-1.5 max-w-xs leading-relaxed">
              Private administrative access for identity architecture and profile management.
            </p>
          </div>

          {/* Rate Limit Lockout Notice */}
          {lockoutRemaining > 0 && (
            <div className="mb-6 p-3.5 rounded-xl bg-[#fef2f2] border border-[#fca5a5] flex items-start gap-3 text-[#991b1b] text-xs">
              <AlertCircle className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Rate Limit Active</p>
                <p className="text-[11px] mt-0.5">
                  Too many incorrect authentication attempts. Please retry in{' '}
                  <span className="font-bold">{lockoutRemaining}s</span>.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-3.5 rounded-xl bg-[#fef2f2] border border-[#fca5a5] flex items-start gap-3 text-[#991b1b] text-xs overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Banner */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-3.5 rounded-xl bg-[#f2f8f2] border border-[#86efac] flex items-start gap-3 text-[#14532d] text-xs overflow-hidden"
              >
                <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{successMessage}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#73685c] font-bold mb-2">
                Authorized Owner Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#73685c]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahulnagv.dev@gmail.com"
                  required
                  disabled={isSubmitting || lockoutRemaining > 0}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-[#73685c] mt-1.5">
                Only the allowlisted owner email address is authorized.
              </p>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs uppercase tracking-wider text-[#73685c] font-bold">
                  Master Password
                </label>
                <button
                  type="button"
                  onClick={handleOpenRecovery}
                  disabled={lockoutRemaining > 0}
                  className="text-[11px] text-[#704a29] hover:underline cursor-pointer font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#73685c]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security password"
                  required
                  disabled={isSubmitting || lockoutRemaining > 0}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-sm text-[#2b241e] placeholder-[#a89d91] focus:outline-none focus:border-[#704a29] focus:ring-1 focus:ring-[#704a29]/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#73685c] hover:text-[#2b241e] transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || lockoutRemaining > 0}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#704a29] hover:bg-[#593a1f] shadow-md active:scale-98 transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-white" />
                  <span>Authenticate &amp; Enter Console</span>
                </>
              )}
            </button>
          </form>

          {/* Security Architecture Footer */}
          <div className="mt-8 pt-6 border-t border-[#d9cdbd] flex items-center justify-between text-[11px] text-[#73685c]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
              TLS End-to-End Encrypted
            </span>
            <span>Single-Owner Auth</span>
          </div>
        </div>

        {/* Brand Copyright */}
        <p className="text-center text-[11px] text-[#73685c] mt-6">
          ANANTA SPARSHA &bull; Contactless Smart Identity Architecture
        </p>
      </motion.div>

      {/* ================= FORGOT PASSWORD RECOVERY MODAL ================= */}
      <AnimatePresence>
        {showRecoveryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-serif">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-[#fffefb] border border-[#d9cdbd] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setShowRecoveryModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#704a29] font-bold">
                  Security Recovery
                </span>
                <h3 className="text-xl font-bold text-[#2b241e] mt-0.5">
                  Password Recovery
                </h3>
                <p className="text-xs text-[#73685c] mt-1">
                  Choose your multi-factor recovery path to restore account access.
                </p>
              </div>

              {recoveryError && (
                <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fca5a5] text-xs text-[#991b1b] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{recoveryError}</span>
                </div>
              )}

              {/* METHOD SELECTION MENU */}
              {recoveryMethod === 'menu' && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryMethod('phone');
                      setRecoveryStep('input');
                    }}
                    className="w-full p-4 rounded-xl bg-[#fbf8f3] hover:bg-[#f0eae1] border border-[#d9cdbd] hover:border-[#704a29] text-left transition flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#fffefb] border border-[#d9cdbd] flex items-center justify-center text-[#704a29]">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#2b241e]">Recover via Phone OTP</h4>
                        <p className="text-[11px] text-[#73685c]">
                          SMS confirmation sent to {maskPhoneNumber(registeredPhone || CONFIGURED_OWNER_PHONE)}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#73685c] group-hover:translate-x-1 group-hover:text-[#704a29] transition-all" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRecoveryMethod('email');
                      handleEmailRecovery();
                    }}
                    className="w-full p-4 rounded-xl bg-[#fbf8f3] hover:bg-[#f0eae1] border border-[#d9cdbd] hover:border-[#704a29] text-left transition flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#fffefb] border border-[#d9cdbd] flex items-center justify-center text-[#704a29]">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#2b241e]">Send Reset Link to Email</h4>
                        <p className="text-[11px] text-[#73685c]">
                          Email dispatched to {CONFIGURED_OWNER_EMAIL}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#73685c] group-hover:translate-x-1 group-hover:text-[#704a29] transition-all" />
                  </button>
                </div>
              )}

              {/* EMAIL CONFIRMATION STATE */}
              {recoveryMethod === 'email' && (
                <div className="py-4 text-center space-y-4">
                  {isDispatchingRecovery ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#704a29]" />
                      <span className="text-xs text-[#73685c]">Dispatching password reset instructions...</span>
                    </div>
                  ) : recoveryStep === 'success' ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-[#f2f8f2] border border-[#86efac] text-[#16a34a] flex items-center justify-center mx-auto shadow-xs">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-[#2b241e]">Reset Email Sent!</h4>
                        <p className="text-xs text-[#73685c] mt-1 max-w-xs mx-auto leading-relaxed">
                          Check your inbox at <strong>{CONFIGURED_OWNER_EMAIL}</strong> for your secure password reset link.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowRecoveryModal(false)}
                        className="px-5 py-2.5 rounded-xl bg-[#704a29] text-white text-xs font-bold transition cursor-pointer"
                      >
                        Return to Sign In
                      </button>
                    </>
                  ) : null}
                </div>
              )}

              {/* PHONE OTP RECOVERY FLOW */}
              {recoveryMethod === 'phone' && (
                <div>
                  {recoveryStep === 'input' && (
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-xs">
                        <p className="text-[#73685c]">Confirm registered owner phone number:</p>
                        <p className="font-bold text-[#2b241e] font-mono mt-0.5">
                          {registeredPhone || CONFIGURED_OWNER_PHONE}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setRecoveryMethod('menu')}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-[#73685c] hover:bg-[#f0eae1] transition cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleSendPhoneRecoveryOtp}
                          disabled={isDispatchingRecovery}
                          className="px-4 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                        >
                          {isDispatchingRecovery ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending OTP...</span>
                            </>
                          ) : (
                            <>
                              <span>Dispatch OTP</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {recoveryStep === 'otp' && (
                    <form onSubmit={handleVerifyRecoveryOtp} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#2b241e] mb-1">
                          Enter 6-Digit SMS Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          autoFocus
                          placeholder="123456"
                          value={recoveryOtp}
                          onChange={(e) => setRecoveryOtp(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-2.5 text-center text-lg font-mono tracking-widest rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                          required
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={handleSendPhoneRecoveryOtp}
                          disabled={recoveryCooldown > 0 || isDispatchingRecovery}
                          className="text-[#704a29] font-bold hover:underline disabled:opacity-50 cursor-pointer"
                        >
                          {recoveryCooldown > 0 ? `Resend code in ${recoveryCooldown}s` : 'Resend Code'}
                        </button>
                        <span className="text-[11px] text-[#73685c]">Firebase Phone Auth</span>
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setRecoveryStep('input')}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-[#73685c] hover:bg-[#f0eae1] transition cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={recoveryOtp.length !== 6 || isDispatchingRecovery}
                          className="px-4 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                        >
                          {isDispatchingRecovery ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <>
                              <span>Verify Code</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  {recoveryStep === 'new-password' && (
                    <form onSubmit={handleFinishPhoneRecovery} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#2b241e] mb-1">
                          New Master Password
                        </label>
                        <div className="relative">
                          <input
                            type={showRecoveryNewPass ? 'text' : 'password'}
                            value={recoveryNewPass}
                            onChange={(e) => setRecoveryNewPass(e.target.value)}
                            placeholder="At least 12 characters..."
                            required
                            className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRecoveryNewPass(!showRecoveryNewPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#73685c] hover:text-[#2b241e] cursor-pointer"
                          >
                            {showRecoveryNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Checklist */}
                        <div className="grid grid-cols-2 gap-1 mt-2 text-[10px]">
                          <span className={recoveryPassVal.hasMinLength ? 'text-[#166534]' : 'text-[#73685c]'}>
                            &bull; 12+ characters
                          </span>
                          <span className={recoveryPassVal.hasUpperCase ? 'text-[#166534]' : 'text-[#73685c]'}>
                            &bull; 1+ uppercase letter
                          </span>
                          <span className={recoveryPassVal.hasLowerCase ? 'text-[#166534]' : 'text-[#73685c]'}>
                            &bull; 1+ lowercase letter
                          </span>
                          <span className={recoveryPassVal.hasNumber ? 'text-[#166534]' : 'text-[#73685c]'}>
                            &bull; 1+ number (0-9)
                          </span>
                          <span className={`col-span-2 ${recoveryPassVal.hasSpecialChar ? 'text-[#166534]' : 'text-[#73685c]'}`}>
                            &bull; 1+ special character (!@#$...)
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#2b241e] mb-1">
                          Confirm Password
                        </label>
                        <input
                          type={showRecoveryNewPass ? 'text' : 'password'}
                          value={recoveryConfirmPass}
                          onChange={(e) => setRecoveryConfirmPass(e.target.value)}
                          placeholder="Re-enter password..."
                          required
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] focus:outline-none focus:border-[#704a29]"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowRecoveryModal(false)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-[#73685c] hover:bg-[#f0eae1] transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!recoveryPassVal.isValid || isDispatchingRecovery}
                          className="px-4 py-2 rounded-xl bg-[#704a29] hover:bg-[#593a1f] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                        >
                          {isDispatchingRecovery ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <span>Set Password &amp; Sign In</span>
                              <Check className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnerLogin;
