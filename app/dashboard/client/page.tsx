"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/app/hooks/page';
import api from '@/app/api/page';
import { Send, Star, Search, ShieldCheck, X, CheckCircle2, Circle, LogOut } from 'lucide-react';
import { useNav } from "../../components/layout/page";
import { useRouter } from 'next/navigation';

export default function ClientDashboard() {
  const router = useRouter();
  const socket = useSocket();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currentView } = useNav();
  const [activeRequest, setActiveRequest] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  // 1. Sync: Check for active sessions on load
  useEffect(() => {
    const sync = async () => {
      try {
        const res = await api.get('/request/accepted');
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const myId = savedUser.id;

        if (myId) {
          const profileRes = await api.get(`/profile/user/${myId}`);
          setClient(profileRes.data); 
        }
        if (res.data && res.data.length > 0) {
          const req = res.data[0];
          setActiveRequest(req);
          const clientRes = await api.get(`profile/user/${req.userId}`);
          setClient(clientRes.data);
          socket?.emit("join-request", req.id);
          const msgs = await api.get(`/message/${req.id}/messages`);
          setMessages(msgs.data);
        }
      } catch (e) { console.error("Sync failed", e); }
    };
    sync();
  }, [socket]);

  // 2. Socket Listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("request-accepted", (fullRequest) => {
    setActiveRequest(fullRequest); 
    setIsSearching(false);
    socket.emit("join-request", fullRequest.id);
  });

    socket.on("new-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    socket.on("session-closed", () => {
      setShowReviewModal(true);
    });

    socket.on("status-updated", (data) => {
    if (data.status === "CANCELLED" || data.status === "REJECTED") {
      setActiveRequest(null);
      setMessages([]);
      alert("This request has been cancelled or closed.");
    }
  });

    return () => {
      socket.off("request-accepted");
      socket.off("new-message");
      socket.off("session-closed");
      socket.off("status-updated");
    };
  }, [socket]);

  // 3. Handlers
  const handleCreateRequest = async () => {
    try {
      setIsSearching(true);
      const res = await api.post('/request'); 
      
      // 🔥 If an expert was found immediately, update the UI NOW
      if (res.data.status === 'ACCEPTED' && res.data.expertId) {
        setActiveRequest(res.data);
        setIsSearching(false);
        socket?.emit("join-request", res.data.id);
      }
    } catch (e) {
      setIsSearching(false);
      alert("Failed to create request");
    }
  };

  const handleCancelRequest = async () => {
    if (!activeRequest) return;
    if (activeRequest.status === 'ACCEPTED' || activeRequest.status === 'ACTIVE') {
      alert("An expert has already joined. Please use 'End Session' instead.");
      return;
    }
    try {
      await api.post(`/request/${activeRequest.id}/cancel`);
      setActiveRequest(null);
      setMessages([]);
      setIsSearching(false); 
    } catch (err) {
      setIsSearching(false);
      console.error("Failed to cancel request:", err);
      alert("Could not cancel request. It might have been accepted already.");
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeRequest) return;
    socket?.emit("Send-message", { requestId: activeRequest.id, content: input });
    setInput("");
  };

  const handleLogout = async () => {
      try {
        // 1. Notify the server we are leaving
        if (socket && socket.connected) {
          socket.disconnect();
        }

        // 2. Clear credentials
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // 3. Clear local component state (Optional but good practice)
        setMessages([]);
        setActiveRequest(null);

        // 4. Redirect
        router.push("/");
      } catch (error) {
        console.error("Logout failed:", error);
        router.push("/");
      }
    };

  const submitReview = async () => {
  if (!activeRequest) return;

  try {
    await api.post('/review', { 
      rating, 
      comment, 
      requestId: activeRequest.id, 
      expertId: activeRequest.expertId, 
    });

    // Cleanup UI after success
    setShowReviewModal(false);
    setActiveRequest(null);
    setMessages([]);
    setComment(""); 
    setRating(5);   

  } catch (e) { 
    console.error("Review submission error:", e);
    alert("Failed to submit review. Please try again."); 
  }
};
  console.log("client DASHBOARD - ACTIVE REQUEST DATA:", activeRequest);
  return (
    <div className="flex h-full bg-[#F1F5F9] overflow-hidden">
      {/* --- SIDEBAR: Hidden on Mobile --- */}
      <aside className={`${currentView === 'dashboard' ? 'flex' : 'hidden'} lg:flex w-full lg:w-80 bg-white border-r border-slate-200 flex-col p-6 overflow-y-auto`}>
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-indigo-100">
              {client?.name ? client.name[0].toUpperCase() : (client?.email ? client.email[0].toUpperCase() : "?")}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white rounded-full ${activeRequest ? 'bg-orange-500' : 'bg-green-500'}`} />
          </div>
          <h2 className="text-xl font-bold text-black">{client?.name ? client.name : (client?.email ? client.email.split('@')[0] : "Loading...")}</h2>
        </div>

        {/* Status Box */}
        <div className="space-y-4 flex-1">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
            <p className="text-sm font-bold flex items-center gap-2 text-black">
              <Circle size={8} fill={activeRequest ? "#f97316" : "#22c55e"} className="text-transparent" />
              {activeRequest ? "On Active Call" : "Available"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
         className="flex items-center gap-3 p-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all mt-auto">
          <LogOut size={20} /> Sign Out
        </button>
      </aside>
      

      <main className={`${currentView === 'chat' ? 'flex' : 'hidden'} lg:flex flex-1 flex flex-col relative min-w-0 bg-white`}>
      {/* SEARCHING OVERLAY */}
      {isSearching && (
        <div className="absolute inset-0 z-50 bg-indigo-600 flex flex-col items-center justify-center text-white p-6 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
            <div className="relative bg-white text-indigo-600 p-8 rounded-full shadow-2xl">
              <Search size={48} className="animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-black mb-2">Finding Your Expert</h2>
          <p className="text-indigo-100 max-w-xs">We are matching you with the best available professional for your request.</p>
          <button onClick={handleCancelRequest} className="mt-10 text-sm font-bold opacity-60 hover:opacity-100 uppercase tracking-widest">Cancel Request</button>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Session Complete!</h3>
              <p className="text-slate-500 text-sm">How was your experience with {activeRequest?.expert?.email}?</p>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((num) => (
                <button key={num} onClick={() => setRating(num)} className={`transition-all ${rating >= num ? 'text-yellow-400 scale-110' : 'text-slate-200'}`}>
                  <Star size={32} fill={rating >= num ? "currentColor" : "none"} />
                </button>
              ))}
            </div>

            <textarea 
              className="w-full bg-slate-50 text-black border-none rounded-2xl p-4 text-sm mb-6 outline-none focus:ring-2 ring-indigo-500 h-24 resize-none"
              placeholder="Leave a professional comment (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button onClick={submitReview} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
              Submit Review & Close
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      {!activeRequest ? (
        /* IDLE STATE */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mb-8">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Ready to help.</h1>
          <p className="text-slate-500 max-w-sm mb-10 leading-relaxed">Click below to connect with a verified professional for your support request.</p>
          <button 
            onClick={handleCreateRequest}
            className="group relative bg-indigo-600 text-white px-10 py-5 rounded-3xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:-translate-y-1 animate-pulse"
          >
            Request Assistance
            <div className="absolute -inset-1 bg-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition" />
          </button>
        </div>
      ) : (
        /* CHAT INTERFACE */
        <div className="flex flex-col h-full overflow-hidden">
          {activeRequest && activeRequest.expert ? (
            <div className="p-4 md:p-6 border-b flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                  {activeRequest.expert?.email?.[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 truncate text-sm md:text-base">{activeRequest.expert?.email}</h4>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Verified Expert
                  </p>
                </div>
              </div>
              <button className="text-slate-300 hover:text-slate-500 transition"><X size={20}/></button>
            </div>
          ) : (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-slate-200 rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-3 w-16 bg-slate-100 rounded" />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 bg-slate-50/30">
            {messages.map((m, i) => (
               <div key={i}>
                 <div key={i} className={`flex ${m.senderId === activeRequest.userId ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] p-2 md:p-3 rounded-2xl text-sm font-medium shadow-sm ${
                  m.senderId === activeRequest.userId 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-300 text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  {m.content}
                </div>
              </div>
                 <span className={`text-[10px] text-slate-400 mt-1 ${m.senderId === activeRequest.userId ? 'text-right block' : ''}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
               </div>
            ))}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={sendMessage} className="p-4 md:p-6 bg-white text-black flex gap-4">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How can we help today?"
              className="flex-1 bg-slate-100 border-none rounded-xl px-6 py-4 outline-none focus:ring-2 ring-indigo-500 text-sm font-medium"
            />
            <button className="bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 shrink-0">
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
     </main> 
    </div>
  );
}