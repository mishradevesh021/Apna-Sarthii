'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Star,
  MapPin,
  XCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import JobTimelineView from '@/components/booking/JobTimelineView';
import ReviewModal from '@/components/reviews/ReviewModal';
import { useAuth } from '@/context/AuthContext';
import { formatINR, formatTimeAgo } from '@/lib/utils';
import { ServiceRequestDTO } from '@/lib/types';

export default function RequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const [reviewModalState, setReviewModalState] = useState<{
    isOpen: boolean;
    requestId: string;
    workerName: string;
  }>({ isOpen: false, requestId: '', workerName: '' });

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/service-requests');
      const data = await res.json();
      if (data.requests) setRequests(data.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleCancelRequest = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this service request?')) return;

    try {
      const res = await fetch(`/api/service-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED', note: 'Cancelled by customer' }),
      });
      if (res.ok) {
        fetchRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === 'ACTIVE') {
      return !['COMPLETED', 'CANCELLED', 'DECLINED'].includes(r.status);
    }
    if (filter === 'COMPLETED') {
      return r.status === 'COMPLETED';
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200/60 px-2.5 py-1 rounded-full text-xs font-bold">⏳ Awaiting Acceptance</span>;
      case 'ACCEPTED':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200/60 px-2.5 py-1 rounded-full text-xs font-bold">🎉 Accepted</span>;
      case 'ON_THE_WAY':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-2.5 py-1 rounded-full text-xs font-bold">🚗 On The Way</span>;
      case 'ARRIVED':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200/60 px-2.5 py-1 rounded-full text-xs font-bold">📍 Arrived</span>;
      case 'IN_PROGRESS':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200/60 px-2.5 py-1 rounded-full text-xs font-bold">⚡ Work In Progress</span>;
      case 'COMPLETED':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-full text-xs font-bold">✅ Completed</span>;
      default:
        return <span className="bg-red-50 text-red-700 border border-red-200/60 px-2.5 py-1 rounded-full text-xs font-bold">❌ {status}</span>;
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <ClipboardList size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Sign in to View Bookings</h2>
        <p className="text-xs text-slate-500 mt-1">
          Keep track of your service requests and live professional status.
        </p>
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
    <div className="max-w-4xl mx-auto px-4 py-5 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {user.role === 'WORKER' ? 'Job Assignments' : 'My Service Bookings'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status tracking, messaging & verified feedback
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilter('ACTIVE')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filter === 'ACTIVE' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            className={`px-3 py-1.5 rounded-xl transition ${
              filter === 'COMPLETED' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 h-40 border border-slate-100" />
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
            📋
          </div>
          <h3 className="font-bold text-slate-800 text-base">No bookings found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {filter === 'ACTIVE'
              ? 'You have no active ongoing service requests.'
              : 'You have not placed any service requests yet.'}
          </p>
          <Link
            href="/"
            className="inline-block mt-4 text-xs font-bold text-white bg-blue-600 px-5 py-2.5 rounded-xl shadow-xs"
          >
            Find a Professional
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Header: Service Name & Status Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 font-extrabold flex items-center justify-center text-sm flex-shrink-0">
                    🔧
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                      {req.problemTitle}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{req.categoryName}</span>
                      <span>•</span>
                      <span>Requested {formatTimeAgo(req.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div>{getStatusBadge(req.status)}</div>
              </div>

              {/* Problem Description & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 font-bold block mb-0.5">Problem Details:</span>
                  <p className="text-slate-700 leading-relaxed">{req.problemDescription}</p>
                </div>

                <div className="space-y-1">
                  <div>
                    <span className="text-slate-400 font-bold">Location: </span>
                    <span className="text-slate-800 font-medium">{req.locationAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Timing: </span>
                    <span className="text-slate-800 font-medium">{req.urgency} ({req.scheduledTime})</span>
                  </div>
                  {req.estimatedBudget && (
                    <div>
                      <span className="text-slate-400 font-bold">Estimated Cost: </span>
                      <span className="text-blue-700 font-extrabold">{formatINR(req.estimatedBudget)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Timeline Stepper */}
              <div className="pt-2">
                <JobTimelineView currentStatus={req.status} timeline={req.timeline} />
              </div>

              {/* Footer Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">
                    {user.role === 'WORKER' ? 'Customer:' : 'Assigned Pro:'}
                  </span>
                  <strong className="text-slate-900">
                    {user.role === 'WORKER' ? req.customerName : req.workerName}
                  </strong>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Chat Button */}
                  <Link
                    href={`/messages?requestId=${req.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition"
                  >
                    <MessageSquare size={14} className="text-blue-600" />
                    <span>Chat</span>
                  </Link>

                  {/* Customer Cancel Button (only if requested) */}
                  {user.role === 'CUSTOMER' && req.status === 'REQUESTED' && (
                    <button
                      onClick={() => handleCancelRequest(req.id)}
                      className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold transition"
                    >
                      Cancel Request
                    </button>
                  )}

                  {/* Rate & Review Button (if completed and not yet reviewed) */}
                  {user.role === 'CUSTOMER' && req.status === 'COMPLETED' && !req.review && (
                    <button
                      onClick={() =>
                        setReviewModalState({
                          isOpen: true,
                          requestId: req.id,
                          workerName: req.workerName,
                        })
                      }
                      className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition shadow-xs"
                    >
                      <Star size={14} className="fill-white" />
                      <span>Rate & Review</span>
                    </button>
                  )}

                  {req.review && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      Reviewed ({req.review.ratingOverall}★)
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        requestId={reviewModalState.requestId}
        workerName={reviewModalState.workerName}
        isOpen={reviewModalState.isOpen}
        onClose={() => setReviewModalState({ isOpen: false, requestId: '', workerName: '' })}
        onSuccess={() => fetchRequests()}
      />
    </div>
  );
}
