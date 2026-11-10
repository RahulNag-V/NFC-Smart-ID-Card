import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CONFIGURED_OWNER_EMAIL } from '../../lib/firebase';

interface OwnerLoginProps {
  onLoginSuccess: () => void;
  onNavigatePublic: () => void;
}

export const OwnerLogin: React.FC<OwnerLoginProps> = ({ onLoginSuccess, onNavigatePublic }) => {
  const { login, sendResetEmail, lockoutRemaining, isOwner } = useAuth();

  const [email, setEmail] = useState<string>(CONFIGURED_OWNER_EMAIL);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // If already logged in as owner, immediately redirect
  React.useEffect(() => {
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

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your owner email address to receive a password reset link.');
      return;
    }

    setIsResetting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await sendResetEmail(email.trim());
      if (res.success) {
        setSuccessMessage('Password reset instructions have been dispatched to your email.');
      } else {
        setErrorMessage(res.error || 'Failed to dispatch password reset email.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error requesting password reset.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fbf8f3] text-[#2b241e] flex flex-col items-center justify-center p-4 relative overflow-hidden font-serif selection:bg-[#704a29]/20">
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

      {/* Top Bar / Back Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onNavigatePublic}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fffefb] border border-[#d9cdbd] text-xs text-[#73685c] hover:text-[#2b241e] hover:border-[#704a29] transition duration-200 cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Portfolio</span>
        </button>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
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
                <div className="text-[11.5px] leading-relaxed">{errorMessage}</div>
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
                <div className="text-[11.5px] leading-relaxed">{successMessage}</div>
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
                  onClick={handleForgotPassword}
                  disabled={isResetting || lockoutRemaining > 0}
                  className="text-[11px] text-[#704a29] hover:underline cursor-pointer"
                >
                  {isResetting ? 'Dispatching...' : 'Forgot password?'}
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
                  <span>Authenticate & Enter Console</span>
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
    </div>
  );
};

export default OwnerLogin;
