'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Modal from './Modal';

const SunIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="theme-icon sun-icon"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="theme-icon moon-icon"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const confirmLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLogoutModalOpen(false);
      router.push('/login');
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link href="/">
            <span className="navbar-brand-dot">
              <img src="/memoora-icon.svg" alt="Memoora Icon" style={{ width: '16px', height: '16px' }} />
            </span>
            <span> Memoora</span>
          </Link>
        </div>
        <div className="navbar-links">
          <Link href="/" className={pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>
                Dashboard
              </Link>
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
              <button onClick={() => setIsLogoutModalOpen(true)} className="navbar-logout-btn" type="button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={pathname === '/login' ? 'active' : ''}>
                Login
              </Link>
              <Link href="/register" className={pathname === '/register' ? 'active' : ''}>
                Register
              </Link>
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>
            </>
          )}
        </div>
      </nav>

      <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} title="Confirm Logout">
        <p style={{ color: 'var(--text)', marginBottom: '1.5rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
          Are you sure you want to log out of your Memoora workspace?
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={() => setIsLogoutModalOpen(false)} style={{ padding: '0.5rem 1rem' }}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={confirmLogout} 
            style={{ 
              background: 'var(--danger)', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              boxShadow: 'none' 
            }}
          >
            Yes, Logout
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
