import React from 'react';
import { Brain, Instagram, PhoneCall, MapPin, Lock, FileText, ExternalLink, Globe } from 'lucide-react';

export const Footer = ({ onOpenPatientPortal, onOpenDoctorPanel, lang, setLang, t }) => {
  const flags = {
    pt: '🇧🇷 PT',
    en: '🇺🇸 EN',
    es: '🇪🇸 ES'
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Clinic & Doctor Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-cyan-500 to-indigo-500 shrink-0">
                <img
                  src="/images/foto-eduardo.jpg"
                  alt="Dr. Eduardo Magalhães"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full bg-slate-900 rounded-full items-center justify-center text-cyan-400">
                  <Brain className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-white text-base block">Dr. Eduardo Magalhães</span>
                <span className="text-[11px] text-cyan-400 font-semibold tracking-wider uppercase">{t.hero.docTitle}</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="pt-1">
              <a
                href="https://www.instagram.com/neuro.eduardomagalhaes/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs text-pink-400 hover:text-pink-300 font-bold"
              >
                <Instagram className="w-4 h-4" /> @neuro.eduardomagalhaes
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">{t.nav.inicio} & Menu</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-cyan-400 transition-colors">{t.nav.inicio}</a></li>
              <li><a href="#especialidades" className="hover:text-cyan-400 transition-colors">{t.nav.especialidades}</a></li>
              <li><a href="#preparacao" className="hover:text-cyan-400 transition-colors">{t.nav.preparacao}</a></li>
              <li><a href="#sobre" className="hover:text-cyan-400 transition-colors">{t.nav.sobre}</a></li>
              <li><a href="#localizacao" className="hover:text-cyan-400 transition-colors">{t.nav.localizacao}</a></li>
            </ul>
          </div>

          {/* Column 3: Patient & Doctor Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">{t.specialties.badge}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenPatientPortal} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <FileText className="w-3.5 h-3.5" /> {t.nav.portalPaciente}
                </button>
              </li>
              <li>
                <button onClick={onOpenDoctorPanel} className="hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" /> {t.nav.areaRestrita}
                </button>
              </li>
              <li><a href="https://wa.me/556932235805" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">{t.nav.agendarWhatsapp}</a></li>
            </ul>
          </div>

          {/* Column 4: Contact & Language Selector */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">{t.location.badge}</h4>
            <p className="text-slate-300 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{t.location.addressText}</span>
            </p>
            <p className="text-emerald-400 font-bold font-mono flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> {t.location.phoneText}
            </p>

            {/* 3 Language Switcher in Footer */}
            <div className="pt-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1.5 font-bold">Idioma / Language / Idioma:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setLang('pt')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${lang === 'pt' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'}`}
                >
                  🇧🇷 PT
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${lang === 'en' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'}`}
                >
                  🇺🇸 EN
                </button>
                <button
                  onClick={() => setLang('es')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${lang === 'es' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-400' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'}`}
                >
                  🇪🇸 ES
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Copyright & HelpUS Developer Signature with HelpUS Logo Image */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>

          {/* HELPUS ecosystem signature featuring official HelpUS logo image */}
          <div className="flex items-center gap-3 bg-slate-900/90 px-4 py-2 rounded-2xl border border-slate-800 shadow-md">
            <a
              href="https://helpus.com.br"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 text-slate-300 hover:text-cyan-400 transition-colors group"
            >
              <span className="text-xs text-slate-400">{t.footer.developedBy}</span>
              <div className="h-6 flex items-center shrink-0">
                <img
                  src="/images/helpus_logo.png"
                  alt="HelpUS Logo"
                  className="h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'inline-block';
                  }}
                />
                <strong className="hidden text-white font-extrabold text-sm tracking-tight">
                  Help<span className="text-indigo-400">US</span>
                </strong>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
