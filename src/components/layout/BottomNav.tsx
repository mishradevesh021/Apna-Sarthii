'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ClipboardList, MessageSquare, User, Briefcase, ShieldCheck, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Define dynamic tabs based on role
  let tabs = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Search', href: '/search', icon: Search },
    { label: 'Requests', href: '/requests', icon: ClipboardList },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  if (user?.role === 'WORKER') {
    tabs = [
      { label: 'Dashboard', href: '/worker/dashboard', icon: Briefcase },
      { label: 'Requests', href: '/requests', icon: ClipboardList },
      { label: 'Search', href: '/search', icon: Search },
      { label: 'Messages', href: '/messages', icon: MessageSquare },
      { label: 'Profile', href: '/profile', icon: User },
    ];
  } else if (user?.role === 'ADMIN') {
    tabs = [
      { label: 'Admin', href: '/admin', icon: ShieldCheck },
      { label: 'Requests', href: '/requests', icon: Activity },
      { label: 'Search', href: '/search', icon: Search },
      { label: 'Messages', href: '/messages', icon: MessageSquare },
      { label: 'Profile', href: '/profile', icon: User },
    ];
  }

  // Hide on auth login/register screens if desired, or keep everywhere
  if (pathname === '/auth/login' || pathname === '/auth/register') {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0f172a] border-t border-slate-800/90 shadow-dock px-2 py-1.5 backdrop-blur-md">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Indicator Bar / Pill */}
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50 transition-all duration-300" />
              )}

              <div
                className={`relative flex items-center justify-center p-1 rounded-xl transition-transform duration-200 ${
                  isActive ? 'scale-110 text-amber-400' : 'text-slate-400'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              <span
                className={`text-[10px] font-semibold tracking-tight transition-colors duration-200 ${
                  isActive ? 'text-white font-bold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
