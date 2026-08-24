'use client';

import React, { useState } from 'react';
import { Star, X, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
  requestId: string;
  workerName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({
  requestId,
  workerName,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [ratingOverall, setRatingOverall] = useState(5);
  const [ratingPunctuality, setRatingPunctuality] = useState(5);
  const [ratingQuality, setRatingQuality] = useState(5);
  const [ratingValue, setRatingValue] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please share a few words about your experience.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceRequestId: requestId,
          ratingOverall,
          ratingPunctuality,
          ratingQuality,
          ratingValue,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit review');
      } else {
        onSuccess();
        onClose();
      }
    } catch {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#0b132b] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base">Rate Your Experience</h3>
            <p className="text-xs text-slate-300">with {workerName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          {/* Overall Star Picker */}
          <div className="text-center py-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              Overall Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingOverall(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= ratingOverall
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-1">
              {ratingOverall === 5
                ? '🌟 Excellent & Highly Recommended'
                : ratingOverall === 4
                ? '👍 Very Good'
                : ratingOverall === 3
                ? '👌 Satisfactory'
                : '👎 Needs Improvement'}
            </div>
          </div>

          {/* Detailed Metric Selectors */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center text-xs">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block mb-1">Punctuality</span>
              <select
                value={ratingPunctuality}
                onChange={(e) => setRatingPunctuality(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg p-1 text-xs font-bold text-slate-800"
              >
                <option value={5}>5★ On Time</option>
                <option value={4}>4★ Slight Delay</option>
                <option value={3}>3★ Late</option>
              </select>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 font-medium block mb-1">Quality</span>
              <select
                value={ratingQuality}
                onChange={(e) => setRatingQuality(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg p-1 text-xs font-bold text-slate-800"
              >
                <option value={5}>5★ Top Notch</option>
                <option value={4}>4★ Good</option>
                <option value={3}>3★ Average</option>
              </select>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 font-medium block mb-1">Value</span>
              <select
                value={ratingValue}
                onChange={(e) => setRatingValue(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-lg p-1 text-xs font-bold text-slate-800"
              >
                <option value={5}>5★ Fair Price</option>
                <option value={4}>4★ Reasonable</option>
                <option value={3}>3★ High</option>
              </select>
            </div>
          </div>

          {/* Feedback Comment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Your Review / Feedback
            </label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Arrived on time, fixed the issue cleanly with genuine parts. Very polite professional!"
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs sm:text-sm focus:border-blue-600 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={16} /> Submit Verified Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
