import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Memoora - Notes Application',
  description: 'Full-stack Notes Application built with Next.js App Router',
  icons: {
    icon: [
      { url: '/memoora-icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/memoora-icon.svg',
    apple: '/memoora-icon.svg',
  },
};

const themeScript = `
  (function() {
    try {
      var saved = localStorage.getItem('memoora-theme');
      var pref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var theme = (saved === 'light' || saved === 'dark') ? saved : pref;
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    } catch(e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/memoora-icon.svg" />
        <link rel="alternate icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/memoora-icon.svg" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'memoora-toast',
                style: {
                  background: 'var(--bg-card)',
                  color: 'var(--text-h)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-md)',
                },
              }}
            />
            <div id="root">
              <div className="main-layout">
                <Navbar />
                <main className="content">{children}</main>
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
