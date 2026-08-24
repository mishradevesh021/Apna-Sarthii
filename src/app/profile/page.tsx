'use client';

import React from 'react';
import Link from 'next/link';
import {
  User,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Briefcase,
  LogOut,
  Sparkles,
  Zap,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, loginAsDemo, logout, activeCity, activeLocality } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <User size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Sign in to your Profile</h2>
        <p className="text-xs text-slate-500 mt-1">Manage addresses, settings, and bookings.</p>
        <Link
          href="/auth/login"
          className="inline-block mt-4 text-xs font-bold text-white bg-blue-600 px-6 py-2.5 rounded-xl shadow-md"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-5 space-y-5">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white text-xl sm:text-2xl font-black flex items-center justify-center shadow-md">
            {user.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                {user.role}
              </span>
            </div>

            <div className="mt-1 space-y-0.5 text-xs text-slate-500">
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <Mail size={13} className="text-slate-400" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  <Phone size={13} className="text-slate-400" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin size={13} className="text-red-500" />
                <span>{user.locality}, {user.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Role Perspective Switcher */}
      <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/80 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
          <Sparkles size={14} className="text-amber-500" />
          <span>Switch Live Role Perspective:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <button
            onClick={() => loginAsDemo('CUSTOMER')}
            className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
              user.role === 'CUSTOMER'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="text-lg">👤</span>
            <div>
              <div className="font-bold">Customer</div>
              <div className="text-[10px] opacity-80">Priya Singh (Book services)</div>
            </div>
          </button>

          <button
            onClick={() => loginAsDemo('WORKER')}
            className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
              user.role === 'WORKER'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="text-lg">⚡</span>
            <div>
              <div className="font-bold">Worker</div>
              <div className="text-[10px] opacity-80">Rahul Kumar (Accept jobs)</div>
            </div>
          </button>

          <button
            onClick={() => loginAsDemo('ADMIN')}
            className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
              user.role === 'ADMIN'
                ? 'bg-purple-600 text-white font-bold shadow-sm'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span className="text-lg">🛡️</span>
            <div>
              <div className="font-bold">Admin</div>
              <div className="text-[10px] opacity-80">Platform command center</div>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2 text-xs font-bold">
        {user.role === 'WORKER' && (
          <Link
            href="/worker/dashboard"
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 transition"
          >
            <div className="flex items-center gap-2.5">
              <Briefcase size={16} className="text-emerald-600" />
              <span>Go to Worker Hub & Job Dispatcher</span>
            </div>
            <span>→</span>
          </Link>
        )}

        {user.role === 'ADMIN' && (
          <Link
            href="/admin"
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-purple-50 text-slate-800 hover:text-purple-700 transition"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-purple-600" />
              <span>Admin Operations & Worker Verification</span>
            </div>
            <span>→</span>
          </Link>
        )}

        <Link
          href="/requests"
          className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 transition"
        >
          <div className="flex items-center gap-2.5">
            <ClipboardList size={16} className="text-blue-600" />
            <span>My Service Bookings & Live Timeline</span>
          </div>
          <span>→</span>
        </Link>
      </div>

      {/* Sign Out Button */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full py-3 px-4 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center justify-center gap-2"
        >
          <LogOut size={16} /> Sign Out of Sarthi
        </button>
      </div>
    </div>
  );
}
