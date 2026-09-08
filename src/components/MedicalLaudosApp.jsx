import React, { useState } from 'react';
import { 
  X, Search, PlusCircle, FileText, Send, UserPlus, ShieldCheck, Lock, 
  Sparkles, Check, Edit3, Trash2, Printer, Eye, ChevronRight, ChevronDown, 
  Folder, FolderOpen, Paperclip, AlertTriangle, Shield, User, Key, RefreshCw, Upload, Database
} from 'lucide-react';
import jsPDF from 'jspdf';
import { ALL_EXAM_TEMPLATES, EXAM_CATEGORIES } from '../data/eegTemplates';
import { INITIAL_PATIENT_DATABASE, formatCPF, findPatientByCPF, fetchCpfOnlineData } from '../data/patientDatabase';

export const MedicalLaudosApp = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'search' | 'users' | 'winsoft'
  
  // User Authentication State (Dr. Eduardo vs Secretária)
  const [currentUserRole, setCurrentUserRole] = useState('doctor'); // 'doctor' | 'reception'
  const [currentUserName, setCurrentUserName] = useState('Dr. Eduardo Magalhães');

  // Patient Database State (Winsoft + New Patients)
  const [patientDb, setPatientDb] = useState(INITIAL_PATIENT_DATABASE);
  const [cpfSearchStatus, setCpfSearchStatus] = useState(null); // null | 'found' | 'found_online' | 'not_found' | 'loading'

  // Selected Category / Folder View / Template
  const [viewMode, setViewMode] = useState('folders'); // 'folders' | 'search'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState(null); // e.g. 'ENMG / Neuropatias'
  const [expandedFolders, setExpandedFolders] = useState({
    'enmg_root': true,
    'eeg_root': true
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState('enmg_stc_grau2');
  const [templateSearchText, setTemplateSearchText] = useState('');

  // Form State for Exam Generator
  const [patientName, setPatientName] = useState('CLELIA MARI DE CARVALHO');
  const [cpf, setCpf] = useState('123.456.789-00');
  const [birthDate, setBirthDate] = useState('07/05/1967');
  const [requestingDoctor, setRequestingDoctor] = useState('DR HEMANOEL FERRO');
  const [examDate, setExamDate] = useState('03/10/2025');
  
  const [motorConduction, setMotorConduction] = useState('Realizada em nervos ulnares e medianos. Observamos amplitudes conservadas, com velocidades de condução normais, e latências distais limítrofes em medianos.');
  const [sensoryConduction, setSensoryConduction] = useState('Realizada em nervos ulnares, medianos e radiais. Em nervos medianos observamos potenciais de ação com latências prolongadas, velocidades de condução diminuídas e amplitudes normais.');
  const [fWave, setFWave] = useState('Pesquisada em nervos medianos e ulnares, com latências mínimas normais.');
  const [emgText, setEmgText] = useState('Realizada com agulha monopolar em músculos paracervicais, deltoide, bíceps, extensor comum dos dedos e primeiro interósseo dorsal.');
  const [conclusion, setConclusion] = useState('Exame compatível com neuropatia do mediano ao nível do carpo, com comprometimento parcial de fibras sensitivas, de caráter desmielinizante (grau 2), bilateral.');

  // Attached Tracings File
  const [attachedTracingsFile, setAttachedTracingsFile] = useState('Graficos_Aparelho_ENMG_Clelia.pdf');

  // Employee Roles Database
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Dr. Eduardo Magalhães', email: 'eduardo@clinica.com.br', role: 'doctor', roleTitle: '👑 Administrador / Médico', status: 'Ativo' },
    { id: 2, name: 'Juliana Costa', email: 'juliana@clinica.com.br', role: 'reception', roleTitle: '📋 Secretária / Atendimento', status: 'Ativo' },
    { id: 3, name: 'Fernanda Souza', email: 'fernanda@clinica.com.br', role: 'reception', roleTitle: '📋 Secretária / Atendimento', status: 'Ativo' }
  ]);

  if (!isOpen) return null;

  // Toggle Folder Expansion
  const toggleFolder = (folderKey) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderKey]: !prev[folderKey]
    }));
  };

  // Handle CPF Change and Auto-fill (Mevo style)
  const handleCpfChange = (val) => {
    const formatted = formatCPF(val);
    setCpf(formatted);

    // If full CPF typed (14 chars like 000.000.000-00), attempt lookup
    if (formatted.length === 14) {
      performCpfLookup(formatted);
    } else {
      setCpfSearchStatus(null);
    }
  };

  // Perform CPF Lookup in Patient Database (Winsoft)
  const performCpfLookup = (targetCpf = cpf) => {
    const found = findPatientByCPF(patientDb, targetCpf);
    if (found) {
      setPatientName(found.name);
      setBirthDate(found.birthDate);
      if (found.requestingDoctor) setRequestingDoctor(found.requestingDoctor);
      setCpfSearchStatus('found');
    } else {
      setCpfSearchStatus('not_found');
    }
  };

  // Filter templates by selected category, folder or search text
  const filteredTemplates = ALL_EXAM_TEMPLATES.filter(tmpl => {
    const matchCategory = selectedCategory === 'all' || tmpl.categoryId === selectedCategory;
    const matchFolder = !selectedFolder || tmpl.folderName === selectedFolder;
    const q = templateSearchText.toLowerCase();
    const matchSearch = !q || tmpl.title.toLowerCase().includes(q) || tmpl.keywords.some(kw => kw.toLowerCase().includes(q));
    return matchCategory && matchFolder && matchSearch;
  });

  // Handle selecting a template
  const handleSelectTemplate = (template) => {
    setSelectedTemplateId(template.id);
    if (template.motorConduction) setMotorConduction(template.motorConduction);
    if (template.sensoryConduction) setSensoryConduction(template.sensoryConduction);
    if (template.fWave) setFWave(template.fWave);
    if (template.emgText) setEmgText(template.emgText);
    setConclusion(template.conclusion);
  };

  // Switch User Profile Simulation
  const handleSwitchUser = (userRole, name) => {
    setCurrentUserRole(userRole);
    setCurrentUserName(name);
  };

  // Function to generate PDF Timbrado with Signature + QR Code
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
      doc.setFontSize(9.5);
      doc.setTextColor(3, 105, 161);
      doc.text(title, 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      const lines = doc.splitTextToSize(text, 182);
      doc.text(lines, 14, y);
      y += lines.length * 4.5 + 5;
    };

    addBlock('NEUROCONDUÇÃO MOTORA:', motorConduction);
    addBlock('NEUROCONDUÇÃO SENSITIVA:', sensoryConduction);
    addBlock('ONDA F:', fWave);
    addBlock('ELETROMIOGRAFIA / REGISTRO CEREBRAL:', emgText);

    // Conclusion Box
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(2, 132, 199);
    const concLines = doc.splitTextToSize(conclusion, 174);
    const bh = concLines.length * 4.5 + 12;
    doc.rect(14, y, 182, bh, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(2, 132, 199);
    doc.text('CONCLUSÃO MÉDICA:', 18, y + 7);
    doc.setTextColor(15, 23, 42);
    doc.text(concLines, 18, y + 13);

    y += bh + 15;

    // Doctor Signature Line & QR Code Note
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
    doc.text('Documento Assinado Digitalmente com Certificado ICP-Brasil (PAdES)', 105, y + 8, { align: 'center' });

    doc.save(`Laudo_Oficial_${patientName.replace(/\s+/g, '_')}.pdf`);
  };

  // WhatsApp Dispatch
  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá ${patientName}! Seu laudo de exame foi concluído pela Clínica Dr. Eduardo Magalhães. Você pode baixar seu laudo e gráficos de exame com segurança no nosso portal usando seu CPF.`
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

        {/* Header & User Switcher Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                <span>Painel do Consultório</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${currentUserRole === 'doctor' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>
                  {currentUserRole === 'doctor' ? '👑 Médico (Dr. Eduardo)' : '📋 Secretária (Recepção)'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Logado como: <strong>{currentUserName}</strong> | Clínica de Neurologia Dr. Eduardo Magalhães
              </p>
            </div>
          </div>

          {/* User Quick Switcher Pill (Simulador de Login) */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-500 font-mono px-2">Simular Login:</span>
            <button
              onClick={() => handleSwitchUser('doctor', 'Dr. Eduardo Magalhães')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${currentUserRole === 'doctor' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              👑 Dr. Eduardo
            </button>
            <button
              onClick={() => handleSwitchUser('reception', 'Juliana Costa (Secretária)')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${currentUserRole === 'reception' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              📋 Secretária
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between pt-4 border-b border-slate-800/80 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'generator' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
            >
              <FileText className="w-4 h-4 inline mr-1.5" /> Emissão de Laudos
            </button>
            <button
              onClick={() => setActiveTab('winsoft')}
              className={`px-4 py-2 rounded-xl transition ${activeTab === 'winsoft' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
            >
              <Database className="w-4 h-4 inline mr-1.5" /> Base Winsoft ({patientDb.length} Pacientes)
            </button>
            {currentUserRole === 'doctor' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-xl transition ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
              >
                <ShieldCheck className="w-4 h-4 inline mr-1.5" /> Gestão de Equipe (RBAC)
              </button>
            )}
          </div>

          {/* Privacy Indicator Badge */}
          {currentUserRole === 'reception' && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Modo Recepção: Conclusões Médicas Ocultas (LGPD)</span>
            </div>
          )}
        </div>

        {/* TAB 1: EMISSOR DE LAUDOS */}
        {activeTab === 'generator' && (
          <div className="pt-4 space-y-5">
            
            {/* Category Folders & Search Selector */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-cyan-400" />
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Biblioteca de Modelos (Google Drive Structure):
                  </label>
                </div>

                {/* View Mode Switcher (Tree Folders vs Direct Search) */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setViewMode('folders')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${viewMode === 'folders' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Folder className="w-3.5 h-3.5" /> Navegador de Pastas (Drive)
                  </button>
                  <button
                    onClick={() => setViewMode('search')}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${viewMode === 'search' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                  >
                    <Search className="w-3.5 h-3.5" /> Busca por Palavras
                  </button>
                </div>
              </div>

              {/* Template Search Box */}
              <div className="relative">
                <input
                  type="text"
                  value={templateSearchText}
                  onChange={(e) => {
                    setTemplateSearchText(e.target.value);
                    if (e.target.value) setViewMode('search');
                  }}
                  placeholder="Pesquisar modelo por palavra-chave... (ex: 'STC', 'grau 2', 'paroxismo', 'normal', 'ritmos lentos')"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              {/* VIEW MODE 1: DRIVE FOLDER TREE NAVIGATION */}
              {viewMode === 'folders' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 max-h-64 overflow-y-auto pr-1">
                  {EXAM_CATEGORIES.map(cat => {
                    const catTemplates = ALL_EXAM_TEMPLATES.filter(t => t.categoryId === cat.id);
                    if (catTemplates.length === 0) return null;
                    const isExpanded = expandedFolders[cat.id] !== false; // expanded by default or toggled
                    return (
                      <div key={cat.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <button
                          onClick={() => toggleFolder(cat.id)}
                          className="w-full flex items-center justify-between text-left text-xs font-bold text-cyan-300 hover:text-cyan-200"
                        >
                          <span className="flex items-center gap-2">
                            {isExpanded ? <FolderOpen className="w-4 h-4 text-amber-400" /> : <Folder className="w-4 h-4 text-amber-400" />}
                            <span>📁 {cat.name}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 font-mono">
                              {catTemplates.length} modelos
                            </span>
                          </span>
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>

                        {isExpanded && (
                          <div className="pl-4 space-y-1.5 border-l border-slate-800 mt-2 max-h-40 overflow-y-auto pr-1">
                            {catTemplates.map(tmpl => (
                              <button
                                key={tmpl.id}
                                onClick={() => handleSelectTemplate(tmpl)}
                                className={`w-full p-2 rounded-lg border text-left text-xs transition flex items-center justify-between ${selectedTemplateId === tmpl.id ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                              >
                                <span className="truncate pr-2">{tmpl.title}</span>
                                {selectedTemplateId === tmpl.id && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* VIEW MODE 2: DIRECT SEARCH GRID */}
              {viewMode === 'search' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {filteredTemplates.map(tmpl => (
                    <button
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl)}
                      className={`p-3 rounded-xl border text-left text-xs transition space-y-1 ${selectedTemplateId === tmpl.id ? 'bg-cyan-500/20 border-cyan-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400">{tmpl.folderName}</span>
                        {selectedTemplateId === tmpl.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <strong className="block text-slate-200 text-xs font-bold leading-snug">{tmpl.title}</strong>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Patient Credentials Form with CPF Auto-Lookup (Mevo Style) */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>Dados Cadastrais do Paciente (Busca Inteligente por CPF):</span>
                </h4>

                {/* CPF Lookup Toast Indicator */}
                {cpfSearchStatus === 'loading' && (
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Consultando CPF Online (Estilo Mevo)...
                  </span>
                )}
                {cpfSearchStatus === 'found' && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 animate-pulse">
                    <Check className="w-3.5 h-3.5" /> Paciente Localizado na Base Winsoft!
                  </span>
                )}
                {cpfSearchStatus === 'found_online' && (
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold flex items-center gap-1.5 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Paciente Localizado via Consulta de CPF (Mevo)!
                  </span>
                )}
                {cpfSearchStatus === 'not_found' && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Novo Paciente (Preencha os dados abaixo)
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {/* CPF Input with Instant Lookup Button */}
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                    <span>CPF do Paciente</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Estilo Mevo</span>
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={cpf}
                      onChange={(e) => handleCpfChange(e.target.value)}
                      placeholder="000.000.000-00"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-cyan-500/50 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono font-bold"
                    />
                    <button
                      onClick={() => performCpfLookup()}
                      title="Buscar dados no Winsoft"
                      className="px-2.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Data Nasc.</label>
                  <input
                    type="text"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Médico Solicitante</label>
                  <input
                    type="text"
                    value={requestingDoctor}
                    onChange={(e) => setRequestingDoctor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              {/* Anexo de Gráficos do Aparelho */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Paperclip className="w-4 h-4 text-cyan-400" />
                  <span>PDF com Gráficos/Traçados do Aparelho:</span>
                  <strong className="text-emerald-400 font-mono">{attachedTracingsFile}</strong>
                </div>
                <button
                  onClick={() => alert("Simulação: Arquivo de gráficos anexado com sucesso ao prontuário do paciente!")}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold border border-slate-700"
                >
                  + Anexar Gráficos do Aparelho
                </button>
              </div>
            </div>

            {/* Medical Report Conclusion Block */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Conclusão Médica do Laudo:</span>
                {currentUserRole === 'reception' && (
                  <span className="text-amber-400 font-semibold text-[11px]">
                    🔒 Restrito ao Médico (LGPD)
                  </span>
                )}
              </label>

              {currentUserRole === 'doctor' ? (
                <textarea
                  rows={3}
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-cyan-500/50 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed font-medium"
                />
              ) : (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-500 text-xs italic">
                  [ As informações diagnósticas deste laudo são restritas ao Dr. Eduardo Magalhães para proteção ao sigilo médico conforme a LGPD. ]
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 flex-wrap gap-3">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Assinatura Digital ICP-Brasil + Carimbo Visual & QR Code</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSendWhatsApp}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Disparar Link no WhatsApp
                </button>

                {currentUserRole === 'doctor' && (
                  <button
                    onClick={handleGeneratePdf}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    <Printer className="w-4 h-4" /> Assinar & Gerar PDF Timbrado
                  </button>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: BASE WINSOFT DE PACIENTES */}
        {activeTab === 'winsoft' && (
          <div className="pt-4 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <span>Base de Dados de Pacientes (Winsoft - Jean Cordeiro)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cadastros sincronizados para busca instantânea por CPF (Estilo Mevo).
                </p>
              </div>

              <button
                onClick={() => alert("Módulo de Carga CSV: Selecione o arquivo exportado do sistema Winsoft (.csv ou .json) para atualizar a base de pacientes.")}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Importar Lista do Winsoft (CSV)
              </button>
            </div>

            {/* Patients Table */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">CPF</th>
                    <th className="p-3">Nome Completo</th>
                    <th className="p-3">Data Nasc.</th>
                    <th className="p-3">Último Exame</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {patientDb.map(p => (
                    <tr key={p.cpf} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-mono text-cyan-400 font-bold">{p.cpf}</td>
                      <td className="p-3 font-semibold text-white">{p.name}</td>
                      <td className="p-3">{p.birthDate}</td>
                      <td className="p-3 text-slate-400">{p.lastExam || '03/10/2025'}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setCpf(p.cpf);
                            setPatientName(p.name);
                            setBirthDate(p.birthDate);
                            if (p.requestingDoctor) setRequestingDoctor(p.requestingDoctor);
                            setCpfSearchStatus('found');
                            setActiveTab('generator');
                          }}
                          className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 font-bold text-[11px]"
                        >
                          Usar no Laudo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GESTÃO DE EQUIPE (RBAC) */}
        {activeTab === 'users' && currentUserRole === 'doctor' && (
          <div className="pt-4 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Gestão de Usuários & Níveis de Acesso (RBAC)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Defina quais funcionários possuem acesso ao diagnóstico e laudos médicos (LGPD).
                </p>
              </div>

              <button
                onClick={() => alert("Simulação: Modal para cadastrar nova secretária/funcionário adicionado.")}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Cadastrar Novo Usuário
              </button>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Nome</th>
                    <th className="p-3">E-mail</th>
                    <th className="p-3">Perfil de Acesso</th>
                    <th className="p-3">Acesso ao Laudo (LGPD)</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-semibold text-white">{emp.name}</td>
                      <td className="p-3 text-slate-400">{emp.email}</td>
                      <td className="p-3 font-bold text-cyan-300">{emp.roleTitle}</td>
                      <td className="p-3">
                        {emp.role === 'doctor' ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Total (Médico)
                          </span>
                        ) : (
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> Oculto (Secretária)
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                          {emp.status}
                        </span>
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
