import { expect } from 'chai';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Initialize DOMPurify with jsdom for server/node testing environment
const window = new JSDOM('').window;
const purify = DOMPurify(window as unknown as Window & typeof globalThis);

describe('Frontend Client-Side Logic & Utilities', () => {
  describe('HTML Sanitization (DOMPurify)', () => {
    it('should allow benign formatting tags (b, i, u, p, ul, ol, li)', () => {
      const safeHtml = '<p>This is <b>bold</b> and <i>italic</i> with <u>underline</u></p><ul><li>item 1</li></ul>';
      const clean = purify.sanitize(safeHtml);
      expect(clean).to.equal(safeHtml);
    });

    it('should strip malicious script tags and inline javascript event handlers', () => {
      const maliciousHtml = '<p>Hello</p><script>alert("hacked")</script><img src="x" onerror="alert(1)" />';
      const clean = purify.sanitize(maliciousHtml);
      expect(clean).to.not.include('<script>');
      expect(clean).to.not.include('alert("hacked")');
      expect(clean).to.not.include('onerror');
      expect(clean).to.include('<p>Hello</p>');
    });

    it('should sanitize javascript: links', () => {
      const badLink = '<a href="javascript:alert(1)">Click here</a>';
      const clean = purify.sanitize(badLink);
      expect(clean).to.not.include('javascript:');
    });
  });

  describe('Notes Sorting and Search Logic', () => {
    interface NoteItem {
      id: string;
      title: string;
      content: string;
      isPinned: boolean;
      updatedAt: string;
    }

    const mockNotes: NoteItem[] = [
      { id: '1', title: 'Shopping List', content: 'Milk, Eggs, Bread', isPinned: false, updatedAt: '2026-03-01T10:00:00Z' },
      { id: '2', title: 'Urgent Project', content: 'Finish next.js migration', isPinned: true, updatedAt: '2026-02-15T10:00:00Z' },
      { id: '3', title: 'Meeting Notes', content: 'Discuss quarterly metrics', isPinned: false, updatedAt: '2026-03-05T12:00:00Z' },
      { id: '4', title: 'Important Passwords', content: 'Remember secure vault', isPinned: true, updatedAt: '2026-03-02T08:00:00Z' },
    ];

    it('should prioritize pinned notes first, then sort by updatedAt descending', () => {
      const sorted = [...mockNotes].sort((a, b) => {
        if (a.isPinned !== b.isPinned) {
          return a.isPinned ? -1 : 1;
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

      // Pinned notes should come first
      expect(sorted[0].id).to.equal('4'); // Pinned, March 2
      expect(sorted[1].id).to.equal('2'); // Pinned, Feb 15
      expect(sorted[2].id).to.equal('3'); // Unpinned, March 5
      expect(sorted[3].id).to.equal('1'); // Unpinned, March 1
    });

    it('should filter notes correctly by case-insensitive title or content search', () => {
      const query = 'project';
      const filtered = mockNotes.filter(
        (n) => n.title.toLowerCase().includes(query.toLowerCase()) || n.content.toLowerCase().includes(query.toLowerCase())
      );

      expect(filtered).to.have.lengthOf(1);
      expect(filtered[0].title).to.equal('Urgent Project');
    });
  });

  describe('CSV Serialization & Parsing Logic', () => {
    const serializeToCsv = (notes: Array<{ title: string; content: string; isPinned: boolean }>): string => {
      const headers = ['title', 'content', 'isPinned'];
      const escapeField = (val: string | boolean) => {
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const rows = notes.map((n) => [escapeField(n.title), escapeField(n.content), escapeField(n.isPinned)].join(','));
      return [headers.join(','), ...rows].join('\n');
    };

    it('should escape quotes, commas, and newlines in CSV export', () => {
      const testNotes = [
        { title: 'Normal Note', content: 'Normal text', isPinned: false },
        { title: 'Complex, Note "With Quotes"', content: 'Line 1\nLine 2', isPinned: true },
      ];

      const csv = serializeToCsv(testNotes);
      expect(csv).to.include('title,content,isPinned');
      expect(csv).to.include('Normal Note,Normal text,false');
      expect(csv).to.include('"Complex, Note ""With Quotes"""');
      expect(csv).to.include('"Line 1\nLine 2"');
    });
  });
});

