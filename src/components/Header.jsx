import React, { useState } from 'react';
import { Brain, FileText, PhoneCall, Menu, X, Lock, Globe, ChevronDown } from 'lucide-react';

export const Header = ({ onOpenPatientPortal, onOpenDoctorPanel, lang, setLang, t }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const flags = {
    pt: '🇧🇷 PT',
    en: '🇺🇸 EN',
    es: '🇪🇸 ES'
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Doctor Header Badge */}
          <a href="#home" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-500 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
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
                  <Brain className="w-6 h-6" />
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" title="Consultório Ativo"></span>
            </div>

            <div className="flex flex-col">
              <span className="font-extrabold text-slate-100 text-lg tracking-tight leading-none group-hover:text-cyan-400 transition-colors">
                Dr. Eduardo Magalhães
              </span>
              <span className="text-[11px] font-medium text-cyan-400 tracking-wider uppercase mt-1">
                {t.hero.docTitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#home" className="hover:text-cyan-400 transition-colors">{t.nav.inicio}</a>
            <a href="#especialidades" className="hover:text-cyan-400 transition-colors">{t.nav.especialidades}</a>
            <a href="#preparacao" className="hover:text-cyan-400 transition-colors">{t.nav.preparacao}</a>
            <a href="#sobre" className="hover:text-cyan-400 transition-colors">{t.nav.sobre}</a>
            <a href="#localizacao" className="hover:text-cyan-400 transition-colors">{t.nav.localizacao}</a>
          </nav>

          {/* Action CTAs & Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* 3-Language Dropdown Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{flags[lang]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in duration-150">
                  <button
                    onClick={() => { setLang('pt'); setIsLangOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-between ${lang === 'pt' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <span>🇧🇷 Português</span>
                  </button>
                  <button
                    onClick={() => { setLang('en'); setIsLangOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-between ${lang === 'en' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <span>🇺🇸 English</span>
                  </button>
                  <button
                    onClick={() => { setLang('es'); setIsLangOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-between ${lang === 'es' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    <span>🇪🇸 Español</span>
                  </button>
                </div>
              )}
            </div>

            {/* Patient Portal Button */}
            <button
              onClick={onOpenPatientPortal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 hover:border-cyan-400/60 text-xs font-bold transition-all shadow-sm shadow-cyan-950"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>{t.nav.portalPaciente}</span>
            </button>

            {/* Doctor Panel Button */}
            <button
              onClick={onOpenDoctorPanel}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-bold transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.nav.areaRestrita}</span>
            </button>

            {/* WhatsApp Direct CTA */}
            <a
              href="https://wa.me/556932235805?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20consulta/exame%20na%20Cl%C3%ADnica%20Dr.%20Eduardo%20Magalh%C3%A3es."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <PhoneCall className="w-4 h-4 text-slate-950" />
              <span>{t.nav.agendarWhatsapp}</span>
            </a>
          </div>

          {/* Mobile Actions & Menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setLang(lang === 'pt' ? 'en' : lang === 'en' ? 'es' : 'pt')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800 text-xs font-bold"
            >
              {flags[lang]}
            </button>
            <button
              onClick={onOpenPatientPortal}
              className="p-2 rounded-lg bg-slate-900 text-cyan-400 border border-cyan-500/30 text-xs font-bold"
              title={t.nav.portalPaciente}
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-slate-300">
            <a href="#home" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400">{t.nav.inicio}</a>
            <a href="#especialidades" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400">{t.nav.especialidades}</a>
            <a href="#preparacao" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400">{t.nav.preparacao}</a>
            <a href="#sobre" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400">{t.nav.sobre}</a>
            <a href="#localizacao" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400">{t.nav.localizacao}</a>
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-3">
            <button
              onClick={() => { setIsMenuOpen(false); onOpenPatientPortal(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-cyan-400 border border-cyan-500/30 text-xs font-bold"
            >
              <FileText className="w-4 h-4" /> {t.nav.portalPaciente}
            </button>
            <button
              onClick={() => { setIsMenuOpen(false); onOpenDoctorPanel(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-slate-300 border border-slate-700 text-xs font-bold"
            >
              <Lock className="w-4 h-4 text-indigo-400" /> {t.nav.areaRestrita}
            </button>
            <a
              href="https://wa.me/556932235805"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              <PhoneCall className="w-4 h-4" /> {t.nav.agendarWhatsapp}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
