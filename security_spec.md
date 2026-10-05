# Security Specification (`security_spec.md`)

## 1. Data Invariants
1. **Strict Ownership Isolation (PII & HIPAA Boundary)**: Every `Patient` and `Appointment` document contains PII (`email`, `phone`, `name`, `clinicalNotes`) and MUST have `ownerId == request.auth.uid`. Reads (`get` and `list`), creates, updates, and deletes are strictly restricted to the owning specialist with a verified email (`request.auth.token.email_verified == true`).
2. **Path Variable Hardening**: Every document ID (`{patientId}`, `{appointmentId}`) on single-document operations (`get`, `create`, `update`, `delete`) MUST match `^[a-zA-Z0-9_\-]+$` and be `<= 128` characters.
3. **Immutable Audit Trail**: `ownerId` and `createdAt` can never be modified after document creation (`incoming().ownerId == existing().ownerId && incoming().createdAt == existing().createdAt`).
4. **Temporal Integrity**: `createdAt` and `updatedAt` must strictly equal `request.time`.
5. **Relational Integrity**: An `Appointment` can only be created if the referenced `/patients/$(incoming().patientId)` exists and belongs to `request.auth.uid`.

## 2. The "Dirty Dozen" Payloads
1. **Identity Spoofing**: Creating a patient with `ownerId: "victim-uid"` while authenticated as `"attacker-uid"`. -> `PERMISSION_DENIED`
2. **Unverified Email Write**: Creating a patient when `request.auth.token.email_verified == false`. -> `PERMISSION_DENIED`
3. **Shadow Field Injection (Create)**: Creating a patient with extra unauthorized field `isAdmin: true`. -> `PERMISSION_DENIED`
4. **Shadow Field Injection (Update)**: Updating a patient with `affectedKeys` containing an undeclared key `hacked: 1`. -> `PERMISSION_DENIED`
5. **Immutable Field Mutation**: Updating `ownerId` or `createdAt` on an existing patient. -> `PERMISSION_DENIED`
6. **Client Timestamp Forgery**: Creating or updating a patient with a forged `updatedAt` timestamp != `request.time`. -> `PERMISSION_DENIED`
7. **Resource Poisoning (Oversized String)**: Setting `clinicalNotes` to a 10,000-character string (exceeds `maxLength: 2000`). -> `PERMISSION_DENIED`
8. **ID Poisoning**: Creating a document with an invalid ID containing spaces or special characters. -> `PERMISSION_DENIED`
9. **Cross-Tenant PII Read (`get`)**: User B attempting `get` on `/patients/p1` owned by User A. -> `PERMISSION_DENIED`
10. **Unscoped List Scraping (`list`)**: User B attempting an unfiltered `list` query on `/patients` without `where('ownerId', '==', request.auth.uid)`. -> `PERMISSION_DENIED`
11. **Orphaned Appointment Creation**: Creating an appointment pointing to a non-existent `patientId`. -> `PERMISSION_DENIED`
12. **Value Poisoning on Update**: Updating `currentWeight` with a string `"78kg"` instead of a valid `number`. -> `PERMISSION_DENIED`
