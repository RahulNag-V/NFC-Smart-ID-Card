import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
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
    if (auth && isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          const authorized = isUserAuthorizedOwner(firebaseUser);
          setIsOwner(authorized);
        } else {
          setUser(null);
          setIsOwner(false);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Offline/Local development fallback check
      try {
        const saved = sessionStorage.getItem(LOCAL_SESSION_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setUser(parsed);
          setIsOwner(true);
        }
      } catch { }
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
        closeLoginModal();
        return { success: true };
      } catch (err: any) {
        let message = 'Failed to sign in. Please verify your email and password.';
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          message = 'Invalid password. Please double-check your credentials.';
        } else if (err.code === 'auth/user-not-found') {
          message = 'Owner account not found in Firebase Authentication.';
        } else if (err.code === 'auth/too-many-requests') {
          message = 'Too many failed login attempts. Please try again later or reset password.';
        }
        return { success: false, error: message };
      }
    } else {
      // Local development simulation mode when Firebase environment variables are not yet populated
      // Owner can login using designated email + default development passphrase
      if (pass.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' };
      }
      const mockUser = {
        email: cleanEmail,
        uid: 'owner-local-admin',
      };
      sessionStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
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
