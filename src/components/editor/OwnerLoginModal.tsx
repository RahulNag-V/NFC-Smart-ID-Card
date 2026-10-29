import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { CONFIGURED_OWNER_EMAIL } from '../../lib/firebase';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';

export const OwnerLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login, sendResetEmail, isFirebaseConnected } = useAuth();
  const [email, setEmail] = useState<string>(CONFIGURED_OWNER_EMAIL);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState<boolean>(false);
  const [isResetMode, setIsResetMode] = useState<boolean>(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email address and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email.trim()) {
      setErrorMessage('Please enter your email address to receive password reset instructions.');
      return;
    }

    setIsLoading(true);
    const result = await sendResetEmail(email);
    setIsLoading(false);

    if (result.success) {
      setResetSent(true);
    } else {
      setErrorMessage(result.error || 'Failed to dispatch reset instructions.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLoginModal}
          className="fixed inset-0 bg-[#1a1410]/70 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md bg-[#fffefb] border border-[#d9cdbd] rounded-2xl shadow-2xl p-6 sm:p-7 text-[#2b241e] font-sans"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLoginModal}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-[#73685c] hover:text-[#2b241e] hover:bg-[#f0eae1] transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#f0eae1] border border-[#d9cdbd] flex items-center justify-center text-[#704a29] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-[#2b241e] tracking-tight">
                {isResetMode ? 'Reset Owner Password' : 'Owner Portal Sign-In'}
              </h2>
              <p className="text-xs text-[#73685c]">
                {isResetMode
                  ? 'Send password recovery link to your owner email'
                  : 'Authenticate to access visual inline editing and customization'}
              </p>
            </div>
          </div>

          {!isFirebaseConnected && (
            <div className="mb-4 p-3 rounded-xl bg-[#fbf5ea] border border-[#e8d5b5] text-[11px] text-[#8c6225] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Development Sandbox Mode:</span> Firebase credentials are not yet configured in <code className="bg-[#ede1cc] px-1 py-0.5 rounded">.env</code>. You can log in with your email <span className="font-semibold">{CONFIGURED_OWNER_EMAIL}</span> and any 6+ character password to test the full visual editing system immediately.
              </div>
            </div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-[#fdf2f2] border border-[#fecaca] text-xs text-[#991b1b] flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {resetSent ? (
            <div className="p-4 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-center space-y-2">
              <CheckCircle2 className="w-6 h-6 text-[#16a34a] mx-auto" />
              <p className="text-xs font-bold text-[#15803d]">Password Recovery Dispatched</p>
              <p className="text-[11px] text-[#166534]">
                Check your inbox for password reset instructions sent to <strong>{email}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setResetSent(false);
                }}
                className="mt-2 text-xs font-semibold text-[#704a29] hover:underline cursor-pointer"
              >
                Return to Login
              </button>
            </div>
          ) : isResetMode ? (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#52493e] mb-1">
                  Owner Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9c9184] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter owner email"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] placeholder-[#9c9184] focus:outline-none focus:border-[#704a29]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetMode(false)}
                  className="text-xs text-[#73685c] hover:text-[#2b241e] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-[#704a29] hover:bg-[#5a3a1f] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Dispatch Reset Email</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#52493e] mb-1">
                  Authorized Owner Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9c9184] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] placeholder-[#9c9184] focus:outline-none focus:border-[#704a29]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#52493e]">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-[11px] text-[#704a29] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9c9184] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-[#fbf8f3] border border-[#d9cdbd] text-[#2b241e] placeholder-[#9c9184] focus:outline-none focus:border-[#704a29]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9c9184] hover:text-[#2b241e] p-1 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#704a29] hover:bg-[#5a3a1f] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Sign In as Owner</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-center text-[#9c9184] pt-1">
                Security Policy: Public registration is strictly disabled. Writes are secured by Firestore Security Rules.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
