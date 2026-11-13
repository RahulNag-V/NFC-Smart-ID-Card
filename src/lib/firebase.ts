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
import { defaultStudentData, maskPhone, maskEmail, maskAddress, maskBloodGroup } from '../data/student';

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
const LOCAL_PRIVATE_DETAILS_KEY = 'ananta_sparsha_private_details';

/**
 * Strips and masks sensitive private fields from public payload based on visibility toggles.
 * Ensures raw confidential phone, email, and home addresses are never published over the public network.
 */
export function sanitizePublicPayload(data: PublishedProfileData): PublishedProfileData {
  const vis = data.visibility || {};
  const student = data.student ? { ...data.student } : { ...defaultStudentData };

  if (!vis.showPhone) {
    student.phone = maskPhone(student.phone, false);
  }
  if (!vis.showEmail) {
    student.email = maskEmail(student.email, false);
  }
  if (!vis.showPermanentAddress) {
    student.permanentAddress = maskAddress(student.permanentAddress, false);
  }
  if (!vis.showCurrentAddress) {
    student.currentAddress = maskAddress(student.currentAddress, false);
  }
  if (!vis.showBloodGroup) {
    student.bloodGroup = maskBloodGroup(student.bloodGroup, false);
  }
  if (!vis.showDob) {
    student.dateOfBirth = '•••• •••••••• •••• (Protected by Privacy Toggle)';
  }

  // Also sanitize social channels phone/whatsapp link if phone visibility is off
  const sanitizedSocialChannels = (data.socialChannels || []).map((ch) => {
    if (ch.id === 'whatsapp' && !vis.showPhone) {
      return { ...ch, handle: '+91 ••••• •••••', url: 'https://wa.me/' };
    }
    return ch;
  });

  return {
    ...data,
    student,
    socialChannels: sanitizedSocialChannels,
  };
}

// Configured Owner UID, Email, and Phone (from environment or defaults)
export const CONFIGURED_OWNER_UID = import.meta.env.VITE_OWNER_UID || '';
export const CONFIGURED_OWNER_EMAIL = (import.meta.env.VITE_OWNER_EMAIL || 'rahulnagv.dev@gmail.com').toLowerCase();
export const CONFIGURED_OWNER_PHONE = (import.meta.env.VITE_OWNER_PHONE || '+91 98446 16699').trim();

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
 * Deep merge helper to prevent undefined schema breaks
 */
function mergeWithDefaults(data: any): PublishedProfileData {
  if (!data || typeof data !== 'object') return defaultInitialContent;

  return {
    ...defaultInitialContent,
    ...data,
    student: {
      ...defaultInitialContent.student,
      ...(data.student || {}),
      college: {
        ...defaultInitialContent.student.college,
        ...(data.student?.college || {}),
      },
      verification: {
        ...defaultInitialContent.student.verification,
        ...(data.student?.verification || {}),
      },
    },
    visibility: {
      ...defaultInitialContent.visibility,
      ...(data.visibility || {}),
    },
    theme: {
      ...defaultInitialContent.theme,
      ...(data.theme || {}),
      colors: {
        ...defaultInitialContent.theme.colors,
        ...(data.theme?.colors || {}),
      },
      typography: {
        ...defaultInitialContent.theme.typography,
        ...(data.theme?.typography || {}),
      },
      layout: {
        ...defaultInitialContent.theme.layout,
        ...(data.theme?.layout || {}),
      },
    },
    academic: {
      ...defaultInitialContent.academic,
      ...(data.academic || {}),
      engineering: data.academic?.engineering || defaultInitialContent.academic.engineering,
      schooling: data.academic?.schooling || defaultInitialContent.academic.schooling,
    },
    projects: Array.isArray(data.projects) && data.projects.length > 0 ? data.projects : defaultInitialContent.projects,
    skills: Array.isArray(data.skills) && data.skills.length > 0 ? data.skills : defaultInitialContent.skills,
    socialChannels: Array.isArray(data.socialChannels) && data.socialChannels.length > 0 ? data.socialChannels : defaultInitialContent.socialChannels,
    sections: Array.isArray(data.sections) && data.sections.length > 0 ? data.sections : defaultInitialContent.sections,
  };
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
          return mergeWithDefaults(data.publishedContent);
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
      return mergeWithDefaults(JSON.parse(local));
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
          return mergeWithDefaults(data.draftContent);
        }
      }

      // Fallback to private details if draft document is empty
      const detailsRef = doc(db, 'profiles', profileId, 'private', 'details');
      const detailsSnap = await getDoc(detailsRef);
      if (detailsSnap.exists()) {
        const d = detailsSnap.data();
        if (d.draftContent) {
          return mergeWithDefaults(d.draftContent);
        }
      }
    } catch (err) {
      console.warn('Could not load draft from Firestore, checking local storage:', err);
    }
  }

  // Local draft fallback
  try {
    const local = localStorage.getItem(LOCAL_DRAFT_KEY) || localStorage.getItem(LOCAL_PRIVATE_DETAILS_KEY);
    if (local) {
      return mergeWithDefaults(JSON.parse(local));
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
 * Strips masked confidential fields from the public document while saving full unmasked data in private storage
 */
export async function publishProfile(
  profileId: string = 'rahulnagv',
  dataToPublish: PublishedProfileData,
  ownerUid: string = 'owner'
): Promise<PublishedProfileData> {
  const newVersion = (dataToPublish.version || 1) + 1;
  const now = new Date().toISOString();

  // Full unmasked master dataset for owner's private storage
  const unmaskedMasterData: PublishedProfileData = {
    ...dataToPublish,
    version: newVersion,
    updatedAt: now,
    publishedAt: now,
  };

  // Sanitized public dataset stripping any fields that are not toggled visible
  const publicPayload = sanitizePublicPayload(unmaskedMasterData);

  // Sync to local storage
  try {
    localStorage.setItem(LOCAL_PUBLISHED_KEY, JSON.stringify(publicPayload));
    localStorage.setItem(LOCAL_PRIVATE_DETAILS_KEY, JSON.stringify(unmaskedMasterData));
    localStorage.removeItem(LOCAL_DRAFT_KEY);
  } catch (err) {
    console.warn('Local publish storage warning:', err);
  }

  // Sync to Cloud Firestore
  if (db && isFirebaseConfigured) {
    // 1. Public profile document (Sanitized payload ONLY)
    const profileRef = doc(db, 'profiles', profileId);
    await setDoc(profileRef, {
      ownerUid,
      publishedContent: publicPayload,
      publishedVersion: newVersion,
      updatedAt: now,
      publishedAt: now,
    }, { merge: true });

    // 2. Private details document (Full unmasked master data for owner)
    const detailsRef = doc(db, 'profiles', profileId, 'private', 'details');
    await setDoc(detailsRef, {
      draftContent: unmaskedMasterData,
      updatedAt: now,
      ownerUid,
    }, { merge: true });

    // 3. Update private draft document
    const draftRef = doc(db, 'profiles', profileId, 'private', 'draft');
    await setDoc(draftRef, {
      draftContent: unmaskedMasterData,
      updatedAt: now,
      ownerUid,
    }, { merge: true });
  }

  return unmaskedMasterData;
}

/**
 * Upload image to Firebase Storage or fallback to base64 DataURL
 */
export async function uploadOwnerMediaFile(
  file: File,
  folder: 'profile' | 'cover' | 'projects' | 'badges' | 'certificates',
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
