'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import SarthiLogo from '@/components/common/SarthiLogo';

export default function LoginPage() {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError('');

    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || 'Invalid credentials');
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <SarthiLogo size="md" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Welcome to Sarthi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to book local professionals or manage service jobs
          </p>
        </div>

        {/* 1-Click Instant Demo Access Box */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700">
            <Sparkles size={14} className="text-amber-500" />
            <span>1-Click Instant Demo Login:</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => loginAsDemo('CUSTOMER')}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-800 font-bold transition shadow-xs flex flex-col items-center gap-1"
            >
              <span>👤 Customer</span>
              <span className="text-[10px] text-slate-400 font-normal">Priya Singh</span>
            </button>

            <button
              onClick={() => loginAsDemo('WORKER')}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800 font-bold transition shadow-xs flex flex-col items-center gap-1"
            >
              <span>⚡ Worker</span>
              <span className="text-[10px] text-slate-400 font-normal">Rahul (Electrician)</span>
            </button>

            <button
              onClick={() => loginAsDemo('ADMIN')}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 text-slate-800 font-bold transition shadow-xs flex flex-col items-center gap-1"
            >
              <span>🛡️ Admin</span>
              <span className="text-[10px] text-slate-400 font-normal">Staff Portal</span>
            </button>
          </div>
        </div>

        {/* Custom Login Form */}
        <form onSubmit={handleCustomLogin} className="space-y-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-xs sm:text-sm focus:border-blue-600 focus:outline-none"
              />
              <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-10 text-xs sm:text-sm focus:border-blue-600 focus:outline-none"
              />
              <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-bold text-blue-600 hover:underline">
            Register as Customer or Worker
          </Link>
        </div>
      </div>
    </div>
  );
}
