import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Specialties } from './components/Specialties';
import { ExamsInfo } from './components/ExamsInfo';
import { AboutDoctor } from './components/AboutDoctor';
import { ClinicLocation } from './components/ClinicLocation';
import { Footer } from './components/Footer';
import { PatientPortalModal } from './components/PatientPortalModal';
import { MedicalLaudosApp } from './components/MedicalLaudosApp';
import { CookieBanner } from './components/CookieBanner';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { translations } from './i18n/translations';

export default function App() {
  const [lang, setLang] = useState('pt');
  const [isPatientPortalOpen, setIsPatientPortalOpen] = useState(false);
  const [isDoctorPanelOpen, setIsDoctorPanelOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);

  const isPanelStandalone = new URLSearchParams(window.location.search).get('panel') === 'open';
  const t = translations[lang] || translations.pt;

  if (isPanelStandalone) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
        <MedicalLaudosApp
          isOpen={true}
          isStandalonePage={true}
          onClose={() => { window.location.href = window.location.origin; }}
          t={t}
          lang={lang}
        />
      </div>
    );
  }

  const handleOpenDoctorPanel = () => {
    const savedSession = localStorage.getItem('neuro_auth_user');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed.email && (parsed.email === 'helpus.ecommerce@gmail.com' || parsed.email === 'eduardojcmagalhaes@gmail.com')) {
          window.open(`${window.location.origin}${window.location.pathname}?panel=open`, '_blank');
          return;
        }
      } catch (e) {
        console.error('Session check error:', e);
      }
    }
    setIsDoctorPanelOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Navigation Header with 3-Language Selector */}
      <Header
        lang={lang}
        setLang={setLang}
        t={t}
        onOpenPatientPortal={() => setIsPatientPortalOpen(true)}
        onOpenDoctorPanel={handleOpenDoctorPanel}
      />

      {/* Main Content */}
      <main>
        <Hero
          t={t}
          onOpenPatientPortal={() => setIsPatientPortalOpen(true)}
          onOpenDoctorPanel={handleOpenDoctorPanel}
        />
        
        <Specialties
          t={t}
          onOpenPatientPortal={() => setIsPatientPortalOpen(true)}
        />
        
        <ExamsInfo
          t={t}
          onOpenPatientPortal={() => setIsPatientPortalOpen(true)}
        />
        
        <AboutDoctor t={t} />
        
        <ClinicLocation t={t} />
      </main>

      {/* Footer with Official HelpUS Logo & 3-Language Selector */}
      <Footer
        lang={lang}
        setLang={setLang}
        t={t}
        onOpenPatientPortal={() => setIsPatientPortalOpen(true)}
        onOpenDoctorPanel={handleOpenDoctorPanel}
        onOpenPrivacyPolicy={() => setIsPrivacyPolicyOpen(true)}
      />

      {/* Cookie Consent Alert Banner */}
      <CookieBanner
        onOpenPrivacyPolicy={() => setIsPrivacyPolicyOpen(true)}
      />

      {/* LGPD Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyOpen}
        onClose={() => setIsPrivacyPolicyOpen(false)}
        t={t}
      />

      {/* Modals & Portals with 3-Language i18n support */}
      <PatientPortalModal
        isOpen={isPatientPortalOpen}
        onClose={() => setIsPatientPortalOpen(false)}
        t={t}
        lang={lang}
      />

      <MedicalLaudosApp
        isOpen={isDoctorPanelOpen}
        onClose={() => setIsDoctorPanelOpen(false)}
        t={t}
        lang={lang}
      />

    </div>
  );
}
