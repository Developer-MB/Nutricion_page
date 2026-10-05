/**
 * Firestore Security Rules Test Suite verifying the Dirty Dozen payloads
 * result in PERMISSION_DENIED.
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  collection: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  expected: 'PERMISSION_DENIED';
  payload?: Record<string, unknown>;
}

export const DIRTY_DOZEN_TESTS: DirtyDozenTestCase[] = [
  {
    id: 1,
    name: 'Identity Spoofing on Patient Create',
    collection: 'patients',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { ownerId: 'other-user-uid', name: 'Juan Pérez' },
  },
  {
    id: 2,
    name: 'Unverified Email Write',
    collection: 'patients',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Shadow Field Injection on Create',
    collection: 'patients',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { isSuperAdmin: true },
  },
  {
    id: 4,
    name: 'Shadow Field Injection on Update',
    collection: 'patients',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { extraShadowKey: 'malicious' },
  },
  {
    id: 5,
    name: 'Immutable Field Mutation (ownerId)',
    collection: 'patients',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { ownerId: 'hijacked-uid' },
  },
  {
    id: 6,
    name: 'Client Timestamp Forgery',
    collection: 'patients',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { updatedAt: '1999-01-01T00:00:00Z' },
  },
  {
    id: 7,
    name: 'Resource Poisoning (Oversized clinicalNotes)',
    collection: 'patients',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { clinicalNotes: 'A'.repeat(2500) },
  },
  {
    id: 8,
    name: 'Path ID Poisoning',
    collection: 'patients',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Cross-Tenant PII Read (get)',
    collection: 'patients',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Unscoped List Query Scraping',
    collection: 'patients',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Orphaned Appointment Creation',
    collection: 'appointments',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { patientId: 'non-existent-id' },
  },
  {
    id: 12,
    name: 'Value Poisoning on Update (wrong type for currentWeight)',
    collection: 'patients',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { currentWeight: 'seventy-eight' },
  },
];
