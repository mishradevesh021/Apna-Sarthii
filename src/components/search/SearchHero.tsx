'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, X, MapPin, ArrowRight } from 'lucide-react';

interface SearchHeroProps {
  initialQuery?: string;
  onOpenAIDiagnose?: () => void;
}

const rotatingPlaceholders = [
  'Find a plumber for leaking pipe...',
  'Need an electrician for fan & switchboard...',
  'Fix my AC cooling issue...',
  'Bike mechanic near me...',
  'Need a master carpenter for door lock...',
  'RO water purifier filter repair...',
  'Deep house & kitchen cleaning...',
];

export default function SearchHero({ initialQuery = '', onOpenAIDiagnose }: SearchHeroProps) {
  const [query, setQuery] = useState(initialQuery);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const router = useRouter();

  // Subtle rotating placeholder every 3.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingPlaceholders.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <div className="w-full bg-[#0b132b] text-white pt-2 pb-6 px-4 rounded-b-3xl sm:rounded-3xl shadow-lg border-b sm:border border-slate-800">
      <div className="max-w-3xl mx-auto">
        <div className="text-center sm:text-left mb-3.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20 mb-2">
            <Sparkles size={12} /> Sarthi Smart Local Network
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
            What service do you need?
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            Connect with verified local electricians, plumbers, carpenters & technicians within minutes.
          </p>
        </div>

        {/* Search Input Bar (matching screenshot's dark search field) */}
        <form onSubmit={handleSearch} className="relative mt-3">
          <div className="flex items-center bg-[#1e293b] hover:bg-[#253248] focus-within:bg-[#1e293b] focus-within:ring-2 focus-within:ring-blue-500 rounded-2xl border border-slate-700/80 shadow-md p-1.5 transition-all">
            <div className="pl-3 pr-2 text-slate-400">
              <Search size={18} />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={rotatingPlaceholders[placeholderIndex]}
              className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none py-2 pr-2"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-white mr-1"
              >
                <X size={16} />
              </button>
            )}

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-xs flex-shrink-0"
            >
              <span>Search</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </form>

        {/* AI Natural Language Assistant Banner */}
        <div className="flex items-center justify-between mt-3 pt-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Popular:</span>
            <button
              onClick={() => router.push('/search?category=electrician')}
              className="text-slate-200 hover:text-white underline-offset-2 hover:underline"
            >
              Fan Repair
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => router.push('/search?category=plumber')}
              className="text-slate-200 hover:text-white underline-offset-2 hover:underline"
            >
              Leakage
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={() => router.push('/search?category=ac-repair')}
              className="text-slate-200 hover:text-white underline-offset-2 hover:underline"
            >
              AC Gas
            </button>
          </div>

          {onOpenAIDiagnose && (
            <button
              onClick={onOpenAIDiagnose}
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold text-xs bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 transition active:scale-95"
            >
              <Sparkles size={12} className="text-amber-400" />
              <span>AI Problem Helper</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
