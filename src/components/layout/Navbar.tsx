'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Bell, ChevronDown, Check, ShieldCheck, Sparkles, User as UserIcon, LogOut, Briefcase, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import SarthiLogo from '../common/SarthiLogo';

export default function Navbar() {
  const { user, activeCity, setActiveCity, activeLocality, setActiveLocality, loginAsDemo, logout } = useAuth();
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  const indianCities = [
    { city: 'Prayagraj', localities: ['Civil Lines', 'Katra', 'George Town', 'Ashok Nagar', 'Tagore Town', 'Naini'] },
    { city: 'Lucknow', localities: ['Hazratganj', 'Gomti Nagar', 'Aliganj', 'Indira Nagar'] },
    { city: 'Varanasi', localities: ['Sigra', 'Lanka', 'Cantonment', 'Bhelupur'] },
    { city: 'Kanpur', localities: ['Civil Lines', 'Swaroop Nagar', 'Kakadeo'] },
    { city: 'Delhi NCR', localities: ['Noida Sector 62', 'Indirapuram', 'Connaught Place', 'Gurgaon Cyber City'] },
  ];

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b132b] text-white border-b border-slate-800 shadow-md">
      {/* Top Utility / Demo Quick Switch Bar */}
      <div className="bg-[#070b18] px-4 py-1.5 border-b border-slate-800/80 text-[11px] font-medium flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-semibold border border-blue-700/50">
            <Sparkles size={11} /> SARTHI DEMO
          </span>
          <span className="hidden sm:inline text-slate-400">Switch Live Perspective:</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => loginAsDemo('CUSTOMER')}
            className={`px-2 py-0.5 rounded transition ${
              user?.role === 'CUSTOMER'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
            }`}
          >
            👤 Customer (Priya)
          </button>
          <button
            onClick={() => loginAsDemo('WORKER')}
            className={`px-2 py-0.5 rounded transition ${
              user?.role === 'WORKER'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ⚡ Worker (Rahul)
          </button>
          <button
            onClick={() => loginAsDemo('ADMIN')}
            className={`px-2 py-0.5 rounded transition ${
              user?.role === 'ADMIN'
                ? 'bg-purple-600 text-white font-semibold shadow-xs'
                : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🛡️ Admin
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Logo & Location Indicator */}
        <div className="flex items-center gap-4">
          <SarthiLogo variant="light" size="sm" />

          {/* Location Selector (matches reference screenshot: 📍 Prayagraj · Near You) */}
          <div className="relative">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 text-xs sm:text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded-full border border-slate-700/80 transition active:scale-98"
            >
              <MapPin size={14} className="text-red-400" />
              <span className="font-semibold text-white">{activeCity}</span>
              <span className="text-slate-400 hidden xs:inline">· {activeLocality}</span>
              <ChevronDown size={12} className="text-slate-400" />
            </button>

            {/* City Dropdown Menu */}
            {cityDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Select Your City
                </div>
                {indianCities.map((item) => (
                  <div key={item.city} className="mb-1">
                    <button
                      onClick={() => {
                        setActiveCity(item.city);
                        setActiveLocality(item.localities[0]);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center justify-between transition ${
                        activeCity === item.city
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>📍 {item.city}</span>
                      {activeCity === item.city && <Check size={14} />}
                    </button>
                    {activeCity === item.city && (
                      <div className="pl-6 pr-2 py-1 flex flex-wrap gap-1">
                        {item.localities.map((loc) => (
                          <button
                            key={loc}
                            onClick={() => {
                              setActiveLocality(loc);
                              setCityDropdownOpen(false);
                            }}
                            className={`text-xs px-2 py-0.5 rounded-md font-medium transition ${
                              activeLocality === loc
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Desktop Links, Notifications & Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 mr-2 text-sm font-medium text-slate-300">
            <Link href="/" className={`hover:text-white transition ${pathname === '/' ? 'text-white font-semibold' : ''}`}>
              Home
            </Link>
            <Link href="/search" className={`hover:text-white transition ${pathname.startsWith('/search') ? 'text-white font-semibold' : ''}`}>
              Find Services
            </Link>
            {user?.role === 'WORKER' ? (
              <Link href="/worker/dashboard" className={`hover:text-white transition ${pathname.startsWith('/worker') ? 'text-white font-semibold' : ''}`}>
                Worker Hub
              </Link>
            ) : user?.role === 'ADMIN' ? (
              <Link href="/admin" className={`hover:text-white transition ${pathname.startsWith('/admin') ? 'text-white font-semibold' : ''}`}>
                Admin Panel
              </Link>
            ) : (
              <Link href="/requests" className={`hover:text-white transition ${pathname.startsWith('/requests') ? 'text-white font-semibold' : ''}`}>
                My Bookings
              </Link>
            )}
          </nav>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition active:scale-95"
              aria-label="Notifications"
            >
              <Bell size={18} className="text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#0b132b] animate-pulse" />
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="font-bold text-sm text-slate-900">Notifications ({unreadCount} new)</div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl transition ${
                          n.isRead ? 'opacity-70' : 'bg-blue-50/60 font-medium'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900">{n.title}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{n.message}</div>
                        {n.link && (
                          <Link
                            href={n.link}
                            onClick={() => setNotifDropdownOpen(false)}
                            className="inline-block mt-1 text-[11px] text-blue-600 hover:underline font-semibold"
                          >
                            View details →
                          </Link>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Login Button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 bg-slate-800/90 hover:bg-slate-800 rounded-full border border-slate-700/80 transition"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-200 hidden sm:inline max-w-[90px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown size={12} className="text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="font-bold text-xs text-slate-900 truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    {user.role === 'WORKER' && (
                      <Link
                        href="/worker/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-50"
                      >
                        <Briefcase size={14} className="text-emerald-600" /> Worker Dashboard
                      </Link>
                    )}
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-50"
                      >
                        <ShieldCheck size={14} className="text-purple-600" /> Admin Command
                      </Link>
                    )}
                    <Link
                      href="/requests"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-50"
                    >
                      <Zap size={14} className="text-blue-600" /> Service Bookings
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 hover:bg-slate-50"
                    >
                      <UserIcon size={14} className="text-slate-600" /> My Profile & Settings
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-full transition shadow-xs"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
