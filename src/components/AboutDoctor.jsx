import React from 'react';
import { Award, CheckCircle, Instagram, MapPin, ShieldCheck, Brain, PhoneCall } from 'lucide-react';

export const AboutDoctor = () => {
  return (
    <section id="sobre" className="py-20 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Doctor Image & Badge Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Decorative Frame */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-500 rounded-3xl blur-xl opacity-30 animate-pulse-glow" />

              <div className="relative glass-panel rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-2xl">
                
                {/* Doctor Photo */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-full p-1.5 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-2xl">
                  <img
                    src="/images/foto-eduardo.jpg"
                    alt="Dr. Eduardo Magalhães - Neurologista"
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-slate-900 rounded-full items-center justify-center text-cyan-400">
                    <Brain className="w-24 h-24" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-white">Dr. Eduardo Magalhães</h3>
                  <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mt-1">
                    Neurologista & Neurofisiologista
                  </p>
                  <p className="text-slate-400 text-xs mt-1">
                    Clínica de Neurologia Dr. Eduardo Magalhães
                  </p>
                </div>

                {/* Instagram Direct Link */}
                <a
                  href="https://www.instagram.com/neuro.eduardomagalhaes/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition transform hover:scale-105"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Siga no Instagram @neuro.eduardomagalhaes</span>
                </a>

              </div>

            </div>
          </div>

          {/* Right Column: Bio & Qualifications */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Sobre o Especialista</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Compromisso com a Saúde Neurológica & <br />
              <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Diagnóstico de Alta Precisão
              </span>
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              O <b>Dr. Eduardo Magalhães</b> é médico neurologista com sólida atuação na avaliação e tratamento de afecções do sistema nervoso central e periférico. Sua clínica é referência regional no exame de <b>Eletroneuromiografia (ENMG)</b> e <b>Eletroencefalograma (EEG)</b>.
            </p>

            <p className="text-slate-400 text-sm leading-relaxed">
              Dedicado a oferecer uma medicina humana, atualizada e baseada em evidências científicas, o Dr. Eduardo aborda desde dores de cabeça crônicas, vertigens e formigamentos até condições complexas como neuropatias, distúrbios da memória, epilepsia e acompanhamento neurológico.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <CheckCircle className="w-4 h-4" /> Neurofisiologia Clínica
                </div>
                <p className="text-xs text-slate-400">Exames especializados com laudagem técnica rigorosa.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" /> Laudos Digitais com QR Code
                </div>
                <p className="text-xs text-slate-400">Portal seguro e envio prático pelo WhatsApp.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <MapPin className="w-4 h-4" /> Atendimento Presencial
                </div>
                <p className="text-xs text-slate-400">Estrutura confortável em Porto Velho - RO.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Award className="w-4 h-4" /> Diversos Convênios
                </div>
                <p className="text-xs text-slate-400">Atendimento Unimed, Cassi, Assefaz e Particular.</p>
              </div>
            </div>

            {/* Direct Contact Button */}
            <div className="pt-4">
              <a
                href="https://wa.me/556932235805"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Falar Diretamente com a Secretaria</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
