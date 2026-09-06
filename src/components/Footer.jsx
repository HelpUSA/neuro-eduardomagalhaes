import React from 'react';
import { Brain, ShieldCheck, Instagram, PhoneCall, MapPin, Lock, FileText, ExternalLink } from 'lucide-react';

export const Footer = ({ onOpenPatientPortal, onOpenDoctorPanel }) => {
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
                <span className="text-[11px] text-cyan-400 font-semibold tracking-wider uppercase">Neurologia & Neurofisiologia</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Clínica médica especializada em diagnósticos neurofisiológicos (ENMG e EEG), neuropatias, cefaleias, Parkinson e portal de laudos digitais criptografados.
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Navegação do Site</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#home" className="hover:text-cyan-400 transition-colors">Página Inicial</a></li>
              <li><a href="#especialidades" className="hover:text-cyan-400 transition-colors">ENMG & Especialidades</a></li>
              <li><a href="#preparacao" className="hover:text-cyan-400 transition-colors">Preparo de Exames</a></li>
              <li><a href="#sobre" className="hover:text-cyan-400 transition-colors">Sobre o Dr. Eduardo</a></li>
              <li><a href="#localizacao" className="hover:text-cyan-400 transition-colors">Localização & Convênios</a></li>
            </ul>
          </div>

          {/* Column 3: Patient & Doctor Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Serviços Digitais</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenPatientPortal} className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <FileText className="w-3.5 h-3.5" /> Portal do Paciente (Baixar Resultado)
                </button>
              </li>
              <li>
                <button onClick={onOpenDoctorPanel} className="hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" /> Área Restrita do Médico
                </button>
              </li>
              <li><a href="https://wa.me/556932235805" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">Agendamento via WhatsApp</a></li>
              <li><span className="text-slate-500">Validação de Laudos por QR Code</span></li>
            </ul>
          </div>

          {/* Column 4: Contact HQ */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Atendimento</h4>
            <p className="text-slate-300 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Av. Dom Pedro II, 637 - Sala 07, Centro, Porto Velho - RO</span>
            </p>
            <p className="text-emerald-400 font-bold font-mono flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> (69) 3223-5805
            </p>
            <p className="text-slate-400 text-[11px]">Segunda a Sexta: 08:00 às 18:00</p>
          </div>

        </div>

        {/* Bottom Bar: Copyright & HelpUS Developer Signature */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Dr. Eduardo Magalhães. Todos os direitos reservados.</p>

          {/* HELPUS ecosystem signature and icon */}
          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-800">
            <a
              href="https://helpus.com.br"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors group"
            >
              <span>Desenvolvido por</span>
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shrink-0 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[4px] flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
              <strong className="text-white group-hover:text-cyan-400 transition-colors">Help<span className="text-indigo-400">US</span></strong>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
