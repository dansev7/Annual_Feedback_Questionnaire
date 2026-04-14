import React, { useState, useEffect } from 'react';
import { translations } from '../data/translations';
import LanguageToggle from '../components/LanguageToggle';
import ProgressBar from '../components/ProgressBar';
import QuestionCard from '../components/QuestionCard';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Stethoscope, 
  AlertTriangle, 
  Lightbulb, 
  ShieldAlert, 
  Activity, 
  MessageSquare, 
  Target, 
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCcw,
  UserCircle,
  TrendingUp,
  TrendingDown,
  Loader2,
  LayoutDashboard
} from 'lucide-react';

import { Link } from 'react-router-dom';

const Survey = () => {
  const [lang, setLang] = useState('en');
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const t = translations[lang];
  const totalSteps = 10;

  const validateStep = (currentStep) => {
    let newErrors = {};
    
    switch (currentStep) {
      case 1: // Demographics
        if (!formData.role) newErrors.role = true;
        break;
      case 2: // Strengths
        t.sections.strengths.questions.forEach((_, idx) => {
          if (!formData[`strengths_${idx}`]) newErrors[`strengths_${idx}`] = true;
        });
        break;
      case 3: // Weaknesses
        t.sections.weaknesses.questions.forEach((_, idx) => {
          if (!formData[`weaknesses_${idx}`]) newErrors[`weaknesses_${idx}`] = true;
        });
        break;
      case 4: // Opportunities
        t.sections.opportunities.questions.forEach((_, idx) => {
          if (!formData[`opportunities_${idx}`]) newErrors[`opportunities_${idx}`] = true;
        });
        break;
      case 5: // Threats
        t.sections.threats.questions.forEach((_, idx) => {
          if (!formData[`threats_${idx}`]) newErrors[`threats_${idx}`] = true;
        });
        break;
      case 6: // Pulse Internal
        t.sections.pulseInternal.questions.forEach((_, idx) => {
          if (!formData[`pulseInternal_${idx}`]) newErrors[`pulseInternal_${idx}`] = true;
        });
        break;
      case 7: // Pulse External
        t.sections.pulseExternal.questions.forEach((_, idx) => {
          if (!formData[`pulseExternal_${idx}`]) newErrors[`pulseExternal_${idx}`] = true;
        });
        break;
      case 8: // Open Feedback
        break; // All optional
      case 9: // Strategic
        t.sections.strategic.questions.forEach((_, idx) => {
          if (!formData[`strategic_${idx}`]) newErrors[`strategic_${idx}`] = true;
        });
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const responsesRef = collection(db, "responses");
      await addDoc(responsesRef, {
        ...formData,
        language: lang,
        submittedAt: serverTimestamp(),
        metadata: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          screenResolution: `${window.screen.width}x${window.screen.height}`
        }
      });
      nextStep();
    } catch (error) {
      console.error("Error submitting feedback: ", error);
      setSubmitError(lang === 'en' ? "Failed to submit feedback. Please try again." : "ግብረመልስ መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step > 0 && !validateStep(step)) return;
    setIsAnimating(true);
    setTimeout(() => {
      setStep(prev => Math.min(prev + 1, totalSteps));
      setIsAnimating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  const prevStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(prev => Math.max(prev - 1, 0));
      setIsAnimating(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  };

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in-up">
      <div className="w-24 h-24 bg-sky-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-sky-200 rotate-3 transition-transform hover:rotate-0 duration-500">
        <Stethoscope size={48} className="text-white" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight leading-tight max-w-3xl">
        {t.title}
      </h1>
      <p className="text-xl text-sky-600 font-black mb-2">
        {t.subtitle}
      </p>
      <p className="text-sm text-slate-400 font-bold mb-8 uppercase tracking-[0.2em]">
        {t.preparedBy}
      </p>
      <div className="max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-10 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{t.welcomeTitle}</h2>
        <p className="text-slate-600 text-lg leading-relaxed">
          {t.welcomeText}
        </p>
      </div>
      <button
        onClick={nextStep}
        className="group relative px-10 py-5 bg-sky-600 text-white rounded-2xl font-bold text-xl shadow-lg shadow-sky-200 hover:bg-sky-700 hover:shadow-sky-300 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3"
      >
        {t.startBtn}
        <ArrowRight className="transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );

  const renderDemographics = () => (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-4 mb-6">
        <UserCircle size={32} className="text-sky-500" />
        <h2 className="text-3xl font-bold text-slate-900">{t.sections.demographics.title}</h2>
      </div>
      
      <div className="space-y-8">
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            {t.sections.demographics.dept} <span className="text-slate-400 font-normal lowercase italic">{t.optional}</span>
          </label>
          <input
            type="text"
            value={formData.department || ''}
            onChange={(e) => updateFormData('department', e.target.value)}
            className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-lg"
            placeholder="e.g. Surgery, Pediatrics..."
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            {t.sections.demographics.role} <span className="text-rose-500 font-bold">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.sections.demographics.roles.map((role) => (
              <button
                key={role}
                onClick={() => updateFormData('role', role)}
                className={`p-4 rounded-2xl border-2 text-left font-semibold transition-all duration-200 ${formData.role === role
                    ? 'bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-100'
                    : errors.role 
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-white border-slate-100 text-slate-600 hover:border-sky-200 hover:bg-sky-50/50'
                  }`}
              >
                {role}
              </button>
            ))}
          </div>
          {errors.role && (
            <p className="mt-2 text-rose-500 text-sm font-semibold animate-fade-in flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {t.fieldRequired}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const getSectionIcon = (key) => {
    switch (key) {
      case 'strengths': return <TrendingUp size={32} className="text-emerald-500" />;
      case 'weaknesses': return <TrendingDown size={32} className="text-rose-500" />;
      case 'opportunities': return <Lightbulb size={32} className="text-amber-500" />;
      case 'threats': return <ShieldAlert size={32} className="text-slate-700" />;
      default: return null;
    }
  };

  const renderSWOTSection = (key, theme = 'sky') => {
    const section = t.sections[key];
    return (
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-4 mb-2">
          {getSectionIcon(key)}
          <h2 className="text-3xl font-bold text-slate-900">{section.title}</h2>
        </div>
        <p className="text-sky-600 font-medium mb-6 italic">{t.scaleLegend}</p>
        
        {section.note && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl mb-8 text-rose-700 flex items-start gap-3">
            <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed font-medium">{section.note}</p>
          </div>
        )}

        <div className="space-y-6">
          {section.questions.map((q, idx) => (
            <QuestionCard
              key={idx}
              index={idx}
              question={q}
              value={formData[`${key}_${idx}`]}
              onChange={(val) => updateFormData(`${key}_${idx}`, val)}
              colorTheme={theme}
              required={true}
              error={errors[`${key}_${idx}`]}
              errorMessage={t.fieldRequired}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderPulseSection = (key) => {
    const section = t.sections[key];
    return (
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-4 mb-2">
          <Activity size={32} className="text-sky-500" />
          <h2 className="text-3xl font-bold text-slate-900">{section.title}</h2>
        </div>
        <p className="text-sky-600 font-medium mb-8 italic">{t.yesNoLegend}</p>
        
        <div className="space-y-6">
          {section.questions.map((q, idx) => (
            <QuestionCard
              key={idx}
              index={idx}
              type="binary"
              question={q}
              value={formData[`${key}_${idx}`]}
              onChange={(val) => updateFormData(`${key}_${idx}`, val)}
              colorTheme="sky"
              yesText={t.yes}
              noText={t.no}
              required={true}
              error={errors[`${key}_${idx}`]}
              errorMessage={t.fieldRequired}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderOpenFeedback = () => (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-4 mb-2">
        <MessageSquare size={32} className="text-sky-500" />
        <h2 className="text-3xl font-bold text-slate-900">{t.sections.openFeedback.title}</h2>
      </div>
      <p className="text-sky-600 font-medium mb-10 italic">({t.sections.openFeedback.note})</p>
      
      <div className="space-y-8">
        {t.sections.openFeedback.questions.map((q, idx) => (
          <QuestionCard
            key={idx}
            index={idx}
            type="text"
            question={q}
            value={formData[`open_${idx}`]}
            onChange={(val) => updateFormData(`open_${idx}`, val)}
            colorTheme="sky"
          />
        ))}
      </div>
    </div>
  );

  const renderStrategic = () => (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <Target size={32} className="text-sky-600" />
        <h2 className="text-3xl font-bold text-slate-900">{t.sections.strategic.title}</h2>
      </div>
      
      <div className="space-y-6 mb-12">
        {t.sections.strategic.questions.map((q, idx) => (
          <QuestionCard
            key={idx}
            index={idx}
            question={q}
            value={formData[`strategic_${idx}`]}
            onChange={(val) => updateFormData(`strategic_${idx}`, val)}
            colorTheme="sky"
            required={true}
            error={errors[`strategic_${idx}`]}
            errorMessage={t.fieldRequired}
          />
        ))}
      </div>

      <div className="space-y-4 pt-8 border-t border-slate-100">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          {t.sections.strategic.email}
        </label>
        <div className="relative">
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => updateFormData('email', e.target.value)}
            className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-sky-400 focus:ring-4 focus:ring-sky-50 outline-none transition-all text-lg"
            placeholder="your@email.com"
          />
        </div>
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in-up">
      <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-emerald-100">
        <CheckCircle2 size={48} className="text-white" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
        {lang === 'en' ? 'Thank You!' : 'እናመሰግናለን!'}
      </h1>
      <p className="text-xl text-slate-600 mb-10 max-w-lg">
        {lang === 'en'
          ? 'Your feedback has been successfully submitted and will shape the future of our center.'
          : 'ግብረመልስዎ በተሳካ ሁኔታ ተልኳል እና የማዕከላችንን የወደፊት ሁኔታ ይቀርፃል።'}
      </p>
      <div className="flex justify-center items-center">
        <button
          onClick={() => window.location.reload()}
          className="group flex items-center gap-3 px-10 py-4 bg-sky-600 text-white rounded-2xl font-bold hover:bg-sky-700 shadow-lg shadow-sky-100 transition-all w-full sm:w-auto justify-center"
        >
          <RefreshCcw size={20} className="transition-transform group-hover:rotate-180 duration-500" />
          {lang === 'en' ? 'Restart Questionnaire' : 'መጠይቁን እንደገና ጀምር'}
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 0: return renderWelcome();
      case 1: return renderDemographics();
      case 2: return renderSWOTSection('strengths', 'sky');
      case 3: return renderSWOTSection('weaknesses', 'red');
      case 4: return renderSWOTSection('opportunities', 'yellow');
      case 5: return renderSWOTSection('threats', 'slate');
      case 6: return renderPulseSection('pulseInternal');
      case 7: return renderPulseSection('pulseExternal');
      case 8: return renderOpenFeedback();
      case 9: return renderStrategic();
      case 10: return renderSummary();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 md:py-12 md:px-8">
      {/* Header */}
      <nav className="max-w-4xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center shadow-lg shadow-sky-100">
            <div className="w-full h-full rounded-lg overflow-hidden bg-white flex items-center justify-center">
                   <img src="https://ui-avatars.com/api/?name=AG&background=0ea5e9&color=fff&bold=true&font-size=0.45" alt="Anbes G Business Group" className="w-full h-full object-cover" />
                </div>
          </div>
          <span className="font-bold text-slate-800 hidden sm:block">Anbes G Business Group</span>
        </div>
        <LanguageToggle currentLang={lang} setLang={setLang} />
      </nav>

      {/* Main Content Area */}
      <main className={`max-w-3xl mx-auto transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        {step > 0 && step < totalSteps && (
          <div className="mb-12">
            <ProgressBar currentStep={step} totalSteps={totalSteps - 1} theme="sky" />
          </div>
        )}

        <div className="pb-24">
          {renderCurrentStep()}
        </div>

        {/* Navigation Controls */}
        {step > 0 && step < totalSteps && (
          <footer className="fixed bottom-0 left-0 right-0 p-4 md:p-8 glass z-50">
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
              {submitError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium animate-fade-in-up text-center">
                  {submitError}
                </div>
              )}
              
              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all disabled:opacity-50"
                >
                  <ArrowLeft size={20} />
                  {t.back}
                </button>
                
                <button
                  onClick={step === totalSteps - 1 ? handleSubmit : nextStep}
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none px-10 py-4 bg-sky-600 text-white rounded-2xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all flex items-center justify-center gap-2 disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      {step === totalSteps - 1 ? t.submit : t.next}
                      <ArrowRight size={20} className="transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
};

export default Survey;
