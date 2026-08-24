'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Wrench, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import SarthiLogo from '@/components/common/SarthiLogo';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<'CUSTOMER' | 'WORKER'>('CUSTOMER');
  const [categories, setCategories] = useState<any[]>([]);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Prayagraj');
  const [locality, setLocality] = useState('Civil Lines');
  const [categoryId, setCategoryId] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [startingPrice, setStartingPrice] = useState(250);
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setCategoryId(data.categories[0].id);
          }
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      name,
      email,
      phone,
      password,
      role,
      city,
      locality,
      ...(role === 'WORKER'
        ? {
            categoryId,
            experienceYears: Number(experienceYears),
            startingPrice: Number(startingPrice),
            bio,
          }
        : {}),
    };

    const res = await register(payload);
    if (!res.success) {
      setError(res.error || 'Failed to register');
      setLoading(false);
    } else {
      if (role === 'WORKER') router.push('/worker/dashboard');
      else router.push('/');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-premium space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <SarthiLogo size="md" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Create Your Sarthi Account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Join Sarthi as a customer or service professional
          </p>
        </div>

        {/* Role Selection Cards */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 text-center">
            What are you joining Sarthi as?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`p-4 rounded-2xl border-2 transition text-left flex flex-col items-start gap-2 ${
                role === 'CUSTOMER'
                  ? 'border-blue-600 bg-blue-50/70 text-blue-950 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <User size={18} />
              </div>
              <div>
                <div className="font-extrabold text-sm">👤 I Need Services</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Find & book verified pros</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('WORKER')}
              className={`p-4 rounded-2xl border-2 transition text-left flex flex-col items-start gap-2 ${
                role === 'WORKER'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Wrench size={18} />
              </div>
              <div>
                <div className="font-extrabold text-sm">🛠️ I Provide Services</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Get local customer leads</div>
              </div>
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@gmail.com"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm focus:border-blue-600 focus:outline-none bg-white font-medium text-slate-800"
              >
                <option value="Prayagraj">Prayagraj</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Varanasi">Varanasi</option>
                <option value="Kanpur">Kanpur</option>
                <option value="Delhi NCR">Delhi NCR</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Locality / Area
              </label>
              <input
                type="text"
                required
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Civil Lines, Katra, Naini"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Worker Specific Fields */}
          {role === 'WORKER' && (
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3 animate-in fade-in duration-150">
              <span className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider block">
                Professional Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Primary Trade
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold focus:outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Years of Exp.
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Visiting Rate (₹)
                  </label>
                  <input
                    type="number"
                    min={100}
                    step={50}
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Short Professional Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Master electrician specializing in fan rewinding, MCB repair & domestic wiring with 8 years experience."
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-1.5 ${
              role === 'WORKER'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link href="/auth/login" className="font-bold text-blue-600 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
