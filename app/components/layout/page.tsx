"use client";
import React, { useEffect, useState, createContext, useContext } from 'react';
import { Menu, X, Home, MessageSquare, LogOut } from 'lucide-react';
import { useSocket } from '@/hooks/page';
import { useRouter } from 'next/navigation';

// 1. Create the Context to hold the current view state
type ViewType = 'dashboard' | 'chat' | 'reviews';
const NavContext = createContext<{
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
} | undefined>(undefined);

// 2. Export a hook so your Dashboard pages can use it
export const useNav = () => {
  const context = useContext(NavContext);
  if (!context) throw new Error("useNav must be used within a NavProvider");
  return context;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const socket = useSocket();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        setUserRole(JSON.parse(saved).role);
      } catch (e) {
        console.error("Parse error", e);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      if (socket) socket.disconnect();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/");
    } catch (error) {
      router.push("/");
    }
  };

  return (
    // 3. Wrap everything in the Provider
    <NavContext.Provider value={{ currentView, setCurrentView }}>
      <div className="flex h-screen bg-[#F1F5F9] overflow-hidden">
        
        {/* MOBILE SIDEBAR OVERLAY */}
        <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className={`absolute left-0 top-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <span className="font-black text-indigo-600 text-xl">{userRole === 'EXPERT' ? 'EXPERT PANEL' : 'CLIENT DASHBOARD'}</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
              </div>

              <nav className="space-y-2 flex-1">
                <button 
                  onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm ${currentView === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}
                >
                  <Home size={20} /> {userRole === 'EXPERT' ? 'Profile & Reviews' : 'Support Home'}
                </button>
                
                <button 
                  onClick={() => { setCurrentView('chat'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-sm ${currentView === 'chat' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}
                >
                  <MessageSquare size={20} /> Active Chat
                </button>
              </nav>

              <button onClick={handleLogout} className="flex items-center gap-3 p-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all">
                <LogOut size={20} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <header className="md:hidden h-16 bg-white border-b flex items-center px-4 justify-between z-30 shrink-0">
            <span className="font-black text-indigo-600">MARKETPLACE</span>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-900">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </header>

          <main className="flex-1 flex flex-col overflow-hidden">
              {children}
          </main>
        </div>
      </div>
    </NavContext.Provider>
  );
}