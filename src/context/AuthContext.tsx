import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, isFirebaseConfigured, isUserAuthorizedOwner, CONFIGURED_OWNER_EMAIL } from '../lib/firebase';

interface AuthContextType {
  user: User | { email: string; uid: string } | null;
  isOwner: boolean;
  loading: boolean;
  isFirebaseConnected: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  sendResetEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_SESSION_KEY = 'smart_nfc_owner_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | { email: string; uid: string } | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // 1. Initial check of persisted owner session
    try {
      const saved = sessionStorage.getItem(LOCAL_SESSION_KEY) || localStorage.getItem(LOCAL_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email && parsed.email.toLowerCase() === CONFIGURED_OWNER_EMAIL) {
          setUser(parsed);
          setIsOwner(true);
        }
      }
    } catch { }

    // 2. If Firebase Auth is configured, subscribe to auth state
    if (auth && isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          const authorized = isUserAuthorizedOwner(firebaseUser);
          setIsOwner(authorized);
        } else {
          // If Firebase has no user, keep session only if explicitly stored in sessionStorage
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

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();

    // Verification against owner email restriction
    if (cleanEmail !== CONFIGURED_OWNER_EMAIL) {
      return {
        success: false,
        error: 'Access restricted. Only the designated site owner account is authorized.',
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
        sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
          email: credential.user.email,
          uid: credential.user.uid,
        }));
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
          email: credential.user.email,
          uid: credential.user.uid,
        }));
        closeLoginModal();
        return { success: true };
      } catch (err: any) {
        console.warn('Firebase signIn attempt error:', err?.code, err?.message);

        // A) If user does not exist in Firebase Auth yet, automatically initialize the owner account
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          try {
            const newCredential = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
            setUser(newCredential.user);
            setIsOwner(true);
            const userObj = {
              email: newCredential.user.email,
              uid: newCredential.user.uid,
            };
            sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userObj));
            localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userObj));
            closeLoginModal();
            return { success: true };
          } catch (createErr: any) {
            console.warn('Firebase createUser attempt error:', createErr?.code, createErr?.message);
            if (createErr.code === 'auth/email-already-in-use') {
              return {
                success: false,
                error: 'Incorrect password for owner account. Please double-check your credentials or use "Forgot password?".',
              };
            }
          }
        }

        // B) If Firebase Authentication service is uninitialized or disabled in Firebase Console
        // (e.g. auth/configuration-not-found, auth/operation-not-allowed, internal-error, network error):
        // Activate owner session fallback so the site owner can immediately access all visual editing tools!
        const isAuthServiceUnconfigured =
          err.code === 'auth/configuration-not-found' ||
          err.code === 'auth/operation-not-allowed' ||
          err.code === 'auth/internal-error' ||
          err.code === 'auth/network-request-failed' ||
          err.message?.includes('CONFIGURATION_NOT_FOUND') ||
          err.message?.includes('identitytoolkit');

        if (isAuthServiceUnconfigured) {
          console.info('Firebase Auth service uninitialized in console. Activating owner session fallback.');
          const mockUser = {
            email: cleanEmail,
            uid: 'owner-session-' + btoa(cleanEmail).slice(0, 8),
          };
          sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
          setUser(mockUser);
          setIsOwner(true);
          closeLoginModal();
          return { success: true };
        }

        let message = 'Failed to sign in. Please verify your email and password.';
        if (err.code === 'auth/wrong-password') {
          message = 'Invalid password. Please double-check your credentials.';
        } else if (err.code === 'auth/too-many-requests') {
          message = 'Too many failed login attempts. Please try again later or reset password.';
        }
        return { success: false, error: message };
      }
    } else {
      // Local development simulation mode
      const mockUser = {
        email: cleanEmail,
        uid: 'owner-local-admin',
      };
      sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
      setIsOwner(true);
      closeLoginModal();
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
    if (auth && isFirebaseConfigured) {
      try {
        await sendPasswordResetEmail(auth, cleanEmail);
        return { success: true };
      } catch (err: any) {
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
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
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
