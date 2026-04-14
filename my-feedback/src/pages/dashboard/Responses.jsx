import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Search, Filter, ChevronRight, User, MapPin, 
  Calendar, MessageSquare, Download, Hash, X,
  ClipboardList, Activity, Target, ShieldCheck, Mail, Globe,
  Briefcase, TrendingUp
} from 'lucide-react';
import { translations } from '../../data/translations';

const Responses = () => {
  const { data } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  const t = translations.en;
  const roles = ['All', ...new Set(data.map(d => d.role).filter(Boolean))];

  const filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRole = filterRole === 'All' || item.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const exportCSV = () => {
    const headers = ['Date', 'Department', 'Role', 'Email', 'Avg Score'];
    const rows = data.map(d => {
      let total = 0, count = 0;
      ['strengths', 'weaknesses', 'opportunities', 'threats'].forEach(c => {
        for(let i=0; i<7; i++) {
          if(d[`${c}_${i}`]) { total += d[`${c}_${i}`]; count++; }
        }
      });
      return [
        d.submittedAt?.toDate().toLocaleDateString(),
        d.department || 'N/A',
        d.role || 'N/A',
        d.email || 'N/A',
        count ? (total / count).toFixed(2) : 0
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "medical_center_feedback_COMPLETE.csv";
    link.click();
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Response Records</h2>
          <p className="text-slate-500 font-medium">1:1 detailed reporting of every staff submission.</p>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm active:scale-95"
        >
          <Download size={18} />
          Export Dataset
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Search responses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50/50 rounded-[1.5rem] border-none focus:ring-4 focus:ring-sky-50 transition-all font-bold text-slate-700 placeholder:text-slate-300"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="text-slate-300" size={18} />
          <select 
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-slate-50/50 border-none rounded-[1.5rem] px-6 py-4 font-black text-xs uppercase tracking-widest text-slate-500 focus:ring-4 focus:ring-sky-50"
          >
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Date Submitted</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Department / Unity</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Staff Role</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-sky-50/40 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-slate-800 tabular-nums">
                      {item.submittedAt?.toDate().toLocaleDateString() || 'Recent'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-wider">
                      <MapPin size={12} className="text-slate-400" />
                      {item.department || 'General'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-50 text-sky-600 rounded-xl text-[10px] font-black uppercase tracking-wider">
                      <User size={12} />
                      {item.role || 'Staff'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => { setSelectedResponse(item); setActiveTab('summary'); }}
                      className="p-3 bg-white border border-slate-200 text-sky-600 rounded-2xl hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all shadow-sm active:scale-90"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center">
            <Search size={64} className="text-slate-100 mb-4" />
            <p className="text-slate-400 font-bold">No records matched your search query.</p>
          </div>
        )}
      </div>

      {/* COMPREHENSIVE INSPECTOR MODAL */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xl z-[100] flex items-center justify-center md:p-4">
          <div className="w-full max-w-6xl bg-white md:rounded-[3.5rem] shadow-2xl h-full md:h-[90vh] flex flex-col overflow-hidden animate-zoom-in border border-white/20">
            {/* Modal Header */}
            <div className="p-6 md:p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/30">
              <div className="flex items-center gap-4 md:gap-8">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-sky-600 rounded-xl md:rounded-[2rem] flex items-center justify-center shadow-2xl shadow-sky-100 text-white transform -rotate-3 transition-transform hover:rotate-0">
                  <ClipboardList size={24} className="md:size-10" />
                </div>
                <div>
                  <h3 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter mb-1">Detailed Staff Report</h3>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-400 rounded text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">ID: {selectedResponse.id.slice(0, 8)}</span>
                    <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse"></span>
                    <span className="text-[8px] md:text-[10px] font-black text-sky-600 uppercase tracking-[0.2em]">{selectedResponse.language === 'en' ? 'English Entry' : 'Amharic Entry'}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedResponse(null)}
                className="p-3 md:p-4 bg-white border border-slate-100 text-slate-300 rounded-xl md:rounded-[1.5rem] hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm active:scale-90"
              >
                <X size={24} className="md:size-7" />
              </button>
            </div>

            {/* Modal Navigation - Scrollable on mobile */}
            <div className="px-6 md:px-10 flex gap-4 md:gap-8 border-b border-slate-100 bg-white overflow-x-auto no-scrollbar">
              <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')} icon={<Globe />} label="Info" />
              <TabButton active={activeTab === 'swot'} onClick={() => setActiveTab('swot')} icon={<TrendingUp />} label="SWOT" />
              <TabButton active={activeTab === 'pulse'} onClick={() => setActiveTab('pulse')} icon={<Activity />} label="Pulse" />
              <TabButton active={activeTab === 'narrative'} onClick={() => setActiveTab('narrative')} icon={<MessageSquare />} label="Narrative" />
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-slate-50/20">
              {activeTab === 'summary' && <InspectorSummary response={selectedResponse} />}
              {activeTab === 'swot' && <InspectorSWOT response={selectedResponse} t={t} />}
              {activeTab === 'pulse' && <InspectorPulse response={selectedResponse} t={t} />}
              {activeTab === 'narrative' && <InspectorNarrative response={selectedResponse} t={t} />}
            </div>

            {/* Modal Footer */}
            <div className="px-10 py-6 bg-white border-t border-slate-100 flex justify-between items-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Confidential Medical Center Feedback Record</p>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Calendar size={14} className="text-sky-500" />
                Submitted: {selectedResponse.submittedAt?.toDate().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 md:gap-3 px-4 md:px-8 py-5 md:py-6 border-b-[3px] font-black text-[10px] md:text-[11px] uppercase tracking-[0.15em] transition-all whitespace-nowrap
      ${active ? 'border-sky-600 text-sky-600 bg-sky-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
  >
    {React.cloneElement(icon, { size: 16 })}
    {label}
  </button>
);

const InspectorSummary = ({ response }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up h-full items-start">
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
      <div className="flex items-center gap-4 text-slate-800 border-b border-slate-50 pb-6">
        <User className="text-sky-500" size={28} />
        <h4 className="text-xl font-black tracking-tight">Staff Demographics</h4>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <ProfileItem label="Staff Role" value={response.role || 'N/A'} icon={<Briefcase />} />
        <ProfileItem label="Department / Hub" value={response.department || 'General Clinic'} icon={<MapPin />} />
        <ProfileItem label="Contact Email" value={response.email || 'Private / Not Provided'} icon={<Mail />} />
      </div>
    </div>
    <div className="bg-sky-600 p-10 rounded-[2.5rem] shadow-2xl shadow-sky-100 text-white space-y-6">
      <h4 className="text-xl font-black tracking-tight flex items-center gap-3">
        <ClipboardList size={28} />
        Submission Summary
      </h4>
      <p className="text-sky-50 opacity-80 text-sm leading-relaxed font-medium">
        This feedback was provided on {response.submittedAt?.toDate().toLocaleDateString()}. The respondent completed all 10 steps of the annual strategic questionnaire, including detailed SWOT assessment and operational pulse checks.
      </p>
      <div className="pt-6 border-t border-sky-500/50 flex gap-4">
        {response.email && (
           <div className="px-5 py-2.5 bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest border border-white/20">
             Follow-up Required
           </div>
        )}
      </div>
    </div>
  </div>
);

const ProfileItem = ({ label, value, icon }) => (
  <div className="flex items-center gap-6 group">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-lg font-black text-slate-700 leading-none">{value}</p>
    </div>
  </div>
);

const InspectorSWOT = ({ response, t }) => (
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 animate-fade-in-up">
    {['strengths', 'weaknesses', 'opportunities', 'threats'].map(cat => (
      <div key={cat} className="space-y-6">
        <h4 className={`text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4
          ${cat === 'strengths' ? 'text-emerald-500' : cat === 'weaknesses' ? 'text-rose-500' : 'text-amber-500'}`}>
          <span className={`w-3 h-3 rounded-full animate-pulse ${cat === 'strengths' ? 'bg-emerald-500' : cat === 'weaknesses' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
          {cat} Analysis
        </h4>
        <div className="space-y-4">
          {t.sections[cat].questions.map((q, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <p className="text-[12px] font-bold text-slate-600 leading-tight flex-1">{q}</p>
              <div className={`w-12 h-12 min-w-[3rem] rounded-2xl flex items-center justify-center font-black text-lg
                ${cat === 'strengths' ? (response[`${cat}_${i}`] > 3 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-slate-100 text-slate-400') :
                  cat === 'weaknesses' ? (response[`${cat}_${i}`] > 3 ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'bg-slate-100 text-slate-400') : 'bg-amber-500 text-white shadow-lg shadow-amber-100'}`}>
                {response[`${cat}_${i}`] || '-'}
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const InspectorPulse = ({ response, t }) => (
  <div className="space-y-12 animate-fade-in-up">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {['pulseInternal', 'pulseExternal'].map(cat => (
        <div key={cat} className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 ml-4">{t.sections[cat].title}</h4>
          <div className="space-y-4">
            {t.sections[cat].questions.map((q, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between gap-6">
                <p className="text-[12px] font-bold text-slate-600 leading-tight flex-1">{q}</p>
                <span className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm
                  ${(response[`${cat}_${i}`] === 'Yes' || response[`${cat}_${i}`] === 'አዎ') ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                  {response[`${cat}_${i}`] || 'Unanswered'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="space-y-6">
      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-sky-500 ml-4">{t.sections.strategic.title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {t.sections.strategic.questions.map((q, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:bg-sky-50 transition-colors">
            <span className="text-3xl font-black text-sky-600 mb-3 group-hover:scale-110 transition-transform">{response[`strategic_${i}`] || '-'}</span>
            <p className="text-[11px] font-bold text-slate-500 uppercase leading-snug tracking-tighter">{q}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const InspectorNarrative = ({ response, t }) => (
  <div className="space-y-10 animate-fade-in-up max-w-4xl mx-auto pb-10">
    {t.sections.openFeedback.questions.map((q, idx) => (
      <div key={idx} className="space-y-4">
        <div className="flex items-center gap-3 ml-6">
           <div className="w-1.5 h-6 bg-sky-200 rounded-full"></div>
           <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{q}</h4>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <MessageSquare size={160} />
          </div>
          <p className="text-slate-700 italic font-bold text-lg leading-loose relative z-10 first-letter:text-4xl first-letter:font-black first-letter:text-sky-600 first-letter:mr-1">
            {response[`open_${idx}`] ? `"${response[`open_${idx}`]}"` : "The respondent did not provide written feedback for this specific section."}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default Responses;
