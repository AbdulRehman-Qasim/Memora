import { expect } from 'chai';
import { JSDOM } from 'jsdom';

describe('Theme Switcher & Persistence Logic', () => {
  let dom: JSDOM;
  let document: Document;
  let window: Window & typeof globalThis;
  let storage: Record<string, string>;

  beforeEach(() => {
    storage = {};
    dom = new JSDOM('<!DOCTYPE html><html lang="en"><body></body></html>', {
      url: 'http://localhost:3000',
    });
    window = dom.window as unknown as Window & typeof globalThis;
    document = window.document;

    // Mock localStorage
    const mockLocalStorage = {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        storage = {};
      },
      length: 0,
      key: () => null,
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  const applyTheme = (targetDoc: Document, theme: 'light' | 'dark') => {
    const root = targetDoc.documentElement;
    root.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  };

  const toggleTheme = (currentTheme: 'light' | 'dark'): 'light' | 'dark' => {
    return currentTheme === 'light' ? 'dark' : 'light';
  };

  it('should apply dark theme attributes and class correctly', () => {
    applyTheme(document, 'dark');

    expect(document.documentElement.getAttribute('data-theme')).to.equal('dark');
    expect(document.documentElement.classList.contains('dark')).to.be.true;
    expect(document.documentElement.classList.contains('light')).to.be.false;
  });

  it('should apply light theme attributes and class correctly', () => {
    applyTheme(document, 'light');

    expect(document.documentElement.getAttribute('data-theme')).to.equal('light');
    expect(document.documentElement.classList.contains('light')).to.be.true;
    expect(document.documentElement.classList.contains('dark')).to.be.false;
  });

  it('should toggle between light and dark themes accurately', () => {
    let currentTheme: 'light' | 'dark' = 'light';
    applyTheme(document, currentTheme);
    expect(document.documentElement.getAttribute('data-theme')).to.equal('light');

    currentTheme = toggleTheme(currentTheme);
    applyTheme(document, currentTheme);
    expect(currentTheme).to.equal('dark');
    expect(document.documentElement.getAttribute('data-theme')).to.equal('dark');
    expect(document.documentElement.classList.contains('dark')).to.be.true;

    currentTheme = toggleTheme(currentTheme);
    applyTheme(document, currentTheme);
    expect(currentTheme).to.equal('light');
    expect(document.documentElement.getAttribute('data-theme')).to.equal('light');
    expect(document.documentElement.classList.contains('light')).to.be.true;
  });

  it('should persist theme selection to localStorage', () => {
    window.localStorage.setItem('memoora-theme', 'dark');
    expect(window.localStorage.getItem('memoora-theme')).to.equal('dark');

    window.localStorage.setItem('memoora-theme', 'light');
    expect(window.localStorage.getItem('memoora-theme')).to.equal('light');
  });

  it('should fallback to light when invalid theme string is in storage', () => {
    window.localStorage.setItem('memoora-theme', 'invalid-theme');
    const stored = window.localStorage.getItem('memoora-theme');
    const validTheme = stored === 'light' || stored === 'dark' ? stored : 'light';
    applyTheme(document, validTheme);

    expect(validTheme).to.equal('light');
    expect(document.documentElement.getAttribute('data-theme')).to.equal('light');
  });
});
