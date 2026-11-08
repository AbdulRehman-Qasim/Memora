import { expect } from 'chai';
import { registerSchema, loginSchema, createNoteSchema, updateNoteSchema, importNotesSchema } from '../../lib/validations/schemas';
import { signToken, verifyToken } from '../../lib/auth/jwt';
import { hashPassword, comparePassword } from '../../lib/auth/password';

describe('Next.js Root Backend Unit Tests', () => {
  describe('Authentication Security & Hashing', () => {
    it('should correctly hash and verify passwords', async () => {
      const password = 'Password123!';
      const hash = await hashPassword(password);
      expect(hash).to.not.equal(password);
      const isValid = await comparePassword(password, hash);
      expect(isValid).to.be.true;
      const isInvalid = await comparePassword('WrongPassword', hash);
      expect(isInvalid).to.be.false;
    });

    it('should sign and verify JWT tokens correctly', () => {
      const payload = { id: 'user-123', email: 'test@example.com' };
      const token = signToken(payload);
      expect(token).to.be.a('string');
      const decoded = verifyToken(token);
      expect(decoded.id).to.equal(payload.id);
    });
  });

  describe('Validation Schemas', () => {
    it('should validate valid registration input', () => {
      const valid = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };
      const result = registerSchema.safeParse(valid);
      expect(result.success).to.be.true;
    });

    it('should reject invalid registration input (weak password)', () => {
      const invalid = {
        name: 'John',
        email: 'john@example.com',
        password: 'weak',
      };
      const result = registerSchema.safeParse(invalid);
      expect(result.success).to.be.false;
    });

    it('should validate note creation input', () => {
      const valid = { title: 'Meeting Notes', content: '<p>Discussion points</p>' };
      const result = createNoteSchema.safeParse(valid);
      expect(result.success).to.be.true;
    });

    it('should reject empty note creation input', () => {
      const invalid = { title: '', content: '' };
      const result = createNoteSchema.safeParse(invalid);
      expect(result.success).to.be.false;
    });

    it('should validate note update input', () => {
      const valid = { title: 'Updated Title' };
      const result = updateNoteSchema.safeParse(valid);
      expect(result.success).to.be.true;
    });

    it('should validate note import input array', () => {
      const valid = [
        { title: 'Note 1', content: 'Content 1' },
        { title: 'Note 2', content: 'Content 2' },
      ];
      const result = importNotesSchema.safeParse(valid);
      expect(result.success).to.be.true;
    });
  });
});

