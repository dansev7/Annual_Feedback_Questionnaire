import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { translations } from '../../data/translations';
import {
  TrendingUp, TrendingDown, Lightbulb, ShieldAlert
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const SWOTDeepDive = () => {
  const { data } = useOutletContext();
  const t = translations.en; // Defaulting to EN for dashboard labels

  const getQuestionAverages = (category) => {
    const questions = t.sections[category].questions;
    return questions.map((q, idx) => {
      let total = 0;
      let count = 0;
      data.forEach(doc => {
        const val = doc[`${category}_${idx}`];
        if (val) {
          total += val;
          count++;
        }
      });
      return {
        question: q.length > 40 ? q.substring(0, 40) + '...' : q,
        fullQuestion: q,
        avg: count ? (total / count).toFixed(1) : 0,
        count
      };
    });
  };

const SWOTCard = ({ category, icon, color, accent }) => {
    const chartData = getQuestionAverages(category);
    
    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-500">
        <div className={`p-8 ${accent} flex items-center justify-between border-b border-slate-50`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center ${color} rotate-3 group-hover:rotate-0 transition-transform`}>
              {React.cloneElement(icon, { size: 24 })}
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">
              {category}
            </h3>
          </div>
          {category === 'weaknesses' && (
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-bold border border-rose-100 italic">
              <ShieldAlert size={14} />
              Note: Higher scores indicate greater perceived weakness.
            </div>
          )}
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Section Score</span>
             <span className={`text-2xl font-black ${color}`}>
               {(chartData.reduce((acc, curr) => acc + parseFloat(curr.avg), 0) / chartData.length).toFixed(1)}
             </span>
          </div>
        </div>
        
        <div className="p-8 flex-1 space-y-10">
          {chartData.map((d, i) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-between items-start gap-6">
                <p className="text-sm font-bold text-slate-600 leading-tight flex-1" title={d.fullQuestion}>
                  {d.fullQuestion}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-black ${color}`}>
                    {d.avg}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300">/5</span>
                </div>
              </div>
              <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden flex shadow-inner">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    category === 'strengths' ? 'bg-emerald-500' :
                    category === 'weaknesses' ? 'bg-rose-500' :
                    category === 'opportunities' ? 'bg-amber-500' : 'bg-slate-500'
                  }`}
                  style={{ width: `${(d.avg / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-extrabold text-slate-800">SWOT Strategic Deep-Dive</h2>
        <p className="text-slate-500 font-medium">Detailed performance breakdown for every survey question.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        <SWOTCard 
          category="strengths" 
          icon={<TrendingUp />} 
          color="text-emerald-600" 
          accent="bg-emerald-50/50" 
        />
        <SWOTCard 
          category="weaknesses" 
          icon={<TrendingDown />} 
          color="text-rose-600" 
          accent="bg-rose-50/50" 
        />
        <SWOTCard 
          category="opportunities" 
          icon={<Lightbulb />} 
          color="text-amber-600" 
          accent="bg-amber-50/50" 
        />
        <SWOTCard 
          category="threats" 
          icon={<ShieldAlert />} 
          color="text-slate-600" 
          accent="bg-slate-50/50" 
        />
      </div>
    </div>
  );
};

export default SWOTDeepDive;
