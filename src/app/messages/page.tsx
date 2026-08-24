'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  User,
  ShieldAlert,
  ArrowLeft,
  Clock,
  CheckCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatTimeAgo } from '@/lib/utils';
import { ServiceRequestDTO } from '@/lib/types';

function MessagesContent() {
  const searchParams = useSearchParams();
  const requestIdParam = searchParams.get('requestId');

  const { user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequestDTO[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(requestIdParam);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all user's service requests to list chat threads
  useEffect(() => {
    fetch('/api/service-requests')
      .then((res) => res.json())
      .then((data) => {
        if (data.requests) {
          setRequests(data.requests);
          if (!selectedRequestId && data.requests.length > 0) {
            setSelectedRequestId(data.requests[0].id);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Fetch messages for active request
  const fetchMessages = async (reqId: string) => {
    try {
      const res = await fetch(`/api/messages?serviceRequestId=${reqId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (selectedRequestId) {
      fetchMessages(selectedRequestId);
      const interval = setInterval(() => fetchMessages(selectedRequestId), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedRequestId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedRequestId) return;

    const content = inputText.trim();
    setInputText('');
    setSending(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceRequestId: selectedRequestId,
          content,
        }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const activeRequest = requests.find((r) => r.id === selectedRequestId);
  const otherPartyName = user?.role === 'WORKER' ? activeRequest?.customerName : activeRequest?.workerName;

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <MessageSquare size={28} />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Sign in for Messages</h2>
        <p className="text-xs text-slate-500 mt-1">Connect directly with your booked service partners.</p>
        <Link
          href="/auth/login"
          className="inline-block mt-4 text-xs font-bold text-white bg-blue-600 px-6 py-2.5 rounded-xl"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden h-[75vh] flex">
        {/* Left Side: Threads list */}
        <div className="w-full sm:w-80 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-extrabold text-slate-900">Messages</h2>
            <p className="text-[11px] text-slate-500">Active job conversation threads</p>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {requests.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No active job conversations. Request a service to start chatting!
              </div>
            ) : (
              requests.map((req) => {
                const partnerName = user.role === 'WORKER' ? req.customerName : req.workerName;
                const isSelected = selectedRequestId === req.id;

                return (
                  <button
                    key={req.id}
                    onClick={() => setSelectedRequestId(req.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition ${
                      isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {partnerName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {partnerName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatTimeAgo(req.createdAt)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {req.problemTitle}
                      </div>
                      <span className="inline-block mt-1 text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                        {req.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Chat Box */}
        <div className="hidden sm:flex flex-1 flex-col bg-slate-50/30">
          {activeRequest ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {otherPartyName?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                      {otherPartyName}
                    </h3>
                    <div className="text-[10px] text-slate-500">
                      Service: <strong className="text-slate-700">{activeRequest.problemTitle}</strong> ({activeRequest.status})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Link
                    href={`/requests`}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    View Booking Details
                  </Link>
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Safe In-App Notice */}
                <div className="text-center my-2">
                  <span className="text-[10px] bg-slate-200/80 text-slate-600 px-3 py-1 rounded-full font-medium inline-flex items-center gap-1">
                    🔒 Messages are protected for customer & worker safety.
                  </span>
                </div>

                {messages.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No messages yet in this thread. Say hello or discuss service details!
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.senderId === user.id;

                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-sm rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                          {formatTimeAgo(m.createdAt)}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-2xl bg-slate-100 px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={sending || !inputText.trim()}
                  className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition shadow-xs"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <MessageSquare size={36} className="mb-2 opacity-50" />
              <p className="text-xs">Select a conversation thread to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs text-slate-400">Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
