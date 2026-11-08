'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Modal from './Modal';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
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
