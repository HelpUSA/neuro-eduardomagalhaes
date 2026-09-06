import React from 'react';
import { Activity, Brain, Shield, Zap, Sparkles, HeartPulse, CheckCircle2, ChevronRight } from 'lucide-react';

export const Specialties = ({ onOpenPatientPortal }) => {
  const specialtiesList = [
    {
      icon: Activity,
      title: 'Eletroneuromiografia (ENMG)',
      badge: 'Exame Especializado',
      color: 'from-cyan-500 to-blue-600',
      description: 'Exame neurofisiológico essencial para diagnosticar neuropatias periféricas, Síndrome do Túnel do Carpo (STC), compressões nervosas e radiculopatias da coluna.',
      items: ['STC Bilateral / Unilateral', 'Radiculopatia Cervical e Lombar', 'Polineuropatia Diabética', 'Polineuropatias Inflamatórias']
    },
    {
      icon: Brain,
      title: 'Eletroencefalograma (EEG)',
      badge: 'Mapeamento Digital',
      color: 'from-indigo-500 to-purple-600',
      description: 'Mapeamento cerebral computadorizado com registro de atividade elétrica em vigília e sono, fundamental no acompanhamento de crises e distúrbios neurológicos.',
      items: ['Mapeamento Cerebral Digital', 'Investigação de Epilepsia e Crises', 'Avaliação de Distúrbios do Sono', 'Monitoramento Neurofuncional']
    },
    {
      icon: Zap,
      title: 'Cefaleias & Enxaqueca Crônica',
      badge: 'Tratamento Especializado',
      color: 'from-amber-500 to-orange-600',
      description: 'Diagnóstico diferencial e protocolo terapêutico preventivo para dores de cabeça intensas, cefaleias tensionais e enxaquecas refratárias.',
      items: ['Protocolos Preventivos de Enxaqueca', 'Toxina Botulínica Terapêutica', 'Tratamento de Cefaleia Tensional', 'Dores de Cabeça Recorrentes']
    },
    {
      icon: HeartPulse,
      title: 'Doenças Neurodegenerativas',
      badge: 'Cognição & Memória',
      color: 'from-emerald-500 to-teal-600',
      description: 'Acompanhamento especializado para alterações de memória, Doença de Alzheimer, Parkinson, distúrbios da marcha, tremores e envelhecimento saudável.',
      items: ['Doença de Parkinson & Tremores', 'Doença de Alzheimer & Demências', 'Avaliação Neurocognitiva', 'Distúrbios do Movimento']
    },
    {
      icon: Sparkles,
      title: 'Neurodesenvolvimento & TDAH / TEA',
      badge: 'Avaliação Neurológica',
      color: 'from-pink-500 to-rose-600',
      description: 'Investigação clínica de quadros de Déficit de Atenção, Hiperatividade (TDAH), Transtorno do Espectro Autista (TEA) e distúrbios de aprendizagem.',
      items: ['Diagnóstico de TDAH em Adultos/Jovens', 'Transtorno do Espectro Autista (TEA)', 'Distúrbios de Concentração', 'Acompanhamento Neurológico']
    },
    {
      icon: Shield,
      title: 'Bloqueios & Procedimentos Terapêuticos',
      badge: 'Alívio da Dor',
      color: 'from-sky-500 to-blue-600',
      description: 'Procedimentos intervencionistas em consultório para controle de dores miofasciais crônicas, pontos-gatilho e espasticidade pós-AVC.',
      items: ['Bloqueio de Pontos-Gatilho', 'Toxina Botulínica para Espasticidade', 'Neuralgia do Trigêmeo', 'Acompanhamento Pós-AVC']
    }
  ];

  return (
    <section id="especialidades" className="py-20 relative bg-slate-950">
      
      {/* Background Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5" />
            <span>Exames & Especialidades Médicas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Diagnósticos Precisos com <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Tecnologia de Ponta
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            A Clínica do Dr. Eduardo Magalhães combina experiência médica avançada e equipamentos de alta fidelidade para diagnósticos neurofisiológicos rápidos e confiáveis.
          </p>
        </div>

        {/* Grid of Specialties */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialtiesList.map((spec, idx) => {
            const IconComp = spec.icon;
            return (
              <div
                key={idx}
                className="group relative glass-card rounded-3xl p-6 sm:p-8 space-y-5 hover:border-cyan-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950"
              >
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${spec.color} text-slate-950 shadow-lg shadow-cyan-500/10 group-hover:scale-110 transition-transform`}>
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                    {spec.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {spec.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    {spec.description}
                  </p>
                </div>

                {/* Items List */}
                <ul className="space-y-2 pt-2 border-t border-slate-800/80">
                  {spec.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Link inside Card */}
                <div className="pt-2">
                  <button
                    onClick={onOpenPatientPortal}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Ver Resultado de Exame</span>
                    <ChevronRight className="w-4 h-4" />
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
