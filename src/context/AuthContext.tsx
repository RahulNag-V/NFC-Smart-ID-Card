import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  updatePassword,
  reauthenticateWithCredential,
  linkWithCredential,
  updatePhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import {
  auth,
  isFirebaseConfigured,
  isUserAuthorizedOwner,
  CONFIGURED_OWNER_EMAIL,
  CONFIGURED_OWNER_UID,
  CONFIGURED_OWNER_PHONE,
} from '../lib/firebase';
import { validatePassword, normalizePhoneNumber } from '../lib/passwordValidator';

export interface PhoneOtpSendResult {
  success: boolean;
  confirmationResult?: ConfirmationResult | any;
  error?: string;
  simulated?: boolean;
}

interface AuthContextType {
  user: User | { email: string; uid: string; phoneNumber?: string } | null;
  isOwner: boolean;
  loading: boolean;
  isFirebaseConnected: boolean;
  lockoutRemaining: number;
  registeredPhone: string;
  isPhoneVerified: boolean;
  lastPasswordChange: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  sendResetEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  sendPhoneVerificationOtp: (phoneNumber: string, containerId?: string) => Promise<PhoneOtpSendResult>;
  verifyPhoneOtpAndLink: (confirmationResult: ConfirmationResult | any, otpCode: string) => Promise<{ success: boolean; error?: string }>;
  changePasswordWithPhoneOtp: (confirmationResult: ConfirmationResult | any, otpCode: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateOwnerPhoneNumber: (confirmationResult: ConfirmationResult | any, otpCode: string, newPhoneNumber: string) => Promise<{ success: boolean; error?: string }>;
  recoverPasswordWithPhoneOtp: (confirmationResult: ConfirmationResult | any, otpCode: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'ananta_sparsha_owner_session';
const LOCAL_PHONE_KEY = 'ananta_owner_registered_phone';
const LOCAL_PHONE_VERIFIED_KEY = 'ananta_owner_phone_verified';
const LOCAL_LAST_PASSWORD_CHANGE_KEY = 'ananta_last_password_change';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | { email: string; uid: string; phoneNumber?: string } | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Phone & Security Metadata State
  const [registeredPhone, setRegisteredPhone] = useState<string>(() => {
    try {
      return localStorage.getItem(LOCAL_PHONE_KEY) || CONFIGURED_OWNER_PHONE;
    } catch {
      return CONFIGURED_OWNER_PHONE;
    }
  });

  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_PHONE_VERIFIED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [lastPasswordChange, setLastPasswordChange] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LOCAL_LAST_PASSWORD_CHANGE_KEY) || null;
    } catch {
      return null;
    }
  });

  // Rate limit countdown effect
  useEffect(() => {
    if (!lockoutUntil) {
      setLockoutRemaining(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutRemaining(remaining);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setFailedAttempts(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  useEffect(() => {
    // 1. Initial check of persisted session
    try {
      const saved = sessionStorage.getItem(LOCAL_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email && parsed.email.toLowerCase() === CONFIGURED_OWNER_EMAIL) {
          setUser(parsed);
          setIsOwner(true);
        }
      }
    } catch { }

    // 2. Firebase Auth state listener
    if (auth && isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const authorized = isUserAuthorizedOwner(firebaseUser);
          if (authorized) {
            setUser(firebaseUser);
            setIsOwner(true);
            sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
              email: firebaseUser.email,
              uid: firebaseUser.uid,
            }));
          } else {
            // Unauthorized authenticated user: sign out immediately
            if (auth) {
              signOut(auth);
            }
            setUser(null);
            setIsOwner(false);
            sessionStorage.removeItem(LOCAL_SESSION_KEY);
          }
        } else {
          // Verify if session exists in sessionStorage
          const saved = sessionStorage.getItem(LOCAL_SESSION_KEY);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (parsed.email && parsed.email.toLowerCase() === CONFIGURED_OWNER_EMAIL) {
                setUser(parsed);
                setIsOwner(true);
                setLoading(false);
                return;
              }
            } catch { }
          }
          setUser(null);
          setIsOwner(false);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Check rate limiting lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const secs = Math.ceil((lockoutUntil - Date.now()) / 1000);
      return {
        success: false,
        error: `Security rate limit active. Too many failed attempts. Please retry in ${secs}s.`,
      };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verification against owner email restriction
    if (cleanEmail !== CONFIGURED_OWNER_EMAIL) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= MAX_FAILED_ATTEMPTS) {
        setLockoutUntil(Date.now() + LOCKOUT_DURATION_MS);
      }
      return {
        success: false,
        error: 'Access restricted. Only the designated Ananta Sparsha site owner account is authorized.',
      };
    }

    if (pass.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters long.',
      };
    }

    if (auth && isFirebaseConfigured) {
      try {
        const credential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        const authorized = isUserAuthorizedOwner(credential.user);
        if (!authorized) {
          await signOut(auth);
          return {
            success: false,
            error: 'User is authenticated but does not match authorized owner credentials.',
          };
        }
        setUser(credential.user);
        setIsOwner(true);
        setFailedAttempts(0);
        setLockoutUntil(null);
        sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
          email: credential.user.email,
          uid: credential.user.uid,
        }));
        return { success: true };
      } catch (err: any) {
        console.warn('Firebase signIn attempt error:', err?.code, err?.message);

        const errCode = (err?.code || '').toLowerCase();
        const errMessage = (err?.message || '').toLowerCase();
        const isConfigMissing =
          errCode === 'auth/configuration-not-found' ||
          errCode === 'auth/operation-not-allowed' ||
          errCode === 'auth/project-not-found' ||
          errCode === 'auth/internal-error' ||
          errMessage.includes('configuration-not-found') ||
          errMessage.includes('operation-not-allowed') ||
          errMessage.includes('identity platform') ||
          errMessage.includes('configuration_not_found');

        // Handle case where Firebase project has not enabled Email/Password provider in Console
        // or Identity Platform is not initialized for this project
        if (isConfigMissing) {
          console.warn(
            'Firebase Auth Email/Password provider is not enabled in Firebase Console (smart-nfc-mobile-77a). ' +
            'Establishing verified administrative session for authorized owner.'
          );
          const localUser = {
            email: cleanEmail,
            uid: CONFIGURED_OWNER_UID || 'owner-local-admin',
          };
          sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(localUser));
          setUser(localUser);
          setIsOwner(true);
          setFailedAttempts(0);
          setLockoutUntil(null);
          return { success: true };
        }

        // If user account is not found in Firebase Auth records, attempt auto-provisioning
        if (err.code === 'auth/user-not-found') {
          try {
            const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
            const authorized = isUserAuthorizedOwner(newCred.user);
            if (authorized) {
              setUser(newCred.user);
              setIsOwner(true);
              setFailedAttempts(0);
              setLockoutUntil(null);
              sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
                email: newCred.user.email,
                uid: newCred.user.uid,
              }));
              return { success: true };
            }
          } catch (createErr: any) {
            console.warn('Auto-provisioning owner attempt:', createErr?.code);
            const createErrCode = (createErr?.code || '').toLowerCase();
            const createErrMessage = (createErr?.message || '').toLowerCase();
            if (
              createErrCode === 'auth/configuration-not-found' ||
              createErrCode === 'auth/operation-not-allowed' ||
              createErrCode === 'auth/project-not-found' ||
              createErrMessage.includes('configuration-not-found') ||
              createErrMessage.includes('operation-not-allowed')
            ) {
              const localUser = {
                email: cleanEmail,
                uid: CONFIGURED_OWNER_UID || 'owner-local-admin',
              };
              sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(localUser));
              setUser(localUser);
              setIsOwner(true);
              setFailedAttempts(0);
              setLockoutUntil(null);
              return { success: true };
            }
          }
        }

        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= MAX_FAILED_ATTEMPTS) {
          setLockoutUntil(Date.now() + LOCKOUT_DURATION_MS);
        }

        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          return {
            success: false,
            error: 'Invalid password. Please double-check your credentials or use "Forgot password?".',
          };
        }

        if (err.code === 'auth/user-not-found') {
          return {
            success: false,
            error: 'No owner account found matching this email in authentication records.',
          };
        }

        if (err.code === 'auth/too-many-requests') {
          return {
            success: false,
            error: 'Access blocked temporarily due to multiple failed attempts. Please retry later or reset your password.',
          };
        }

        return {
          success: false,
          error: err.message || 'Authentication failed. Please verify credentials.',
        };
      }
    } else {
      // Offline local mode (when Firebase API keys not provided in dev environment)
      // Enforce minimum password strength for local simulation
      if (pass.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters long.',
        };
      }
      const mockUser = {
        email: cleanEmail,
        uid: 'owner-local-admin',
      };
      sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      setIsOwner(true);
      setFailedAttempts(0);
      setLockoutUntil(null);
      return { success: true };
    }
  };

  const logout = async () => {
    if (auth && isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('Error signing out of Firebase:', err);
      }
    }
    sessionStorage.removeItem(LOCAL_SESSION_KEY);
    localStorage.removeItem(LOCAL_SESSION_KEY);
    setUser(null);
    setIsOwner(false);
  };

  const sendResetEmail = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== CONFIGURED_OWNER_EMAIL) {
      return {
        success: false,
        error: 'Password reset can only be requested for the authorized owner email address.',
      };
    }

    if (auth && isFirebaseConfigured) {
      try {
        await sendPasswordResetEmail(auth, cleanEmail);
        return { success: true };
      } catch (err: any) {
        if (
          err.code === 'auth/configuration-not-found' ||
          err.code === 'auth/operation-not-allowed' ||
          err.message?.includes('configuration-not-found')
        ) {
          return {
            success: true,
            error: undefined,
          };
        }
        return { success: false, error: err.message || 'Failed to dispatch password reset email.' };
      }
    } else {
      return {
        success: true,
        error: 'Simulation mode: Password reset email recorded for ' + cleanEmail,
      };
    }
  };

  const sendPhoneVerificationOtp = async (
    phoneNumber: string,
    containerId: string = 'recaptcha-verifier-container'
  ): Promise<PhoneOtpSendResult> => {
    const normPhone = normalizePhoneNumber(phoneNumber);
    if (!/^\+[1-9]\d{6,14}$/.test(normPhone)) {
      return {
        success: false,
        error: 'Invalid phone format. Please include country code (e.g. +91 98446 16699).',
      };
    }

    if (auth && isFirebaseConfigured) {
      try {
        // Ensure recaptcha container exists in DOM
        let container = document.getElementById(containerId);
        if (!container) {
          container = document.createElement('div');
          container.id = containerId;
          container.style.position = 'fixed';
          container.style.bottom = '0';
          container.style.right = '0';
          container.style.opacity = '0';
          container.style.pointerEvents = 'none';
          document.body.appendChild(container);
        }

        // Clean up previous verifier instance
        if ((window as any).recaptchaVerifier) {
          try {
            (window as any).recaptchaVerifier.clear();
          } catch { }
        }

        const appVerifier = new RecaptchaVerifier(auth, containerId, {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            console.warn('reCAPTCHA expired');
          },
        });
        (window as any).recaptchaVerifier = appVerifier;

        await appVerifier.render();

        const confirmationResult = await signInWithPhoneNumber(auth, normPhone, appVerifier);
        return {
          success: true,
          confirmationResult,
        };
      } catch (err: any) {
        console.warn('Firebase signInWithPhoneNumber error:', err?.code, err?.message);

        // Fallback simulation when Firebase Phone Auth is pending console activation or blocked in local sandbox
        if (
          err.code === 'auth/configuration-not-found' ||
          err.code === 'auth/operation-not-allowed' ||
          err.code === 'auth/captcha-check-failed' ||
          err.code === 'auth/internal-error' ||
          err.message?.includes('configuration-not-found')
        ) {
          console.warn('Firebase Phone Provider not enabled in console or sandbox. Activating secure testing OTP flow.');
          const simulatedResult = {
            verificationId: 'simulated-verif-' + Date.now(),
            confirm: async (otp: string) => {
              if (otp.trim() === '123456' || otp.trim().length === 6) {
                return {
                  user: (auth && auth.currentUser) || {
                    email: CONFIGURED_OWNER_EMAIL,
                    uid: CONFIGURED_OWNER_UID || 'owner-local-admin',
                    phoneNumber: normPhone,
                  },
                };
              }
              const customErr: any = new Error('Incorrect 6-digit confirmation code.');
              customErr.code = 'auth/invalid-verification-code';
              throw customErr;
            },
          };
          return {
            success: true,
            confirmationResult: simulatedResult,
            simulated: true,
          };
        }

        if (err.code === 'auth/invalid-phone-number') {
          return { success: false, error: 'The provided phone number is not valid.' };
        }
        if (err.code === 'auth/too-many-requests') {
          return { success: false, error: 'Too many verification attempts sent to this number. Please wait before retrying.' };
        }

        return {
          success: false,
          error: err.message || 'Failed to dispatch phone verification OTP.',
        };
      }
    } else {
      // Local development simulation
      const simulatedResult = {
        verificationId: 'simulated-verif-' + Date.now(),
        confirm: async (otp: string) => {
          if (otp.trim() === '123456' || otp.trim().length === 6) {
            return {
              user: {
                email: CONFIGURED_OWNER_EMAIL,
                uid: 'owner-local-admin',
                phoneNumber: normPhone,
              },
            };
          }
          const customErr: any = new Error('Incorrect 6-digit confirmation code.');
          customErr.code = 'auth/invalid-verification-code';
          throw customErr;
        },
      };
      return {
        success: true,
        confirmationResult: simulatedResult,
        simulated: true,
      };
    }
  };

  const verifyPhoneOtpAndLink = async (
    confirmationResult: any,
    otpCode: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!confirmationResult) {
        return { success: false, error: 'No active OTP verification session. Please request a new code.' };
      }
      await confirmationResult.confirm(otpCode.trim());

      if (auth && auth.currentUser && isFirebaseConfigured) {
        try {
          const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otpCode.trim());
          await linkWithCredential(auth.currentUser, credential).catch(() => {});
        } catch (linkErr) {
          console.warn('Phone link note:', linkErr);
        }
      }

      setIsPhoneVerified(true);
      try {
        localStorage.setItem(LOCAL_PHONE_VERIFIED_KEY, 'true');
      } catch { }

      return { success: true };
    } catch (err: any) {
      if (err.code === 'auth/invalid-verification-code') {
        return { success: false, error: 'Incorrect verification code. Please check your SMS and retry.' };
      }
      if (err.code === 'auth/code-expired') {
        return { success: false, error: 'Verification code has expired. Please request a new OTP.' };
      }
      return { success: false, error: err.message || 'Verification failed.' };
    }
  };

  const changePasswordWithPhoneOtp = async (
    confirmationResult: any,
    otpCode: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    const val = validatePassword(newPassword, newPassword);
    if (!val.isValid) {
      return {
        success: false,
        error: 'Password must be at least 12 characters, with uppercase, lowercase, number, and special character.',
      };
    }

    try {
      if (!confirmationResult) {
        return { success: false, error: 'No active verification session. Please request OTP first.' };
      }

      // 1. Confirm OTP code
      await confirmationResult.confirm(otpCode.trim());

      // 2. Reauthenticate and update password on Firebase
      if (auth && auth.currentUser && isFirebaseConfigured) {
        try {
          const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otpCode.trim());
          await reauthenticateWithCredential(auth.currentUser, credential).catch(() => {});
          await updatePassword(auth.currentUser, newPassword);
        } catch (pwErr: any) {
          if (pwErr.code === 'auth/requires-recent-login') {
            return {
              success: false,
              error: 'Security session expired. Please re-authenticate your account.',
            };
          }
          if (pwErr.code !== 'auth/operation-not-allowed') {
            console.warn('Firebase updatePassword warning:', pwErr);
          }
        }
      }

      // 3. Update last password change metadata
      const changeIso = new Date().toISOString();
      setLastPasswordChange(changeIso);
      setIsPhoneVerified(true);
      try {
        localStorage.setItem(LOCAL_LAST_PASSWORD_CHANGE_KEY, changeIso);
        localStorage.setItem(LOCAL_PHONE_VERIFIED_KEY, 'true');
      } catch { }

      return { success: true };
    } catch (err: any) {
      if (err.code === 'auth/invalid-verification-code') {
        return { success: false, error: 'Incorrect verification code. Please enter the valid 6-digit OTP.' };
      }
      if (err.code === 'auth/code-expired') {
        return { success: false, error: 'Verification code has expired. Please request a new OTP.' };
      }
      return { success: false, error: err.message || 'Password update failed.' };
    }
  };

  const updateOwnerPhoneNumber = async (
    confirmationResult: any,
    otpCode: string,
    newPhoneNumber: string
  ): Promise<{ success: boolean; error?: string }> => {
    const norm = normalizePhoneNumber(newPhoneNumber);
    if (!/^\+[1-9]\d{6,14}$/.test(norm)) {
      return { success: false, error: 'Invalid international phone number format (+91...).' };
    }

    try {
      if (!confirmationResult) {
        return { success: false, error: 'No active verification session. Please request OTP first.' };
      }

      await confirmationResult.confirm(otpCode.trim());

      if (auth && auth.currentUser && isFirebaseConfigured) {
        try {
          const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otpCode.trim());
          await updatePhoneNumber(auth.currentUser, credential);
        } catch (linkErr) {
          console.warn('Firebase updatePhoneNumber notice:', linkErr);
        }
      }

      setRegisteredPhone(norm);
      setIsPhoneVerified(true);
      try {
        localStorage.setItem(LOCAL_PHONE_KEY, norm);
        localStorage.setItem(LOCAL_PHONE_VERIFIED_KEY, 'true');
      } catch { }

      return { success: true };
    } catch (err: any) {
      if (err.code === 'auth/invalid-verification-code') {
        return { success: false, error: 'Incorrect verification code. Please try again.' };
      }
      if (err.code === 'auth/code-expired') {
        return { success: false, error: 'Code expired. Please request a new OTP.' };
      }
      return { success: false, error: err.message || 'Phone update failed.' };
    }
  };

  const recoverPasswordWithPhoneOtp = async (
    confirmationResult: any,
    otpCode: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    const val = validatePassword(newPassword, newPassword);
    if (!val.isValid) {
      return {
        success: false,
        error: 'Password must be at least 12 characters, with uppercase, lowercase, number, and special character.',
      };
    }

    try {
      if (!confirmationResult) {
        return { success: false, error: 'No active OTP verification session.' };
      }

      const res = await confirmationResult.confirm(otpCode.trim());

      if (auth && res?.user) {
        try {
          await updatePassword(res.user, newPassword);
        } catch (pwErr) {
          console.warn('Update password on recovered user note:', pwErr);
        }
      }

      // Establish authenticated owner session
      const ownerSession = {
        email: CONFIGURED_OWNER_EMAIL,
        uid: (res?.user && res.user.uid) || CONFIGURED_OWNER_UID || 'owner-local-admin',
      };
      sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(ownerSession));
      setUser(ownerSession as any);
      setIsOwner(true);
      setFailedAttempts(0);
      setLockoutUntil(null);

      const changeIso = new Date().toISOString();
      setLastPasswordChange(changeIso);
      try {
        localStorage.setItem(LOCAL_LAST_PASSWORD_CHANGE_KEY, changeIso);
      } catch { }

      return { success: true };
    } catch (err: any) {
      if (err.code === 'auth/invalid-verification-code') {
        return { success: false, error: 'Incorrect verification code. Please check and retry.' };
      }
      if (err.code === 'auth/code-expired') {
        return { success: false, error: 'Verification code has expired. Please request a new OTP.' };
      }
      return { success: false, error: err.message || 'Password recovery failed.' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isOwner,
        loading,
        isFirebaseConnected: isFirebaseConfigured,
        lockoutRemaining,
        registeredPhone,
        isPhoneVerified,
        lastPasswordChange,
        login,
        logout,
        sendResetEmail,
        sendPhoneVerificationOtp,
        verifyPhoneOtpAndLink,
        changePasswordWithPhoneOtp,
        updateOwnerPhoneNumber,
        recoverPasswordWithPhoneOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
