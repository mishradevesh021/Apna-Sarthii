'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  Star,
  Award,
  Calendar,
  Zap,
  ArrowLeft,
  Share2,
  Bookmark,
  Flag,
} from 'lucide-react';
import RatingStars from '@/components/common/RatingStars';
import RequestServiceModal from '@/components/booking/RequestServiceModal';
import { formatINR, formatTimeAgo } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function WorkerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchWorker = async () => {
    try {
      const res = await fetch(`/api/workers/${id}`);
      const json = await res.json();
      if (json.worker) {
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchWorker();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-24 mb-4" />
        <div className="bg-white rounded-3xl p-6 h-48 border border-slate-100" />
        <div className="bg-white rounded-3xl p-6 h-64 border border-slate-100" />
      </div>
    );
  }

  if (!data || !data.worker) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-slate-900">Professional Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">This profile may have been removed or updated.</p>
        <Link
          href="/search"
          className="inline-block mt-4 text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl"
        >
          Browse All Professionals
        </Link>
      </div>
    );
  }

  const { worker, reviews } = data;
  const initials = worker.name.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 space-y-5">
      {/* Top Breadcrumb / Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSaved(!saved)}
            className={`p-2 rounded-xl border shadow-xs transition ${
              saved
                ? 'bg-blue-50 border-blue-200 text-blue-600'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark size={16} className={saved ? 'fill-blue-600' : ''} />
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white text-xl sm:text-2xl font-extrabold flex items-center justify-center shadow-md">
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {worker.name}
                </h1>
                {worker.isVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200/60">
                    <CheckCircle2 size={13} className="text-blue-600" /> Verified Pro
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {worker.category.name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-red-500" />
                  {worker.locality}, {worker.city} (Serves ~{worker.serviceRadiusKm} km)
                </span>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <RatingStars rating={worker.rating} reviewCount={worker.reviewCount} size="md" />
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-slate-700">{worker.completedJobs} jobs</span>
              </div>
            </div>
          </div>

          {/* Pricing & Booking CTA */}
          <div className="w-full sm:w-auto bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center sm:text-right flex sm:flex-col justify-between items-center sm:items-end gap-2">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Standard Visiting Rate</div>
              <div className="text-xl font-black text-slate-900">
                {formatINR(worker.startingPrice)}
              </div>
            </div>

            <button
              onClick={() => setBookingOpen(true)}
              className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-98 flex items-center gap-1.5"
            >
              <Zap size={15} />
              <span>Book Service</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium">Availability</span>
            <span className="font-bold text-emerald-600 mt-0.5 inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {worker.isAvailable ? 'Available Today' : 'Busy Today'}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium">Experience</span>
            <span className="font-bold text-slate-900 mt-0.5 block">
              {worker.experienceYears} Years
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium">Working Hours</span>
            <span className="font-bold text-slate-900 mt-0.5 block">{worker.workingHours}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 block font-medium">Response Rate</span>
            <span className="font-bold text-blue-600 mt-0.5 block">
              {worker.responseRate}% Instant
            </span>
          </div>
        </div>

        {/* Bio */}
        {worker.bio && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              About Professional
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{worker.bio}</p>
          </div>
        )}
      </div>

      {/* Services & Rate Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3.5">
          Offered Services & Pricing
        </h2>

        <div className="space-y-3">
          {worker.services && worker.services.length > 0 ? (
            worker.services.map((s: any) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition"
              >
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{s.customTitle}</h4>
                  {s.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <span className="font-extrabold text-sm text-slate-900">
                    {formatINR(s.price)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-500">
              Standard {worker.category.name} Inspection & Fix starting at {formatINR(worker.startingPrice)}.
            </div>
          )}
        </div>
      </div>

      {/* Verified Reviews Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Customer Reviews ({reviews.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              100% verified reviews submitted after completed service bookings
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200/60">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <span className="font-black text-slate-900 text-sm">{worker.rating.toFixed(1)}</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
            No reviews yet for this professional. Be the first to book and rate!
          </div>
        ) : (
          <div className="space-y-3 divide-y divide-slate-100">
            {reviews.map((r: any) => (
              <div key={r.id} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {r.customerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{r.customerName}</div>
                      <div className="text-[10px] text-slate-400">
                        {r.customerLocality} • {formatTimeAgo(r.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(Math.floor(r.ratingOverall))].map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 mt-2 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <RequestServiceModal
        worker={worker}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onSuccess={() => fetchWorker()}
      />
    </div>
  );
}
