import React from 'react';
import { MapPin, Phone, Clock, Shield, Navigation, ExternalLink, Calendar } from 'lucide-react';

export const ClinicLocation = () => {
  const convenios = ['Unimed', 'Cassi', 'Assefaz', 'Amil', 'Bradesco Saúde', 'SulAmérica', 'Atendimento Particular'];

  return (
    <section id="localizacao" className="py-20 relative bg-slate-950/80 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Localização & Atendimento</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Clínica de Neurologia <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Dr. Eduardo Magalhães
              </span>
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              Localização privilegiada no centro de Porto Velho - RO, com ambiente climatizado, estacionamento acessível e estrutura pronta para realização de exames neurológicos.
            </p>

            {/* Address & Contact Cards */}
            <div className="space-y-4 pt-2">
              
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Endereço da Clínica:</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Av. Dom Pedro II, 637 - Sala 07, Centro <br />
                    Porto Velho - RO, CEP 76801-910
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Telefone & Agendamento:</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Telefone Fixo: <strong>(69) 3223-5805</strong> <br />
                    WhatsApp Corporativo: <strong>(69) 3223-5805</strong>
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Horário de Funcionamento:</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Segunda a Sexta-feira: 08:00 às 18:00 <br />
                    (Atendimento com hora marcada)
                  </p>
                </div>
              </div>

            </div>

            {/* Convenios Acceptance */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Convênios Aceitos & Planos:</h4>
              <div className="flex flex-wrap gap-2">
                {convenios.map((conv, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
                    ✓ {conv}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Map Placeholder & Directions Card */}
          <div className="lg:col-span-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-2xl">
              
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-cyan-400" /> Como Chegar à Clínica
                </h3>
                <a
                  href="https://maps.google.com/?q=Av.+Dom+Pedro+II,+637,+Porto+Velho+-+RO"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                >
                  Abrir no Google Maps <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Map Graphic Box */}
              <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg">
                  <MapPin className="w-7 h-7 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Clínica Dr. Eduardo Magalhães</h4>
                  <p className="text-xs text-slate-400 mt-1">Av. Dom Pedro II, 637 - Sala 07, Centro - Porto Velho/RO</p>
                </div>
                <a
                  href="https://maps.google.com/?q=Av.+Dom+Pedro+II,+637,+Porto+Velho+-+RO"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Traçar Rota no GPS
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 space-y-1">
                <p>💡 <strong>Dica de Estacionamento:</strong> Estacionamento fácil ao longo da Av. Dom Pedro II e proximidades do Centro Médico.</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
