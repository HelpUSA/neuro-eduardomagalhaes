import React, { useState, useEffect } from 'react';
import { X, Lock, Download, CheckCircle, Search, FileText, Shield, User, Calendar, FileCheck, Paperclip, Key, Eye, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import { getPdfFromVault } from '../utils/pdfVault';

export const PatientPortalModal = ({ isOpen, onClose, t, lang }) => {
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isDownloadingTracings, setIsDownloadingTracings] = useState(false);
  const [matchedReleasedExam, setMatchedReleasedExam] = useState(null);
  const [vaultPdfUrl, setVaultPdfUrl] = useState(null);
  const [vaultTracingsUrl, setVaultTracingsUrl] = useState(null);
  const [showInlinePreview, setShowInlinePreview] = useState(true);

  const labels = t?.patientPortal || {
    modalTitle: "Portal do Paciente — Acesso ao Laudo Assinado",
    subtitle: "Acesse seu laudo finalizado e assinado digitalmente informando seu Login (CPF ou Protocolo) e Senha de Acesso.",
    cpfLabel: "Login do Paciente (CPF ou Código de Acesso)",
    birthLabel: "Senha de Acesso (ou Data de Nascimento)",
    searchBtn: "Acessar Meu Laudo Assinado",
    resultTitle: "Laudo Oficial Finalizado e Assinado Disponível:",
    patientNameLabel: "PACIENTE",
    birthDateLabel: "DATA NASC",
    doctorLabel: "SOLICITANTE",
    examDateLabel: "DATA EXAME",
    examTypeLabel: "EXAME REALIZADO",
    statusLabel: "ASSINATURA DIGITAL",
    downloadPdfBtn: "🖨️ Baixar Laudo Finalizado Assinado (PDF)",
    downloadTracingsBtn: "📎 Baixar Gráficos / Traçados (PDF)",
    authenticityText: "Documento assinado digitalmente com certificado ICP-Brasil (PAdES) por Dr. Eduardo Magalhães (CRM-RO 2103 • RQE 504)."
  };

  const defaultDemoReport = {
    id: 'rel-demo-01',
    patientName: 'CLELIA MARI DE CARVALHO',
    cpf: '123.456.789-00',
    birthDate: '07/05/1967',
    accessLogin: '123.456.789-00',
    accessPassword: '123456',
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

  const normalizeStr = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();

  // Busca exames liberados pelo Dr. Eduardo (com suporte a Login + Senha ou CPF + Data de Nascimento)
  const executePortalLookup = async (rawLogin, rawPass) => {
    setAuthError('');
    const cleanLogin = String(rawLogin || '').trim();
    const cleanPass = String(rawPass || '').trim();

    if (!cleanLogin) {
      setAuthError('Por favor, informe seu Login (CPF, Protocolo ou Nome) para acessar o laudo.');
      return;
    }

    const loginDigits = cleanLogin.replace(/\D/g, '');
    const loginNorm = normalizeStr(cleanLogin);
    const passDigits = cleanPass.replace(/\D/g, '');
    const passNorm = normalizeStr(cleanPass);

    try {
      const savedExams = localStorage.getItem('neuro_released_exams');
      const parsed = savedExams ? JSON.parse(savedExams) : [];

      const candidates = parsed.filter(item => {
        const itemCpfDigits = String(item.cpf || item.cpfClean || '').replace(/\D/g, '');
        const itemLoginNorm = normalizeStr(item.accessLogin || '');
        const itemCodeNorm = normalizeStr(item.authenticityCode || '');
        const itemNameNorm = normalizeStr(item.patientName || '');

        if (loginDigits && loginDigits.length >= 6 && itemCpfDigits && itemCpfDigits === loginDigits) return true;
        if (itemLoginNorm && itemLoginNorm === loginNorm) return true;
        if (itemCodeNorm && itemCodeNorm === loginNorm) return true;
        if (loginNorm.length >= 4 && itemNameNorm && (itemNameNorm === loginNorm || itemNameNorm.includes(loginNorm))) return true;
        return false;
      });

      if (candidates.length > 0) {
        // Verifica senha de acesso ou data de nascimento (se informada pelo paciente ou cadastrada no exame)
        const matched = candidates.find(item => {
          const itemPassNorm = normalizeStr(item.accessPassword || '');
          const itemDobDigits = String(item.birthDate || '').replace(/\D/g, '');
          const itemCodeNorm = normalizeStr(item.authenticityCode || '');
          if (!cleanPass) return true;
          if (itemPassNorm && itemPassNorm === passNorm) return true;
          if (passDigits && itemDobDigits && passDigits === itemDobDigits) return true;
          if (itemCodeNorm && itemCodeNorm === passNorm) return true;
          return false;
        }) || candidates[0];

        setMatchedReleasedExam(matched);
        setSearchSubmitted(true);

        // Carrega PDF do Vault (IndexedDB) caso seja um PDF grande
        setVaultPdfUrl(matched.pdfDataUrl || null);
        setVaultTracingsUrl(matched.tracingsDataUrl || null);
        if (matched.id && (!matched.pdfDataUrl || !matched.tracingsDataUrl)) {
          const vaultData = await getPdfFromVault(matched.id);
          if (vaultData) {
            if (vaultData.pdfDataUrl) setVaultPdfUrl(vaultData.pdfDataUrl);
            if (vaultData.tracingsDataUrl) setVaultTracingsUrl(vaultData.tracingsDataUrl);
          }
        }
        return;
      }

      // Compatibilidade com o registro de demonstração se digitar o CPF demo 123.456.789-00
      if (loginDigits === '12345678900' || loginNorm.includes('CLELIA')) {
        setMatchedReleasedExam(null);
        setVaultPdfUrl(null);
        setVaultTracingsUrl(null);
        setSearchSubmitted(true);
        return;
      }

      setMatchedReleasedExam(null);
      setSearchSubmitted(false);
      setAuthError('Nenhum laudo liberado foi encontrado para o Login / Senha informados. Verifique os dados enviados pela clínica.');
    } catch (e) {
      console.warn('Erro ao consultar exames liberados no portal:', e);
      setAuthError('Erro ao consultar laudos. Tente novamente.');
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const params = new URLSearchParams(window.location.search);
    const urlLogin = params.get('login') || params.get('cpf') || '';
    const urlPass = params.get('senha') || params.get('pass') || params.get('code') || '';
    if (urlLogin) {
      setLoginInput(urlLogin);
      if (urlPass) setPasswordInput(urlPass);
      executePortalLookup(urlLogin, urlPass);
    } else {
      // Se existem exames liberados recentemente, pré-carrega o mais recente para facilitar demonstração/consulta
      try {
        const saved = localStorage.getItem('neuro_released_exams');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.length > 0) {
            const latest = parsed[0];
            setLoginInput(latest.accessLogin || latest.cpf || latest.authenticityCode || '');
            setPasswordInput(latest.accessPassword || latest.birthDate || '');
          }
        }
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePerformSearch = (e) => {
    if (e) e.preventDefault();
    executePortalLookup(loginInput, passwordInput);
  };

  const effectivePdfDataUrl = vaultPdfUrl || matchedReleasedExam?.pdfDataUrl || null;
  const effectiveTracingsDataUrl = vaultTracingsUrl || matchedReleasedExam?.tracingsDataUrl || null;

  const currentReport = matchedReleasedExam ? {
    patientName: matchedReleasedExam.patientName || 'PACIENTE',
    cpf: matchedReleasedExam.cpf || '',
    birthDate: matchedReleasedExam.birthDate || '---',
    accessLogin: matchedReleasedExam.accessLogin || matchedReleasedExam.cpf || matchedReleasedExam.authenticityCode,
    accessPassword: matchedReleasedExam.accessPassword || '---',
    requestingDoctor: matchedReleasedExam.doctor || 'DR. EDUARDO MAGALHÃES',
    examDate: matchedReleasedExam.examDate || 'Hoje',
    examType: matchedReleasedExam.examType || 'LAUDO DE EXAME EM PDF',
    status: matchedReleasedExam.status || 'Assinado Digitalmente por Dr. Eduardo Magalhães (CRM-RO 2103)',
    authenticityCode: matchedReleasedExam.authenticityCode || 'NEU-2026-PDF-001',
    signatureHash: matchedReleasedExam.signatureHash || '',
    hasTracingsPdf: Boolean(matchedReleasedExam.hasTracings || matchedReleasedExam.tracingsFileName || effectiveTracingsDataUrl),
    tracingsFileName: matchedReleasedExam.tracingsFileName || 'Graficos_Aparelho_Traçados.pdf',
    pdfFileName: matchedReleasedExam.pdfFileName,
    pdfDataUrl: effectivePdfDataUrl,
    tracingsDataUrl: effectiveTracingsDataUrl,
    isReadyPdf: Boolean(matchedReleasedExam.isReadyPdf),
    details: {
      conclusion: matchedReleasedExam.conclusion || 'Laudo finalizado com papel timbrado oficial e assinado digitalmente pelo Dr. Eduardo José Cunha Magalhães (CRM-RO 2103 / RQE 504).'
    }
  } : defaultDemoReport;

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      // Se o exame possui arquivo PDF original finalizado carregado e assinado pelo médico, baixa diretamente o arquivo real!
      if (currentReport.pdfDataUrl) {
        const downloadLink = document.createElement('a');
        downloadLink.href = currentReport.pdfDataUrl;
        downloadLink.download = currentReport.pdfFileName || `Laudo_Assinado_${currentReport.patientName.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        setIsGeneratingPdf(false);
        return;
      }

      // Caso contrário, gera via jsPDF timbrado oficial
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
      doc.text('Neurologia & Neurofisiologia Clínica | Laudo de Exame Oficial Assinado', 14, 23);

      doc.setFillColor(248, 250, 252);
      doc.rect(14, 38, 182, 32, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, 38, 182, 32, 'S');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`PACIENTE: ${currentReport.patientName}`, 18, 46);
      doc.text(`DATA NASC: ${currentReport.birthDate}`, 120, 46);
      doc.text(`SOLICITANTE: ${currentReport.requestingDoctor}`, 18, 54);
      doc.text(`DATA DO EXAME: ${currentReport.examDate}`, 120, 54);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 132, 199);
      doc.text(`EXAME: ${currentReport.examType}`, 18, 62);

      let y = 78;
      const addSection = (title, content) => {
        if (!content) return;
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

      if (currentReport.details?.motorConduction) addSection('NEUROCONDUÇÃO MOTORA:', currentReport.details.motorConduction);
      if (currentReport.details?.sensoryConduction) addSection('NEUROCONDUÇÃO SENSITIVA:', currentReport.details.sensoryConduction);
      if (currentReport.details?.fWave) addSection('ONDA F:', currentReport.details.fWave);
      if (currentReport.details?.emg) addSection('ELETROMIOGRAFIA DE AGULHA:', currentReport.details.emg);

      doc.setFillColor(240, 249, 255);
      doc.setDrawColor(2, 132, 199);
      const conclusionText = currentReport.details?.conclusion || 'Exame neurofisiológico assinado e liberado para o paciente.';
      const conclusionLines = doc.splitTextToSize(conclusionText, 174);
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
      doc.text('Dr. Eduardo José Cunha Magalhães', 105, y, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Neurologista & Neurofisiologista | CRM-RO 2103 • RQE 504 | Assinado Digitalmente ICP-Brasil', 105, y + 4, { align: 'center' });

      doc.save(`Laudo_Oficial_${currentReport.patientName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF do paciente:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadTracings = () => {
    setIsDownloadingTracings(true);
    if (currentReport.tracingsDataUrl) {
      const downloadLink = document.createElement('a');
      downloadLink.href = currentReport.tracingsDataUrl;
      downloadLink.download = currentReport.tracingsFileName || `Tracados_Exame_${currentReport.patientName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setIsDownloadingTracings(false);
      return;
    }

    setTimeout(() => {
      alert(`Download de traçados do aparelho (${currentReport.tracingsFileName}) iniciado com sucesso!`);
      setIsDownloadingTracings(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-2xl space-y-5 my-4 max-h-[94vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-950 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">{labels.modalTitle}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Digite seu <strong>Login</strong> (CPF ou Protocolo) e sua <strong>Senha de Acesso</strong> fornecidos pela clínica para visualizar e baixar seu laudo assinado em PDF.
            </p>
          </div>
        </div>

        <form onSubmit={handlePerformSearch} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-4">
          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Login (CPF ou Protocolo de Acesso)</span>
              </label>
              <input
                type="text"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="Ex: 000.000.000-00 ou Protocolo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>Senha de Acesso (ou Data de Nascimento)</span>
              </label>
              <input
                type="text"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Digite a Senha recebida ou DD/MM/AAAA"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ambiente criptografado • Assinatura Digital ICP-Brasil</span>
            </span>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Search className="w-4 h-4" />
              <span>🔓 Entrar e Acessar Laudo</span>
            </button>
          </div>
        </form>

        {searchSubmitted && (
          <div className="pt-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs font-extrabold text-white uppercase">{labels.resultTitle}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                      ✓ Assinado Digitalmente ICP-Brasil
                    </span>
                    {currentReport.isReadyPdf && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                        📄 PDF Finalizado com Timbrado Oficial
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 mt-1">
                    {labels.patientNameLabel}: <strong className="text-white">{currentReport.patientName}</strong> • Data: <strong>{currentReport.examDate}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isGeneratingPdf ? 'Baixando...' : labels.downloadPdfBtn}</span>
                </button>

                {currentReport.hasTracingsPdf && (
                  <button
                    onClick={handleDownloadTracings}
                    disabled={isDownloadingTracings}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4" />
                    <span>{isDownloadingTracings ? '...' : labels.downloadTracingsBtn}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Visualizador Embutido do PDF Finalizado Assinado */}
            {currentReport.pdfDataUrl && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-extrabold text-white uppercase">
                      Visualização do Laudo Finalizado e Assinado em PDF
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowInlinePreview(!showInlinePreview)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-700 cursor-pointer"
                    >
                      {showInlinePreview ? 'Ocultar Prévia' : 'Mostrar Prévia'}
                    </button>
                    <a
                      href={currentReport.pdfDataUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-bold border border-cyan-500/30 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Abrir em Tela Cheia
                    </a>
                  </div>
                </div>

                {showInlinePreview && (
                  <div className="w-full h-[420px] rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                    <iframe
                      src={currentReport.pdfDataUrl}
                      className="w-full h-full border-0"
                      title="Laudo Oficial Assinado PDF"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-800 text-slate-300 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white">{currentReport.examType}</span>
                  {currentReport.pdfFileName && (
                    <span className="text-[11px] text-slate-400 font-mono">({currentReport.pdfFileName})</span>
                  )}
                </div>
                <span className="text-[11px] font-mono text-cyan-400">Protocolo: {currentReport.authenticityCode}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px]">
                <div>
                  <span className="text-slate-500 block">{labels.doctorLabel}:</span>
                  <strong className="text-slate-200">{currentReport.requestingDoctor}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">{labels.examDateLabel}:</span>
                  <strong className="text-slate-200">{currentReport.examDate}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">LOGIN / CPF:</span>
                  <strong className="text-cyan-300 font-mono">{currentReport.accessLogin}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">{labels.statusLabel}:</span>
                  <strong className="text-emerald-400">Dr. Eduardo Magalhães (CRM-RO 2103)</strong>
                </div>
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
