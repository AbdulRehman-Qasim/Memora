import { expect } from 'chai';
import { createMockNextRequest } from './mock-request';
import { POST as registerHandler } from '../../app/api/auth/register/route';
import { POST as loginHandler } from '../../app/api/auth/login/route';
import { POST as logoutHandler } from '../../app/api/auth/logout/route';
import { GET as meHandler } from '../../app/api/auth/me/route';
import { GET as getNotesHandler, POST as createNoteHandler } from '../../app/api/notes/route';
import { GET as getNoteHandler, PATCH as patchNoteHandler, DELETE as deleteNoteHandler } from '../../app/api/notes/[id]/route';
import { POST as importNotesHandler } from '../../app/api/notes/import/route';
import { signToken } from '../../lib/auth/jwt';
import prisma from '../../lib/database/prisma';

describe('Next.js API Route Handlers Integration Tests (with Mocked DB Services)', () => {
  const allowedOrigin = 'http://localhost:3000';
  const testUserId = 'test-user-id-123';
  const otherUserId = 'other-user-id-456';
  const validToken = signToken({ id: testUserId });

  describe('Security & CSRF Protection', () => {
    it('should reject state-changing requests when Origin and Referer are missing', async () => {
      const req = createMockNextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: { name: 'Alice', email: 'alice@example.com', password: 'Password123!' },
      });
      const res = await registerHandler(req);
      expect(res.status).to.equal(403);
      const json = await res.json();
      expect(json.success).to.be.false;
      expect(json.error).to.equal('Invalid request origin');
    });

    it('should reject state-changing requests from untrusted cross-origin', async () => {
      const req = createMockNextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { origin: 'http://malicious-site.com' },
        body: { name: 'Alice', email: 'alice@example.com', password: 'Password123!' },
      });
      const res = await registerHandler(req);
      expect(res.status).to.equal(403);
      const json = await res.json();
      expect(json.success).to.be.false;
      expect(json.error).to.equal('Invalid request origin');
    });

    it('should accept state-changing requests with valid same-origin headers', async () => {
      const req = createMockNextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { origin: allowedOrigin },
        body: { name: 'A', email: 'invalid-email', password: 'weak' },
      });
      const res = await registerHandler(req);
      // Valid origin passes CSRF to reach Zod validation (status 400), not CSRF 403
      expect(res.status).to.equal(400);
      const json = await res.json();
      expect(json.success).to.be.false;
    });
  });

  describe('Authentication Route Handlers', () => {
    let originalUserFindUnique: any;
    let originalUserCreate: any;

    beforeEach(() => {
      originalUserFindUnique = prisma.user.findUnique;
      originalUserCreate = prisma.user.create;
    });

    afterEach(() => {
      prisma.user.findUnique = originalUserFindUnique;
      prisma.user.create = originalUserCreate;
    });

    it('POST /api/auth/register: should return 400 when email already exists', async () => {
      (prisma.user.findUnique as any) = async () => ({
        id: 'existing-id',
        email: 'alice@example.com',
      });

      const req = createMockNextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { origin: allowedOrigin },
        body: { name: 'Alice', email: 'alice@example.com', password: 'Password123!' },
      });

      const res = await registerHandler(req);
      expect(res.status).to.equal(400);
      const json = await res.json();
      expect(json.success).to.be.false;
      expect(json.error).to.equal('User already exists');
    });

    it('POST /api/auth/register: should return 201 on valid user registration', async () => {
      (prisma.user.findUnique as any) = async () => null;
      (prisma.user.create as any) = async ({ data }: any) => ({
        id: 'new-id',
        name: data.name,
        email: data.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const req = createMockNextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { origin: allowedOrigin },
        body: { name: 'Alice Doe', email: 'alice.new@example.com', password: 'Password123!' },
      });

      const res = await registerHandler(req);
      expect(res.status).to.equal(201);
      const json = await res.json();
      expect(json.success).to.be.true;
      expect(json.data.email).to.equal('alice.new@example.com');
      expect(json.data).to.not.have.property('password');
    });

    it('POST /api/auth/login: should return 401 on non-existent user', async () => {
      (prisma.user.findUnique as any) = async () => null;

      const req = createMockNextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { origin: allowedOrigin },
        body: { email: 'notfound@example.com', password: 'Password123!' },
      });

      const res = await loginHandler(req);
      expect(res.status).to.equal(401);
      const json = await res.json();
      expect(json.success).to.be.false;
      expect(json.error).to.equal('Invalid email or password');
    });

    it('POST /api/auth/logout: should clear cookie and return 200', async () => {
      const req = createMockNextRequest('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: { origin: allowedOrigin },
      });

      const res = await logoutHandler(req);
      expect(res.status).to.equal(200);
      const json = await res.json();
      expect(json.success).to.be.true;
      expect(json.message).to.equal('Logged out successfully');
      expect(res.cookies.get('jwt')?.value).to.equal('');
    });

    it('GET /api/auth/me: should return 401 when token is missing', async () => {
      const req = createMockNextRequest('http://localhost:3000/api/auth/me', {
        method: 'GET',
      });

      const res = await meHandler(req);
      expect(res.status).to.equal(401);
      const json = await res.json();
      expect(json.success).to.be.false;
      expect(json.error).to.equal('Unauthorized');
    });

    it('GET /api/auth/me: should return 200 and user data when valid token is provided', async () => {
      (prisma.user.findUnique as any) = async () => ({
        id: testUserId,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const req = createMockNextRequest('http://localhost:3000/api/auth/me', {
        method: 'GET',
        cookies: { jwt: validToken },
      });

      const res = await meHandler(req);
      expect(res.status).to.equal(200);
      const json = await res.json();
      expect(json.success).to.be.true;
      expect(json.data.id).to.equal(testUserId);
      expect(json.data).to.not.have.property('password');
    });
  });

  describe('Notes Route Handlers & Authorization Checks', () => {
    let originalNoteFindMany: any;
    let originalNoteFindUnique: any;
    let originalNoteCreate: any;
    let originalNoteUpdate: any;
    let originalNoteDelete: any;
    let originalTransaction: any;

    beforeEach(() => {
      originalNoteFindMany = prisma.note.findMany;
      originalNoteFindUnique = prisma.note.findUnique;
      originalNoteCreate = prisma.note.create;
      originalNoteUpdate = prisma.note.update;
      originalNoteDelete = prisma.note.delete;
      originalTransaction = prisma.$transaction;
    });

    afterEach(() => {
      prisma.note.findMany = originalNoteFindMany;
      prisma.note.findUnique = originalNoteFindUnique;
      prisma.note.create = originalNoteCreate;
      prisma.note.update = originalNoteUpdate;
      prisma.note.delete = originalNoteDelete;
      prisma.$transaction = originalTransaction;
    });

    it('GET /api/notes: should reject unauthenticated requests with 401', async () => {
      const req = createMockNextRequest('http://localhost:3000/api/notes');
      const res = await getNotesHandler(req);
      expect(res.status).to.equal(401);
    });

    it('GET /api/notes: should retrieve notes scoped strictly to the authenticated user', async () => {
      let passedWhere: any = null;
      (prisma.note.findMany as any) = async (args: any) => {
        passedWhere = args.where;
        return [
          { id: 'note-1', title: 'Note 1', content: 'Content 1', userId: testUserId },
        ];
      };

      const req = createMockNextRequest('http://localhost:3000/api/notes', {
        cookies: { jwt: validToken },
      });

      const res = await getNotesHandler(req);
      expect(res.status).to.equal(200);
      expect(passedWhere?.userId).to.equal(testUserId);
    });

    it('POST /api/notes: should create a note bound to user ID', async () => {
      let createdData: any = null;
      (prisma.note.create as any) = async (args: any) => {
        createdData = args.data;
        return { id: 'new-note-id', ...args.data };
      };

      const req = createMockNextRequest('http://localhost:3000/api/notes', {
        method: 'POST',
        headers: { origin: allowedOrigin },
        cookies: { jwt: validToken },
        body: { title: 'My Note', content: 'Some content' },
      });

      const res = await createNoteHandler(req);
      expect(res.status).to.equal(201);
      expect(createdData.userId).to.equal(testUserId);
      expect(createdData.title).to.equal('My Note');
    });

    it('GET /api/notes/[id]: should return 404 when note belongs to another user (tenant isolation)', async () => {
      (prisma.note.findUnique as any) = async () => ({
        id: 'foreign-note',
        title: 'Secret Note',
        content: 'Confidential',
        userId: otherUserId, // Different user
      });

      const req = createMockNextRequest('http://localhost:3000/api/notes/foreign-note', {
        cookies: { jwt: validToken },
      });

      const res = await getNoteHandler(req, { params: Promise.resolve({ id: 'foreign-note' }) });
      expect(res.status).to.equal(404);
      const json = await res.json();
      expect(json.error).to.equal('Note not found');
    });

    it('PATCH /api/notes/[id]: should reject updating another user note', async () => {
      (prisma.note.findUnique as any) = async () => ({
        id: 'foreign-note',
        userId: otherUserId,
      });

      const req = createMockNextRequest('http://localhost:3000/api/notes/foreign-note', {
        method: 'PATCH',
        headers: { origin: allowedOrigin },
        cookies: { jwt: validToken },
        body: { title: 'Hacked Title' },
      });

      const res = await patchNoteHandler(req, { params: Promise.resolve({ id: 'foreign-note' }) });
      expect(res.status).to.equal(404);
    });

    it('DELETE /api/notes/[id]: should reject deleting another user note', async () => {
      (prisma.note.findUnique as any) = async () => ({
        id: 'foreign-note',
        userId: otherUserId,
      });

      const req = createMockNextRequest('http://localhost:3000/api/notes/foreign-note', {
        method: 'DELETE',
        headers: { origin: allowedOrigin },
        cookies: { jwt: validToken },
      });

      const res = await deleteNoteHandler(req, { params: Promise.resolve({ id: 'foreign-note' }) });
      expect(res.status).to.equal(404);
    });

    it('POST /api/notes/import: should execute import inside a transaction', async () => {
      let transactionExecuted = false;
      (prisma.$transaction as any) = async (fn: any) => {
        transactionExecuted = true;
        const fakeTx = {
          note: {
            create: async ({ data }: any) => ({ id: 'gen-id', ...data }),
          },
        };
        return fn(fakeTx);
      };

      const req = createMockNextRequest('http://localhost:3000/api/notes/import', {
        method: 'POST',
        headers: { origin: allowedOrigin },
        cookies: { jwt: validToken },
        body: [
          { title: 'Import 1', content: 'Content 1' },
          { title: 'Import 2', content: 'Content 2' },
        ],
      });

      const res = await importNotesHandler(req);
      expect(res.status).to.equal(201);
      expect(transactionExecuted).to.be.true;
      const json = await res.json();
      expect(json.data).to.have.lengthOf(2);
    });
  });
});

