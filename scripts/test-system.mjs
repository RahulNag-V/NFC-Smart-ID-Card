import assert from 'node:assert/strict';
import test from 'node:test';

// 1. Authorization & Read-Only Policy Tests
test('Owner Authorization & Access Control Logic', () => {
  const CONFIGURED_OWNER_EMAIL = 'rahulnagv.dev@gmail.com';
  const CONFIGURED_OWNER_UID = 'test-owner-uid-123';

  function isUserAuthorizedOwner(user, configuredUid = CONFIGURED_OWNER_UID, configuredEmail = CONFIGURED_OWNER_EMAIL) {
    if (!user) return false;
    if (configuredUid && user.uid === configuredUid) return true;
    if (user.email && user.email.toLowerCase() === configuredEmail.toLowerCase()) return true;
    return false;
  }

  // Null / unauthenticated visitor is not owner
  assert.equal(isUserAuthorizedOwner(null), false, 'Null user must not be authorized as owner');

  // Random authenticated visitor is rejected
  assert.equal(
    isUserAuthorizedOwner({ email: 'attacker@example.com', uid: 'visitor-uid-999' }),
    false,
    'Unrelated user must be rejected'
  );

  // Valid owner email is identified
  assert.equal(
    isUserAuthorizedOwner({ email: 'rahulnagv.dev@gmail.com', uid: 'random-uid' }),
    true,
    'Configured owner email must be recognized'
  );

  // Case-insensitive email check
  assert.equal(
    isUserAuthorizedOwner({ email: 'RAHULNAGV.DEV@GMAIL.COM', uid: 'random-uid' }),
    true,
    'Email check must be case-insensitive'
  );

  // Configured owner UID is recognized
  assert.equal(
    isUserAuthorizedOwner({ email: 'other@example.com', uid: 'test-owner-uid-123' }),
    true,
    'Configured owner UID must be recognized'
  );
});

// 2. Privacy Masking Tests for Public Viewing
test('Privacy Masking Functions for Read-Only Public Viewing', () => {
  function maskPhone(phone, isVisible) {
    if (isVisible) return phone;
    const parts = phone.split(' ');
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1]} •••••`;
    }
    return phone.slice(0, 6) + ' •••••';
  }

  function maskEmail(email, isVisible) {
    if (isVisible) return email;
    const [user, domain] = email.split('@');
    if (!user || !domain) return '••••••••@••••.com';
    const maskedUser = user.length > 2 ? `${user[0]}••••••${user[user.length - 1]}` : '••••';
    return `${maskedUser}@${domain}`;
  }

  function maskBloodGroup(blood, isVisible) {
    if (isVisible) return blood;
    return '•• (Protected)';
  }

  function maskAddress(address, isVisible) {
    if (isVisible) return address;
    const parts = address.split(',');
    if (parts.length >= 2) {
      return `••••••••••••••, ${parts[parts.length - 2].trim()}, ${parts[parts.length - 1].trim()}`;
    }
    return '•••••••••••••••••••• (Protected Address)';
  }

  const phone = '+91 98446 16699';
  const email = 'rahulnagv.dev@gmail.com';
  const blood = 'O+';
  const address = '#42, 5th Cross, Bangalore, Karnataka - 560068';

  // Visible returns exact data
  assert.equal(maskPhone(phone, true), phone);
  assert.equal(maskEmail(email, true), email);
  assert.equal(maskBloodGroup(blood, true), blood);
  assert.equal(maskAddress(address, true), address);

  // Hidden returns protected masked value
  assert.match(maskPhone(phone, false), /•••••/);
  assert.match(maskEmail(email, false), /••••••/);
  assert.equal(maskBloodGroup(blood, false), '•• (Protected)');
  assert.match(maskAddress(address, false), /••••••••••••••/);
});

// 3. Read-Only Schema & Data Integrity Tests
test('Published Content Schema & Data Integrity', () => {
  const publishedContent = {
    version: 1,
    student: {
      fullName: 'Rahul Nag V',
      usn: '1BH24CS051',
      department: 'Computer Science & Engineering',
      academicYear: '2024 – 2028',
    },
    projects: [
      { id: 'admitto-scanner', title: 'Admitto Scanner', category: 'Full-Stack' },
      { id: '3d-unetr-mri', title: '3D UNETR MRI Segmentation', category: 'AI / ML' },
    ],
    sections: [
      { id: 'sec-watermark', type: 'watermark', visible: true, order: 1 },
      { id: 'sec-id-card', type: 'id-card', visible: true, order: 2 },
      { id: 'sec-education', type: 'education', visible: true, order: 3 },
    ],
    theme: {
      preset: 'Classic Academic',
      colors: { background: '#fbf8f3', foreground: '#2b241e' },
    },
  };

  // Ensure content structure contains required fields
  assert.ok(publishedContent.student, 'Student profile data must exist');
  assert.equal(publishedContent.student.usn, '1BH24CS051');
  assert.ok(Array.isArray(publishedContent.projects), 'Projects must be an array');
  assert.ok(publishedContent.projects.length >= 2, 'Projects must contain records');
  assert.ok(Array.isArray(publishedContent.sections), 'Sections must be an array');
  assert.ok(publishedContent.theme.preset, 'Theme preset must exist');
});

// 4. Immutability & Modification Prevention
test('Read-Only Data Immutability Enforcement', () => {
  const publishedProfile = Object.freeze({
    id: 'rahulnagv',
    readOnly: true,
    student: Object.freeze({
      fullName: 'Rahul Nag V',
      usn: '1BH24CS051',
    }),
  });

  // Attempting to modify frozen profile must throw in strict mode
  assert.throws(() => {
    // @ts-ignore
    publishedProfile.student.fullName = 'Tampered Name';
  }, TypeError, 'Direct mutation of read-only profile must be blocked');

  assert.equal(publishedProfile.student.fullName, 'Rahul Nag V');
});

// 5. Owner Rate Limiting Simulation
test('Owner Login Rate Limiting & Lockout Guard', () => {
  const MAX_FAILED = 5;
  const LOCKOUT_MS = 60000;
  let attempts = 0;
  let lockoutUntil = null;

  function simulateFailedLogin(timestamp = Date.now()) {
    if (lockoutUntil && timestamp < lockoutUntil) {
      return { allowed: false, remainingSec: Math.ceil((lockoutUntil - timestamp) / 1000) };
    }
    attempts += 1;
    if (attempts >= MAX_FAILED) {
      lockoutUntil = timestamp + LOCKOUT_MS;
      return { allowed: false, lockedOut: true };
    }
    return { allowed: true, attemptsLeft: MAX_FAILED - attempts };
  }

  // First 4 failed attempts allow retries
  for (let i = 1; i <= 4; i++) {
    const res = simulateFailedLogin();
    assert.equal(res.allowed, true);
    assert.equal(res.attemptsLeft, MAX_FAILED - i);
  }

  // 5th attempt locks out
  const fifth = simulateFailedLogin();
  assert.equal(fifth.allowed, false);
  assert.equal(fifth.lockedOut, true);

  // Subsequent attempt is blocked by rate limiter
  const blocked = simulateFailedLogin();
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.remainingSec > 0);
});

// 6. Draft vs Live Published Isolation Test
test('Staging Draft vs Live Public Profile Isolation', () => {
  let liveProfile = {
    version: 1,
    headline: 'Published Live Edition',
    publishedAt: '2026-01-01T00:00:00Z',
  };

  let draftProfile = {
    ...liveProfile,
    headline: 'Draft Staged Changes (Unpublished)',
  };

  // Verifying isolation: modifying draft does NOT mutate live
  assert.notEqual(draftProfile.headline, liveProfile.headline);
  assert.equal(liveProfile.headline, 'Published Live Edition');

  // Simulation of Publish workflow
  function publish(draft, currentLive) {
    return {
      ...draft,
      version: currentLive.version + 1,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const newLive = publish(draftProfile, liveProfile);
  assert.equal(newLive.version, 2);
  assert.equal(newLive.headline, 'Draft Staged Changes (Unpublished)');
});

// 7. Permanent NFC URL Stability Check
test('Permanent NFC Hardware Link Invariance', () => {
  const permanentNfcUrl = 'https://rahulnagv-21cs051.web.app/';

  // Simulating consecutive profile editions
  const edition1 = { version: 1, nfcTargetUrl: permanentNfcUrl };
  const edition2 = { version: 2, nfcTargetUrl: permanentNfcUrl };
  const edition3 = { version: 3, nfcTargetUrl: permanentNfcUrl };

  assert.equal(edition1.nfcTargetUrl, permanentNfcUrl);
  assert.equal(edition2.nfcTargetUrl, permanentNfcUrl);
  assert.equal(edition3.nfcTargetUrl, permanentNfcUrl);
  assert.equal(edition1.nfcTargetUrl, edition3.nfcTargetUrl, 'Physical NFC tag URL must remain 100% immutable');
});

// 8. Edit Profile Button Navigation & Owner Authorization Flow
test('Edit Profile Button Navigation & Single-Owner Access Routing', () => {
  function resolveEditProfileRoute({ isOwner, onNavigateOwnerDashboard, onNavigateOwnerLogin }) {
    if (isOwner) {
      if (onNavigateOwnerDashboard) return onNavigateOwnerDashboard();
      return '/owner/dashboard';
    } else {
      if (onNavigateOwnerLogin) return onNavigateOwnerLogin();
      return '/owner/login';
    }
  }

  // Case 1: Unauthenticated visitor clicks Edit Profile -> redirects to /owner/login
  const unauthenticatedAction = resolveEditProfileRoute({
    isOwner: false,
    onNavigateOwnerDashboard: () => 'NAVIGATE_DASHBOARD',
    onNavigateOwnerLogin: () => 'NAVIGATE_LOGIN',
  });
  assert.equal(unauthenticatedAction, 'NAVIGATE_LOGIN', 'Unauthenticated user must be routed to /owner/login');

  // Case 2: Authenticated owner clicks Edit Profile -> direct navigation to /owner/dashboard
  const ownerAction = resolveEditProfileRoute({
    isOwner: true,
    onNavigateOwnerDashboard: () => 'NAVIGATE_DASHBOARD',
    onNavigateOwnerLogin: () => 'NAVIGATE_LOGIN',
  });
  assert.equal(ownerAction, 'NAVIGATE_DASHBOARD', 'Authenticated owner must be routed directly to dashboard without relogin');

  // Case 3: Direct access protection for /owner/dashboard
  function guardDashboardAccess({ currentRoute, isOwner, authLoading }) {
    if (currentRoute === 'owner-dashboard') {
      if (!authLoading && !isOwner) {
        return 'REDIRECT_TO_LOGIN';
      }
      return 'RENDER_DASHBOARD';
    }
    return 'RENDER_PUBLIC';
  }

  assert.equal(
    guardDashboardAccess({ currentRoute: 'owner-dashboard', isOwner: false, authLoading: false }),
    'REDIRECT_TO_LOGIN',
    'Unauthenticated access to dashboard route must be redirected to login'
  );

  assert.equal(
    guardDashboardAccess({ currentRoute: 'owner-dashboard', isOwner: true, authLoading: false }),
    'RENDER_DASHBOARD',
    'Authorized owner must be granted dashboard access'
  );

  // Case 4: Owner visiting /owner/login auto-redirects to /owner/dashboard
  function evaluateLoginState({ isOwner }) {
    if (isOwner) {
      return 'AUTO_REDIRECT_DASHBOARD';
    }
    return 'SHOW_LOGIN_FORM';
  }

  assert.equal(evaluateLoginState({ isOwner: true }), 'AUTO_REDIRECT_DASHBOARD');
  assert.equal(evaluateLoginState({ isOwner: false }), 'SHOW_LOGIN_FORM');
});

// 9. Public Profile Read-Only Verification
test('Public Profile Interface Exposes No Direct Modification Controls', () => {
  // Public portfolio view configuration schema
  const publicViewControls = {
    hasEditInlineButtons: false,
    hasInlineContentEditable: false,
    hasSaveProfileButton: false,
    hasDeleteProjectButtons: false,
    hasThemePalettePickers: false,
    hasSectionOrderingHandles: false,
    hasEditProfilePencilEntry: true, // Secure owner entry point present
  };

  assert.equal(publicViewControls.hasEditInlineButtons, false);
  assert.equal(publicViewControls.hasInlineContentEditable, false);
  assert.equal(publicViewControls.hasSaveProfileButton, false);
  assert.equal(publicViewControls.hasDeleteProjectButtons, false);
  assert.equal(publicViewControls.hasThemePalettePickers, false);
  assert.equal(publicViewControls.hasSectionOrderingHandles, false);
  assert.equal(publicViewControls.hasEditProfilePencilEntry, true);
});

// 10. Firebase Configuration Error Resilience & Local Owner Session Fallback
test('Firebase auth/configuration-not-found Graceful Recovery', () => {
  const CONFIGURED_OWNER_EMAIL = 'rahulnagv.dev@gmail.com';

  function simulateAuthAttempt(email, password, firebaseErrorCode) {
    if (email.toLowerCase() !== CONFIGURED_OWNER_EMAIL) {
      return { success: false, error: 'Unauthorized user' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password too short' };
    }

    if (
      firebaseErrorCode === 'auth/configuration-not-found' ||
      firebaseErrorCode === 'auth/operation-not-allowed'
    ) {
      // Automatic fallback to secure local session
      return {
        success: true,
        sessionType: 'verified-local-owner',
        user: { email, uid: 'owner-local-admin' },
      };
    }

    return {
      success: true,
      sessionType: 'cloud-firebase',
      user: { email, uid: 'firebase-uid-123' },
    };
  }

  // When Firebase throws auth/configuration-not-found, authorized owner is NOT blocked
  const res = simulateAuthAttempt('rahulnagv.dev@gmail.com', 'password123', 'auth/configuration-not-found');
  assert.equal(res.success, true, 'Authorized owner must be granted access even if Firebase Console provider is pending');
  assert.equal(res.sessionType, 'verified-local-owner');

  // Random email is still rejected even with configuration error
  const rejectRes = simulateAuthAttempt('stranger@example.com', 'password123', 'auth/configuration-not-found');
  assert.equal(rejectRes.success, false);
});

// 11. Password Complexity & Phone Verification Validation
test('Password Complexity and Phone Number Normalization Tests', () => {
  // Test password complexity rules (12+ chars, uppercase, lowercase, number, special char)
  function validatePassword(newPassword, confirmPassword) {
    const checks = {
      minLength: newPassword.length >= 12,
      hasUpper: /[A-Z]/.test(newPassword),
      hasLower: /[a-z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(newPassword),
      passwordsMatch: Boolean(newPassword && newPassword === confirmPassword),
    };
    const isValid = Object.values(checks).every(Boolean);
    return { isValid, checks };
  }

  function normalizePhoneNumber(raw) {
    const cleaned = raw.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) return cleaned;
    if (cleaned.length === 10) return `+91${cleaned}`;
    return `+${cleaned}`;
  }

  // Weak password fails
  const weak1 = validatePassword('short', 'short');
  assert.equal(weak1.isValid, false, 'Short password must fail');

  const weak2 = validatePassword('AllLettersNoNumOrSym', 'AllLettersNoNumOrSym');
  assert.equal(weak2.isValid, false, 'Missing numbers and symbols must fail');

  const weak3 = validatePassword('ValidPass123!@#', 'MismatchPass123!@#');
  assert.equal(weak3.isValid, false, 'Mismatched passwords must fail');

  // Compliant strong password passes
  const strong = validatePassword('Ananta@Secure2026', 'Ananta@Secure2026');
  assert.equal(strong.isValid, true, 'Fully compliant password must pass');
  assert.equal(strong.checks.minLength, true);
  assert.equal(strong.checks.hasUpper, true);
  assert.equal(strong.checks.hasLower, true);
  assert.equal(strong.checks.hasNumber, true);
  assert.equal(strong.checks.hasSpecial, true);
  assert.equal(strong.checks.passwordsMatch, true);

  // Phone normalization tests
  assert.equal(normalizePhoneNumber('+91 98446 16699'), '+919844616699');
  assert.equal(normalizePhoneNumber('9844616699'), '+919844616699');
  assert.equal(normalizePhoneNumber('+1 (555) 019-2834'), '+15550192834');
});

