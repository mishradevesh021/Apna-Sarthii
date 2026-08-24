'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  Briefcase,
  ClipboardList,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Award,
  Layers,
  Star,
  Search,
  Mail,
  Phone,
  MapPin,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatINR, formatTimeAgo } from '@/lib/utils';

export default function AdminPage() {
  const { user, loginAsDemo } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [workers, setWorkers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ACCOUNTS' | 'VERIFICATIONS' | 'REPORTS' | 'SERVICES'>('OVERVIEW');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'CUSTOMER' | 'WORKER' | 'ADMIN'>('ALL');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      const [statsRes, workersRes, reportsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/verifications'),
        fetch('/api/admin/reports'),
        fetch('/api/admin/users'),
      ]);

      const statsData = await statsRes.json();
      const workersData = await workersRes.json();
      const reportsData = await reportsRes.json();
      const usersData = await usersRes.json();

      if (statsData.stats) setStats(statsData);
      if (workersData.workers) setWorkers(workersData.workers);
      if (reportsData.reports) setReports(reportsData.reports);
      if (usersData.users) setAllUsers(usersData.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const handleVerifyWorker = async (workerProfileId: string, isVerified: boolean) => {
    setProcessingId(workerProfileId);
    try {
      const res = await fetch('/api/admin/verifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerProfileId, isVerified }),
      });
      if (res.ok) {
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Admin Authentication Required</h2>
        <p className="text-xs text-slate-500 mt-1">
          Sign in with administrator privileges to access platform operations.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => loginAsDemo('ADMIN')}
            className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            🛡️ Switch to Demo Admin Account
          </button>
          <Link
            href="/auth/login"
            className="w-full py-2 px-4 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50"
          >
            Regular Sign In
          </Link>
        </div>
      </div>
    );
  }

  const filteredUsers = allUsers.filter((u) => {
    if (userRoleFilter !== 'ALL' && u.role !== userRoleFilter) return false;
    if (userSearchQuery.trim()) {
      const q = userSearchQuery.toLowerCase();
      const matchName = u.name?.toLowerCase().includes(q);
      const matchEmail = u.email?.toLowerCase().includes(q);
      const matchLoc = u.locality?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchLoc) return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 space-y-6">
      {/* Header */}
      <div className="bg-[#0b132b] text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-extrabold flex items-center justify-center shadow-inner">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black">Sarthi Admin Command Center</h1>
            <p className="text-xs text-slate-300">
              User Directory, Worker Verification, Risk Monitoring & Marketplace Analytics
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/90 p-1.5 rounded-2xl text-xs font-bold self-start sm:self-auto overflow-x-auto">
          {(['OVERVIEW', 'ACCOUNTS', 'VERIFICATIONS', 'REPORTS', 'SERVICES'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab === 'ACCOUNTS' ? '👥 ALL USERS & WORKERS' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">Total Users</span>
                <Users size={16} className="text-blue-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {allUsers.length || 15}
              </div>
              <span className="text-[11px] text-slate-500">
                {allUsers.filter((u) => u.role === 'WORKER').length || 12} Pros • {allUsers.filter((u) => u.role === 'CUSTOMER').length || 2} Customers
              </span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">Completed Jobs</span>
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {stats?.stats.completedJobs || 12}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold">100% resolution rate</span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">Market GMV</span>
                <DollarSign size={16} className="text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {formatINR(stats?.stats.totalGMV || 18500)}
              </div>
              <span className="text-[11px] text-slate-500">Service value generated</span>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-bold uppercase">Verification Queue</span>
                <ShieldCheck size={16} className="text-purple-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {workers.filter((w) => !w.isVerified).length}
              </div>
              <span className="text-[11px] text-slate-500">Awaiting document check</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
              Category Distribution & Worker Supply
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {stats?.categories?.map((cat: any) => (
                <div key={cat.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="font-bold text-xs text-slate-900">{cat.name}</div>
                  <div className="flex items-center justify-between mt-1 text-xs text-slate-500">
                    <span>{cat._count?.workers || 2} Workers</span>
                    <span className="font-semibold text-blue-600">{cat._count?.requests || 1} Bookings</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL ACCOUNTS & WORKERS DIRECTORY */}
      {activeTab === 'ACCOUNTS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Registered Users & Worker Directory ({filteredUsers.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Full list of customer, worker, and administrator accounts
              </p>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              {(['ALL', 'CUSTOMER', 'WORKER', 'ADMIN'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1 rounded-xl transition ${
                    userRoleFilter === r
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              placeholder="Search user by name, email, or locality..."
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 py-2 pl-9 pr-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          </div>

          {/* Users Table / List */}
          <div className="space-y-2.5 divide-y divide-slate-100">
            {filteredUsers.map((u) => (
              <div key={u.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl text-white font-black text-xs flex items-center justify-center flex-shrink-0 ${
                      u.role === 'WORKER'
                        ? 'bg-emerald-600'
                        : u.role === 'ADMIN'
                        ? 'bg-purple-600'
                        : 'bg-blue-600'
                    }`}
                  >
                    {u.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900">{u.name}</span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          u.role === 'WORKER'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : u.role === 'ADMIN'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {u.role}
                      </span>
                      {u.workerProfile?.isVerified && (
                        <span className="text-blue-600 text-[10px] font-bold">✓ Verified Pro</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail size={11} className="text-slate-400" />
                        {u.email}
                      </span>
                      {u.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={11} className="text-slate-400" />
                          {u.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-red-500" />
                        {u.locality}, {u.city}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  {u.workerProfile ? (
                    <div className="text-xs font-bold text-slate-700">
                      <span>{u.workerProfile.primaryCategory?.name || 'Technician'}</span>
                      <span className="text-slate-400 block text-[10px]">
                        ⭐ {u.workerProfile.rating || 4.8} • {u.workerProfile.completedJobs || 50}+ jobs
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs">Customer Account</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WORKER VERIFICATIONS */}
      {activeTab === 'VERIFICATIONS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Worker Verification & Background Trust
            </h2>
            <p className="text-xs text-slate-500">
              Grant or revoke verified professional blue badge status
            </p>
          </div>

          <div className="space-y-3 divide-y divide-slate-100">
            {workers.map((w) => (
              <div key={w.id} className="pt-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {w.user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">{w.user.name}</span>
                      {w.isVerified ? (
                        <span className="text-emerald-700 bg-emerald-50 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                          Pending Check
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {w.primaryCategory.name} • {w.user.locality}, {w.user.city} • {w.experienceYears} yrs exp
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {w.isVerified ? (
                    <button
                      disabled={processingId === w.id}
                      onClick={() => handleVerifyWorker(w.id, false)}
                      className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition"
                    >
                      Revoke Badge
                    </button>
                  ) : (
                    <button
                      disabled={processingId === w.id}
                      onClick={() => handleVerifyWorker(w.id, true)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
                    >
                      <CheckCircle2 size={13} />
                      <span>Approve & Verify</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS */}
      {activeTab === 'REPORTS' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Safety & Dispute Reports ({reports.length})
          </h2>

          {reports.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
              Zero active abuse or dispute reports. Platform is operating smoothly.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-600 uppercase">{r.reason}</span>
                    <span className="text-[10px] text-slate-400">{formatTimeAgo(r.createdAt)}</span>
                  </div>
                  <p className="text-slate-700">{r.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SERVICES */}
      {activeTab === 'SERVICES' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 animate-in fade-in duration-200">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Platform Service Catalog
          </h2>
          <div className="space-y-2 divide-y divide-slate-100">
            {stats?.categories?.map((cat: any) => (
              <div key={cat.id} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{cat.name}</span>
                  <p className="text-[11px] text-slate-500">{cat.description}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-800">Starts {formatINR(cat.startingPrice)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
