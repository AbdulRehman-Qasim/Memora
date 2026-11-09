import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'var(--grad)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-accent)',
          marginBottom: '1.5rem',
        }}
      >
        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>404</span>
      </div>
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--text-h)',
          marginBottom: '0.75rem',
          letterSpacing: '-0.5px',
        }}
      >
        Page Not Found
      </h1>
      <p
        style={{
          color: 'var(--text)',
          maxWidth: '420px',
          lineHeight: '1.6',
          marginBottom: '2rem',
          fontSize: '0.95rem',
        }}
      >
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn-primary" style={{ padding: '0.65rem 1.5rem', textDecoration: 'none' }}>
        Return Home
      </Link>
    </div>
  );
}

