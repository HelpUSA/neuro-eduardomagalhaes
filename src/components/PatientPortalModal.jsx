import React, { useState } from 'react';
import { X, Lock, Download, CheckCircle, Search, FileText, Shield, User, Calendar, FileCheck, Paperclip } from 'lucide-react';
import jsPDF from 'jspdf';

export const PatientPortalModal = ({ isOpen, onClose, t, lang }) => {
  const [cpf, setCpf] = useState('123.456.789-00');
  const [birthDate, setBirthDate] = useState('07/05/1967');
  const [searchSubmitted, setSearchSubmitted] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isDownloadingTracings, setIsDownloadingTracings] = useState(false);

  if (!isOpen) return null;

  const labels = t?.patientPortal || {
    modalTitle: "Portal do Paciente — Consulta de Laudos",
    subtitle: "Digite seu CPF e data de nascimento para baixar seu laudo oficial assinado digitalmente.",
    cpfLabel: "CPF do Paciente",
    birthLabel: "Data de Nascimento",
    searchBtn: "Buscar Meus Laudos",
    resultTitle: "Resultado do Exame Encontrado:",
    patientNameLabel: "PACIENTE",
    birthDateLabel: "DATA NASC",
    doctorLabel: "SOLICITANTE",
    examDateLabel: "DATA EXAME",
    examTypeLabel: "EXAME REALIZADO",
    statusLabel: "STATUS DO LAUDO",
    downloadPdfBtn: "🖨️ Baixar Laudo Oficial em PDF",
    downloadTracingsBtn: "📎 Baixar Gráficos do Aparelho",
    authenticityText: "Documento assinado digitalmente com certificado ICP-Brasil (PAdES) e validação QR Code."
  };

  const demoReport = {
    patientName: 'CLELIA MARI DE CARVALHO',
    birthDate: '07/05/1967',
    requestingDoctor: 'DR. HEMANOEL FERRO',
    examDate: '03/10/2025',
    examType: 'ELETRONEUROMIOGRAFIA (ENMG)',
    status: 'Concluído e Assinado Digitalmente por Dr. Eduardo Magalhães',
    authenticityCode: 'ENMG-2025-98472-EM',
    hasTracingsPdf: true,
    tracingsFileName: 'Graficos_Traçados_Aparelho_ENMG_Clelia.pdf',
    details: {
      motorConduction: 'Realizada em nervos ulnares e medianos. Observamos amplitudes conservadas, com velocidades de condução normais, e latências distais limítrofes em medianos.',
      sensoryConduction: 'Realizada em nervos ulnares, medianos e radiais. Em nervos medianos observamos potenciais de ação com latências prolongadas e velocidades diminuídas.',
      fWave: 'Pesquisada em nervos medianos e ulnares, com latências mínimas normais.',
      emg: 'Realizada com agulha monopolar em músculos paracervicais, deltoide, bíceps, extensor comum dos dedos e primeiro interósseo dorsal.',
      conclusion: 'Exame compatível com neuropatia do mediano ao nível do carpo, com comprometimento parcial de fibras sensitivas, de caráter desmielinizante (grau 2), bilateral. Não foram evidenciados sinais de comprometimento radicular ou miopático.'
    }
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF();
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('CLÍNICA DE NEUROLOGIA DR. EDUARDO MAGALHÃES', 14, 15);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(56, 189, 248);
      doc.text('Neurologia & Neurofisiologia Clínica | Laudo de Exame Oficial', 14, 23);

      doc.setFillColor(248, 250, 252);
      doc.rect(14, 38, 182, 32, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, 38, 182, 32, 'S');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`PACIENTE: ${demoReport.patientName}`, 18, 46);
      doc.text(`DATA NASC: ${demoReport.birthDate}`, 120, 46);
      doc.text(`SOLICITANTE: ${demoReport.requestingDoctor}`, 18, 54);
      doc.text(`DATA DO EXAME: ${demoReport.examDate}`, 120, 54);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 132, 199);
      doc.text(`EXAME: ${demoReport.examType}`, 18, 62);

      let y = 78;
      const addSection = (title, content) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(3, 105, 161);
        doc.text(title, 14, y);
        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(30, 41, 59);
        const splitText = doc.splitTextToSize(content, 182);
        doc.text(splitText, 14, y);
        y += splitText.length * 4.5 + 5;
      };

      addSection('NEUROCONDUÇÃO MOTORA:', demoReport.details.motorConduction);
      addSection('NEUROCONDUÇÃO SENSITIVA:', demoReport.details.sensoryConduction);
      addSection('ONDA F:', demoReport.details.fWave);
      addSection('ELETROMIOGRAFIA DE AGULHA:', demoReport.details.emg);

      doc.setFillColor(240, 249, 255);
      doc.setDrawColor(2, 132, 199);
      const conclusionLines = doc.splitTextToSize(demoReport.details.conclusion, 174);
      const boxHeight = conclusionLines.length * 4.5 + 12;

      doc.rect(14, y, 182, boxHeight, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(2, 132, 199);
      doc.text('CONCLUSÃO MÉDICA:', 18, y + 7);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(conclusionLines, 18, y + 13);

      y += boxHeight + 15;

      doc.setDrawColor(148, 163, 184);
      doc.line(70, y, 140, y);
      y += 4;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('Dr. Eduardo Magalhães', 105, y, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Neurologista & Neurofisiologista | CRM-RO', 105, y + 4, { align: 'center' });

      doc.save(`Laudo_Oficial_${demoReport.patientName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF do paciente:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadTracings = () => {
    setIsDownloadingTracings(true);
    setTimeout(() => {
      alert(`Download de traçados do aparelho (${demoReport.tracingsFileName}) iniciado com sucesso!`);
      setIsDownloadingTracings(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6 my-4">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-950 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">{labels.modalTitle}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{labels.subtitle}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{labels.cpfLabel}</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">{labels.birthLabel}</label>
              <input
                type="text"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="DD/MM/AAAA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setSearchSubmitted(true)}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition"
            >
              <Search className="w-4 h-4" /> {labels.searchBtn}
            </button>
          </div>
        </div>

        {searchSubmitted && (
          <div className="pt-4 border-t border-slate-800 space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">{labels.resultTitle}</h4>
                  <p className="text-[11px] text-slate-300">{labels.patientNameLabel}: <strong>{demoReport.patientName}</strong> | {demoReport.examDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingPdf ? '...' : labels.downloadPdfBtn}</span>
                </button>

                <button
                  onClick={handleDownloadTracings}
                  disabled={isDownloadingTracings}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Paperclip className="w-4 h-4" />
                  <span>{isDownloadingTracings ? '...' : labels.downloadTracingsBtn}</span>
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-slate-300 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white">{demoReport.examType}</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">ID: {demoReport.authenticityCode}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px]">
                <div>
                  <span className="text-slate-500 block">{labels.doctorLabel}:</span>
                  <strong className="text-slate-200">{demoReport.requestingDoctor}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">{labels.examDateLabel}:</span>
                  <strong className="text-slate-200">{demoReport.examDate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">{labels.birthDateLabel}:</span>
                  <strong className="text-slate-200">{demoReport.birthDate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">{labels.statusLabel}:</span>
                  <strong className="text-emerald-400">Dr. Eduardo Magalhães</strong>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-cyan-400 uppercase text-[11px]">Conclusão Médica / Diagnosis:</h5>
                <p className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-slate-200 leading-relaxed font-medium">
                  {demoReport.details.conclusion}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{labels.authenticityText}</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
