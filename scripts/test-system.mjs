import assert from 'node:assert/strict';
import test from 'node:test';

// 1. Authorization Verification Tests
test('Owner Authorization Logic', () => {
  const CONFIGURED_OWNER_EMAIL = 'rahulnagv.dev@gmail.com';
  const CONFIGURED_OWNER_UID = 'test-owner-uid-123';

  function isUserAuthorizedOwner(user, configuredUid = CONFIGURED_OWNER_UID, configuredEmail = CONFIGURED_OWNER_EMAIL) {
    if (!user) return false;
    if (configuredUid && user.uid === configuredUid) return true;
    if (user.email && user.email.toLowerCase() === configuredEmail.toLowerCase()) return true;
    return false;
  }

  // Null user is rejected
  assert.equal(isUserAuthorizedOwner(null), false, 'Null user must be rejected');

  // Random authenticated visitor is rejected
  assert.equal(
    isUserAuthorizedOwner({ email: 'attacker@example.com', uid: 'visitor-uid-999' }),
    false,
    'Unrelated user must be rejected'
  );

  // Valid owner email is accepted
  assert.equal(
    isUserAuthorizedOwner({ email: 'rahulnagv.dev@gmail.com', uid: 'random-uid' }),
    true,
    'Configured owner email must be authorized'
  );

  // Case-insensitive email check
  assert.equal(
    isUserAuthorizedOwner({ email: 'RAHULNAGV.DEV@GMAIL.COM', uid: 'random-uid' }),
    true,
    'Email check must be case-insensitive'
  );

  // Configured owner UID is accepted
  assert.equal(
    isUserAuthorizedOwner({ email: 'other@example.com', uid: 'test-owner-uid-123' }),
    true,
    'Configured owner UID must be authorized'
  );
});

// 2. Privacy Masking Tests
test('Privacy Masking Functions', () => {
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

  const phone = '+91 98446 16699';
  const email = 'rahulnagv.dev@gmail.com';
  const blood = 'O+';

  // Visible returns exact data
  assert.equal(maskPhone(phone, true), phone);
  assert.equal(maskEmail(email, true), email);
  assert.equal(maskBloodGroup(blood, true), blood);

  // Hidden returns protected masked value
  assert.match(maskPhone(phone, false), /•••••/);
  assert.match(maskEmail(email, false), /••••••/);
  assert.equal(maskBloodGroup(blood, false), '•• (Protected)');
});

// 3. Draft & Publishing Lifecycle Tests
test('Draft Mutation and Version Snapshotting', () => {
  let draft = {
    version: 1,
    student: { fullName: 'Rahul Nag V', usn: '1BH24CS051' },
    projects: [{ id: 'p1', title: 'Admitto Scanner' }],
    sections: [
      { id: 's1', title: 'Watermark', order: 1, visible: true },
      { id: 's2', title: 'ID Card', order: 2, visible: true },
    ],
    updatedAt: new Date().toISOString(),
  };

  // Undo/Redo stack test
  const undoStack = [];
  const redoStack = [];

  function mutate(updater) {
    undoStack.push(JSON.parse(JSON.stringify(draft)));
    draft = updater(draft);
  }

  function undo() {
    if (undoStack.length === 0) return;
    redoStack.push(JSON.parse(JSON.stringify(draft)));
    draft = undoStack.pop();
  }

  function redo() {
    if (redoStack.length === 0) return;
    undoStack.push(JSON.parse(JSON.stringify(draft)));
    draft = redoStack.pop();
  }

  // Mutate student name
  mutate((prev) => ({
    ...prev,
    student: { ...prev.student, fullName: 'Rahul Nag V (Updated)' },
  }));

  assert.equal(draft.student.fullName, 'Rahul Nag V (Updated)');
  assert.equal(undoStack.length, 1);

  // Undo
  undo();
  assert.equal(draft.student.fullName, 'Rahul Nag V');
  assert.equal(redoStack.length, 1);

  // Redo
  redo();
  assert.equal(draft.student.fullName, 'Rahul Nag V (Updated)');

  // Publishing snapshot
  function publish(currentDraft, ownerUid) {
    const nextVer = (currentDraft.version || 1) + 1;
    const now = new Date().toISOString();
    const published = {
      ...currentDraft,
      version: nextVer,
      updatedAt: now,
      publishedAt: now,
    };
    const snapshot = {
      id: `v${nextVer}-${Date.now()}`,
      version: nextVer,
      timestamp: now,
      description: `Published version ${nextVer}`,
      publishedBy: ownerUid,
      data: published,
    };
    return { published, snapshot };
  }

  const { published, snapshot } = publish(draft, 'owner-uid');
  assert.equal(published.version, 2);
  assert.equal(snapshot.version, 2);
  assert.equal(snapshot.publishedBy, 'owner-uid');
  assert.equal(snapshot.data.student.fullName, 'Rahul Nag V (Updated)');
});

// 4. Section Manager Reordering and Operations Tests
test('Section Reordering and Deduplication', () => {
  let sections = [
    { id: 'sec-1', title: 'Hero', order: 1, visible: true },
    { id: 'sec-2', title: 'ID Card', order: 2, visible: true },
    { id: 'sec-3', title: 'Projects', order: 3, visible: true },
  ];

  // Move ID Card up to index 0
  function moveSection(list, index, direction) {
    if (direction === 'up' && index === 0) return list;
    if (direction === 'down' && index === list.length - 1) return list;
    const copy = [...list];
    const target = direction === 'up' ? index - 1 : index + 1;
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    copy.forEach((s, idx) => {
      s.order = idx + 1;
    });
    return copy;
  }

  sections = moveSection(sections, 1, 'up');
  assert.equal(sections[0].id, 'sec-2');
  assert.equal(sections[0].order, 1);
  assert.equal(sections[1].id, 'sec-1');
  assert.equal(sections[1].order, 2);

  // Toggle visibility
  sections[1].visible = false;
  assert.equal(sections[1].visible, false);
});

// 5. JSON Backup Export & Schema Import Validation Tests
test('Backup Export & Import Schema Validation', () => {
  const content = {
    student: { fullName: 'Rahul Nag V', usn: '1BH24CS051' },
    projects: [{ id: 'p1', title: 'Admitto' }],
    theme: { preset: 'Classic Academic' },
  };

  const backupString = JSON.stringify({
    exportVersion: 1,
    exportedAt: new Date().toISOString(),
    content,
  });

  // Valid import
  const parsed = JSON.parse(backupString);
  assert.ok(parsed.content.student);
  assert.ok(parsed.content.projects);
  assert.equal(parsed.content.student.usn, '1BH24CS051');

  // Corrupted import check
  const invalidJson = JSON.stringify({ randomField: true });
  const parsedInvalid = JSON.parse(invalidJson);
  const isValid = Boolean(parsedInvalid.content && parsedInvalid.content.student && parsedInvalid.content.projects);
  assert.equal(isValid, false, 'Corrupted JSON backup must fail validation');
});
