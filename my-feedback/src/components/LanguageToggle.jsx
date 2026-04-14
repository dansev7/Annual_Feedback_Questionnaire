import { Languages } from 'lucide-react';

const LanguageToggle = ({ currentLang, setLang }) => {
  return (
    <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-full shadow-inner border border-slate-200/50">
      <div className="pl-2 pr-1 text-slate-400">
        <Languages size={18} />
      </div>
      <button
        onClick={() => setLang('en')}
        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${
          currentLang === 'en'
            ? 'bg-white text-sky-700 shadow-sm'
            : 'text-slate-500 hover:text-sky-600'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLang('am')}
        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${
          currentLang === 'am'
            ? 'bg-white text-sky-700 shadow-sm'
            : 'text-slate-500 hover:text-sky-600'
        }`}
      >
        አማርኛ
      </button>
    </div>
  );
};

export default LanguageToggle;
