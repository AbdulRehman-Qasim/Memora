'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/">
          <span className="navbar-brand-dot">📝</span>
          Memoora
        </Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <Link
              href="/dashboard"
              className={pathname === '/dashboard' ? 'active' : ''}
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="navbar-logout-btn"
              type="button"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className={pathname === '/login' ? 'active' : ''}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={pathname === '/register' ? 'active' : ''}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

