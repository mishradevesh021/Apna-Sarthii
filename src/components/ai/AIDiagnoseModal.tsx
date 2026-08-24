'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, X, AlertTriangle, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface AIDiagnoseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIDiagnoseModal({ isOpen, onClose }: AIDiagnoseModalProps) {
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: inputQuery }),
      });
      const data = await res.json();
      setDiagnosis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'My ceiling fan is making a clicking sound and running very slow',
    'Kitchen pipe is leaking water under the sink continuously',
    'Split AC is blowing air but not cooling the room at all',
    'Main MCB switch is tripping every time I turn on the geyser',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-amber-300 border border-blue-400/30">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg">Sarthi AI Problem Diagnostician</h2>
              <p className="text-xs text-blue-200">Describe what happened in plain words</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {!diagnosis ? (
            <div>
              <form onSubmit={handleDiagnose}>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Describe Your Issue
                </label>
                <textarea
                  rows={3}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="e.g. My washing machine is making a loud banging noise and water won't drain..."
                  className="w-full rounded-2xl border border-slate-200 p-3 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition resize-none"
                />

                <div className="mt-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Or try an example:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {samplePrompts.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setInputQuery(prompt)}
                        className="text-left text-xs text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50/70 p-2 rounded-xl border border-slate-100 transition"
                      >
                        💡 {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <button
                    type="submit"
                    disabled={loading || !inputQuery.trim()}
                    className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Diagnose & Find Best Match</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Diagnosis Result Card */}
              <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200">
                <div className="flex items-center justify-between text-xs font-bold text-blue-700 uppercase tracking-wider">
                  <span>AI Diagnosis Result</span>
                  <span className="bg-blue-200/70 text-blue-800 px-2 py-0.5 rounded-full">
                    {Math.round(diagnosis.diagnosis.confidence * 100)}% Confidence
                  </span>
                </div>

                <div className="mt-2">
                  <div className="text-base font-extrabold text-slate-900">
                    Category: {diagnosis.diagnosis.categoryName}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Suggested Service: <span className="font-semibold text-slate-800">{diagnosis.diagnosis.suggestedService}</span>
                  </div>
                </div>

                {diagnosis.diagnosis.estimatedPriceRange && (
                  <div className="mt-2 text-xs font-bold text-slate-700 bg-white/80 px-2.5 py-1 rounded-lg inline-block border border-blue-100">
                    Estimated Cost: {diagnosis.diagnosis.estimatedPriceRange}
                  </div>
                )}
              </div>

              {/* Safety Advice Alert (if any) */}
              {diagnosis.diagnosis.safetyAdvice && (
                <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <ShieldAlert size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Safety Tip: </span>
                    {diagnosis.diagnosis.safetyAdvice}
                  </div>
                </div>
              )}

              {/* Matched Workers Found */}
              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Matched Professionals Nearby
                </div>
                <div className="space-y-2">
                  {diagnosis.matchedWorkers?.slice(0, 3).map((w: any) => (
                    <div
                      key={w.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {w.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{w.name}</div>
                          <div className="text-[11px] text-slate-500">
                            {w.locality} • ⭐ {w.rating}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-slate-900">
                          {formatINR(w.startingPrice)}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold">Available</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setDiagnosis(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Try Another Problem
                </button>
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/search?category=${diagnosis.diagnosis.categorySlug}&q=${encodeURIComponent(diagnosis.diagnosis.suggestedService)}`);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-md"
                >
                  <span>View All Matches</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
