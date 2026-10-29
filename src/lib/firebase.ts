import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  Firestore,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  FirebaseStorage,
} from 'firebase/storage';
import { PublishedProfileData, VersionSnapshot } from '../types/content';
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
const LOCAL_PUBLISHED_KEY = 'smart_nfc_published_content';
const LOCAL_DRAFT_KEY = 'smart_nfc_draft_content';
const LOCAL_VERSIONS_KEY = 'smart_nfc_version_history';
const LOCAL_OWNER_AUTH_KEY = 'smart_nfc_owner_authenticated';

// Configured Owner UID and Email (from environment or defaults)
export const CONFIGURED_OWNER_UID = import.meta.env.VITE_OWNER_UID || '';
export const CONFIGURED_OWNER_EMAIL = (import.meta.env.VITE_OWNER_EMAIL || 'rahulnagv.dev@gmail.com').toLowerCase();

/**
 * Validates if the authenticated user is the designated owner.
 * Checks against VITE_OWNER_UID (if set) and VITE_OWNER_EMAIL.
 */
export function isUserAuthorizedOwner(user: User | null): boolean {
  if (!user) return false;
  
  // If UID is configured, verify UID match
  if (CONFIGURED_OWNER_UID && user.uid === CONFIGURED_OWNER_UID) {
    return true;
  }
  
  // Verify by email
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
    const local = localStorage.getItem(LOCAL_PUBLISHED_KEY);
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
      console.warn('Could not load draft from Firestore:', err);
    }
  }

  // Local fallback
  try {
    const localDraft = localStorage.getItem(LOCAL_DRAFT_KEY);
    if (localDraft) {
      return JSON.parse(localDraft) as PublishedProfileData;
    }
  } catch (e) {
    console.warn('Failed to parse local draft:', e);
  }

  return null;
}

/**
 * Persist draft changes
 */
export async function saveDraftToStorage(
  profileId: string = 'rahulnagv',
  draftData: PublishedProfileData,
  ownerUid?: string
): Promise<void> {
  // Always update local cache for instant recovery
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
 * Publish profile live and append version snapshot
 */
export async function publishProfileLive(
  profileId: string = 'rahulnagv',
  dataToPublish: PublishedProfileData,
  ownerUid: string = 'owner'
): Promise<VersionSnapshot> {
  const newVersion = (dataToPublish.version || 1) + 1;
  const now = new Date().toISOString();

  const publishedData: PublishedProfileData = {
    ...dataToPublish,
    version: newVersion,
    updatedAt: now,
    publishedAt: now,
  };

  const snapshot: VersionSnapshot = {
    id: `v${newVersion}-${Date.now()}`,
    version: newVersion,
    timestamp: now,
    description: `Published version ${newVersion}`,
    publishedBy: ownerUid,
    data: publishedData,
  };

  // Local sync
  try {
    localStorage.setItem(LOCAL_PUBLISHED_KEY, JSON.stringify(publishedData));
    localStorage.removeItem(LOCAL_DRAFT_KEY);

    const existingVersionsStr = localStorage.getItem(LOCAL_VERSIONS_KEY);
    const versions: VersionSnapshot[] = existingVersionsStr ? JSON.parse(existingVersionsStr) : [];
    versions.unshift(snapshot);
    // Limit to latest 30 versions in local storage
    localStorage.setItem(LOCAL_VERSIONS_KEY, JSON.stringify(versions.slice(0, 30)));
  } catch (err) {
    console.warn('Local persistence warning during publish:', err);
  }

  // Firestore sync
  if (db && isFirebaseConfigured) {
    const profileRef = doc(db, 'profiles', profileId);
    await setDoc(profileRef, {
      ownerUid,
      publishedContent: publishedData,
      publishedVersion: newVersion,
      updatedAt: now,
      publishedAt: now,
    }, { merge: true });

    // Clear remote draft
    const draftRef = doc(db, 'profiles', profileId, 'private', 'draft');
    await setDoc(draftRef, {
      draftContent: publishedData,
      updatedAt: now,
      ownerUid,
    });

    // Create version snapshot
    const versionRef = doc(db, 'profiles', profileId, 'versions', snapshot.id);
    await setDoc(versionRef, {
      ...snapshot,
    });
  }

  return snapshot;
}

/**
 * Fetch version history
 */
export async function fetchVersionHistory(profileId: string = 'rahulnagv'): Promise<VersionSnapshot[]> {
  if (db && isFirebaseConfigured) {
    try {
      const versionsCol = collection(db, 'profiles', profileId, 'versions');
      const q = query(versionsCol, orderBy('timestamp', 'desc'), limit(30));
      const querySnapshot = await getDocs(q);
      const list: VersionSnapshot[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push(docSnap.data() as VersionSnapshot);
      });
      if (list.length > 0) return list;
    } catch (err) {
      console.warn('Could not fetch versions from Firestore:', err);
    }
  }

  try {
    const local = localStorage.getItem(LOCAL_VERSIONS_KEY);
    if (local) {
      return JSON.parse(local) as VersionSnapshot[];
    }
  } catch { }

  return [];
}

/**
 * Upload image to Firebase Storage or fallback to base64 DataURL
 */
export async function uploadMediaFile(
  file: File,
  folder: 'profile' | 'projects' | 'id-card' | 'backgrounds',
  ownerUid: string = 'owner'
): Promise<string> {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, WEBP, or SVG image.');
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size exceeds the 5MB limit.');
  }

  // If Firebase Storage is initialized and configured
  if (storage && isFirebaseConfigured) {
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `profiles/${ownerUid}/${folder}/${Date.now()}_${sanitizedName}`;
    const fileRef = ref(storage, storagePath);
    const uploadTask = await uploadBytesResumable(fileRef, file);
    return await getDownloadURL(uploadTask.ref);
  }

  // Fallback: Convert to Base64 Data URL so user can immediately see and use their images
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}
