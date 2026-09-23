import React from 'react';
import { ClipboardList, CheckCircle, AlertTriangle, FileCheck2, Info, Sparkles } from 'lucide-react';

export const ExamsInfo = ({ onOpenPatientPortal, t }) => {
  return (
    <section id="preparacao" className="py-20 relative bg-slate-950/60 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>{t.prep.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.prep.title}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t.prep.subtitle}
          </p>
        </div>

        {/* Preparation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: ENMG */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-cyan-500/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{t.prep.cardEnmgTitle}</h3>
                  <p className="text-xs text-cyan-400">{t.prep.cardEnmgSub}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-semibold">
                {t.prep.cardEnmgDuration}
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.prep.enmgItem1}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t.prep.enmgItem2}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.prep.enmgItem3}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.prep.enmgItem4}</span>
              </li>
            </ul>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{t.prep.enmgNote}</span>
            </div>
          </div>

          {/* Card 2: EEG */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-indigo-500/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{t.prep.cardEegTitle}</h3>
                  <p className="text-xs text-indigo-400">{t.prep.cardEegSub}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-semibold">
                {t.prep.cardEegDuration}
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.prep.eegItem1}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{t.prep.eegItem2}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.prep.eegItem3}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{t.prep.eegItem4}</span>
              </li>
            </ul>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>{t.prep.eegNote}</span>
            </div>
          </div>

        </div>

        {/* CTA Banner to Patient Portal */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/80 border border-cyan-500/30 flex items-center justify-between flex-wrap gap-6 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>{t.prep.ctaTitle}</span>
            </div>
            <p className="text-white font-extrabold text-base sm:text-lg">
              {t.prep.ctaSub}
            </p>
          </div>

          <button
            onClick={onOpenPatientPortal}
            className="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition transform hover:scale-105"
          >
            {t.prep.btnPortal}
          </button>
        </div>

      </div>
    </section>
  );
};
