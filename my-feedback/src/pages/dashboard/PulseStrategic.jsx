import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { translations } from '../../data/translations';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {
  Activity, Zap, Target, ShieldCheck, Heart, 
  Settings, TrendingUp, Briefcase
} from 'lucide-react';

const PulseStrategic = () => {
  const { data } = useOutletContext();
  const t = translations.en;

  const getPulseAverages = (sectionKey) => {
    const questions = t.sections[sectionKey].questions;
    return questions.map((q, idx) => {
      let yes = 0;
      let total = 0;
      data.forEach(doc => {
        const val = doc[`${sectionKey}_${idx}`];
        if (val) {
          total++;
          if (val === 'Yes' || val === 'አዎ') yes++;
        }
      });
      return {
        question: q,
        shortQuestion: q.length > 50 ? q.substring(0, 50) + '...' : q,
        yesPercentage: total ? Math.round((yes / total) * 100) : 0,
        total
      };
    });
  };

  const getStrategicAverages = () => {
    const questions = t.sections.strategic.questions;
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
        subject: q.length > 30 ? q.substring(0, 30) + '...' : q,
        full: q,
        A: count ? (totalVal / count).toFixed(1) : 0,
        fullMark: 5
      };
    });
  };

  const PulseGrid = ({ title, sectionKey, icon, color }) => {
    const pulseData = getPulseAverages(sectionKey);
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
          <div className={`p-2 rounded-lg ${color}`}>
            {React.cloneElement(icon, { size: 24, className: "text-white" })}
          </div>
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{title}</h3>
        </div>
        
        <div className="space-y-8">
          {pulseData.map((d, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <p className="text-sm font-bold text-slate-600 leading-snug flex-1">{d.question}</p>
                <div className="flex flex-col items-end">
                  <span className={`text-xl font-black ${d.yesPercentage > 50 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {d.yesPercentage}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Yes Rate</span>
                </div>
              </div>
              <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden flex shadow-inner">
                <div 
                  className={`h-full transition-all duration-1000 ${d.yesPercentage > 70 ? 'bg-emerald-500' : d.yesPercentage > 40 ? 'bg-sky-500' : 'bg-rose-500'}`}
                  style={{ width: `${d.yesPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-extrabold text-slate-800">Pulse & Strategic Reports</h2>
        <p className="text-slate-500 font-medium">Detailed monitoring of operational health and future outlook.</p>
      </div>

      {/* Strategic Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Target size={24} className="text-white" />
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight">Strategic Confidence</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 flex-1">
            {getStrategicAverages().map((s, i) => (
              <div key={i} className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center justify-center text-center group hover:bg-white hover:shadow-xl hover:shadow-indigo-50 transition-all border-dashed hover:border-solid hover:border-indigo-100">
                <div className="text-3xl md:text-4xl font-black text-indigo-600 mb-2">{s.A}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">AVG Score / 5.0</div>
                <p className="text-[11px] md:text-xs font-black text-slate-600 leading-tight uppercase tracking-tighter">
                  {s.full}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center h-[350px] md:h-auto">
           <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getStrategicAverages()}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
              <Radar
                name="Confidence"
                dataKey="A"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.1}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 italic">Strategic Performance Radar</p>
        </div>
      </div>

      {/* Pulse Grids */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 mb-12">
        <PulseGrid 
          title="Pulse Check: Internal" 
          sectionKey="pulseInternal" 
          icon={<Heart />} 
          color="bg-rose-500" 
        />
        <PulseGrid 
          title="Pulse Check: External" 
          sectionKey="pulseExternal" 
          icon={<Zap />} 
          color="bg-sky-500" 
        />
      </div>
    </div>
  );
};

export default PulseStrategic;
