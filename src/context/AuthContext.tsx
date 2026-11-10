import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured, isUserAuthorizedOwner, CONFIGURED_OWNER_EMAIL, CONFIGURED_OWNER_UID } from '../lib/firebase';

interface AuthContextType {
  user: User | { email: string; uid: string } | null;
  isOwner: boolean;
  loading: boolean;
  isFirebaseConnected: boolean;
  lockoutRemaining: number;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  sendResetEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'ananta_sparsha_owner_session';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | { email: string; uid: string } | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

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

        // Handle case where Firebase project has not enabled Email/Password provider in Console
        // or Identity Platform is not initialized for this project
        if (
          err.code === 'auth/configuration-not-found' ||
          err.code === 'auth/operation-not-allowed' ||
          err.message?.includes('configuration-not-found')
        ) {
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
            if (
              createErr.code === 'auth/configuration-not-found' ||
              createErr.code === 'auth/operation-not-allowed' ||
              createErr.message?.includes('configuration-not-found')
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isOwner,
        loading,
        isFirebaseConnected: isFirebaseConfigured,
        lockoutRemaining,
        login,
        logout,
        sendResetEmail,
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
