import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Memoora - Notes Application',
  description: 'Full-stack Notes Application built with Next.js App Router',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster position="top-right" />
          <div id="root">
            <div className="main-layout">
              <Navbar />
              <main className="content">{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
