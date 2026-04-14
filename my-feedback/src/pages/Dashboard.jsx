import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import {
  LayoutDashboard, Users, BarChart3, PieChart, MessageSquare, 
  ArrowLeft, LogOut, Search, Filter, ChevronRight, Menu, X, Activity
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const DashboardLayout = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    avgSentiment: 0,
    depts: new Set(),
    roles: {}
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "responses"), orderBy("submittedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(docs);
      calculateStats(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const calculateStats = (docs) => {
    const roles = {};
    const depts = new Set();
    let totalScore = 0;
    let scoreCount = 0;

    docs.forEach(doc => {
      depts.add(doc.department || 'Unknown');
      roles[doc.role] = (roles[doc.role] || 0) + 1;
      
      for (let i = 0; i < 7; i++) {
        const val = doc[`strengths_${i}`];
        if (val) {
          totalScore += val;
          scoreCount++;
        }
      }
    });

    setStats({
      total: docs.length,
      avgSentiment: scoreCount ? (totalScore / scoreCount).toFixed(1) : 0,
      depts,
      roles
    });
  };

  const menuItems = [
    { path: '/results/overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
    { path: '/results/responses', icon: <Users size={20} />, label: 'Responses' },
    { path: '/results/swot', icon: <BarChart3 size={20} />, label: 'SWOT Analysis' },
    { path: '/results/pulse', icon: <Activity size={20} />, label: 'Pulse & Strategy' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold">Initializing Anbes G Admin Console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-white border-r border-slate-100 z-50 transform transition-all duration-300 lg:translate-x-0 lg:static lg:inset-auto 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isCollapsed ? 'w-24' : 'w-72'}`}
      >
        <div className="flex flex-col h-full relative">
          {/* Collapse Toggle Button (Gemini Style) */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-white border border-slate-100 rounded-full items-center justify-center shadow-sm text-slate-400 hover:text-sky-600 hover:scale-110 transition-all z-10"
          >
            <ChevronRight size={14} className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
          </button>

          <div className={`flex flex-col h-full p-6 ${isCollapsed ? 'items-center px-4' : ''}`}>
            <div className={`flex items-center gap-3 mb-12 ${isCollapsed ? 'justify-center border-b border-slate-50 pb-6 w-full' : ''}`}>
              <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-100 shrink-0">
                <LayoutDashboard size={20} className="text-white" />
              </div>
              {!isCollapsed && <span className="text-xl font-black text-slate-800 tracking-tight">Admin Console</span>}
            </div>

            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all group relative ${
                    location.pathname === item.path
                      ? 'bg-sky-50 text-sky-600 shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  } ${isCollapsed ? 'justify-center px-0 w-12 h-12 mx-auto' : ''}`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-[10px] uppercase tracking-widest font-black rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </Link>
              ))}
            </nav>

            <div className={`mt-auto space-y-4 ${isCollapsed ? 'w-full flex flex-col items-center border-t border-slate-50 pt-6' : ''}`}>
              <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all group relative ${isCollapsed ? 'justify-center px-0 w-12' : ''}`}>
                <LogOut size={20} />
                {!isCollapsed && <span>Exit Admin</span>}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1 bg-rose-600 text-white text-[10px] uppercase tracking-widest font-black rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    Exit Admin
                  </div>
                )}
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 -ml-2 text-slate-600 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden lg:flex items-center bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100 group focus-within:bg-white focus-within:border-sky-300 transition-all w-96">
              <Search size={18} className="text-slate-400 group-focus-within:text-sky-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search staff, departments, or insights..." 
                className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-600 placeholder:text-slate-400 w-full ml-2"
              />
              <div className="flex items-center gap-1">
                 <kbd className="hidden sm:inline-block px-1.5 py-0.5 border border-slate-200 rounded text-[10px] font-black text-slate-400 bg-white shadow-sm">⌘</kbd>
                 <kbd className="hidden sm:inline-block px-1.5 py-0.5 border border-slate-200 rounded text-[10px] font-black text-slate-400 bg-white shadow-sm">K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center gap-1 md:gap-3">
               <button className="p-2.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all relative group">
                  <Activity size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
                  <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-slate-100 shadow-2xl rounded-2xl p-4 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Live Feed</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        <p className="text-xs font-bold text-slate-600">New response from HR Unit</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
                        <p className="text-xs font-bold text-slate-600">Analytic sync completed</p>
                      </div>
                    </div>
                  </div>
               </button>
               <button className="hidden sm:flex p-2.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-all">
                  <Filter size={20} />
               </button>
            </div>

            <div className="w-[1px] h-8 bg-slate-100 hidden md:block"></div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-black text-slate-800 leading-none mb-1">Dr. Admikew Medical & Surgical Center</span>
                <span className="text-[10px] font-black text-sky-600 uppercase tracking-[0.2em]">Evaluated by Anbes G Business Group</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500 border-2 border-white shadow-xl shadow-sky-100 overflow-hidden flex items-center justify-center p-0.5 hover:scale-105 transition-transform cursor-pointer">
                <div className="w-full h-full rounded-lg overflow-hidden bg-white flex items-center justify-center">
                   <img src="https://ui-avatars.com/api/?name=AG&background=0ea5e9&color=fff&bold=true&font-size=0.45" alt="Anbes G Business Group" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50/50">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet context={{ data, stats }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
