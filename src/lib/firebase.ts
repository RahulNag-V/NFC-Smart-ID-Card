import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  User,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  Firestore,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  FirebaseStorage,
} from 'firebase/storage';
import { PublishedProfileData } from '../types/content';
import { defaultInitialContent } from '../data/initialContent';

// Firebase configuration from environment
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'smart-nfc-mobile-77a.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'smart-nfc-mobile-77a',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'smart-nfc-mobile-77a.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (err) {
    console.warn('Firebase initialization warning:', err);
  }
}

export { auth, db, storage };

// Storage keys for offline/local simulation fallback
const LOCAL_PUBLISHED_KEY = 'ananta_sparsha_published_content';
const LOCAL_DRAFT_KEY = 'ananta_sparsha_draft_content';

// Configured Owner UID and Email (from environment or defaults)
export const CONFIGURED_OWNER_UID = import.meta.env.VITE_OWNER_UID || '';
export const CONFIGURED_OWNER_EMAIL = (import.meta.env.VITE_OWNER_EMAIL || 'rahulnagv.dev@gmail.com').toLowerCase();

/**
 * Validates if the authenticated user is the designated owner.
 * Checks against VITE_OWNER_UID (if set) and VITE_OWNER_EMAIL.
 */
export function isUserAuthorizedOwner(user: User | { email?: string; uid?: string } | null): boolean {
  if (!user) return false;
  
  if (CONFIGURED_OWNER_UID && user.uid === CONFIGURED_OWNER_UID) {
    return true;
  }
  
  if (user.email && user.email.toLowerCase() === CONFIGURED_OWNER_EMAIL) {
    return true;
  }
  
  return false;
}

/**
 * Load published profile from Firestore or local fallback
 */
export async function fetchPublishedProfile(profileId: string = 'rahulnagv'): Promise<PublishedProfileData> {
  if (db && isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'profiles', profileId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.publishedContent) {
          return data.publishedContent as PublishedProfileData;
        }
      }
    } catch (err) {
      console.warn('Could not load from Firestore, falling back to local/default:', err);
    }
  }

  // Local fallback
  try {
    const local = localStorage.getItem(LOCAL_PUBLISHED_KEY) || localStorage.getItem('smart_nfc_published_content');
    if (local) {
      return JSON.parse(local) as PublishedProfileData;
    }
  } catch (e) {
    console.warn('Failed to parse local stored content:', e);
  }

  return defaultInitialContent;
}

/**
 * Load private draft from Firestore or local fallback
 */
export async function fetchDraftProfile(profileId: string = 'rahulnagv'): Promise<PublishedProfileData | null> {
  if (db && isFirebaseConfigured) {
    try {
      const draftRef = doc(db, 'profiles', profileId, 'private', 'draft');
      const snapshot = await getDoc(draftRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.draftContent) {
          return data.draftContent as PublishedProfileData;
        }
      }
    } catch (err) {
      console.warn('Could not load draft from Firestore, checking local storage:', err);
    }
  }

  // Local draft fallback
  try {
    const local = localStorage.getItem(LOCAL_DRAFT_KEY);
    if (local) {
      return JSON.parse(local) as PublishedProfileData;
    }
  } catch (e) {
    console.warn('Failed to parse local draft:', e);
  }

  return null;
}

/**
 * Save draft profile to private storage
 */
export async function saveDraftProfile(
  profileId: string = 'rahulnagv',
  draftData: PublishedProfileData,
  ownerUid?: string
): Promise<void> {
  // Always update local cache
  try {
    localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(draftData));
  } catch (err) {
    console.warn('Local draft storage warning:', err);
  }

  if (db && isFirebaseConfigured) {
    const draftRef = doc(db, 'profiles', profileId, 'private', 'draft');
    await setDoc(draftRef, {
      draftContent: draftData,
      updatedAt: new Date().toISOString(),
      ownerUid: ownerUid || 'owner',
    }, { merge: true });
  }
}

/**
 * Publish profile live to public document
 */
export async function publishProfile(
  profileId: string = 'rahulnagv',
  dataToPublish: PublishedProfileData,
  ownerUid: string = 'owner'
): Promise<PublishedProfileData> {
  const newVersion = (dataToPublish.version || 1) + 1;
  const now = new Date().toISOString();

  const publishedData: PublishedProfileData = {
    ...dataToPublish,
    version: newVersion,
    updatedAt: now,
    publishedAt: now,
  };

  // Sync to local published key and clear draft
  try {
    localStorage.setItem(LOCAL_PUBLISHED_KEY, JSON.stringify(publishedData));
    localStorage.removeItem(LOCAL_DRAFT_KEY);
  } catch (err) {
    console.warn('Local publish storage warning:', err);
  }

  // Sync to Cloud Firestore
  if (db && isFirebaseConfigured) {
    const profileRef = doc(db, 'profiles', profileId);
    await setDoc(profileRef, {
      ownerUid,
      publishedContent: publishedData,
      publishedVersion: newVersion,
      updatedAt: now,
      publishedAt: now,
    }, { merge: true });

    // Also update private draft with published data
    const draftRef = doc(db, 'profiles', profileId, 'private', 'draft');
    await setDoc(draftRef, {
      draftContent: publishedData,
      updatedAt: now,
      ownerUid,
    }, { merge: true });
  }

  return publishedData;
}

/**
 * Upload image to Firebase Storage or fallback to base64 DataURL
 */
export async function uploadOwnerMediaFile(
  file: File,
  folder: 'profile' | 'cover' | 'projects' | 'badges',
  ownerUid: string = 'owner'
): Promise<string> {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, WEBP, or SVG image.');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds the 5MB limit.');
  }

  if (storage && isFirebaseConfigured) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `profiles/${ownerUid}/${folder}/${Date.now()}_${sanitizedName}`;
      const fileRef = ref(storage, storagePath);
      const uploadTask = await uploadBytesResumable(fileRef, file);
      return await getDownloadURL(uploadTask.ref);
    } catch (storageErr) {
      console.warn('Firebase storage upload failed, falling back to data URL:', storageErr);
    }
  }

  // Base64 fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
