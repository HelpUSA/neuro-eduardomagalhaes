import React from 'react';
import { ClipboardList, CheckCircle, AlertTriangle, FileCheck2, Info, Sparkles } from 'lucide-react';

export const ExamsInfo = ({ onOpenPatientPortal }) => {
  return (
    <section id="preparacao" className="py-20 relative bg-slate-950/60 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Orientações aos Pacientes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Instruções de Preparo para Exames
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Siga as orientações abaixo para garantir a máxima precisão nos resultados dos seus exames na Clínica Dr. Eduardo Magalhães.
          </p>
        </div>

        {/* Preparation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: ENMG */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-cyan-500/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Eletroneuromiografia (ENMG)</h3>
                  <p className="text-xs text-cyan-400">Instruções Pré-Exame</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-semibold">
                Duração: ~40 min
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Higiene da Pele:</strong> Tomar banho normal no dia do exame, limpando bem os membros superiores/inferiores.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Sem Óleos ou Cremes:</strong> NÃO aplicar cremes hidratantes, óleos ou loções na pele no dia do exame (prejudica os eletrodos).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Roupas Confortáveis:</strong> Vir com roupas fáceis de dobrar ou afastar (ex: camiseta de manga curta ou bermuda).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Alimentação & Medicamentos:</strong> Vir bem alimentado. Manter os remédios de uso contínuo, salvo se indicado pelo médico.</span>
              </li>
            </ul>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Traga exames de imagem anteriores (Ressonância ou Tomografia da coluna/membros) no dia da consulta.</span>
            </div>
          </div>

          {/* Card 2: EEG */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 border border-indigo-500/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Eletroencefalograma (EEG)</h3>
                  <p className="text-xs text-indigo-400">Mapeamento Cerebral Digital</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-semibold">
                Duração: ~45 min
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Cabelo Limpo & Seco:</strong> Lavar o cabelo com sabão/xampu neutro na véspera. O cabelo deve vir completamente seco.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Sem Gel ou Condicionador:</strong> NÃO usar gel, laquê, creme de pentear, condicionador ou óleos capilares.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Alimentação Normal:</strong> Fazer refeição leve antes de vir. EVITAR bebidas energéticas, café forte ou estimulantes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>EEG com Sono (Se Solicitado):</strong> Se o exame for em privação de sono, dormir menos horas na noite anterior conforme orientativo.</span>
              </li>
            </ul>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Após o exame, o laudo ficará disponível em PDF no nosso Portal de Laudos Digitais.</span>
            </div>
          </div>

        </div>

        {/* CTA Bar */}
        <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-base font-bold text-white">Já realizou seu exame na clínica?</h4>
            <p className="text-xs text-slate-400 mt-1">Acesse nosso portal seguro com seu CPF e baixe seu laudo oficial em PDF.</p>
          </div>
          <button
            onClick={onOpenPatientPortal}
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 shrink-0 transition"
          >
            Acessar Meus Laudos em PDF
          </button>
        </div>

      </div>
    </section>
  );
};
