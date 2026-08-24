'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Truck,
  MapPin,
  Wrench,
  Clock,
  Star,
  DollarSign,
  Zap,
  Phone,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatINR, formatTimeAgo } from '@/lib/utils';
import { ServiceRequestDTO } from '@/lib/types';
import JobTimelineView from '@/components/booking/JobTimelineView';

export default function WorkerDashboardPage() {
  const { user, loginAsDemo } = useAuth();
  const [requests, setRequests] = useState<ServiceRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [emergency24x7, setEmergency24x7] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchWorkerData = async () => {
    try {
      const res = await fetch('/api/service-requests');
      const data = await res.json();
      if (data.requests) setRequests(data.requests);

      if (user?.workerProfile) {
        setIsAvailable(user.workerProfile.isAvailable);
        setEmergency24x7(user.workerProfile.emergency24x7);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerData();
  }, [user]);

  const toggleAvailability = async () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    try {
      await fetch('/api/worker/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: nextState }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (requestId: string, status: string, note?: string) => {
    setUpdatingStatus(requestId);
    try {
      const res = await fetch(`/api/service-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note }),
      });
      if (res.ok) {
        await fetchWorkerData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <Briefcase size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Worker Dashboard Sign In</h2>
        <p className="text-xs text-slate-500 mt-1">
          Sign in with your professional account to manage leads and update jobs.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => loginAsDemo('WORKER')}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            ⚡ Open Rahul Kumar Demo (Worker)
          </button>
          <Link
            href="/auth/login"
            className="w-full py-2 px-4 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50"
          >
            Custom Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Filter requests
  const newRequests = requests.filter((r) => r.status === 'REQUESTED');
  const activeJobs = requests.filter((r) =>
    ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(r.status)
  );
  const completedJobs = requests.filter((r) => r.status === 'COMPLETED');

  // Stats calculation
  const totalEarnings = completedJobs.reduce(
    (sum, r) => sum + (r.estimatedBudget || 300),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 space-y-6">
      {/* Top Banner & Profile Overview */}
      <div className="bg-gradient-to-r from-[#0b132b] to-[#1e293b] text-white rounded-3xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-black text-xl flex items-center justify-center shadow-inner">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">Welcome, {user.name}</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  <ShieldCheck size={12} /> Verified Pro
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {user.locality}, {user.city} • Professional Dashboard
              </p>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
            <span className="text-xs font-bold text-slate-200">Live Status:</span>
            <button
              onClick={toggleAvailability}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition shadow-xs ${
                isAvailable
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isAvailable ? 'bg-white animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span>{isAvailable ? 'Available for Jobs' : 'Off Duty (Busy)'}</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium block">New Requests</span>
            <span className="text-xl font-black text-amber-400 mt-0.5 block">
              {newRequests.length}
            </span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium block">Active Jobs</span>
            <span className="text-xl font-black text-blue-400 mt-0.5 block">
              {activeJobs.length}
            </span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium block">Completed Jobs</span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">
              {user.workerProfile?.completedJobs || completedJobs.length}
            </span>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
            <span className="text-[11px] text-slate-400 font-medium block">Est. Revenue</span>
            <span className="text-xl font-black text-white mt-0.5 block">
              {formatINR(totalEarnings || 4200)}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Incoming Service Requests (Needs Accept/Decline) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span>New Incoming Leads</span>
            {newRequests.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-black animate-pulse">
                {newRequests.length}
              </span>
            )}
          </h2>
        </div>

        {newRequests.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-3xl border border-slate-200 shadow-xs">
            <p className="text-xs text-slate-500">
              No pending requests at the moment. As customers in {user.locality} submit requests, they will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {newRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-5 border-2 border-blue-500 shadow-md animate-in slide-in-from-top-2 duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                      ⚡
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{req.problemTitle}</h3>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Customer: <strong className="text-slate-800">{req.customerName}</strong></span>
                        <span>•</span>
                        <span>{formatTimeAgo(req.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      ⚡ {req.urgency} ({req.scheduledTime})
                    </span>
                  </div>
                </div>

                <div className="py-3 text-xs text-slate-700 space-y-1.5 bg-slate-50 p-3 rounded-2xl my-3 border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-400">Problem Description: </span>
                    <span className="text-slate-900 font-medium">{req.problemDescription}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400">Customer Address: </span>
                    <span className="text-slate-900 font-medium">{req.locationAddress}</span>
                  </div>
                  {req.estimatedBudget && (
                    <div>
                      <span className="font-bold text-slate-400">Offered Budget: </span>
                      <span className="text-blue-700 font-extrabold">{formatINR(req.estimatedBudget)}</span>
                    </div>
                  )}
                </div>

                {/* 1-Click Accept & Decline Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    disabled={updatingStatus === req.id}
                    onClick={() => handleUpdateStatus(req.id, 'ACCEPTED', 'Professional accepted the job.')}
                    className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={16} /> Accept Service Request
                  </button>

                  <button
                    disabled={updatingStatus === req.id}
                    onClick={() => handleUpdateStatus(req.id, 'DECLINED', 'Worker currently busy')}
                    className="py-3 px-4 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition"
                  >
                    Decline
                  </button>

                  <Link
                    href={`/messages?requestId=${req.id}`}
                    className="p-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                    title="Ask Question"
                  >
                    <MessageSquare size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION 2: Active Ongoing Jobs (Progress Stepper Controls) */}
      <section className="space-y-3">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
          Active Ongoing Jobs ({activeJobs.length})
        </h2>

        {activeJobs.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-3xl border border-slate-200 shadow-xs text-xs text-slate-500">
            No active jobs in progress. Accept an incoming request above to begin dispatch.
          </div>
        ) : (
          <div className="space-y-4">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{job.problemTitle}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Client: <strong className="text-slate-800">{job.customerName}</strong> • {job.locationAddress}
                    </p>
                  </div>
                  <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full self-start sm:self-auto">
                    Status: {job.status.replace(/_/g, ' ')}
                  </div>
                </div>

                {/* Progress Visualizer */}
                <JobTimelineView currentStatus={job.status} timeline={job.timeline} />

                {/* Worker Status Update Action Bar */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">
                    Update Real-Time Status for Customer:
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <button
                      disabled={job.status !== 'ACCEPTED' || updatingStatus === job.id}
                      onClick={() => handleUpdateStatus(job.id, 'ON_THE_WAY', 'Worker is heading to your location')}
                      className={`p-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                        job.status === 'ACCEPTED'
                          ? 'bg-blue-600 text-white shadow-xs hover:bg-blue-700'
                          : 'bg-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <Truck size={14} /> On The Way
                    </button>

                    <button
                      disabled={job.status !== 'ON_THE_WAY' || updatingStatus === job.id}
                      onClick={() => handleUpdateStatus(job.id, 'ARRIVED', 'Worker reached premises')}
                      className={`p-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                        job.status === 'ON_THE_WAY'
                          ? 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700'
                          : 'bg-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <MapPin size={14} /> Arrived at Location
                    </button>

                    <button
                      disabled={job.status !== 'ARRIVED' || updatingStatus === job.id}
                      onClick={() => handleUpdateStatus(job.id, 'IN_PROGRESS', 'Inspection and repairs started')}
                      className={`p-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                        job.status === 'ARRIVED'
                          ? 'bg-amber-600 text-white shadow-xs hover:bg-amber-700'
                          : 'bg-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <Wrench size={14} /> Work Started
                    </button>

                    <button
                      disabled={job.status !== 'IN_PROGRESS' || updatingStatus === job.id}
                      onClick={() => handleUpdateStatus(job.id, 'COMPLETED', 'Job completed and verified')}
                      className={`p-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                        job.status === 'IN_PROGRESS'
                          ? 'bg-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                          : 'bg-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle2 size={14} /> Mark Completed
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <Link
                    href={`/messages?requestId=${job.id}`}
                    className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    <MessageSquare size={14} />
                    <span>Message Customer ({job.customerName})</span>
                  </Link>

                  <span className="text-slate-400">
                    Est. Payment: {formatINR(job.estimatedBudget || 300)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
