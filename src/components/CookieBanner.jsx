import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Lock, X } from 'lucide-react';

export const CookieBanner = ({ onOpenPrivacyPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('neuro_cookie_consent');
      if (!consent) {
        setIsVisible(true);
      }
    } catch (e) {
      console.warn('localStorage is not available:', e);
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('neuro_cookie_consent', 'accepted_all');
    } catch (e) {
      console.warn('Could not save consent to localStorage:', e);
    }
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem('neuro_cookie_consent', 'accepted_essential');
    } catch (e) {
      console.warn('Could not save consent to localStorage:', e);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-2xl z-40 animate-slide-up">
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-cyan-500/40 shadow-2xl bg-slate-950/95 backdrop-blur-xl text-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10">
          <Cookie className="w-6 h-6 text-amber-400" />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Privacidade & Cookies (LGPD)</span>
            </h4>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Protegido
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Utilizamos cookies essenciais e criptografia para garantir o funcionamento seguro do Portal de Laudos e aprimorar sua experiência na Clínica Dr. Eduardo Magalhães. Saiba mais em nossa{' '}
            <button
              onClick={onOpenPrivacyPolicy}
              className="text-cyan-400 font-bold underline hover:text-cyan-300 transition"
            >
              Política de Privacidade (LGPD)
            </button>.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <button
            onClick={handleAcceptEssential}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 transition"
          >
            Essenciais
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-md shadow-cyan-500/20 transition"
          >
            Aceitar Todos
          </button>
        </div>

      </div>
    </div>
  );
};
