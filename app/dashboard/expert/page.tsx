"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/app/hooks/page';
import api from '@/app/api/page';
import { Send, Star, Circle, MessageSquare, CheckCheck, X, Bell, LogOut, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNav } from "../../components/layout/page";

const ElapsedTimer = ({ createdAt }: { createdAt: string }) => {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    const calculate = () => {
      const start = new Date(createdAt).getTime();
      const now = new Date().getTime();
      const diff = Math.floor((now - start) / 1000);

      const mins = Math.floor(diff / 60);
      const secs = diff % 60;
      setElapsed(`${mins}m ${secs}s`);
    };

    const interval = setInterval(calculate, 1000);
    calculate();
    return () => clearInterval(interval);
  }, [createdAt]);

  return <span className="font-mono text-orange-500">{elapsed}</span>;
};

export default function ExpertDashboard() {
  const { currentView, setCurrentView } = useNav();
  const router = useRouter();
  const socket = useSocket();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [expert, setExpert] = useState<any>(null);
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [incoming, setIncoming] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  // 1. Initial Sync
  useEffect(() => {
    const sync = async () => {
      try {
        const profile = await api.get('/profile/me');
        setExpert(profile.data);
      
        const reviewRes = await api.get(`/review/expert/${profile.data.userId}`);
        setReviews(reviewRes.data.data);

        const pending = await api.get('/request/pending'); 
        setPendingRequests(pending.data);

        const active = await api.get('/request/accepted');
        if (active.data && active.data.length > 0) {
          const req = active.data[0];
          console.log("DEBUG: Active Request Data:", req);
          setActiveRequest(req);
          socket?.emit("join-request", req.id);
          const msgs = await api.get(`/message/${req.id}/messages`);
          setMessages(msgs.data);
        }
      } catch (e) { console.error("Sync failed", e); }
    };
    sync();
  }, [socket]);

  // 2. Real-time Listeners
  useEffect(() => {
    if (!socket) return;

    const removeRequestFromUI = (id: string) => {
    setPendingRequests((prev) => prev.filter(req => req.id !== id));
    setIncoming((prev:any) => (prev?.id === id ? null : prev));
  };

    // Listen for new requests to show the Toast
    socket.on("new-pending-request", (newReq) => {
      setIncoming(newReq); 
      setPendingRequests((prev) => {
        if (prev.find(r => r.id === newReq.id)) return prev;
        return [newReq, ...prev];
      });
    });

    socket.on("new-assignment", (data) => {
      setActiveRequest(data);
      setPendingRequests(prev => prev.filter(r => r.id !== data.id));
      setIncoming(null);
      socket.emit("join-request", data.id);
      setCurrentView('chat'); 
    });

    socket.on("new-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    socket.on("request-cancelled", (data) => {
      const cancelledId = data.requestId || data.id;
      // 1. Remove from Pending Requests
      setPendingRequests((prev) => prev.filter(req => req.id !== cancelledId));
      // 2. Clear the Toast if it's currently showing this request
      setIncoming((prev:any) => (prev?.id === cancelledId ? null : prev));
    });

    socket.on("request-accepted-by-other", (data) => {
      console.log("Request taken by another expert:", data.id);
      removeRequestFromUI(data.id);
    });

    return () => {
      socket.off("new-pending-request");
      socket.off("new-assignment");
      socket.off("new-message");
      socket.off("request-cancelled");
      socket.off("request-accepted-by-other")
    };
  }, [socket, setCurrentView]);

  // 3. Handlers
  const handleAccept = async (reqId?: string) => {
    const targetId = reqId || incoming?.id;
    if (!targetId) return;

    try {
      const { data } = await api.post(`/request/${targetId}/accept`);
      setActiveRequest(data);
      socket?.emit("join-request", data.id);
      setIncoming(null);
      setCurrentView('chat'); 
    } catch (e) { 
      alert("Request no longer available"); 
      setIncoming(null);
    }
  };

  const handleReject = async (reqId: string) => {
    try {
      await api.post(`/request/${reqId}/reject`);
      // Remove from local UI list
      setPendingRequests((prev) => prev.filter(r => r.id !== reqId));
      if (incoming?.id === reqId) setIncoming(null);
      
    } catch (e) {
      console.error("Reject failed", e);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeRequest) return;

    const content = input;
    setInput(""); 

    try {
      await api.post(`/message/${activeRequest.id}/messages`, { content });
    } catch (err: any) {
      console.error("❌ Message failed:", err);
      setInput(content);
    }
  };

  const handleLogout = async () => {
    try {
      if (socket?.connected) socket.disconnect();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/");
    } catch (error) {
      router.push("/");
    }
  };

  const handleCloseChat = async () => {
    if (!window.confirm("End this support session?")) return;
    try {
      await api.post(`/request/${activeRequest.id}/close`);
      setActiveRequest(null);
      setMessages([]);
      setCurrentView('dashboard');
    } catch (e) { console.error("Close failed", e); }
  };

  if (!expert) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="flex h-full bg-[#F1F5F9] overflow-hidden relative">
      
      {/* 🔥 INCOMING TOAST OVERLAY */}
      {incoming && !activeRequest && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[100] animate-in slide-in-from-top-10 duration-500">
          <div className="bg-white border-2 border-indigo-500 shadow-[0_20px_50px_rgba(79,70,229,0.2)] rounded-[2rem] p-5 flex items-center justify-between">
            <div className="flex gap-4 items-center truncate">
              <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100 animate-pulse">
                <Bell size={24}/>
              </div>
              <div className="truncate">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Immediate Support Needed</p>
                <p className="font-bold text-slate-900 truncate">{incoming.user?.email || 'New Client'}</p>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button 
                onClick={() => handleAccept()} 
                className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition shadow-md"
              >
                <CheckCheck size={20}/>
              </button>
              <button 
                onClick={() => setIncoming(null)} 
                className="bg-slate-100 text-slate-400 p-3 rounded-xl hover:bg-slate-200 transition"
              >
                <X size={20}/>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`${currentView === 'dashboard' ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 bg-white border-r border-slate-200 flex-col p-6 overflow-y-auto`}>
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-indigo-100">
              {expert.user.email[0].toUpperCase()}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white rounded-full ${activeRequest ? 'bg-orange-500' : 'bg-green-500'}`} />
          </div>
          <h2 className="text-xl font-bold text-black">{expert.user.email.split('@')[0]}</h2>
          <div className="flex items-center gap-1 mt-1 text-yellow-500">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-bold text-slate-700">{expert.rating || 5.0} Expert</span>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
            <p className="text-sm font-bold flex items-center gap-2 text-black">
              <Circle size={8} fill={activeRequest ? "#f97316" : "#22c55e"} className="text-transparent" />
              {activeRequest ? "Busy (In Chat)" : "Available for Clients"}
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Client Feedback</p>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {reviews.length > 0 ? reviews.map((r, i) => (
              <div key={i} className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-100 transition-colors">
                <div className="flex text-yellow-400 mb-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={10} fill={idx < r.rating ? "currentColor" : "none"} className={idx < r.rating ? "" : "text-slate-200"} />
                  ))}
                </div>
                <p className="text-[11px] text-slate-600 italic leading-tight">"{r.comment}"</p>
              </div>
            )) : <p className="text-[11px] text-slate-400">No feedback yet.</p>}
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 p-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all mt-auto">
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      {/* --- MAIN CHAT STAGE --- */}
      <main className={`${currentView === 'chat' ? 'flex' : 'hidden'} lg:flex flex-1 flex flex-col relative min-w-0 bg-white`}>
        {activeRequest ? (
          <div className="flex flex-col h-full overflow-hidden bg-white">
            <div className="p-4 md:p-6 border-b flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
                  {activeRequest.user?.email?.[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm md:text-base">{activeRequest.user?.email}</h4>
                  <p className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> Secure Session
                  </p>
                </div>
              </div>
              <button onClick={handleCloseChat} className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                End Session
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 bg-slate-50/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.senderId === expert.userId ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[80%] flex flex-col">
                    <div className={`p-3 md:p-4 rounded-2xl text-sm font-medium shadow-sm ${
                      m.senderId === expert.userId 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200' 
                    }`}>
                      {m.content}
                    </div>
                    <span className={`text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-tighter ${m.senderId === expert.userId ? 'text-right' : ''}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 md:p-6 bg-white border-t flex gap-2">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your professional advice..."
                className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-indigo-500 transition-all font-medium text-sm text-black"
              />
              <button className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 shrink-0">
                <Send size={20} />
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.map((req) => (
              <div 
                key={req.id} 
                className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group relative overflow-hidden"
              >
                {/* Background Decoration */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-100">
                      {req.user?.email[0].toUpperCase()}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Elapsed</p>
                      <div className="text-sm font-bold">
                        <ElapsedTimer createdAt={req.createdAt} />
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="font-black text-slate-900 truncate">
                      {req.user?.email.split('@')[0]}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{req.user?.email}</p>
                    
                    <div className="flex gap-2 mt-3">
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-bold uppercase tracking-tight">
                        Standard Support
                      </span>
                      <span className="text-[9px] bg-green-50 text-green-600 px-2 py-1 rounded-lg font-bold uppercase tracking-tight">
                        Live
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleAccept(req.id)}
                      className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                    >
                      <CheckCheck size={18} /> Accept
                    </button>
                    <button 
                      onClick={() => handleReject(req.id)}
                      className="w-14 h-14 flex items-center justify-center bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}