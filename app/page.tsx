'use client';

import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="landing-page">
      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-badge">Next-Gen Notes</span>
            <h1 className="hero-headline">
              Capture your ideas, perfectly organized.
            </h1>
            <p className="hero-subheadline">
              Memoora helps you craft thoughts, organize projects, and stay in
              sync across all your workflows. Clean, private, and effortlessly
              powerful.
            </p>
            <div className="hero-cta">
              <Link href="/register" className="btn-primary">
                Get Started Free
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
          <div className="hero-visual-wrapper">
            <Image
              src="/hero-visual.png"
              alt="Memoora App Interface"
              width={800}
              height={450}
              className="hero-image"
              priority
            />
          </div>
        </section>

        <section className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3 className="feature-title">Rich Text Formatting</h3>
              <p className="feature-desc">
                Express ideas clearly with headings, bold text, bullet lists,
                and custom styling.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Private & Secure</h3>
              <p className="feature-desc">
                End-to-end data isolation with strict cookie authentication and
                scoped database access.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-desc">
                Optimized App Router performance, instant searching, pinning,
                and seamless CSV export/import.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
