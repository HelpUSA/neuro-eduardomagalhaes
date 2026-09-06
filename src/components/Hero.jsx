import React from 'react';
import { Brain, FileCheck, ShieldCheck, Activity, Award, ArrowRight, Download, Sparkles } from 'lucide-react';

export const Hero = ({ onOpenPatientPortal, onOpenDoctorPanel, t }) => {
  return (
    <section id="home" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              {t.hero.titleStart} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                {t.hero.titleEnd}
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t.hero.subtitle}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenPatientPortal}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Download className="w-5 h-5 text-slate-950" />
                <span>{t.hero.btnPortal}</span>
              </button>

              <a
                href="https://wa.me/556932235805?text=Ol%C3%A1!%20Desejo%20informa%C3%A7%C3%B5es%20sobre%20consultas%20ou%20exames%20neurol%C3%B3gicos."
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-bold text-sm transition-all"
              >
                <span>{t.hero.btnAgendar}</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </a>
            </div>

            <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">{t.hero.enmgPill}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
                <Brain className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">{t.hero.eegPill}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">{t.hero.securityPill}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-500 rounded-3xl blur-lg opacity-40 animate-pulse-glow" />
              <div className="relative glass-panel rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-2xl">
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto rounded-full p-1.5 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-xl shadow-cyan-500/20">
                  <img
                    src="/images/foto-eduardo.jpg"
                    alt="Dr. Eduardo Magalhães - Neurologista"
                    className="w-full h-full rounded-full object-cover shadow-inner"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-slate-900 rounded-full items-center justify-center text-cyan-400">
                    <Brain className="w-20 h-20" />
                  </div>
                  <div className="absolute bottom-2 right-2 p-2 bg-emerald-500 text-slate-950 rounded-full shadow-lg" title="CRM Registrado">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    Dr. Eduardo Magalhães
                  </h3>
                  <p className="text-cyan-400 text-xs font-semibold tracking-wider uppercase mt-1">
                    {t.hero.docTitle}
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    {t.hero.docClinic}
                  </p>
                </div>

                <button
                  onClick={onOpenPatientPortal}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 text-xs font-extrabold flex items-center justify-center gap-2 transition-all"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{t.hero.btnPortal}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
