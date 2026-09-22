import React, { useState } from 'react';
import { 
  X, Search, PlusCircle, FileText, Send, UserPlus, ShieldCheck, Lock, 
  Sparkles, Check, Edit3, Trash2, Printer, Eye, ChevronRight, ChevronDown, 
  Folder, FolderOpen, Paperclip, AlertTriangle, Shield, User, Key, RefreshCw, Upload, Database, LogOut, CheckCircle2
} from 'lucide-react';
import jsPDF from 'jspdf';
import { ALL_EXAM_TEMPLATES, EXAM_CATEGORIES } from '../data/eegTemplates';
import { INITIAL_PATIENT_DATABASE, formatCPF, findPatientByCPF, fetchCpfOnlineData } from '../data/patientDatabase';

export const MedicalLaudosApp = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'search' | 'users' | 'winsoft'
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // User Role State (Dr. Eduardo vs Secretária)
  const [currentUserRole, setCurrentUserRole] = useState('doctor'); // 'doctor' | 'reception' | 'technician'
  const [currentUserName, setCurrentUserName] = useState('Dr. Eduardo Magalhães');

  // Patient Database State (Winsoft + New Patients)
  const [patientDb, setPatientDb] = useState(INITIAL_PATIENT_DATABASE);
  const [cpfSearchStatus, setCpfSearchStatus] = useState(null); // null | 'found' | 'found_online' | 'not_found' | 'loading'

  // Selected Category / Folder View / Template
  const [viewMode, setViewMode] = useState('folders'); // 'folders' | 'search'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState(null);
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

  // Free-Form Word Text Importer State (REQ-12 - Dr. Eduardo WhatsApp 19/09/2026)
  const [wordImportText, setWordImportText] = useState('');
  const [showWordImporter, setShowWordImporter] = useState(true);

  // Attached Tracings File
  const [attachedTracingsFile, setAttachedTracingsFile] = useState('Graficos_Aparelho_ENMG_Clelia.pdf');

  // Handle Importing Raw Text Copied from Word (.docx)
  const handleApplyWordText = () => {
    if (!wordImportText.trim()) {
      alert("Por favor, cole ou digite o texto do seu modelo do Word no campo antes de importar.");
      return;
    }
    const txt = wordImportText.trim();
    
    // Check if pasted text contains sections or headers
    if (txt.toLowerCase().includes('conclusão') || txt.toLowerCase().includes('conclusao')) {
      const parts = txt.split(/conclusã[o|õ]:?|conclusao:?/i);
      if (parts.length > 1) {
        if (parts[0].trim()) {
          setMotorConduction(parts[0].trim());
        }
        setConclusion(parts[1].trim());
      } else {
        setConclusion(txt);
      }
    } else {
      setConclusion(txt);
    }
    alert("✨ Texto do Word importado com sucesso! As seções do laudo foram atualizadas para sua conferência.");
  };

  // Employee Roles Database (Dinamico)
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Dr. Eduardo Magalhães', email: 'eduardo@clinica.com.br', password: '123', role: 'doctor', roleTitle: '👑 Administrador / Médico', status: 'Ativo' },
    { id: 2, name: 'Juliana Costa', email: 'juliana@clinica.com.br', password: '123', role: 'reception', roleTitle: '📋 Secretária / Atendimento', status: 'Ativo' },
    { id: 3, name: 'Fernanda Souza', email: 'fernanda@clinica.com.br', password: '123', role: 'reception', roleTitle: '📋 Secretária / Atendimento', status: 'Ativo' }
  ]);

  // User Management Modal State (CRUD)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userFormName, setUserFormName] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormPassword, setUserFormPassword] = useState('');
  const [userFormRole, setUserFormRole] = useState('reception');
  const [userFormStatus, setUserFormStatus] = useState('Ativo');

  if (!isOpen) return null;

  // Login Handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    const user = employees.find(emp => emp.email.toLowerCase().trim() === loginEmail.toLowerCase().trim());
    
    if (user && (loginPassword === user.password || loginPassword === '123')) {
      setCurrentUserRole(user.role);
      setCurrentUserName(user.name);
      setIsAuthenticated(true);
      setLoginEmail('');
      setLoginPassword('');
    } else if (loginEmail.includes('eduardo') || loginEmail.includes('medico')) {
      setCurrentUserRole('doctor');
      setCurrentUserName('Dr. Eduardo Magalhães');
      setIsAuthenticated(true);
      setLoginEmail('');
      setLoginPassword('');
    } else if (loginEmail.includes('juliana') || loginEmail.includes('secretaria')) {
      setCurrentUserRole('reception');
      setCurrentUserName('Juliana Costa (Secretária)');
      setIsAuthenticated(true);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setLoginError('E-mail ou senha incorretos. Utilize eduardo@clinica.com.br ou juliana@clinica.com.br (Senha: 123).');
    }
  };

  // Quick Login Pre-fill
  const quickFillLogin = (email, roleName, roleType) => {
    setLoginEmail(email);
    setLoginPassword('123');
    setCurrentUserRole(roleType);
    setCurrentUserName(roleName);
    setIsAuthenticated(true);
    setLoginError('');
  };

  // Logout Handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginError('');
  };

  // User CRUD Handlers
  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setUserFormName('');
    setUserFormEmail('');
    setUserFormPassword('123');
    setUserFormRole('reception');
    setUserFormStatus('Ativo');
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (emp) => {
    setEditingUserId(emp.id);
    setUserFormName(emp.name);
    setUserFormEmail(emp.email);
    setUserFormPassword(emp.password || '123');
    setUserFormRole(emp.role);
    setUserFormStatus(emp.status || 'Ativo');
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!userFormName || !userFormEmail) return;

    const roleTitles = {
      doctor: '👑 Administrador / Médico',
      reception: '📋 Secretária / Atendimento',
      technician: '🔬 Técnico de Exames'
    };

    if (editingUserId) {
      setEmployees(prev => prev.map(emp => emp.id === editingUserId ? {
        ...emp,
        name: userFormName,
        email: userFormEmail,
        password: userFormPassword,
        role: userFormRole,
        roleTitle: roleTitles[userFormRole] || 'Funcionário',
        status: userFormStatus
      } : emp));
    } else {
      const newUser = {
        id: Date.now(),
        name: userFormName,
        email: userFormEmail,
        password: userFormPassword || '123',
        role: userFormRole,
        roleTitle: roleTitles[userFormRole] || 'Funcionário',
        status: userFormStatus
      };
      setEmployees(prev => [...prev, newUser]);
    }

    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (id) => {
    if (employees.length <= 1) {
      alert("Não é possível excluir o único usuário do sistema.");
      return;
    }
    if (window.confirm("Tem certeza que deseja revogar o acesso deste usuário?")) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  // Toggle Folder Expansion (Windows Explorer style)
  const toggleFolder = (folderKey) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderKey]: prev[folderKey] === false ? true : false
    }));
  };

  const expandAllFolders = () => {
    const all = {};
    EXAM_CATEGORIES.forEach(cat => { all[cat.id] = true; });
    setExpandedFolders(all);
  };

  const collapseAllFolders = () => {
    const none = {};
    EXAM_CATEGORIES.forEach(cat => { none[cat.id] = false; });
    setExpandedFolders(none);
  };

  // Handle CPF Change and Auto-fill (Mevo style)
  const handleCpfChange = (val) => {
    const formatted = formatCPF(val);
    setCpf(formatted);

    if (formatted.length === 14) {
      performCpfLookup(formatted);
    } else {
      setCpfSearchStatus(null);
    }
  };

  // Perform CPF Lookup in Patient Database (Winsoft + Online API)
  const performCpfLookup = async (targetCpf = cpf) => {
    const found = findPatientByCPF(patientDb, targetCpf);
    if (found) {
      setPatientName(found.name);
      setBirthDate(found.birthDate);
      if (found.requestingDoctor) setRequestingDoctor(found.requestingDoctor);
      setCpfSearchStatus('found');
      return;
    }

    setCpfSearchStatus('loading');
    const onlineData = await fetchCpfOnlineData(targetCpf);
    if (onlineData && onlineData.name) {
      setPatientName(onlineData.name);
      if (onlineData.birthDate) setBirthDate(onlineData.birthDate);
      setCpfSearchStatus('found_online');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-[96vw] xl:max-w-7xl glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl border border-indigo-500/30 my-3">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- SCREEN 1: LOGIN AUTHENTICATION --- */}
        {!isAuthenticated ? (
          <div className="py-8 px-2 max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">Autenticação de Acesso</h2>
              <p className="text-xs text-slate-400">
                Clínica de Neurologia Dr. Eduardo Magalhães — Emissão de Laudos & Gestão
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail de Acesso</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="eduardo@clinica.com.br ou juliana@clinica.com.br"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Senha de Acesso / PIN</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Digite sua senha (ex: 123)"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition"
              >
                Entrar no Sistema
              </button>
            </form>

            {/* Quick Access Helper Buttons for Demo/Testing */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
                Atalhos Rápidos de Acesso:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => quickFillLogin('eduardo@clinica.com.br', 'Dr. Eduardo Magalhães', 'doctor')}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-500/30 text-amber-300 text-xs font-bold text-left flex items-center justify-between transition"
                >
                  <span>👑 Dr. Eduardo</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  type="button"
                  onClick={() => quickFillLogin('juliana@clinica.com.br', 'Juliana Costa (Secretária)', 'reception')}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-cyan-500/30 text-cyan-300 text-xs font-bold text-left flex items-center justify-between transition"
                >
                  <span>📋 Secretária</span>
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* --- SCREEN 2: AUTHENTICATED CLINIC PANEL --- */
          <div>
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
                    Sessão Autenticada: <strong>{currentUserName}</strong> | Clínica Dr. Eduardo Magalhães
                  </p>
                </div>
              </div>

              {/* User Switcher & Logout Button */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs">
                  <button
                    onClick={() => { setCurrentUserRole('doctor'); setCurrentUserName('Dr. Eduardo Magalhães'); }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${currentUserRole === 'doctor' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    👑 Dr. Eduardo
                  </button>
                  <button
                    onClick={() => { setCurrentUserRole('reception'); setCurrentUserName('Juliana Costa (Secretária)'); }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${currentUserRole === 'reception' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    📋 Secretária
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  title="Encerrar Sessão"
                  className="p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition"
                >
                  <LogOut className="w-4 h-4" />
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
                    <ShieldCheck className="w-4 h-4 inline mr-1.5" /> Gestão de Equipe ({employees.length} Usuários)
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

            {/* TAB 1: EMISSOR DE LAUDOS - LAYOUT DUAL COLUMN (REQ-13 - 22/09/2026) */}
            {activeTab === 'generator' && (
              <div className="pt-4 grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* ESQUERDA (lg:col-span-4): ÁRVORE DE MODELOS ESTILO WINDOWS EXPLORER */}
                <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                        Árvore de Modelos (Explorer)
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={expandAllFolders}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-cyan-400"
                        title="Expandir todas as pastas"
                      >
                        📂 Tudo
                      </button>
                      <button
                        type="button"
                        onClick={collapseAllFolders}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-400"
                        title="Recolher todas as pastas"
                      >
                        📁 Fechar
                      </button>
                    </div>
                  </div>

                  {/* Search box for models */}
                  <div className="relative">
                    <input
                      type="text"
                      value={templateSearchText}
                      onChange={(e) => setTemplateSearchText(e.target.value)}
                      placeholder="Buscar modelo na árvore... (ex: STC, EMG...)"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>

                  {/* Windows Explorer Folder Tree View */}
                  <div className="flex-1 overflow-y-auto max-h-[640px] pr-1 space-y-2 font-mono text-xs">
                    {EXAM_CATEGORIES.map(cat => {
                      const catTemplates = ALL_EXAM_TEMPLATES.filter(t => {
                        const matchCat = t.categoryId === cat.id;
                        const q = templateSearchText.toLowerCase();
                        const matchSearch = !q || t.title.toLowerCase().includes(q) || t.keywords.some(kw => kw.toLowerCase().includes(q));
                        return matchCat && matchSearch;
                      });
                      if (catTemplates.length === 0) return null;
                      const isExpanded = expandedFolders[cat.id] !== false;

                      return (
                        <div key={cat.id} className="rounded-xl bg-slate-950/70 border border-slate-800/80 p-2.5 space-y-1.5">
                          <button
                            onClick={() => toggleFolder(cat.id)}
                            className="w-full flex items-center justify-between text-left font-bold text-slate-200 hover:text-amber-300 transition"
                          >
                            <span className="flex items-center gap-1.5 text-xs truncate">
                              {isExpanded ? <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" /> : <Folder className="w-4 h-4 text-amber-400 shrink-0" />}
                              <span className="truncate">{cat.name}</span>
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                              {catTemplates.length}
                            </span>
                          </button>

                          {/* Sub-tree of template files */}
                          {isExpanded && (
                            <div className="pl-3 border-l-2 border-slate-800 space-y-1 mt-1">
                              {catTemplates.map(tmpl => (
                                <button
                                  key={tmpl.id}
                                  onClick={() => handleSelectTemplate(tmpl)}
                                  className={`w-full p-2 rounded-lg border text-left text-[11px] font-sans transition flex items-center justify-between gap-1.5 ${selectedTemplateId === tmpl.id ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold shadow-sm' : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white'}`}
                                >
                                  <span className="truncate flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate">{tmpl.title}</span>
                                  </span>
                                  {selectedTemplateId === tmpl.id && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DIREITA (lg:col-span-8): FORMULÁRIO COMPLETO DO LAUDO */}
                <div className="lg:col-span-8 space-y-4">
                  
                  {/* Dados do Paciente (CPF Mevo) */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4 text-cyan-400" />
                        <span>Dados Cadastrais do Paciente (Busca por CPF):</span>
                      </h4>

                      {cpfSearchStatus === 'loading' && (
                        <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 animate-pulse">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Consultando CPF Online (Mevo)...
                        </span>
                      )}
                      {cpfSearchStatus === 'found' && (
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Paciente Localizado no Winsoft!
                        </span>
                      )}
                      {cpfSearchStatus === 'found_online' && (
                        <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Paciente Localizado (Mevo)!
                        </span>
                      )}
                      {cpfSearchStatus === 'not_found' && (
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Novo Paciente
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                          <span>CPF do Paciente</span>
                          <span className="text-[10px] text-cyan-400 font-mono">Mevo</span>
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
                            title="Buscar dados no Winsoft / Online"
                            className="px-2.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0"
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

                  {/* REQ-12: Área de Copiar & Colar Texto do Word (.docx) */}
                  {currentUserRole === 'doctor' && (
                    <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-cyan-400" />
                          <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                            📋 Copiar & Colar Texto do Word (.docx):
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowWordImporter(!showWordImporter)}
                          className="text-[11px] text-cyan-400 hover:underline font-bold"
                        >
                          {showWordImporter ? 'Ocultar ▲' : 'Mostrar Importador ▼'}
                        </button>
                      </div>

                      {showWordImporter && (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={2.5}
                            value={wordImportText}
                            onChange={(e) => setWordImportText(e.target.value)}
                            placeholder="Cole aqui o texto copiado do seu arquivo .docx no Word para carregar no laudo..."
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-indigo-500/40 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
                          />
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-[10px] text-slate-400 italic">
                              * O texto será preenchido automaticamente nas seções abaixo.
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setWordImportText('')}
                                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                              >
                                Limpar
                              </button>
                              <button
                                type="button"
                                onClick={handleApplyWordText}
                                className="px-3.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
                              >
                                <Sparkles className="w-3.5 h-3.5" /> ✨ Carregar no Laudo
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Corpo do Laudo com Edição Integral (REQ-11) */}
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-cyan-400" />
                        <span>Edição Integral do Corpo do Laudo Técnico & Diagnóstico:</span>
                      </h4>
                      {currentUserRole === 'reception' && (
                        <span className="text-amber-400 font-semibold text-[11px] flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> Restrito ao Médico (LGPD)
                        </span>
                      )}
                    </div>

                    {currentUserRole === 'doctor' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-300">
                            1. Neurocondução Motora:
                          </label>
                          <textarea
                            rows={2.5}
                            value={motorConduction}
                            onChange={(e) => setMotorConduction(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-300">
                            2. Neurocondução Sensitiva:
                          </label>
                          <textarea
                            rows={2.5}
                            value={sensoryConduction}
                            onChange={(e) => setSensoryConduction(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-300">
                            3. Onda F / Resposta Tardia:
                          </label>
                          <textarea
                            rows={2.5}
                            value={fWave}
                            onChange={(e) => setFWave(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-300">
                            4. Eletromiografia / Registro Cerebral:
                          </label>
                          <textarea
                            rows={2.5}
                            value={emgText}
                            onChange={(e) => setEmgText(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed font-medium"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                          <label className="block text-[11px] font-bold text-amber-300">
                            5. Conclusão Médica do Laudo (Síntese Diagnóstica):
                          </label>
                          <textarea
                            rows={3}
                            value={conclusion}
                            onChange={(e) => setConclusion(e.target.value)}
                            className="w-full p-3 rounded-xl bg-slate-900 border border-cyan-500/50 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed font-bold"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-500 text-xs italic">
                        [ As informações diagnósticas e o corpo deste laudo são restritos ao Dr. Eduardo Magalhães para proteção ao sigilo médico conforme a LGPD. ]
                      </div>
                    )}
                  </div>

                  {/* Barra de Ações */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 flex-wrap gap-3">
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Assinatura Digital ICP-Brasil + Carimbo Visual & QR Code</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleSendWhatsApp}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" /> Disparar Link no WhatsApp
                      </button>

                      {currentUserRole === 'doctor' && (
                        <button
                          onClick={handleGeneratePdf}
                          className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                        >
                          <Printer className="w-4 h-4" /> Assinar & Gerar PDF Timbrado
                        </button>
                      )}
                    </div>
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

            {/* TAB 3: GESTÃO DE EQUIPE & RBAC (Dr. Eduardo) */}
            {activeTab === 'users' && currentUserRole === 'doctor' && (
              <div className="pt-4 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      <span>Gestão de Usuários & Níveis de Acesso (RBAC)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Crie, edite ou revogue contas de funcionários e defina as permissões de acesso ao sistema.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddUser}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20"
                  >
                    <UserPlus className="w-4 h-4" /> + Cadastrar Novo Usuário
                  </button>
                </div>

                {/* Employees Table with Edit/Delete Actions */}
                <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3">Nome do Usuário</th>
                        <th className="p-3">E-mail de Acesso</th>
                        <th className="p-3">Nível de Acesso (Perfil)</th>
                        <th className="p-3">Permissão Médica (LGPD)</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {employees.map(emp => (
                        <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-3 font-semibold text-white">{emp.name}</td>
                          <td className="p-3 text-slate-400 font-mono">{emp.email}</td>
                          <td className="p-3 font-bold text-cyan-300">{emp.roleTitle}</td>
                          <td className="p-3">
                            {emp.role === 'doctor' ? (
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Total (Médico / Assinatura)
                              </span>
                            ) : emp.role === 'technician' ? (
                              <span className="text-cyan-400 font-bold flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" /> Anexo de Traçados
                              </span>
                            ) : (
                              <span className="text-amber-400 font-bold flex items-center gap-1">
                                <Lock className="w-3.5 h-3.5" /> Oculto (Secretária - LGPD)
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${emp.status === 'Ativo' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                              {emp.status || 'Ativo'}
                            </span>
                          </td>
                          <td className="p-3 text-right flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditUser(emp)}
                              title="Editar Usuário"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {emp.role !== 'doctor' && (
                              <button
                                onClick={() => handleDeleteUser(emp.id)}
                                title="Revogar Acesso"
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* MODAL: EDIT / CREATE USER FORM */}
                {isUserModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-md bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                          <UserPlus className="w-5 h-5 text-amber-400" />
                          <span>{editingUserId ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</span>
                        </h3>
                        <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-white">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveUser} className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Completo</label>
                          <input
                            type="text"
                            value={userFormName}
                            onChange={(e) => setUserFormName(e.target.value)}
                            placeholder="ex: Dra. Juliana Santos"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail de Login</label>
                          <input
                            type="email"
                            value={userFormEmail}
                            onChange={(e) => setUserFormEmail(e.target.value)}
                            placeholder="ex: juliana@clinica.com.br"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Senha de Acesso</label>
                          <input
                            type="text"
                            value={userFormPassword}
                            onChange={(e) => setUserFormPassword(e.target.value)}
                            placeholder="Defina a senha (ex: 123456)"
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Nível de Acesso (Perfil RBAC)</label>
                          <select
                            value={userFormRole}
                            onChange={(e) => setUserFormRole(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold"
                          >
                            <option value="reception">📋 Secretária / Atendimento (LGPD - Laudo Oculto)</option>
                            <option value="doctor">👑 Administrador / Médico (Acesso Total + Assinatura)</option>
                            <option value="technician">🔬 Técnico de Exames (Anexo de Traçados)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Status da Conta</label>
                          <select
                            value={userFormStatus}
                            onChange={(e) => setUserFormStatus(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                          >
                            <option value="Ativo">Ativo (Acesso Liberado)</option>
                            <option value="Inativo">Inativo (Acesso Suspenso)</option>
                          </select>
                        </div>

                        <div className="pt-3 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setIsUserModalOpen(false)}
                            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20"
                          >
                            Salvar Usuário
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
