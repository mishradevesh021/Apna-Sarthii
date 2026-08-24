'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, Check, Zap, Star, MapPin } from 'lucide-react';
import WorkerCard from '@/components/home/WorkerCard';
import { WorkerCardSkeleton } from '@/components/common/SkeletonLoader';
import RequestServiceModal from '@/components/booking/RequestServiceModal';
import { ServiceCategoryDTO, WorkerCardDTO } from '@/lib/types';
import { defaultCategories } from '@/lib/categories-data';
import { useAuth } from '@/context/AuthContext';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialEmergency = searchParams.get('emergency') === 'true';

  const { activeCity, activeLocality } = useAuth();
  const [query, setQuery] = useState(initialQuery);
  const [categories, setCategories] = useState<ServiceCategoryDTO[]>(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(initialEmergency);
  const [minRating, setMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('match');

  const [workers, setWorkers] = useState<WorkerCardDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState<WorkerCardDTO | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(console.error);
  }, []);

  const searchWorkers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
      if (availableOnly) params.set('available', 'true');
      if (verifiedOnly) params.set('verified', 'true');
      if (emergencyOnly) params.set('emergency', 'true');
      if (minRating !== '0') params.set('minRating', minRating);
      if (sortBy) params.set('sortBy', sortBy);

      const res = await fetch(`/api/workers?${params.toString()}`);
      const data = await res.json();
      if (data.workers) setWorkers(data.workers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchWorkers();
  }, [selectedCategory, availableOnly, verifiedOnly, emergencyOnly, minRating, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchWorkers();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 space-y-5">
      {/* Header & Search Bar */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">
          Find Professionals in {activeLocality}, {activeCity}
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time availability and smart matching based on distance & rating
        </p>

        <form onSubmit={handleSearchSubmit} className="mt-3.5 flex gap-2">
          <div className="flex-1 flex items-center bg-white rounded-2xl border border-slate-200 shadow-xs px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <Search size={18} className="text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by service or worker name..."
              className="w-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Categories
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.slug)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === c.slug
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAvailableOnly(!availableOnly)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              availableOnly
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Available Today
          </button>

          <button
            onClick={() => setEmergencyOnly(!emergencyOnly)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              emergencyOnly
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Zap size={13} />
            24×7 Emergency
          </button>

          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              verifiedOnly
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Check size={13} />
            Verified Only
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="match">🎯 Best Smart Match</option>
            <option value="rating">⭐ Highest Rated</option>
            <option value="distance">📍 Closest Distance</option>
            <option value="price_asc">💵 Lowest Starting Price</option>
          </select>
        </div>
      </div>

      {/* Workers Results List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500">
            Found {workers.length} verified professional{workers.length === 1 ? '' : 's'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <WorkerCardSkeleton key={i} />
            ))}
          </div>
        ) : workers.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
              🔍
            </div>
            <h3 className="font-bold text-slate-800 text-base">No matching professionals</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No workers found matching your active filter criteria. Try adjusting filters or searching a different locality.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {workers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onRequestClick={(w) => {
                  setSelectedWorker(w);
                  setBookingModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Dialog */}
      <RequestServiceModal
        worker={selectedWorker}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onSuccess={() => searchWorkers()}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs text-slate-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
