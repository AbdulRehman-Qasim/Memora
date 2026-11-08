import { expect } from 'chai';
import api from '@/services/api';
import authService from '@/services/auth.service';
import notesService from '@/services/notes.service';
import { ApiError } from '@/types/auth.types';

describe('Frontend Services Suite', () => {
  let originalPost: typeof api.post;
  let originalGet: typeof api.get;
  let originalPatch: typeof api.patch;
  let originalDelete: typeof api.delete;

  beforeEach(() => {
    originalPost = api.post;
    originalGet = api.get;
    originalPatch = api.patch;
    originalDelete = api.delete;
  });

  afterEach(() => {
    api.post = originalPost;
    api.get = originalGet;
    api.patch = originalPatch;
    api.delete = originalDelete;
  });

  describe('Auth Service', () => {
    it('login: should return user data on success', async () => {
      const mockUser = { id: 'u1', name: 'User One', email: 'user@example.com' };
      api.post = (async () => ({
        data: { success: true, data: mockUser },
      })) as any;

      const result = await authService.login('user@example.com', 'password123');
      expect(result.success).to.be.true;
      expect(result.data?.email).to.equal('user@example.com');
    });

    it('login: should throw ApiError on 401 response', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 401,
          data: { success: false, error: 'Invalid email or password' },
        },
      };
      api.post = (() => Promise.reject(axiosError)) as any;

      try {
        await authService.login('wrong@example.com', 'wrongpassword');
        expect.fail('Should have thrown an ApiError');
      } catch (err: any) {
        expect(err).to.be.instanceOf(ApiError);
        expect(err.statusCode).to.equal(401);
        expect(err.message).to.equal('Invalid email or password');
      }
    });

    it('register: should return new user on success', async () => {
      const mockUser = { id: 'u2', name: 'New User', email: 'new@example.com' };
      api.post = (async () => ({
        data: { success: true, data: mockUser },
      })) as any;

      const result = await authService.register('New User', 'new@example.com', 'Password@123');
      expect(result.success).to.be.true;
      expect(result.data?.name).to.equal('New User');
    });

    it('register: should format validation errors array properly', async () => {
      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: {
            success: false,
            errors: [{ field: 'email', msg: 'Invalid email format' }],
          },
        },
      };
      api.post = (() => Promise.reject(axiosError)) as any;

      try {
        await authService.register('Name', 'invalid-email', '123');
        expect.fail('Should have thrown ApiError');
      } catch (err: any) {
        expect(err).to.be.instanceOf(ApiError);
        expect(err.statusCode).to.equal(400);
        expect(err.message).to.equal('Invalid email format');
        expect(err.errors).to.have.lengthOf(1);
      }
    });

    it('getCurrentUser: should fetch current user profile', async () => {
      api.get = (async () => ({
        data: { success: true, data: { id: 'u1', name: 'Current User', email: 'current@example.com' } },
      })) as any;

      const result = await authService.getCurrentUser();
      expect(result.success).to.be.true;
      expect(result.data?.name).to.equal('Current User');
    });

    it('logout: should make logout request and return success', async () => {
      api.post = (async () => ({
        data: { success: true, message: 'Logged out successfully' },
      })) as any;

      const result = await authService.logout();
      expect(result.success).to.be.true;
      expect(result.message).to.equal('Logged out successfully');
    });
  });

  describe('Notes Service', () => {
    it('getNotes: should fetch list of notes', async () => {
      const mockNotes = [
        { id: 'n1', title: 'Note 1', content: 'Content 1', isPinned: false, createdAt: '2026-01-01', updatedAt: '2026-01-01', userId: 'u1' },
      ];
      api.get = (async () => ({
        data: { success: true, data: mockNotes },
      })) as any;

      const result = await notesService.getNotes();
      expect(result.success).to.be.true;
      expect(result.data).to.have.lengthOf(1);
      expect(result.data?.[0].title).to.equal('Note 1');
    });

    it('createNote: should create a new note', async () => {
      const newNote = { id: 'n2', title: 'Note 2', content: 'Content 2', createdAt: '2026-01-01', updatedAt: '2026-01-01', userId: 'u1' };
      api.post = (async () => ({
        data: { success: true, data: newNote },
      })) as any;

      const result = await notesService.createNote({ title: 'Note 2', content: 'Content 2' });
      expect(result.success).to.be.true;
      expect(result.data?.title).to.equal('Note 2');
    });

    it('updateNote: should patch note fields', async () => {
      const updatedNote = { id: 'n1', title: 'Updated Title', content: 'Content 1', createdAt: '2026-01-01', updatedAt: '2026-01-02', userId: 'u1' };
      api.patch = (async () => ({
        data: { success: true, data: updatedNote },
      })) as any;

      const result = await notesService.updateNote('n1', { title: 'Updated Title' });
      expect(result.success).to.be.true;
      expect(result.data?.title).to.equal('Updated Title');
    });

    it('deleteNote: should delete note by id', async () => {
      api.delete = (async () => ({
        data: { success: true, message: 'Note deleted' },
      })) as any;

      const result = await notesService.deleteNote('n1');
      expect(result.success).to.be.true;
      expect(result.message).to.equal('Note deleted');
    });

    it('importNotes: should send array of notes and return imported notes', async () => {
      const importedNotes = [
        { id: 'n1', title: 'T1', content: 'C1', userId: 'u1', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
        { id: 'n2', title: 'T2', content: 'C2', userId: 'u1', createdAt: '2026-01-01', updatedAt: '2026-01-01' },
      ];
      api.post = (async () => ({
        data: { success: true, data: importedNotes },
      })) as any;

      const result = await notesService.importNotes([
        { title: 'T1', content: 'C1' },
        { title: 'T2', content: 'C2' },
      ]);
      expect(result.success).to.be.true;
      expect(result.data).to.have.lengthOf(2);
    });
  });
});
