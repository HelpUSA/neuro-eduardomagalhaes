import React from 'react';
import { MapPin, Phone, Clock, Navigation, ExternalLink } from 'lucide-react';

export const ClinicLocation = ({ t }) => {
  const convenios = ['Unimed', 'Cassi', 'Assefaz', 'Amil', 'Bradesco Saúde', 'SulAmérica', 'Particular / Private'];

  return (
    <section id="localizacao" className="py-20 relative bg-slate-950/80 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.location.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.location.title}
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              {t.location.subtitle}
            </p>

            {/* Address & Contact Cards */}
            <div className="space-y-4 pt-2">
              
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.location.addressTitle}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {t.location.addressText}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.location.phoneTitle}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    <strong>{t.location.phoneText}</strong>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.location.hoursTitle}</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {t.location.hoursText}
                  </p>
                </div>
              </div>

            </div>

            {/* Convenios Acceptance */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t.location.conveniosTitle}</h4>
              <div className="flex flex-wrap gap-2">
                {convenios.map((conv, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
                    ✓ {conv}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Directions Card */}
          <div className="lg:col-span-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-2xl">
              
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-cyan-400" /> {t.location.howToGetTitle}
                </h3>
                <a
                  href="https://maps.google.com/?q=Av.+Dom+Pedro+II,+637,+Porto+Velho+-+RO"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Google Maps
                </a>
              </div>

              {/* Map Preview Frame */}
              <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
                <iframe
                  title="Google Maps Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.380735739343!2d-63.90382348521587!3d-8.759530493708365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92325cce12345679%3A0x123456789abcdef0!2sAv.%20Dom%20Pedro%20II%2C%20637%20-%20Centro%2C%20Porto%20Velho%20-%20RO%2C%2076801-910!5e0!3m2!1spt-BR!2sbr!4v1690000000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="filter grayscale contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="text-center pt-2">
                <a
                  href="https://maps.google.com/?q=Av.+Dom+Pedro+II,+637,+Porto+Velho+-+RO"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition transform hover:scale-105"
                >
                  <Navigation className="w-4 h-4 text-slate-950" />
                  <span>{t.location.googleMapsBtn}</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
