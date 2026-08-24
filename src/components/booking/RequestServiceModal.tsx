'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, MapPin, Clock, DollarSign, ArrowRight, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatINR } from '@/lib/utils';
import { WorkerCardDTO } from '@/lib/types';
import Link from 'next/link';

interface RequestServiceModalProps {
  worker: WorkerCardDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RequestServiceModal({
  worker,
  isOpen,
  onClose,
  onSuccess,
}: RequestServiceModalProps) {
  const { user, activeCity, activeLocality } = useAuth();
  const [step, setStep] = useState(1);
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [urgency, setUrgency] = useState<'ASAP' | 'TODAY' | 'TOMORROW' | 'CUSTOM'>('ASAP');
  const [scheduledTime, setScheduledTime] = useState('Immediate (within 1-2 hours)');
  const [address, setAddress] = useState(
    user ? `${user.locality}, ${user.city}` : `${activeLocality}, ${activeCity}`
  );
  const [budget, setBudget] = useState(worker ? String(worker.startingPrice) : '300');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !worker) return null;

  const totalSteps = 4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in to complete this service booking.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerId: worker.userId || worker.id,
          serviceCategoryId: (worker as any).primaryCategoryId || (worker as any).category?.id || worker.categorySlug,
          problemTitle,
          problemDescription,
          urgency,
          scheduledTime,
          locationAddress: address,
          locationCity: activeCity,
          locationLocality: activeLocality,
          estimatedBudget: Number(budget) || worker.startingPrice,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit request');
      } else {
        setSubmitted(true);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setProblemTitle('');
    setProblemDescription('');
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0b132b] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
              {worker.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base">{worker.name}</h3>
                {worker.isVerified && (
                  <ShieldCheck size={15} className="text-blue-400" />
                )}
              </div>
              <p className="text-xs text-slate-300">
                {worker.categoryName} • Starts {formatINR(worker.startingPrice)}
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Multi-step progress bar (if not submitted) */}
        {!submitted && (
          <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Step {step} of {totalSteps}</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step
                      ? 'w-6 bg-blue-600'
                      : i < step
                      ? 'w-3 bg-emerald-500'
                      : 'w-3 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-medium">
              {error}
            </div>
          )}

          {submitted ? (
            <div className="text-center py-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3.5 shadow-sm">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Request Sent Successfully!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto mt-1.5">
                We notified <span className="font-bold text-slate-900">{worker.name}</span>. You will receive an instant notification as soon as they accept.
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <Link
                  href="/requests"
                  onClick={handleReset}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
                >
                  Track in My Bookings
                </Link>
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* STEP 1: What do you need? */}
              {step === 1 && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <h4 className="text-sm font-extrabold text-slate-900">What service do you need?</h4>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Problem Title / Work Item
                    </label>
                    <input
                      type="text"
                      required
                      value={problemTitle}
                      onChange={(e) => setProblemTitle(e.target.value)}
                      placeholder="e.g. Ceiling Fan Repair, Tap Leakage, MCB Tripping"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Describe the problem in detail
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={problemDescription}
                      onChange={(e) => setProblemDescription(e.target.value)}
                      placeholder="e.g. Fan is making loud noise and regulator sparks when turned to speed 3..."
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-blue-600 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: When do you need it? */}
              {step === 2 && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <h4 className="text-sm font-extrabold text-slate-900">When do you need the professional?</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'ASAP', label: '⚡ ASAP / Emergency', sub: 'Within 1-2 hours' },
                      { id: 'TODAY', label: '📅 Today', sub: 'Flexible today' },
                      { id: 'TOMORROW', label: '🌅 Tomorrow', sub: 'Next morning/afternoon' },
                      { id: 'CUSTOM', label: '⏰ Specific Time', sub: 'Select timing' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setUrgency(opt.id as any);
                          setScheduledTime(opt.sub);
                        }}
                        className={`p-3 rounded-2xl border text-left transition ${
                          urgency === opt.id
                            ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{opt.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{opt.sub}</div>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Preferred Time Slot
                    </label>
                    <input
                      type="text"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      placeholder="e.g. 5:00 PM - 7:00 PM today"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Location */}
              {step === 3 && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <h4 className="text-sm font-extrabold text-slate-900">Where should the worker arrive?</h4>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                      Service Address / Landmark
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Flat/House No, Building, Street, Landmark..."
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:border-blue-600 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                    <MapPin size={16} className="text-red-500 flex-shrink-0" />
                    <span>
                      Selected Area: <strong className="text-slate-900">{activeLocality}, {activeCity}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Send */}
              {step === 4 && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <h4 className="text-sm font-extrabold text-slate-900">Review Booking Details</h4>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500">Service:</span>
                      <span className="font-bold text-slate-900">{problemTitle}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500">Timing:</span>
                      <span className="font-semibold text-slate-900">{urgency} ({scheduledTime})</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500">Address:</span>
                      <span className="font-medium text-slate-900 text-right max-w-[200px] truncate">
                        {address}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500">Estimated Base Price:</span>
                      <span className="font-extrabold text-blue-700 text-sm">
                        {formatINR(Number(budget) || worker.startingPrice)}
                      </span>
                    </div>
                  </div>

                  {!user && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                      ⚠️ You need to be logged in to confirm your booking.
                    </div>
                  )}
                </div>
              )}

              {/* Footer Step Controls */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                ) : <div />}

                {step < totalSteps ? (
                  <button
                    type="button"
                    disabled={step === 1 && (!problemTitle.trim() || !problemDescription.trim())}
                    onClick={() => setStep(step + 1)}
                    className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1 shadow-md"
                  >
                    Next <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1 shadow-md"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap size={14} /> Send Service Request
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
