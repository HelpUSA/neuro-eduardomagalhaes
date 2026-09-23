import React, { useState } from 'react';
import { 
  X, Search, PlusCircle, FileText, Send, UserPlus, ShieldCheck, Lock, 
  Sparkles, Check, Edit3, Trash2, Printer, Eye, ChevronRight, ChevronDown, 
  Folder, FolderOpen, Paperclip, AlertTriangle, Shield, User, Key, RefreshCw, Upload, Database, LogOut, CheckCircle2,
  Maximize2, Minimize2, Bold, Italic, Underline, Save, History, Type
} from 'lucide-react';
import jsPDF from 'jspdf';
import { ALL_EXAM_TEMPLATES, EXAM_CATEGORIES } from '../data/eegTemplates';
import { INITIAL_PATIENT_DATABASE, formatCPF, findPatientByCPF, fetchCpfOnlineData } from '../data/patientDatabase';

export const MedicalLaudosApp = ({ isOpen, onClose, t, lang }) => {
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'search' | 'users' | 'winsoft'
  
  const labels = t?.doctorPanel || {
    modalTitle: "Painel do Consultório",
    doctorBadge: "👑 Médico (Dr. Eduardo)",
    receptionBadge: "📋 Secretária (Recepção)",
    tabLaudos: "Emissão de Laudos",
    tabWinsoft: "Base Winsoft",
    tabUsers: "Gestão de Equipe",
    hideTreeBtn: "📂 Ocultar Árvore (Maximizar Espaço)",
    showTreeBtn: "📂 Mostrar Árvore de Modelos",
    treeTitle: "Árvore de Modelos",
    editorTitle: "Edição Integral do Corpo do Laudo Técnico:",
    formatBold: "Negrito",
    formatItalic: "Itálico",
    formatUnderline: "Sublinhado",
    saveModelBtn: "💾 Salvar como Novo Modelo",
    clearBtn: "Limpar",
    whatsappBtn: "Disparar Link no WhatsApp",
    signPdfBtn: "Assinar & Gerar PDF Timbrado"
  };

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
  const [selectedPatientExams, setSelectedPatientExams] = useState(INITIAL_PATIENT_DATABASE[0].examHistory || []);
  const [isExamHistoryOpen, setIsExamHistoryOpen] = useState(false);

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

  // Collapsible Explorer Tree & Full-Width Expanded Editor State
  const [isTreeVisible, setIsTreeVisible] = useState(true);

  // Rich Text Formatting & Editor Font Size State
  const [editorFontSize, setEditorFontSize] = useState(13);

  // Custom Templates State
  const [customTemplates, setCustomTemplates] = useState([]);
  const [deletedTemplateIds, setDeletedTemplateIds] = useState([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateFormTitle, setTemplateFormTitle] = useState('');
  const [templateFormCategory, setTemplateFormCategory] = useState('enmg_stc');
  const [templateFormText, setTemplateFormText] = useState('');

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

  const [editorMode, setEditorMode] = useState('unified');
  const [fullReportText, setFullReportText] = useState(
`ELETRONEUROMIOGRAFIA DOS MEMBROS SUPERIORES

Realizada eletroneuromiografia de membros superiores.
A neurocondução motora foi realizada em nervos medianos e ulnares. Os potenciais de ação motores apresentaram velocidades de condução normais, latência distal limítrofe e amplitudes conservadas.
A neurocondução sensitiva foi realizada em nervos medianos, ulnares e radiais. Em nervos medianos observamos potenciais de ação com latências prolongadas, velocidades de condução diminuídas e amplitudes normais.
A onda F foi pesquisada em nervos medianos e ulnares, apresentando latências mínimas preservadas.
A eletromiografia realizada com agulha monopolar exibiu potenciais de ação de unidades motoras com recrutamento normal e ausência de atividade espontânea.

CONCLUSÃO:
Exame compatível com neuropatia do mediano ao nível do carpo, com comprometimento parcial de fibras sensitivas, de caráter desmielinizante (grau 2), bilateral.`
  );

  const [wordImportText, setWordImportText] = useState('');
  const [showWordImporter, setShowWordImporter] = useState(false);
  const [attachedTracingsFile, setAttachedTracingsFile] = useState('Graficos_Aparelho_ENMG_Clelia.pdf');

  const allAvailableTemplates = [...ALL_EXAM_TEMPLATES, ...customTemplates].filter(t => !deletedTemplateIds.includes(t.id));

  const handleApplyWordText = () => {
    if (!wordImportText.trim()) {
      alert("Por favor, cole ou digite o texto do seu modelo do Word no campo antes de importar.");
      return;
    }
    const txt = wordImportText;
    setFullReportText(txt);
    setConclusion(txt);

    if (txt.toLowerCase().includes('conclusão') || txt.toLowerCase().includes('conclusao')) {
      const parts = txt.split(/conclusã[o|õ]:?|conclusao:?/i);
      if (parts.length > 1) {
        if (parts[0].trim()) setMotorConduction(parts[0].trim());
        setConclusion(parts[1].trim());
      }
    }
    alert("✨ Texto do Word importado com sucesso!");
  };

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Dr. Eduardo Magalhães', email: 'eduardo@clinica.com.br', password: '123', role: 'doctor', roleTitle: '👑 Administrador / Médico', status: 'Ativo' },
    { id: 2, name: 'Juliana Costa', email: 'juliana@clinica.com.br', password: '123', role: 'reception', roleTitle: '📋 Secretária / Atendimento', status: 'Ativo' },
    { id: 3, name: 'Fernanda Souza', email: 'fernanda@clinica.com.br', password: '123', role: 'reception', roleTitle: '📋 Secretária / Atendimento', status: 'Ativo' }
  ]);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userFormName, setUserFormName] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormPassword, setUserFormPassword] = useState('');
  const [userFormRole, setUserFormRole] = useState('reception');
  const [userFormStatus, setUserFormStatus] = useState('Ativo');

  if (!isOpen) return null;

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

  const quickFillLogin = (email, roleName, roleType) => {
    setLoginEmail(email);
    setLoginPassword('123');
    setCurrentUserRole(roleType);
    setCurrentUserName(roleName);
    setIsAuthenticated(true);
    setLoginError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginError('');
  };

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

  const handleCpfChange = (val) => {
    const formatted = formatCPF(val);
    setCpf(formatted);

    if (formatted.length === 14) {
      performCpfLookup(formatted);
    } else {
      setCpfSearchStatus(null);
      setSelectedPatientExams([]);
    }
  };

  const performCpfLookup = async (targetCpf = cpf) => {
    const found = findPatientByCPF(patientDb, targetCpf);
    if (found) {
      setPatientName(found.name);
      setBirthDate(found.birthDate);
      if (found.requestingDoctor) setRequestingDoctor(found.requestingDoctor);
      setCpfSearchStatus('found');
      setSelectedPatientExams(found.examHistory || []);
      return;
    }

    setCpfSearchStatus('loading');
    const onlineData = await fetchCpfOnlineData(targetCpf);
    if (onlineData && onlineData.name) {
      setPatientName(onlineData.name);
      if (onlineData.birthDate) setBirthDate(onlineData.birthDate);
      setCpfSearchStatus('found_online');
      setSelectedPatientExams([]);
    } else {
      setCpfSearchStatus('not_found');
      setSelectedPatientExams([]);
    }
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplateId(template.id);
    if (template.motorConduction) setMotorConduction(template.motorConduction);
    if (template.sensoryConduction) setSensoryConduction(template.sensoryConduction);
    if (template.fWave) setFWave(template.fWave);
    if (template.emgText) setEmgText(template.emgText);
    if (template.conclusion) setConclusion(template.conclusion);

    let cleanText = template.fullText;
    if (!cleanText) {
      const parts = [
        template.motorConduction,
        template.sensoryConduction,
        template.fWave,
        template.emgText,
        template.conclusion
      ].filter(Boolean);
      cleanText = parts.join('\n\n');
    }
    
    setFullReportText(cleanText);
  };

  const handleInsertFormat = (tagStart, tagEnd = tagStart) => {
    const textarea = document.getElementById('unified-editor-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = fullReportText.substring(start, end) || 'texto';
    const replacement = `${tagStart}${selectedText}${tagEnd}`;
    const newText = fullReportText.substring(0, start) + replacement + fullReportText.substring(end);
    setFullReportText(newText);
  };

  const handleOpenAddTemplate = () => {
    setEditingTemplate(null);
    setTemplateFormTitle('');
    setTemplateFormCategory(EXAM_CATEGORIES[0]?.id || 'enmg_stc');
    setTemplateFormText(fullReportText || '');
    setIsTemplateModalOpen(true);
  };

  const handleOpenEditTemplate = (e, tmpl) => {
    e.stopPropagation();
    setEditingTemplate(tmpl);
    setTemplateFormTitle(tmpl.title);
    setTemplateFormCategory(tmpl.categoryId || 'enmg_stc');
    setTemplateFormText(tmpl.fullText || tmpl.emgText || tmpl.conclusion || '');
    setIsTemplateModalOpen(true);
  };

  const handleDeleteTemplate = (e, tmplId) => {
    e.stopPropagation();
    if (window.confirm("Deseja realmente remover este modelo da árvore de templates?")) {
      setDeletedTemplateIds(prev => [...prev, tmplId]);
      alert("Modelo removido da árvore com sucesso!");
    }
  };

  const handleSaveTemplateForm = (e) => {
    e.preventDefault();
    if (!templateFormTitle.trim() || !templateFormText.trim()) {
      alert("Preencha o título e o texto do modelo.");
      return;
    }

    if (editingTemplate) {
      setCustomTemplates(prev => prev.map(t => t.id === editingTemplate.id ? {
        ...t,
        title: templateFormTitle,
        categoryId: templateFormCategory,
        fullText: templateFormText,
        conclusion: templateFormText
      } : t));
      alert("Modelo atualizado com sucesso!");
    } else {
      const newTmpl = {
        id: `custom_${Date.now()}`,
        categoryId: templateFormCategory,
        categoryName: EXAM_CATEGORIES.find(c => c.id === templateFormCategory)?.name || 'Customizados',
        folderName: 'MODELOS PERSONALIZADOS',
        title: templateFormTitle,
        keywords: [templateFormTitle],
        fullText: templateFormText,
        conclusion: templateFormText
      };
      setCustomTemplates(prev => [...prev, newTmpl]);
      alert("✨ Novo modelo salvo com sucesso na árvore de templates!");
    }

    setIsTemplateModalOpen(false);
  };

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
      if (!text) return;
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

    if (editorMode === 'unified') {
      addBlock('CORPO TÉCNICO & LAUDO DIAGNÓSTICO:', fullReportText);
    } else {
      addBlock('NEUROCONDUÇÃO MOTORA:', motorConduction);
      addBlock('NEUROCONDUÇÃO SENSITIVA:', sensoryConduction);
      addBlock('ONDA F:', fWave);
      addBlock('ELETROMIOGRAFIA / REGISTRO CEREBRAL:', emgText);

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
    }

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

    doc.save(`Laudo_Oficial_${patientName.replace(/\s+/g, '_')}.pdf`);
  };

  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá ${patientName}! Seu laudo de exame foi concluído pela Clínica Dr. Eduardo Magalhães. Você pode baixar seu laudo e gráficos de exame com segurança no nosso portal usando seu CPF.`
    );
    window.open(`https://wa.me/556932235805?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-[96vw] xl:max-w-7xl glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl border border-indigo-500/30 my-3 max-h-[92vh] flex flex-col overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          <div className="py-8 px-2 max-w-md mx-auto space-y-6 overflow-y-auto">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">{labels.modalTitle}</h2>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail de Acesso / Email</label>
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
                <label className="block text-xs font-semibold text-slate-300 mb-1">Senha / Password</label>
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
                Entrar no Sistema / Login
              </button>
            </form>

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
                  <span>{labels.doctorBadge}</span>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
                <button
                  type="button"
                  onClick={() => quickFillLogin('juliana@clinica.com.br', 'Juliana Costa (Secretária)', 'reception')}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-cyan-500/30 text-cyan-300 text-xs font-bold text-left flex items-center justify-between transition"
                >
                  <span>{labels.receptionBadge}</span>
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                    <span>{labels.modalTitle}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${currentUserRole === 'doctor' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>
                      {currentUserRole === 'doctor' ? labels.doctorBadge : labels.receptionBadge}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Sessão Autenticada: <strong>{currentUserName}</strong> | Clínica Dr. Eduardo Magalhães
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs">
                  <button
                    onClick={() => { setCurrentUserRole('doctor'); setCurrentUserName('Dr. Eduardo Magalhães'); }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${currentUserRole === 'doctor' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {labels.doctorBadge}
                  </button>
                  <button
                    onClick={() => { setCurrentUserRole('reception'); setCurrentUserName('Juliana Costa (Secretária)'); }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition ${currentUserRole === 'reception' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {labels.receptionBadge}
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

            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 flex-wrap gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('generator')}
                  className={`px-4 py-2 rounded-xl transition ${activeTab === 'generator' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
                >
                  <FileText className="w-4 h-4 inline mr-1.5" /> {labels.tabLaudos}
                </button>
                <button
                  onClick={() => setActiveTab('winsoft')}
                  className={`px-4 py-2 rounded-xl transition ${activeTab === 'winsoft' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
                >
                  <Database className="w-4 h-4 inline mr-1.5" /> {labels.tabWinsoft} ({patientDb.length})
                </button>
                {currentUserRole === 'doctor' && (
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-xl transition ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
                  >
                    <ShieldCheck className="w-4 h-4 inline mr-1.5" /> {labels.tabUsers} ({employees.length})
                  </button>
                )}
              </div>

              {currentUserRole === 'reception' && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Modo Recepção: Conclusões Médicas Ocultas (LGPD)</span>
                </div>
              )}
            </div>

            {activeTab === 'generator' && (
              <div className="flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {isTreeVisible && (
                    <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="w-4 h-4 text-amber-400" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                            {labels.treeTitle}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={expandAllFolders}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-cyan-400"
                          >
                            📂 Tudo
                          </button>
                          <button
                            type="button"
                            onClick={collapseAllFolders}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-400"
                          >
                            📁 Fechar
                          </button>
                          {currentUserRole === 'doctor' && (
                            <button
                              type="button"
                              onClick={handleOpenAddTemplate}
                              className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-500/40 flex items-center gap-1"
                            >
                              <PlusCircle className="w-3 h-3" /> +Novo
                            </button>
                          )}
                        </div>
                      </div>

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

                      <div className="flex-1 overflow-y-auto max-h-[580px] pr-1 space-y-2 font-mono text-xs">
                        {[...EXAM_CATEGORIES]
                          .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
                          .map(cat => {
                            const catTemplates = allAvailableTemplates
                              .filter(t => {
                                const matchCat = t.categoryId === cat.id;
                                const q = templateSearchText.toLowerCase();
                                const matchSearch = !q || t.title.toLowerCase().includes(q) || (t.keywords && t.keywords.some(kw => kw.toLowerCase().includes(q)));
                                return matchCat && matchSearch;
                              })
                              .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));

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

                                {isExpanded && (
                                  <div className="pl-3 border-l-2 border-slate-800 space-y-1 mt-1">
                                    {catTemplates.map(tmpl => (
                                      <div
                                        key={tmpl.id}
                                        onClick={() => handleSelectTemplate(tmpl)}
                                        className={`w-full p-2 rounded-lg border text-left text-[11px] font-sans transition flex items-center justify-between gap-1 cursor-pointer group ${selectedTemplateId === tmpl.id ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold shadow-sm' : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white'}`}
                                      >
                                        <span className="truncate flex items-center gap-1.5">
                                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                          <span className="truncate">{tmpl.title}</span>
                                        </span>

                                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                                          {currentUserRole === 'doctor' && (
                                            <>
                                              <button
                                                type="button"
                                                onClick={(e) => handleOpenEditTemplate(e, tmpl)}
                                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-300"
                                                title="Editar Modelo"
                                              >
                                                <Edit3 className="w-3 h-3" />
                                              </button>
                                              <button
                                                type="button"
                                                onClick={(e) => handleDeleteTemplate(e, tmpl.id)}
                                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                                                title="Excluir Modelo"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </>
                                          )}
                                          {selectedTemplateId === tmpl.id && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  <div className={`${isTreeVisible ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4 transition-all duration-300`}>
                    <div className="flex items-center justify-between bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setIsTreeVisible(!isTreeVisible)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-bold flex items-center gap-2 transition"
                      >
                        {isTreeVisible ? (
                          <>
                            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>{labels.hideTreeBtn}</span>
                          </>
                        ) : (
                          <>
                            <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{labels.showTreeBtn}</span>
                          </>
                        )}
                      </button>

                      <span className="text-[11px] text-slate-400 font-medium">
                        {isTreeVisible ? 'Árvore Visível à Esquerda' : '✨ Área de Edição Expandida em 100% da Tela'}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                          <User className="w-4 h-4 text-cyan-400" />
                          <span>Dados Cadastrais do Paciente (Busca por CPF):</span>
                        </h4>

                        <div className="flex items-center gap-2">
                          {selectedPatientExams.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setIsExamHistoryOpen(true)}
                              className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold flex items-center gap-1.5 hover:bg-indigo-500/30 transition shadow-sm"
                            >
                              <History className="w-3.5 h-3.5 text-indigo-400" /> 📜 Exames Anteriores ({selectedPatientExams.length})
                            </button>
                          )}

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
                        </div>
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
                    </div>

                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-cyan-400" />
                          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                            {labels.editorTitle}
                          </h4>
                        </div>

                        {currentUserRole === 'doctor' && (
                          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
                            <button
                              type="button"
                              onClick={() => setEditorMode('unified')}
                              className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${editorMode === 'unified' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                            >
                              📝 Campo Único (Texto Integral)
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditorMode('split')}
                              className={`px-3 py-1 rounded-lg transition flex items-center gap-1 ${editorMode === 'split' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
                            >
                              📑 Sub-seções Separadas ENMG
                            </button>
                          </div>
                        )}
                      </div>

                      {currentUserRole === 'doctor' ? (
                        editorMode === 'unified' ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800 flex-wrap gap-2 text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                                  Formatação:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleInsertFormat('**', '**')}
                                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs"
                                  title={labels.formatBold}
                                >
                                  <Bold className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleInsertFormat('*', '*')}
                                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white italic text-xs"
                                  title={labels.formatItalic}
                                >
                                  <Italic className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleInsertFormat('<u>', '</u>')}
                                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white underline text-xs"
                                  title={labels.formatUnderline}
                                >
                                  <Underline className="w-3.5 h-3.5" />
                                </button>

                                <div className="h-4 w-px bg-slate-800 mx-1" />

                                <span className="text-[10px] font-bold text-slate-400">Fonte:</span>
                                <button
                                  type="button"
                                  onClick={() => setEditorFontSize(prev => Math.max(11, prev - 1))}
                                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold text-xs"
                                >
                                  A-
                                </button>
                                <span className="text-xs font-mono font-bold text-cyan-400 px-1">{editorFontSize}px</span>
                                <button
                                  type="button"
                                  onClick={() => setEditorFontSize(prev => Math.min(18, prev + 1))}
                                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold text-xs"
                                >
                                  A+
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={handleOpenAddTemplate}
                                  className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1.5"
                                >
                                  <Save className="w-3.5 h-3.5 text-amber-400" /> {labels.saveModelBtn}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFullReportText('')}
                                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 text-[11px] font-bold"
                                >
                                  {labels.clearBtn}
                                </button>
                              </div>
                            </div>

                            <textarea
                              id="unified-editor-textarea"
                              rows={isTreeVisible ? 14 : 18}
                              value={fullReportText}
                              onChange={(e) => setFullReportText(e.target.value)}
                              placeholder="Edite aqui todo o texto do laudo..."
                              style={{ fontSize: `${editorFontSize}px`, whiteSpace: 'pre-wrap' }}
                              className="w-full p-4 rounded-xl bg-slate-950 border border-cyan-500/40 text-white font-mono focus:outline-none focus:border-cyan-400 leading-relaxed shadow-inner"
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-slate-300">1. Neurocondução Motora:</label>
                              <textarea
                                rows={3}
                                value={motorConduction}
                                onChange={(e) => setMotorConduction(e.target.value)}
                                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed font-medium"
                                style={{ whiteSpace: 'pre-wrap' }}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-slate-300">2. Neurocondução Sensitiva:</label>
                              <textarea
                                rows={3}
                                value={sensoryConduction}
                                onChange={(e) => setSensoryConduction(e.target.value)}
                                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed font-medium"
                                style={{ whiteSpace: 'pre-wrap' }}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-slate-300">3. Onda F / Resposta Tardia:</label>
                              <textarea
                                rows={3}
                                value={fWave}
                                onChange={(e) => setFWave(e.target.value)}
                                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed font-medium"
                                style={{ whiteSpace: 'pre-wrap' }}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[11px] font-bold text-slate-300">4. Eletromiografia / Registro:</label>
                              <textarea
                                rows={3}
                                value={emgText}
                                onChange={(e) => setEmgText(e.target.value)}
                                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed font-medium"
                                style={{ whiteSpace: 'pre-wrap' }}
                              />
                            </div>

                            <div className="md:col-span-2 space-y-1">
                              <label className="block text-[11px] font-bold text-amber-300">5. Conclusão Médica do Laudo:</label>
                              <textarea
                                rows={3}
                                value={conclusion}
                                onChange={(e) => setConclusion(e.target.value)}
                                className="w-full p-3 rounded-xl bg-slate-900 border border-cyan-500/50 text-white text-xs focus:outline-none focus:border-cyan-400 leading-relaxed font-bold"
                                style={{ whiteSpace: 'pre-wrap' }}
                              />
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-500 text-xs italic">
                          [ As informações diagnósticas e o corpo deste laudo são restritos ao Dr. Eduardo Magalhães para proteção ao sigilo médico conforme a LGPD. ]
                        </div>
                      )}
                    </div>

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
                          <Send className="w-4 h-4" /> {labels.whatsappBtn}
                        </button>

                        {currentUserRole === 'doctor' && (
                          <button
                            onClick={handleGeneratePdf}
                            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                          >
                            <Printer className="w-4 h-4" /> {labels.signPdfBtn}
                          </button>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
