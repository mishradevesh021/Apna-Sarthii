import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'Sarthi — Premium Local Worker & Service Finder',
  description:
    'Find verified plumbers, electricians, carpenters, AC repair technicians, mechanics, and local professionals in your neighborhood.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-[#fafaf9] text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-10">{children}</main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
