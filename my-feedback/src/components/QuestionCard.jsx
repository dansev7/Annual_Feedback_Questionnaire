import React from 'react';

const QuestionCard = ({ 
  question, 
  value, 
  onChange, 
  type = 'scale', 
  colorTheme = 'sky',
  index,
  total,
  yesText = 'Yes',
  noText = 'No',
  required = false,
  error = false,
  errorMessage = "This field is required"
}) => {
  const isScale = type === 'scale';
  const isBinary = type === 'binary';
  const isText = type === 'text';

  const themes = {
    sky: 'bg-sky-50 border-sky-200 text-sky-800',
    red: 'bg-rose-50 border-rose-200 text-rose-800',
    yellow: 'bg-amber-50 border-amber-200 text-amber-800',
    slate: 'bg-slate-50 border-slate-200 text-slate-800'
  };

  const activeThemes = {
    sky: 'bg-sky-600 text-white shadow-lg shadow-sky-100',
    red: 'bg-rose-600 text-white shadow-lg shadow-rose-100',
    yellow: 'bg-amber-500 text-white shadow-lg shadow-amber-100',
    slate: 'bg-slate-700 text-white shadow-lg shadow-slate-100'
  };

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 mb-4 bg-white shadow-sm hover:shadow-md ${index !== undefined ? 'animate-fade-in-up' : ''}`}
         style={{ animationDelay: `${(index % 5) * 100}ms` }}>
      <p className="text-lg font-medium text-slate-800 mb-6 leading-relaxed">
        {question} {required && <span className="text-rose-500 font-bold">*</span>}
      </p>

      {isScale && (
        <div className="flex flex-wrap items-center justify-between gap-2 max-w-md mx-auto">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => onChange(num)}
              className={`w-12 h-12 rounded-full border-2 font-bold transition-all duration-200 flex items-center justify-center
                ${value === num 
                  ? activeThemes[colorTheme] 
                  : 'border-slate-100 text-slate-400 hover:border-sky-300 hover:text-sky-500 hover:bg-sky-50/50'}`}
            >
              {num}
            </button>
          ))}
        </div>
      )}

      {isBinary && (
        <div className="flex gap-4 max-w-xs">
          {[yesText, noText].map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`flex-1 py-3 px-6 rounded-xl border-2 font-bold transition-all duration-200
                ${value === option 
                  ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-100' 
                  : 'border-slate-100 text-slate-500 hover:border-sky-300 hover:text-sky-500 hover:bg-sky-50/50'}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {isText && (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full p-4 rounded-xl border-2 border-slate-100 bg-slate-50 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 transition-all outline-none text-slate-700 font-medium"
          placeholder="Type your response here..."
        />
      )}

      {error && (
        <p className="mt-4 text-rose-500 text-sm font-semibold animate-fade-in flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default QuestionCard;
