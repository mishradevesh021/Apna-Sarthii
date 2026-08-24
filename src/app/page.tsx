'use client';

import React, { useEffect, useState } from 'react';
import SearchHero from '@/components/search/SearchHero';
import EmergencyBanner from '@/components/home/EmergencyBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import WorkerCard from '@/components/home/WorkerCard';
import { CategorySkeleton, WorkerCardSkeleton } from '@/components/common/SkeletonLoader';
import RequestServiceModal from '@/components/booking/RequestServiceModal';
import AIDiagnoseModal from '@/components/ai/AIDiagnoseModal';
import { ServiceCategoryDTO, WorkerCardDTO } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Clock, Award, CheckCircle2, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { activeCity, activeLocality } = useAuth();
  const [categories, setCategories] = useState<ServiceCategoryDTO[]>([]);
  const [workers, setWorkers] = useState<WorkerCardDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<WorkerCardDTO | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  const fetchData = async (categorySlug?: string | null) => {
    setLoading(true);
    try {
      // Fetch categories
      const catRes = await fetch('/api/services');
      const catData = await catRes.json();
      if (catData.categories) setCategories(catData.categories);

      // Fetch workers with optional category filter
      const workerUrl = categorySlug && categorySlug !== 'all'
        ? `/api/workers?category=${categorySlug}`
        : '/api/workers';

      const workerRes = await fetch(workerUrl);
      const workerData = await workerRes.json();
      if (workerData.workers) setWorkers(workerData.workers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedCategory);
  }, [selectedCategory, activeCity]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug === selectedCategory ? null : slug);
  };

  const handleRequestClick = (worker: WorkerCardDTO) => {
    setSelectedWorker(worker);
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Search Hero Section (Top dark container) */}
      <SearchHero onOpenAIDiagnose={() => setAiModalOpen(true)} />

      {/* Main Content Area (Clean cream background matching reference design) */}
      <div className="max-w-5xl mx-auto px-4 py-5 sm:py-7 space-y-7">
        {/* 24x7 Services Banner (Golden Amber) */}
        <EmergencyBanner />

        {/* Categories Section */}
        <section>
          <CategoryGrid
            categories={categories}
            selectedSlug={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </section>

        {/* Available Professionals Section */}
        <section>
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-700 uppercase">
                {selectedCategory
                  ? `${categories.find((c) => c.slug === selectedCategory)?.name || 'Filtered'} Professionals`
                  : 'AVAILABLE PROFESSIONALS'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified workers in {activeLocality}, {activeCity} ready to assist you
              </p>
            </div>

            <Link
              href="/search"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <WorkerCardSkeleton key={i} />
              ))}
            </div>
          ) : workers.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2 font-bold text-lg">
                🔍
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No professionals found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try selecting a different category or search term.
              </p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="mt-3 text-xs font-bold text-blue-600 hover:underline"
              >
                Clear Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {workers.map((worker) => (
                <WorkerCard
                  key={worker.id}
                  worker={worker}
                  onRequestClick={handleRequestClick}
                />
              ))}
            </div>
          )}
        </section>

        {/* How Sarthi Works (Desktop & Mobile) */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Simple & Reliable
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              How Sarthi Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Your trusted companion for getting everyday repairs done smoothly
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                step: '01',
                title: 'Tell Sarthi Your Need',
                desc: 'Search service or describe your issue in plain language.',
                icon: Sparkles,
              },
              {
                step: '02',
                title: 'Compare Nearby Pros',
                desc: 'Check upfront rates, distance, ratings & verified badges.',
                icon: ShieldCheck,
              },
              {
                step: '03',
                title: 'Request in 1-Click',
                desc: 'Worker accepts instantly and heads over to your address.',
                icon: Clock,
              },
              {
                step: '04',
                title: 'Track & Pay Fairly',
                desc: 'Track live progress, pay directly, and leave honest reviews.',
                icon: Award,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex flex-col items-start p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-black text-slate-400">{item.step}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why Sarthi Trust Grid */}
        <section className="bg-gradient-to-br from-[#0b132b] to-[#1e293b] text-white rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-md text-center sm:text-left">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                Safe & Verified Platform
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                Why Thousands Trust Sarthi
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Every professional on Sarthi undergoes identity and profession checks before receiving jobs.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 text-xs bg-white/10 px-3 py-1 rounded-full text-slate-200">
                  <CheckCircle2 size={13} className="text-emerald-400" /> Aadhaar / ID Verified
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-white/10 px-3 py-1 rounded-full text-slate-200">
                  <CheckCircle2 size={13} className="text-emerald-400" /> Transparent Pricing
                </span>
                <span className="inline-flex items-center gap-1 text-xs bg-white/10 px-3 py-1 rounded-full text-slate-200">
                  <CheckCircle2 size={13} className="text-emerald-400" /> 100% Genuine Reviews
                </span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center w-full sm:w-auto">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">4.9★</div>
              <div className="flex items-center justify-center gap-1 text-amber-300 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 mt-2 font-medium">
                Average service satisfaction across 1,200+ local jobs
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Service Booking Modal */}
      <RequestServiceModal
        worker={selectedWorker}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        onSuccess={() => fetchData(selectedCategory)}
      />

      {/* AI Problem Diagnosis Modal */}
      <AIDiagnoseModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
    </div>
  );
}
