'use client';

import React from 'react';
import {
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Wrench,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { RequestStatus } from '@/lib/types';
import { formatTimeAgo } from '@/lib/utils';

interface JobTimelineViewProps {
  currentStatus: RequestStatus;
  timeline?: {
    id: string;
    status: RequestStatus;
    note: string | null;
    createdAt: string;
  }[];
}

const statusSteps: { key: RequestStatus; label: string; icon: any }[] = [
  { key: 'REQUESTED', label: 'Requested', icon: Clock },
  { key: 'ACCEPTED', label: 'Accepted', icon: CheckCircle },
  { key: 'ON_THE_WAY', label: 'On The Way', icon: Truck },
  { key: 'ARRIVED', label: 'Arrived', icon: MapPin },
  { key: 'IN_PROGRESS', label: 'In Progress', icon: Wrench },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2 },
];

export default function JobTimelineView({ currentStatus, timeline = [] }: JobTimelineViewProps) {
  if (currentStatus === 'CANCELLED' || currentStatus === 'DECLINED') {
    return (
      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
        <XCircle size={24} className="flex-shrink-0" />
        <div>
          <h4 className="font-bold text-sm">
            Job {currentStatus === 'CANCELLED' ? 'Cancelled' : 'Declined'}
          </h4>
          <p className="text-xs text-red-600 mt-0.5">
            This service request is no longer active.
          </p>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === currentStatus);

  return (
    <div className="w-full py-2">
      {/* Horizontal / Responsive Stepper */}
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 z-0"
          style={{
            width: `${Math.max(0, (currentStepIndex / (statusSteps.length - 1)) * 100)}%`,
          }}
        />

        {statusSteps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110 shadow-md'
                    : isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                <Icon size={16} />
              </div>

              <span
                className={`text-[10px] sm:text-xs font-bold mt-1.5 text-center hidden xs:block ${
                  isCurrent
                    ? 'text-blue-700 font-extrabold'
                    : isDone
                    ? 'text-slate-800'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Timeline Audit Events Log */}
      {timeline.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Activity Log
          </h5>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs text-slate-600">
            {timeline.map((event) => (
              <div key={event.id} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="font-semibold text-slate-800">
                    {event.status.replace(/_/g, ' ')}
                  </span>
                  {event.note && <span className="text-slate-500 font-normal">— {event.note}</span>}
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0">
                  {formatTimeAgo(event.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
