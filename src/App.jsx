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

export default function App() {
  const [isPatientPortalOpen, setIsPatientPortalOpen] = useState(false);
  const [isDoctorPanelOpen, setIsDoctorPanelOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <Header
        onOpenPatientPortal={() => setIsPatientPortalOpen(true)}
        onOpenDoctorPanel={() => setIsDoctorPanelOpen(true)}
      />

      {/* Main Content */}
      <main>
        <Hero
          onOpenPatientPortal={() => setIsPatientPortalOpen(true)}
          onOpenDoctorPanel={() => setIsDoctorPanelOpen(true)}
        />
        
        <Specialties
          onOpenPatientPortal={() => setIsPatientPortalOpen(true)}
        />
        
        <ExamsInfo
          onOpenPatientPortal={() => setIsPatientPortalOpen(true)}
        />
        
        <AboutDoctor />
        
        <ClinicLocation />
      </main>

      {/* Footer with HelpUS Branding */}
      <Footer
        onOpenPatientPortal={() => setIsPatientPortalOpen(true)}
        onOpenDoctorPanel={() => setIsDoctorPanelOpen(true)}
      />

      {/* Modals & Portals */}
      <PatientPortalModal
        isOpen={isPatientPortalOpen}
        onClose={() => setIsPatientPortalOpen(false)}
      />

      <MedicalLaudosApp
        isOpen={isDoctorPanelOpen}
        onClose={() => setIsDoctorPanelOpen(false)}
      />

    </div>
  );
}
