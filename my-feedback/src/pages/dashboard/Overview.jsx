import React from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, Activity, Users, Calendar, MapPin, ChevronRight
} from 'lucide-react';

const Overview = () => {
  const { data, stats } = useOutletContext();

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#a855f7'];

  const getDeptData = () => {
    const deptMap = {};
    data.forEach(d => {
      const dept = d.department || 'Not Specified';
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });
    return Object.entries(deptMap).map(([name, value]) => ({ name, value }));
  };

  const getSWOTData = () => {
    const categories = ['strengths', 'weaknesses', 'opportunities', 'threats'];
    return categories.map(cat => {
      let total = 0;
      let count = 0;
      const numQuestions = cat === 'strengths' ? 7 : cat === 'weaknesses' ? 7 : cat === 'opportunities' ? 6 : 6;

      data.forEach(doc => {
        for (let i = 0; i < numQuestions; i++) {
          const val = doc[`${cat}_${i}`];
          if (val) {
            total += val;
            count++;
          }
        }
      });
      return {
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        avg: count ? (total / count).toFixed(2) : 0,
        color: cat === 'strengths' ? '#10b981' : cat === 'weaknesses' ? '#f43f5e' : cat === 'opportunities' ? '#f59e0b' : '#64748b'
      };
    });
  };

  const getStrategicAverages = () => {
    const questions = ['Future Direction', 'Management Feedback', 'Challenge Readiness'];
    return questions.map((q, idx) => {
      let totalVal = 0;
      let count = 0;
      data.forEach(doc => {
        const val = doc[`strategic_${idx}`];
        if (val) {
          totalVal += val;
          count++;
        }
      });
      return {
        subject: q,
        A: count ? parseFloat((totalVal / count).toFixed(1)) : 0,
        fullMark: 5
      };
    });
  };

  const getPulseSummary = () => {
    const sections = ['pulseInternal', 'pulseExternal'];
    return sections.map(sec => {
      let totalYes = 0;
      let totalResponses = 0;
      data.forEach(doc => {
        for (let i = 0; i < 6; i++) {
          const val = doc[`${sec}_${i}`];
          if (val) {
            totalResponses++;
            if (val === 'Yes' || val === 'አዎ') totalYes++;
          }
        }
      });
      const percentage = totalResponses ? Math.round((totalYes / totalResponses) * 100) : 0;

      const isInternal = sec === 'pulseInternal';
      return {
        id: sec,
        name: isInternal ? 'Pulse Check Internal' : 'Pulse Check External',
        desc: isInternal
          ? 'Safety, protocols, and supply stability.'
          : 'Growth, training, and competition readiness.',
        value: percentage,
        color: isInternal ? '#f43f5e' : '#0ea5e9',
        status: percentage > 80 ? 'Optimal' : percentage > 50 ? 'Stable' : 'Critical'
      };
    });
  };

  const StatCard = ({ icon, label, value, suffix, color }) => {
    const colorMap = {
      sky: 'bg-sky-50 text-sky-600',
      emerald: 'bg-emerald-50 text-emerald-600',
      amber: 'bg-amber-50 text-amber-600',
      indigo: 'bg-indigo-50 text-indigo-600',
    };

    return (
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-xl transition-all duration-500 group">
        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${colorMap[color]}`}>
          {React.cloneElement(icon, { size: 28 })}
        </div>
        <div>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">{label}</p>
          <p className="text-2xl font-black text-slate-800">
            {value}{suffix}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in-up pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Executive Summary</h2>
          <p className="text-slate-500 font-medium">Evaluation and feedback insights for Dr. Admikew Medical & Surgical Center, managed by Anbes G Business Group.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Live Monitoring Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users />} label="Total Responses" value={stats.total} color="sky" />
        <StatCard icon={<Activity />} label="SWOT Average" value={stats.avgSentiment} suffix="/5.0" color="emerald" />
        <StatCard icon={<MapPin />} label="Departments" value={stats.depts.size} color="amber" />
        <StatCard icon={<TrendingUp />} label="Strat. Confidence" value={getStrategicAverages()[0].A} suffix="/5.0" color="indigo" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main SWOT Chart */}
        <div className="xl:col-span-2 bg-white p-6 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <div className="bg-sky-100 p-2 rounded-xl"><TrendingUp size={20} className="text-sky-600" /></div>
              SWOT Performance Indicator
            </h3>
            <div className="hidden sm:flex gap-2">
              {['Strengths', 'Weaknesses', 'Opportunities', 'Threats'].map(cat => (
                <div key={cat} className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">{cat}</div>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getSWOTData()} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 900, fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 700, fontSize: 11 }} domain={[0, 5]} />
                <Tooltip
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', padding: '16px' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="avg" radius={[15, 15, 0, 0]} barSize={60}>
                  {getSWOTData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Pulse Check Internal Card */}
          {getPulseSummary().map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-2 rounded-xl ${item.id === 'pulseInternal' ? 'bg-rose-50' : 'bg-sky-50'}`}>
                  <Activity size={20} className={item.id === 'pulseInternal' ? 'text-rose-500' : 'text-sky-500'} />
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${item.status === 'Optimal' ? 'bg-emerald-50 text-emerald-600' :
                    item.status === 'Stable' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                  }`}>{item.status}</span>
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">{item.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold leading-tight mb-6">{item.desc}</p>

                <div className="flex items-end justify-between mb-2">
                  <span className="text-3xl font-black text-slate-800 tabular-nums">{item.value}<span className="text-sm text-slate-400 ml-0.5">%</span></span>
                </div>

                <div className="h-4 bg-slate-50 rounded-2xl overflow-hidden shadow-inner p-1 border border-slate-100/50">
                  <div
                    className="h-full rounded-xl transition-all duration-1000 shadow-sm"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>

              <button
                onClick={() => window.location.href = item.id === 'pulseInternal' ? '/ad@results/pulse' : '/ad@results/pulse'}
                className="mt-6 flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-sky-600 transition-colors group"
              >
                Analyze Metrics
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}

          {/* Future Outlook / Confidence Card */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <TrendingUp size={20} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Outlook</p>
                <h3 className="text-sm font-black text-slate-800">Admin Confidence</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              {getStrategicAverages().slice(0, 2).map((s, i) => (
                <div key={i} className="flex flex-col p-4 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:border-indigo-100 transition-all group">
                  <span className="text-2xl font-black text-indigo-600 leading-none mb-1 group-hover:scale-110 transition-transform origin-left">{s.A}</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter leading-tight">{s.subject}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => window.location.href = '/ad@results/pulse'}
              className="mt-6 w-full py-3 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
            >
              Review Strategy
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Participation */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-xl"><MapPin size={24} className="text-amber-600" /></div>
            Departmental Participation
          </h3>
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="h-[250px] w-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getDeptData()}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {getDeptData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-800 leading-none">{stats.total}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 gap-3 w-full">
              {getDeptData().map((d, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                    <span className="text-xs font-bold text-slate-600">{d.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-800">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Responses Placeholder for professional feel */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-xl"><Users size={24} className="text-emerald-600" /></div>
            Latest Insights
          </h3>
          <div className="space-y-4">
            {data.slice(0, 4).map((r, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-sky-100 hover:bg-white transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sky-600 shadow-sm font-black group-hover:scale-110 transition-transform">
                    {r.role?.[0] || 'S'}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{r.role || 'Staff'}</p>
                    <p className="text-[10px] font-bold text-slate-400">{r.department || 'General'}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
              </div>
            ))}
            <button
              onClick={() => window.location.href = '/ad@results/responses'}
              className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-sky-600 transition-colors pt-6"
            >
              View All Responses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
