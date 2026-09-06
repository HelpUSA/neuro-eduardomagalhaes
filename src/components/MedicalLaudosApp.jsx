import React, { useState } from 'react';
import { X, Search, PlusCircle, FileText, Send, UserPlus, ShieldCheck, Lock, Sparkles, Check, Edit3, Trash2, Printer, Eye, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';

export const MedicalLaudosApp = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'search' | 'users'
  const [searchTerm, setSearchTerm] = useState('Túnel do Carpo');
  const [selectedTemplate, setSelectedTemplate] = useState('stc_grau2');

  // Form State for Exam Generator
  const [patientName, setPatientName] = useState('CLELIA MARI DE CARVALHO');
  const [birthDate, setBirthDate] = useState('07/05/1967');
  const [requestingDoctor, setRequestingDoctor] = useState('DR HEMANOEL FERRO');
  const [examDate, setExamDate] = useState('03/10/2025');
  
  const [motorConduction, setMotorConduction] = useState('Realizada em nervos ulnares e medianos. Observamos amplitudes conservadas, com velocidades de condução normais, e latências distais limítrofes em medianos.');
  const [sensoryConduction, setSensoryConduction] = useState('Realizada em nervos ulnares, medianos e radiais. Em nervos medianos observamos potenciais de ação com latências prolongadas, velocidades de condução diminuídas e amplitudes normais.');
  const [fWave, setFWave] = useState('Pesquisada em nervos medianos e ulnares, com latências mínimas normais.');
  const [emgText, setEmgText] = useState('Realizada com agulha monopolar em músculos paracervicais, deltoide, bíceps, extensor comum dos dedos, primeiro interósseo dorsal e abdutor curto do polegar. Evidenciou ausência de atividade espontânea e potenciais de ação normais.');
  const [conclusion, setConclusion] = useState('Exame compatível com neuropatia do mediano ao nível do carpo, com comprometimento parcial de fibras sensitivas, de caráter desmielinizante (grau 2), bilateral.');

  // Mock Database of Reports for Search Demonstration
  const mockReportsList = [
    {
      id: 'L001',
      patientName: 'CLELIA MARI DE CARVALHO',
      birthDate: '07/05/1967',
      requestingDoctor: 'DR HEMANOEL FERRO',
      examDate: '03/10/2025',
      examType: 'ENMG',
      conclusion: 'Exame compatível com neuropatia do mediano ao nível do carpo, com comprometimento parcial de fibras sensitivas, de caráter desmielinizante (grau 2), bilateral.',
      keywords: ['Túnel do Carpo', 'STC', 'Grau 2', 'Desmielinizante', 'Bilateral']
    },
    {
      id: 'L002',
      patientName: 'ROBERTO ALVES DA SILVA',
      birthDate: '12/11/1980',
      requestingDoctor: 'DRA PATRICIA LIMA',
      examDate: '28/09/2025',
      examType: 'ENMG',
      conclusion: 'Sinais eletroneuromiográficos compatíveis com radiculopatia L5-S1 crônica à direita, sem sinais de desnervação ativa no momento.',
      keywords: ['Radiculopatia', 'Lombociatalgia', 'L5-S1', 'Coluna']
    },
    {
      id: 'L003',
      patientName: 'MARIA DAS GRACAS MENDES',
      birthDate: '03/02/1958',
      requestingDoctor: 'DR MARCIO TOPBARBER',
      examDate: '15/08/2025',
      examType: 'EEG',
      conclusion: 'Eletroencefalograma digital de vigília e sono normal. Não foram observadas paroxismos epileptiformes.',
      keywords: ['EEG', 'Normal', 'Eletroencefalograma', 'Mapeamento']
    }
  ];

  // Employee Roles Mock
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Dr. Eduardo Magalhães', email: 'eduardo@clinica.com.br', role: 'Administrador (Médico)', status: 'Ativo' },
    { id: 2, name: 'Juliana Costa (Recepção)', email: 'juliana@clinica.com.br', role: 'Secretária / Atendimento', status: 'Ativo' },
    { id: 3, name: 'Fernanda Souza (Triagem)', email: 'fernanda@clinica.com.br', role: 'Secretária / Atendimento', status: 'Ativo' }
  ]);

  if (!isOpen) return null;

  // Filtered reports for full text search
  const filteredReports = mockReportsList.filter(rep => {
    const q = searchTerm.toLowerCase();
    return (
      rep.patientName.toLowerCase().includes(q) ||
      rep.conclusion.toLowerCase().includes(q) ||
      rep.requestingDoctor.toLowerCase().includes(q) ||
      rep.birthDate.includes(q) ||
      rep.keywords.some(kw => kw.toLowerCase().includes(q))
    );
  });

  // Function to apply templates
  const handleSelectTemplate = (templateKey) => {
    setSelectedTemplate(templateKey);
    if (templateKey === 'stc_grau2') {
      setConclusion('Exame compatível com neuropatia do mediano ao nível do carpo, com comprometimento parcial de fibras sensitivas, de caráter desmielinizante (grau 2), bilateral.');
    } else if (templateKey === 'enmg_normal') {
      setConclusion('Estudo eletroneuromiográfico dos membros superiores dentro dos padrões de normalidade.');
    } else if (templateKey === 'radiculopatia_cervical') {
      setConclusion('Sinais sugestivos de comprometimento radicular C6-C7 à direita, de intensidade leve.');
    } else if (templateKey === 'eeg_normal') {
      setConclusion('Eletroencefalograma de vigília e sono dentro dos limites da normalidade para a idade.');
    }
  };

  // Function to generate and open PDF
  const handleGeneratePdf = () => {
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

    // Patient Header Box
    doc.setFillColor(248, 250, 252);
    doc.rect(14, 38, 182, 32, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(14, 38, 182, 32, 'S');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`PACIENTE: ${patientName}`, 18, 46);
    doc.text(`DATA NASC: ${birthDate}`, 120, 46);
    doc.text(`SOLICITANTE: ${requestingDoctor}`, 18, 54);
    doc.text(`DATA DO EXAME: ${examDate}`, 120, 54);

    let y = 80;
    const addBlock = (title, text) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(3, 105, 161);
      doc.text(title, 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      const lines = doc.splitTextToSize(text, 182);
      doc.text(lines, 14, y);
      y += lines.length * 5 + 6;
    };

    addBlock('NEUROCONDUÇÃO MOTORA:', motorConduction);
    addBlock('NEUROCONDUÇÃO SENSITIVA:', sensoryConduction);
    addBlock('ONDA F:', fWave);
    addBlock('ELETROMIOGRAFIA:', emgText);

    // Conclusion Box
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(2, 132, 199);
    const concLines = doc.splitTextToSize(conclusion, 174);
    const bh = concLines.length * 5 + 14;
    doc.rect(14, y, 182, bh, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(2, 132, 199);
    doc.text('CONCLUSÃO:', 18, y + 8);
    doc.setTextColor(15, 23, 42);
    doc.text(concLines, 18, y + 14);

    doc.save(`Laudo_ENMG_${patientName.replace(/\s+/g, '_')}.pdf`);
  };

  // WhatsApp Dispatch
  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá ${patientName}! Seu laudo de exame (${selectedTemplate.toUpperCase()}) foi concluído e assinado digitalmente pelo Dr. Eduardo Magalhães. Você pode baixar seu PDF com segurança no portal.`
    );
    window.open(`https://wa.me/556932235805?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-500/30 my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Painel do Médico & Emissor de Laudos
              </h2>
              <p className="text-xs text-slate-400">
                Área Restrita - Dr. Eduardo Magalhães & Equipe Autorizada
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'generator' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <FileText className="w-4 h-4 inline mr-1.5" /> Gerar Laudo
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'search' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Search className="w-4 h-4 inline mr-1.5" /> Busca Inteligente
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <ShieldCheck className="w-4 h-4 inline mr-1.5" /> Gestão de Equipe (RBAC)
            </button>
          </div>
        </div>

        {/* TAB 1: EMISSOR DE LAUDOS */}
        {activeTab === 'generator' && (
          <div className="pt-6 space-y-6">
            
            {/* Template Picker */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                Selecione o Modelo Pré-determinado do Exame:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleSelectTemplate('stc_grau2')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${selectedTemplate === 'stc_grau2' ? 'bg-cyan-500/20 border-cyan-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <strong className="block text-slate-200">ENMG - STC Grau 2</strong>
                  <span className="text-[10px] text-cyan-400">Túnel do Carpo Bilateral</span>
                </button>

                <button
                  onClick={() => handleSelectTemplate('enmg_normal')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${selectedTemplate === 'enmg_normal' ? 'bg-cyan-500/20 border-cyan-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <strong className="block text-slate-200">ENMG Normal</strong>
                  <span className="text-[10px] text-emerald-400">Membros Superiores</span>
                </button>

                <button
                  onClick={() => handleSelectTemplate('radiculopatia_cervical')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${selectedTemplate === 'radiculopatia_cervical' ? 'bg-cyan-500/20 border-cyan-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <strong className="block text-slate-200">Radiculopatia C6-C7</strong>
                  <span className="text-[10px] text-amber-400">Comprometimento Leve</span>
                </button>

                <button
                  onClick={() => handleSelectTemplate('eeg_normal')}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold transition ${selectedTemplate === 'eeg_normal' ? 'bg-cyan-500/20 border-cyan-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <strong className="block text-slate-200">EEG Mapeamento</strong>
                  <span className="text-[10px] text-indigo-400">Vigília e Sono Normal</span>
                </button>
              </div>
            </div>

            {/* Patient Credentials Form */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome do Paciente</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Data Nasc.</label>
                <input
                  type="text"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Médico Solicitante</label>
                <input
                  type="text"
                  value={requestingDoctor}
                  onChange={(e) => setRequestingDoctor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Data do Exame</label>
                <input
                  type="text"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>

            {/* Exam Details Text Blocks */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Conclusão Médica do Laudo:</label>
                <textarea
                  rows={3}
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-cyan-500/50 text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 flex-wrap gap-4">
              <div className="text-xs text-slate-400">
                <span>Timbrado Oficial: <strong>Clínica Eduardo Magalhães</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSendWhatsApp}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Disparar no WhatsApp
                </button>
                <button
                  onClick={handleGeneratePdf}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <Printer className="w-4 h-4" /> Gerar & Salvar PDF Timbrado
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: BUSCA INTELIGENTE POR PALAVRAS-CHAVE */}
        {activeTab === 'search' && (
          <div className="pt-6 space-y-6">
            
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400">
                Pesquisar Histórico por Palavras-Chave, Diagnóstico, Nome ou CPF:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ex: 'Túnel do Carpo', 'Grau 2', 'Radiculopatia', 'Clelia', '07/05/1967'..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Results Counter */}
            <div className="text-xs text-slate-400">
              Exibindo <strong>{filteredReports.length}</strong> laudo(s) encontrado(s) para o termo "<span className="text-cyan-400 font-bold">{searchTerm}</span>":
            </div>

            {/* Reports List */}
            <div className="space-y-3">
              {filteredReports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition space-y-2">
                  <div className="flex justify-between items-center flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <strong className="text-white text-sm">{rep.patientName}</strong>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">{rep.examType}</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Exame: {rep.examDate} | Nasc: {rep.birthDate}</span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 font-medium">
                    {rep.conclusion}
                  </p>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-slate-500">Palavras-chave:</span>
                      {rep.keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                          {kw}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={handleGeneratePdf}
                      className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Re-emitir PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 3: GESTÃO DE EQUIPE (RBAC) */}
        {activeTab === 'users' && (
          <div className="pt-6 space-y-6">
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">Equipe & Permissões da Clínica</h3>
                <p className="text-xs text-slate-400">Controle rigoroso de acessos por perfil (Conformidade LGPD).</p>
              </div>
              <button
                onClick={() => setEmployees([...employees, { id: Date.now(), name: 'Nova Secretária', email: 'secretaria@clinica.com.br', role: 'Secretária / Atendimento', status: 'Ativo' }])}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" /> + Adicionar Funcionário
              </button>
            </div>

            {/* Employee List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Nome / Usuário</th>
                    <th className="p-3">E-mail</th>
                    <th className="p-3">Perfil de Acesso</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-bold text-white">{emp.name}</td>
                      <td className="p-3 text-slate-400">{emp.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${emp.role.includes('Admin') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                          {emp.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                          ● {emp.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button className="text-slate-400 hover:text-white text-[11px] font-semibold">Editar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
