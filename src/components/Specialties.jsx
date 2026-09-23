import React from 'react';
import { Activity, Brain, Shield, Zap, Sparkles, HeartPulse, CheckCircle2 } from 'lucide-react';

export const Specialties = ({ onOpenPatientPortal, t }) => {
  const icons = [Activity, Brain, Zap, HeartPulse, Sparkles, Shield];
  const colors = [
    'from-cyan-500 to-blue-600',
    'from-indigo-500 to-purple-600',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-teal-600',
    'from-pink-500 to-rose-600',
    'from-sky-500 to-blue-600'
  ];

  const specialtiesList = t.specialties.list.map((item, idx) => ({
    ...item,
    icon: icons[idx % icons.length],
    color: colors[idx % colors.length]
  }));

  return (
    <section id="especialidades" className="py-20 relative bg-slate-950">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5" />
            <span>{t.specialties.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.specialties.title}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            {t.specialties.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialtiesList.map((spec, idx) => {
            const IconComp = spec.icon;
            return (
              <div
                key={idx}
                className="group relative glass-card rounded-3xl p-6 sm:p-8 space-y-5 hover:border-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${spec.color} text-slate-950 shadow-lg shadow-cyan-500/10 group-hover:scale-110 transition-transform`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                      {spec.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-400 transition-colors">
                    {spec.title}
                  </h3>

                  <p className="text-slate-400 text-xs leading-relaxed">
                    {spec.description}
                  </p>

                  <ul className="space-y-2 pt-2 border-t border-slate-800/80">
                    {spec.items.map((sub, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <button
                    onClick={onOpenPatientPortal}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-400 font-bold text-xs flex items-center justify-center gap-2 transition-all group-hover:border-cyan-500/50"
                  >
                    <span>{t.specialties.btnVerLaudo}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
