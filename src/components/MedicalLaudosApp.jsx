import React, { useState, useEffect } from 'react';
import { 
  X, Search, PlusCircle, FileText, Send, UserPlus, ShieldCheck, Lock, 
  Sparkles, Check, Edit3, Trash2, Printer, Eye, ChevronRight, ChevronDown, ChevronLeft,
  Folder, FolderOpen, Paperclip, AlertTriangle, Shield, User, Key, RefreshCw, Upload, Database, LogOut, CheckCircle2,
  Maximize2, Minimize2, Bold, Italic, Underline, Save, History, Type, Undo, Redo, RotateCcw, RotateCw, UserCheck, ShieldAlert, Calendar,
  ArrowUpDown, ArrowUp, ArrowDown, Filter, Phone, MapPin, Grid, List, Copy, ExternalLink, Plus, Edit2, Trash
} from 'lucide-react';
import jsPDF from 'jspdf';
import { ALL_EXAM_TEMPLATES, EXAM_CATEGORIES } from '../data/eegTemplates';
import { INITIAL_PATIENT_DATABASE, formatCPF, findPatientByCPF, fetchCpfOnlineData } from '../data/patientDatabase';

// Utility: Format input digits into DD/MM/YYYY mask
const formatDateMask = (value) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

// Utility: Convert YYYY-MM-DD from HTML5 date picker to DD/MM/YYYY
const convertIsoToBrDate = (isoString) => {
  if (!isoString) return '';
  const parts = isoString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoString;
};

// Utility: Convert DD/MM/YYYY to YYYY-MM-DD for HTML5 date picker
const convertBrToIsoDate = (brDate) => {
  if (!brDate) return '';
  const parts = brDate.split('/');
  if (parts.length === 3 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
  }
  return '';
};

// Official Whitelisted Accounts
const AUTHORIZED_EMAILS = [
  { email: 'helpus.ecommerce@gmail.com', role: 'superadmin', name: 'HelpUS Tech (SuperAdmin)' },
  { email: 'eduardojcmagalhaes@gmail.com', role: 'doctor', name: 'Dr. Eduardo Magalhães (Gestor / Médico)' }
];

export const MedicalLaudosApp = ({ isOpen, onClose, t, lang, isStandalonePage: isStandaloneProp = false }) => {
  const isStandalonePage = isStandaloneProp || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('panel') === 'open');
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'search' | 'users' | 'winsoft'
  
  const labels = t?.doctorPanel || {
    modalTitle: "Painel do Consultório",
    doctorBadge: "👑 Médico (Dr. Eduardo)",
    receptionBadge: "📋 Secretária (Recepção)",
    tabLaudos: "Emissão de Laudos",
    tabWinsoft: "Base de Dados de Pacientes",
    tabUsers: "Gestão de Equipe",
    hideTreeBtn: "📂 Ocultar Árvore (Maximizar Espaço)",
    showTreeBtn: "📂 Mostrar Árvore de Modelos",
    treeTitle: "Árvore de Modelos",
    editorTitle: "Edição Integral do Corpo do Laudo Técnico:",
    formatBold: "Negrito",
    formatItalic: "Itálico",
    formatUnderline: "Sublinhado",
    undoBtn: "Desfazer (Ctrl+Z)",
    redoBtn: "Refazer (Ctrl+Y)",
    pdfFontPreview: "Tam. PDF",
    saveModelBtn: "💾 Salvar como Novo Modelo",
    clearBtn: "Limpar",
    whatsappBtn: "Disparar Link no WhatsApp",
    signPdfBtn: "Assinar & Gerar PDF Timbrado"
  };

  // Authentication State with localStorage session persistence across page reloads (F5)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      if (typeof window === 'undefined') return false;
      const savedSession = localStorage.getItem('neuro_auth_user');
      if (savedSession) {
        const sessionObj = JSON.parse(savedSession);
        if (sessionObj && sessionObj.email) {
          const cleanEmail = sessionObj.email.toLowerCase().trim();
          const authRecord = AUTHORIZED_EMAILS.find(a => a.email.toLowerCase() === cleanEmail);
          if (authRecord) return true;
        }
      }
    } catch (e) {
      console.error('Error restoring auth session:', e);
    }
    return false;
  });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // User Role State (Dr. Eduardo vs Secretária)
  const [currentUserRole, setCurrentUserRole] = useState(() => {
    try {
      if (typeof window === 'undefined') return 'doctor';
      const savedSession = localStorage.getItem('neuro_auth_user');
      if (savedSession) {
        const sessionObj = JSON.parse(savedSession);
        if (sessionObj && sessionObj.role) return sessionObj.role;
      }
    } catch (e) {}
    return 'doctor';
  });

  const [currentUserName, setCurrentUserName] = useState(() => {
    try {
      if (typeof window === 'undefined') return 'Dr. Eduardo Magalhães';
      const savedSession = localStorage.getItem('neuro_auth_user');
      if (savedSession) {
        const sessionObj = JSON.parse(savedSession);
        if (sessionObj && sessionObj.name) return sessionObj.name;
      }
    } catch (e) {}
    return 'Dr. Eduardo Magalhães';
  });

  // Patient Database State (Winsoft + New Patients) with localStorage persistence
  const [patientDb, setPatientDb] = useState(() => {
    try {
      const saved = localStorage.getItem('neuro_patient_database');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading patient database from localStorage:', e);
    }
    return INITIAL_PATIENT_DATABASE;
  });

  const savePatientDb = (newDb) => {
    setPatientDb(newDb);
    try {
      localStorage.setItem('neuro_patient_database', JSON.stringify(newDb));
    } catch (e) {
      console.error('Error saving patient database to localStorage:', e);
    }
  };

  const [cpfSearchStatus, setCpfSearchStatus] = useState(null); // null | 'found' | 'found_online' | 'not_found' | 'loading'
  const [selectedPatientExams, setSelectedPatientExams] = useState(INITIAL_PATIENT_DATABASE[0].examHistory || []);
  const [isExamHistoryOpen, setIsExamHistoryOpen] = useState(false);

  // Filter, Search & Sorting State for Patient Table View (Default 100 per page)
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [patientFilterType, setPatientFilterType] = useState('all'); // 'all' | 'has_cpf' | 'has_dob' | 'has_phone' | 'has_laudo'
  const [patientSortField, setPatientSortField] = useState('name'); // 'name' | 'cpf' | 'birthDate' | 'city' | 'hasLaudo'
  const [patientSortOrder, setPatientSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [patientPage, setPatientPage] = useState(1);
  const [patientPerPage, setPatientPerPage] = useState(100);
  const [patientViewMode, setPatientViewMode] = useState('table'); // 'table' | 'cards'
  const [copiedCpf, setCopiedCpf] = useState(null);

  // CRUD Modal State for Patients
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [editingPatientIndex, setEditingPatientIndex] = useState(null);
  const [patientFormData, setPatientFormData] = useState({
    name: '',
    cpf: '',
    birthDate: '',
    phone: '',
    city: 'Porto Velho',
    state: 'RO'
  });

  const handleOpenAddPatient = () => {
    setEditingPatientIndex(null);
    setPatientFormData({
      name: '',
      cpf: '',
      birthDate: '',
      phone: '',
      city: 'Porto Velho',
      state: 'RO'
    });
    setIsPatientModalOpen(true);
  };

  const handleOpenEditPatient = (patientObj) => {
    const idx = patientDb.findIndex(pt => pt === patientObj || (pt.cpf && pt.cpf === patientObj.cpf && pt.name === patientObj.name));
    setEditingPatientIndex(idx >= 0 ? idx : null);
    setPatientFormData({
      name: patientObj.name || '',
      cpf: patientObj.cpf || '',
      birthDate: patientObj.birthDate || '',
      phone: patientObj.phone || '',
      city: patientObj.city || 'Porto Velho',
      state: patientObj.state || 'RO'
    });
    setIsPatientModalOpen(true);
  };

  const handleSavePatient = (e) => {
    e.preventDefault();
    if (!patientFormData.name.trim()) {
      alert('Por favor, informe o Nome Completo do paciente.');
      return;
    }

    const cleanCpfDigits = (patientFormData.cpf || '').replace(/\D/g, '');
    const formattedCpfVal = cleanCpfDigits.length === 11 ? formatCPF(cleanCpfDigits) : patientFormData.cpf;

    const newRecord = {
      name: patientFormData.name.trim().toUpperCase(),
      cpf: formattedCpfVal,
      cpfClean: cleanCpfDigits,
      birthDate: patientFormData.birthDate,
      phone: patientFormData.phone,
      city: patientFormData.city,
      state: patientFormData.state,
      lastExam: editingPatientIndex !== null ? patientDb[editingPatientIndex]?.lastExam : undefined,
      examHistory: editingPatientIndex !== null ? patientDb[editingPatientIndex]?.examHistory : []
    };

    if (editingPatientIndex !== null && editingPatientIndex >= 0) {
      const updated = [...patientDb];
      updated[editingPatientIndex] = { ...updated[editingPatientIndex], ...newRecord };
      savePatientDb(updated);
    } else {
      savePatientDb([newRecord, ...patientDb]);
    }

    setIsPatientModalOpen(false);
  };

  const handleDeletePatient = (patientObj) => {
    if (window.confirm(`Tem certeza que deseja excluir o cadastro do paciente "${patientObj.name}"?`)) {
      const updated = patientDb.filter(pt => pt !== patientObj && !(pt.cpf === patientObj.cpf && pt.name === patientObj.name));
      savePatientDb(updated);
    }
  };

  // Helper to calculate approximate age from DD/MM/YYYY
  const calculateAge = (birthDateStr) => {
    if (!birthDateStr || !birthDateStr.includes('/')) return null;
    const parts = birthDateStr.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    const today = new Date();
    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - month;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
      age--;
    }
    return age >= 0 && age < 120 ? age : null;
  };

  // Reset page when filter/search/sort/perPage change
  useEffect(() => {
    setPatientPage(1);
  }, [patientSearchQuery, patientFilterType, patientSortField, patientSortOrder, patientPerPage]);

  // Filtered & Sorted Patient List
  const filteredPatients = React.useMemo(() => {
    return patientDb.filter(pt => {
      // 1. Universal Search (CPF, Nome, Data de Nascimento, Telefone, Cidade)
      if (patientSearchQuery.trim()) {
        const query = patientSearchQuery.trim().toLowerCase();
        const cleanQuery = query.replace(/\D/g, '');
        
        const nameMatch = (pt.name || '').toLowerCase().includes(query);
        const cpfMatch = (pt.cpf || '').toLowerCase().includes(query) || (cleanQuery.length > 0 && (pt.cpfClean || '').includes(cleanQuery));
        const dobMatch = (pt.birthDate || '').includes(query);
        const cityMatch = (pt.city || '').toLowerCase().includes(query);
        const phoneMatch = (pt.phone || '').includes(query);

        if (!nameMatch && !cpfMatch && !dobMatch && !cityMatch && !phoneMatch) {
          return false;
        }
      }

      // 2. Quick Filter Pills
      if (patientFilterType === 'has_cpf' && (!pt.cpf || pt.cpf.trim() === '')) return false;
      if (patientFilterType === 'has_dob' && (!pt.birthDate || pt.birthDate.trim() === '')) return false;
      if (patientFilterType === 'has_phone' && (!pt.phone || pt.phone.trim() === '')) return false;
      if (patientFilterType === 'has_laudo') {
        const count = (pt.examHistory?.length || 0) + (pt.lastExam ? 1 : 0);
        if (count === 0) return false;
      }

      return true;
    }).sort((a, b) => {
      let valueA = a[patientSortField] || '';
      let valueB = b[patientSortField] || '';

      if (patientSortField === 'birthDate') {
        const convertToKey = (dateStr) => {
          if (!dateStr || !dateStr.includes('/')) return '00000000';
          const parts = dateStr.split('/');
          if (parts.length === 3) return `${parts[2]}${parts[1].padStart(2, '0')}${parts[0].padStart(2, '0')}`;
          return '00000000';
        };
        valueA = convertToKey(valueA);
        valueB = convertToKey(valueB);
      } else if (patientSortField === 'hasLaudo') {
        valueA = (a.examHistory?.length || 0) + (a.lastExam ? 1 : 0);
        valueB = (b.examHistory?.length || 0) + (b.lastExam ? 1 : 0);
      }

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if (valueA < valueB) return patientSortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return patientSortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [patientDb, patientSearchQuery, patientFilterType, patientSortField, patientSortOrder]);

  const totalPages = Math.ceil(filteredPatients.length / patientPerPage) || 1;
  const paginatedPatients = React.useMemo(() => {
    const start = (patientPage - 1) * patientPerPage;
    return filteredPatients.slice(start, start + patientPerPage);
  }, [filteredPatients, patientPage, patientPerPage]);

  const handleSortToggle = (field) => {
    if (patientSortField === field) {
      setPatientSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setPatientSortField(field);
      setPatientSortOrder('asc');
    }
  };

  const handleCopyCpf = (cpfText) => {
    if (!cpfText) return;
    navigator.clipboard.writeText(cpfText);
    setCopiedCpf(cpfText);
    setTimeout(() => setCopiedCpf(null), 2000);
  };

  // Selected Category / Folder View / Template
  const [viewMode, setViewMode] = useState('folders'); // 'folders' | 'search'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});
  const [selectedTemplateId, setSelectedTemplateId] = useState('enmg_stc_grau2');
  const [templateSearchText, setTemplateSearchText] = useState('');

  // Collapsible Explorer Tree & Full-Width Expanded Editor State
  const [isTreeVisible, setIsTreeVisible] = useState(true);

  // Rich Text Formatting & Editor Font Size State
  const [editorFontSize, setEditorFontSize] = useState(15);

  // Custom Templates & Template Overrides State
  const [customTemplates, setCustomTemplates] = useState([]);
  const [templateOverrides, setTemplateOverrides] = useState({});
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
  const [reportIssueDate, setReportIssueDate] = useState(() => new Date().toLocaleDateString('pt-BR'));
  const [patientPhone, setPatientPhone] = useState('(69) 99234-5678');
  
  const [motorConduction, setMotorConduction] = useState('Realizada em nervos ulnares e medianos. Observamos amplitudes conservadas, com velocidades de condução normais, e latências distais limítrofes em medianos.');
  const [sensoryConduction, setSensoryConduction] = useState('Realizada em nervos ulnares, medianos e radiais. Em nervos medianos observamos potenciais de ação com latências prolongadas, velocidades de condução diminuídas e amplitudes normais.');
  const [fWave, setFWave] = useState('Pesquisada em nervos medianos e ulnares, com latências mínimas normais.');
  const [emgText, setEmgText] = useState('Realizada com agulha monopolar em músculos paracervicais, deltoide, bíceps, extensor comum dos dedos e primeiro interósseo dorsal.');
  const [conclusion, setConclusion] = useState('Exame compatível com neuropatia do mediano ao nível do carpo, com comprometimento parcial de fibras sensitivas, de caráter desmielinizante (grau 2), bilateral.');

  const [editorMode, setEditorMode] = useState('unified');

  const initialReportText = `ELETRONEUROMIOGRAFIA DOS MEMBROS SUPERIORES

Realizada eletroneuromiografia de membros superiores.
A neurocondução motora foi realizada em nervos medianos e ulnares. Os potenciais de ação motores apresentaram velocidades de condução normais, latência distal limítrofe e amplitudes conservadas.
A neurocondução sensitiva foi realizada em nervos medianos, ulnares e radiais. Em nervos medianos observamos potenciais de ação com latências prolongadas, velocidades de condução diminuídas e amplitudes normais.
A onda F foi pesquisada em nervos medianos e ulnares, apresentando latências mínimas preservadas.
A eletromiografia realizada com agulha monopolar exibiu potenciais de ação de unidades motoras com recrutamento normal e ausência de atividade espontânea.

CONCLUSÃO:
Exame compatível com neuropatia do mediano ao nível do carpo, com comprometimento parcial de fibras sensitivas, de caráter desmielinizante (grau 2), bilateral.`;

  const [fullReportText, setFullReportText] = useState(initialReportText);

  // Undo / Redo History Stack State
  const [reportHistory, setReportHistory] = useState([initialReportText]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateFullReportText = (newText, pushToHistory = true) => {
    setFullReportText(newText);
    if (pushToHistory) {
      setReportHistory(prev => {
        const next = prev.slice(0, historyIndex + 1);
        if (next[next.length - 1] !== newText) {
          next.push(newText);
          setHistoryIndex(next.length - 1);
          return next;
        }
        return prev;
      });
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setFullReportText(reportHistory[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < reportHistory.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setFullReportText(reportHistory[nextIdx]);
    }
  };

  const [wordImportText, setWordImportText] = useState('');
  const [showWordImporter, setShowWordImporter] = useState(false);
  const [attachedTracingsFile, setAttachedTracingsFile] = useState('Graficos_Aparelho_ENMG_Clelia.pdf');

  // Combined List of Templates with Overrides for In-Place Saving
  const allAvailableTemplates = [...ALL_EXAM_TEMPLATES, ...customTemplates]
    .filter(t => !deletedTemplateIds.includes(t.id))
    .map(t => {
      if (templateOverrides[t.id]) {
        return {
          ...t,
          fullText: templateOverrides[t.id],
          conclusion: templateOverrides[t.id]
        };
      }
      return t;
    });

  const handleUpdateCurrentTemplate = () => {
    if (!selectedTemplateId) {
      alert("Nenhum modelo está selecionado na árvore no momento.");
      return;
    }

    const currentTmpl = allAvailableTemplates.find(t => t.id === selectedTemplateId);
    const tmplName = currentTmpl ? currentTmpl.title : 'o modelo selecionado';

    const isCustom = customTemplates.some(t => t.id === selectedTemplateId);
    if (isCustom) {
      setCustomTemplates(prev => prev.map(t => t.id === selectedTemplateId ? {
        ...t,
        fullText: fullReportText,
        conclusion: fullReportText
      } : t));
    } else {
      setTemplateOverrides(prev => ({
        ...prev,
        [selectedTemplateId]: fullReportText
      }));
    }

    alert(`✨ Alterações salvas com sucesso no modelo "${tmplName}"!\nEle permanecerá na sua posição original na árvore de modelos com o novo texto.`);
  };

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

  // CAPTCHA Security & Google Auth State
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [isCaptchaLoading, setIsCaptchaLoading] = useState(false);

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Dr. Eduardo Magalhães', email: 'eduardojcmagalhaes@gmail.com', password: '123', role: 'doctor', roleTitle: '👑 Gerente do Site / Médico', status: 'Ativo' },
    { id: 2, name: 'HelpUS Technology', email: 'helpus.ecommerce@gmail.com', password: '123', role: 'superadmin', roleTitle: '⚡ SuperAdmin (Master)', status: 'Ativo' },
    { id: 3, name: 'Juliana Costa', email: 'juliana@clinica.com.br', password: '123', role: 'reception', roleTitle: '📋 Secretária / Atendimento', status: 'Ativo' },
    { id: 4, name: 'Fernanda Souza', email: 'fernanda@clinica.com.br', password: '123', role: 'reception', roleTitle: '📋 Secretária / Atendimento', status: 'Ativo' }
  ]);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userFormName, setUserFormName] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormPassword, setUserFormPassword] = useState('');
  const [userFormRole, setUserFormRole] = useState('reception');
  const [userFormStatus, setUserFormStatus] = useState('Ativo');

  const handleToggleCaptcha = () => {
    if (isCaptchaVerified) {
      setIsCaptchaVerified(false);
      return;
    }
    setIsCaptchaLoading(true);
    setTimeout(() => {
      setIsCaptchaLoading(false);
      setIsCaptchaVerified(true);
      setLoginError('');
    }, 600);
  };

  const processGoogleUserInfo = (googleUser, pendingTab = null) => {
    if (!googleUser || !googleUser.email) {
      if (pendingTab && !pendingTab.closed) pendingTab.close();
      return false;
    }
    const cleanEmail = googleUser.email.toLowerCase().trim();
    const authRecord = AUTHORIZED_EMAILS.find(a => a.email.toLowerCase() === cleanEmail);

    if (authRecord) {
      const userRole = authRecord.role;
      const userName = googleUser.name ? `${googleUser.name} (${cleanEmail})` : authRecord.name;

      const sessionObj = { email: cleanEmail, role: userRole, name: userName, time: Date.now() };
      localStorage.setItem('neuro_auth_user', JSON.stringify(sessionObj));

      const isPanelUrl = new URLSearchParams(window.location.search).get('panel') === 'open';

      if (!isPanelUrl) {
        // Landing page tab: Redirect pending tab to the panel URL
        const panelLocation = `${window.location.origin}${window.location.pathname}?panel=open`;
        if (pendingTab && !pendingTab.closed) {
          pendingTab.location.href = panelLocation;
        } else {
          window.open(panelLocation, '_blank');
        }

        // Keep landing page tab clean & close login modal on main tab
        setIsAuthenticated(false);
        setLoginError('');
        if (onClose) onClose();
      } else {
        // We are already on the ?panel=open tab
        setCurrentUserRole(userRole);
        setCurrentUserName(userName);
        setIsAuthenticated(true);
        setLoginError('');
      }
      return true;
    } else {
      // Unauthorized email! Close pending tab & show error on current modal
      if (pendingTab && !pendingTab.closed) {
        pendingTab.close();
      }
      setIsAuthenticated(false);
      setLoginError(`⛔ Acesso Negado: O e-mail (${googleUser.email}) não possui permissão para acessar o sistema. Apenas os e-mails autorizados (eduardojcmagalhaes@gmail.com e helpus.ecommerce@gmail.com) possuem permissão de acesso.`);
      localStorage.removeItem('neuro_auth_user');
      return false;
    }
  };

  useEffect(() => {
    // 1. Check OAuth Hash Fragment Token
    if (window.location.hash.includes('access_token=')) {
      const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
      const token = hashParams.get('access_token');
      if (token) {
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(googleUser => {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', user: googleUser }, window.location.origin);
            window.close();
          } else {
            processGoogleUserInfo(googleUser);
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        })
        .catch(err => console.error('Erro OAuth token hash:', err));
      }
    }

    // 2. Listen for postMessage from Google Auth Popup window
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS' && event.data?.user) {
        processGoogleUserInfo(event.data.user);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleGoogleSignIn = () => {
    if (!isCaptchaVerified) {
      setLoginError('Por favor, confirme a verificação de segurança "Não sou um robô" (CAPTCHA) antes de entrar com a conta do Google.');
      return;
    }

    setLoginError('');

    const isPanelUrl = new URLSearchParams(window.location.search).get('panel') === 'open';
    let pendingTab = null;

    if (!isPanelUrl) {
      pendingTab = window.open('about:blank', '_blank');
      if (pendingTab) {
        pendingTab.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <title>Carregando Painel Dr. Eduardo Magalhães...</title>
              <style>
                body { background: #020617; color: #38bdf8; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                .card { background: #0f172a; padding: 36px; border-radius: 24px; border: 1px solid #1e293b; text-align: center; max-width: 420px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); }
                .spinner { width: 44px; height: 44px; border: 4px solid #1e293b; border-top-color: #38bdf8; border-radius: 50%; animation: spin 0.9s linear infinite; margin: 0 auto 20px; }
                @keyframes spin { to { transform: rotate(360deg); } }
                h2 { margin: 0 0 10px; color: #f8fafc; font-size: 19px; font-weight: 800; }
                p { margin: 0; color: #94a3b8; font-size: 13.5px; line-height: 1.5; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="spinner"></div>
                <h2>Autenticando Conta Google...</h2>
                <p>Por favor, selecione sua conta na janela do Google para abrir o Painel do Consultório.</p>
              </div>
            </body>
          </html>
        `);
      }
    }

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '812202824664-s716306ibb7c15jh7aok2v0lfnuocpkn.apps.googleusercontent.com';

    // Official Google Identity Services GIS SDK Client
    if (window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          prompt: 'select_account',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const googleUser = await res.json();
                processGoogleUserInfo(googleUser, pendingTab);
              } catch (fetchErr) {
                console.error('Erro ao consultar API do Google UserInfo:', fetchErr);
                if (pendingTab && !pendingTab.closed) pendingTab.close();
              }
            } else {
              if (pendingTab && !pendingTab.closed) pendingTab.close();
            }
          },
          error_callback: (err) => {
            console.warn('Google OAuth popup fechado ou cancelado:', err);
            if (pendingTab && !pendingTab.closed) pendingTab.close();
          }
        });
        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (e) {
        console.warn('Falha ao inicializar Google Identity Services:', e);
      }
    }

    // Direct Google OAuth Popup Window Fallback
    const redirectUri = encodeURIComponent(window.location.origin);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile%20openid&prompt=select_account`;
    
    const width = 500;
    const height = 650;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      authUrl,
      'GoogleSignInPopup',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes`
    );

    if (popup) {
      popup.focus();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsCaptchaVerified(false);
    setLoginError('');
    localStorage.removeItem('neuro_auth_user');
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
      if (found.phone) setPatientPhone(found.phone);
      if (found.lastExam) setExamDate(found.lastExam);
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
    
    updateFullReportText(cleanText);
  };

  const handleInsertFormat = (tagStart, tagEnd = tagStart) => {
    const textarea = document.getElementById('unified-editor-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = fullReportText.substring(start, end) || 'texto';
    const replacement = `${tagStart}${selectedText}${tagEnd}`;
    const newText = fullReportText.substring(0, start) + replacement + fullReportText.substring(end);
    updateFullReportText(newText);
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
    doc.rect(14, 38, 182, 36, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(14, 38, 182, 36, 'S');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`PACIENTE: ${patientName}`, 18, 46);
    doc.text(`DATA NASC: ${birthDate}`, 120, 46);
    doc.text(`SOLICITANTE: ${requestingDoctor}`, 18, 53);
    doc.text(`DATA DO EXAME: ${examDate}`, 120, 53);
    doc.text(`EMISSÃO LAUDO: ${reportIssueDate}`, 18, 60);
    doc.text(`WHATSAPP PACIENTE: ${patientPhone}`, 120, 60);

    // Calculate PDF body font size dynamically based on editorFontSize (default 15px -> 9.8pt in PDF)
    const pdfBodyFontSize = Number((8.5 * (editorFontSize / 13)).toFixed(1));
    const pdfLineHeight = Number((pdfBodyFontSize * 0.52).toFixed(1));

    let y = 84;
    const addBlock = (title, text) => {
      if (!text) return;
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(3, 105, 161);
      doc.text(title, 14, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(pdfBodyFontSize);
      doc.setTextColor(30, 41, 59);

      const lines = doc.splitTextToSize(text, 182);
      lines.forEach((line) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 14, y);
        y += pdfLineHeight;
      });
      y += 5;
    };

    if (editorMode === 'unified') {
      addBlock('CORPO TÉCNICO & LAUDO DIAGNÓSTICO:', fullReportText);
    } else {
      addBlock('NEUROCONDUÇÃO MOTORA:', motorConduction);
      addBlock('NEUROCONDUÇÃO SENSITIVA:', sensoryConduction);
      addBlock('ONDA F:', fWave);
      addBlock('ELETROMIOGRAFIA / REGISTRO CEREBRAL:', emgText);

      if (y > 240) {
        doc.addPage();
        y = 20;
      }
      doc.setFillColor(240, 249, 255);
      doc.setDrawColor(2, 132, 199);
      doc.setFontSize(pdfBodyFontSize);
      const concLines = doc.splitTextToSize(conclusion, 174);
      const bh = concLines.length * pdfLineHeight + 14;
      doc.rect(14, y, 182, bh, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 132, 199);
      doc.text('CONCLUSÃO MÉDICA:', 18, y + 7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      let yConc = y + 13;
      concLines.forEach((cline) => {
        doc.text(cline, 18, yConc);
        yConc += pdfLineHeight;
      });

      y += bh + 15;
    }

    if (y > 250) {
      doc.addPage();
      y = 30;
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
    doc.text(`Neurologista & Neurofisiologista | CRM-RO  •  Emissão: ${reportIssueDate}`, 105, y + 4, { align: 'center' });

    doc.save(`Laudo_Oficial_${patientName.replace(/\s+/g, '_')}.pdf`);
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = patientPhone.replace(/\D/g, '');
    const targetNumber = cleanPhone ? (cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`) : '';
    const text = encodeURIComponent(
      `Olá ${patientName}! Seu laudo de exame (realizado em ${examDate}) foi assinado e emitido pela Clínica Dr. Eduardo Magalhães. Você pode baixar seu laudo e exames com segurança no nosso portal usando seu CPF.`
    );
    if (targetNumber) {
      window.open(`https://wa.me/${targetNumber}?text=${text}`, '_blank');
    } else {
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={isStandalonePage ? "min-h-screen w-full bg-slate-950 p-2 sm:p-4 flex flex-col justify-start" : "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto"}>
      <div className={isStandalonePage ? "relative w-full flex-1 min-h-[96vh] glass-panel rounded-2xl p-4 sm:p-6 shadow-2xl border border-indigo-500/30 flex flex-col overflow-hidden" : "relative w-full max-w-[96vw] xl:max-w-7xl glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl border border-indigo-500/30 my-3 max-h-[92vh] flex flex-col overflow-hidden"}>
        
        {!isStandalonePage && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {!isAuthenticated ? (
          <div className="py-8 px-4 max-w-md mx-auto space-y-6 text-center">
            <div className="inline-flex p-4 rounded-full bg-indigo-950/40 border border-indigo-500/30 text-cyan-400 mb-1 shadow-xl">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">PAINEL DO CONSULTÓRIO</h1>
              <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mt-1">CLÍNICA DR. EDUARDO MAGALHÃES</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Acesso restrito para emissão de laudos de EEG / Eletroneuromiografia e gestão do consultório.
              </p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2 text-left">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Captcha Security Widget */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-left shadow-inner">
              <label
                onClick={handleToggleCaptcha}
                className="flex items-center gap-3 cursor-pointer select-none"
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isCaptchaVerified ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md scale-105' : 'bg-slate-900 border-slate-700 text-transparent hover:border-cyan-400'}`}>
                  {isCaptchaLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                  ) : isCaptchaVerified ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : null}
                </div>
                <span className="text-xs font-bold text-slate-200">
                  {isCaptchaVerified ? 'Verificação de Segurança Confirmada' : 'Não sou um robô'}
                </span>
              </label>
              <div className="flex flex-col items-end opacity-75">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> reCAPTCHA
                </div>
                <span className="text-[8px] text-slate-500 font-mono">LGPD Protegido</span>
              </div>
            </div>

            {/* Google Login Button */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={!isCaptchaVerified}
                className={`relative group flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all duration-300 border focus:outline-none cursor-pointer ${
                  isCaptchaVerified
                    ? 'bg-black hover:bg-slate-900 text-white border-slate-700 shadow-2xl hover:scale-[1.01]'
                    : 'bg-slate-900 text-slate-500 border-slate-800 opacity-50 cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>ENTRAR COM O GOOGLE</span>
              </button>

              <p className="text-[11px] text-slate-500 text-center font-medium">
                Autenticação vinculada aos e-mails autorizados <span className="text-cyan-400 font-bold">eduardojcmagalhaes@gmail.com</span> e <span className="text-purple-400 font-bold">helpus.ecommerce@gmail.com</span>.
              </p>
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
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      currentUserRole === 'superadmin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      currentUserRole === 'doctor' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {currentUserRole === 'superadmin' ? '⚡ SuperAdmin (Master)' :
                       currentUserRole === 'doctor' ? '👑 Gerente do Site / Médico' :
                       labels.receptionBadge}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>Sessão Autenticada: <strong>{currentUserName}</strong></span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {(currentUserRole === 'doctor' || currentUserRole === 'superadmin') && (
                  <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs">
                    {currentUserRole === 'superadmin' && (
                      <span className="px-3 py-1.5 rounded-xl font-bold bg-purple-500 text-white shadow-md text-xs">
                        ⚡ SuperAdmin Master
                      </span>
                    )}
                    <button
                      onClick={() => { setCurrentUserRole('doctor'); setCurrentUserName('Dr. Eduardo Magalhães (Gerente)'); }}
                      className={`px-3 py-1.5 rounded-xl font-bold transition ${currentUserRole === 'doctor' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      👑 Gerente / Médico
                    </button>
                    <button
                      onClick={() => { setCurrentUserRole('reception'); setCurrentUserName('Juliana Costa (Secretária)'); }}
                      className={`px-3 py-1.5 rounded-xl font-bold transition ${currentUserRole === 'reception' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      📋 Secretária
                    </button>
                  </div>
                )}

                {isStandalonePage && (
                  <button
                    onClick={() => { window.location.href = window.location.origin; }}
                    title="Ir para o Site Principal da Clínica"
                    className="px-3 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition flex items-center gap-1.5 font-bold text-xs cursor-pointer"
                  >
                    🌐 Site Principal
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  title="Encerrar Sessão"
                  className="p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition flex items-center gap-1.5 font-bold text-xs cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> <span>Sair</span>
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
                            const isExpanded = templateSearchText ? true : Boolean(expandedFolders[cat.id]);

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
                                    {isExpanded && (
                                      <div className="pl-3 border-l-2 border-slate-800 space-y-1 mt-1">
                                        {catTemplates.map(tmpl => (
                                          <div key={tmpl.id} className="relative group">
                                            <div
                                              onClick={() => handleSelectTemplate(tmpl)}
                                              title={tmpl.title}
                                              className={`w-full p-2 rounded-lg border text-left text-[11px] font-sans transition flex items-center justify-between gap-1 cursor-pointer ${selectedTemplateId === tmpl.id ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold shadow-sm' : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white'}`}
                                            >
                                              <span className="truncate flex items-center gap-1.5" title={tmpl.title}>
                                                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span className="truncate" title={tmpl.title}>{tmpl.title}</span>
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

                                            {/* Floating Hover Tooltip: Complete Model Title Preview */}
                                            <div className="absolute left-0 bottom-full mb-1.5 z-40 hidden group-hover:block pointer-events-none w-max max-w-xs p-2.5 rounded-xl bg-slate-950/95 border border-cyan-400 text-white text-[11px] font-semibold shadow-2xl backdrop-blur-md">
                                              <div className="text-[9px] uppercase tracking-wider text-amber-400 font-extrabold mb-0.5 flex items-center gap-1">
                                                <FileText className="w-3 h-3 text-amber-400" /> Título Completo do Modelo:
                                              </div>
                                              <div className="text-slate-100 leading-snug break-words font-medium">
                                                {tmpl.title}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
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
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Consultando Receita Federal (HelpUS CPF)...
                            </span>
                          )}
                          {cpfSearchStatus === 'found' && (
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" /> Paciente Localizado no Histórico!
                            </span>
                          )}
                          {cpfSearchStatus === 'found_online' && (
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" /> 🌐 Verificado na Receita Federal (HelpUS CPF)!
                            </span>
                          )}
                          {cpfSearchStatus === 'not_found' && (
                            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" /> CPF não encontrado online (Digite manualmente abaixo)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                        <div className="sm:col-span-1">
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                            <span>CPF</span>
                            <span className="text-[10px] text-cyan-400 font-mono">Mevo</span>
                          </label>
                          <div className="flex gap-1">
                            <input
                              type="text"
                              value={cpf}
                              onChange={(e) => handleCpfChange(e.target.value)}
                              placeholder="000.000.000-00"
                              className="w-full px-2 py-2 rounded-xl bg-slate-950 border border-cyan-500/50 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => performCpfLookup()}
                              title="Buscar CPF"
                              className="px-2 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0"
                            >
                              <Search className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Nome Completo</label>
                          <input
                            type="text"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold"
                          />
                        </div>

                        <div className="sm:col-span-1">
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Data Nasc.</label>
                          <input
                            type="text"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Médico Solicitante</label>
                          <input
                            type="text"
                            value={requestingDoctor}
                            onChange={(e) => setRequestingDoctor(e.target.value)}
                            placeholder="Ex: DR HEMANOEL FERRO"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-amber-400 mb-1">📅 Data do Exame</label>
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              value={examDate}
                              onChange={(e) => setExamDate(formatDateMask(e.target.value))}
                              placeholder="03/10/2025"
                              className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-200 text-xs font-semibold focus:outline-none focus:border-amber-400"
                            />
                            <div className="absolute right-2.5 flex items-center justify-center cursor-pointer text-amber-400 hover:text-amber-300">
                              <Calendar className="w-4 h-4 pointer-events-none" />
                              <input
                                type="date"
                                value={convertBrToIsoDate(examDate)}
                                onChange={(e) => {
                                  if (e.target.value) setExamDate(convertIsoToBrDate(e.target.value));
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-cyan-400 mb-1">✍️ Emissão / Assinatura do Laudo</label>
                          <div className="relative flex items-center">
                            <input
                              type="text"
                              value={reportIssueDate}
                              onChange={(e) => setReportIssueDate(formatDateMask(e.target.value))}
                              placeholder="25/09/2026"
                              className="w-full pl-3 pr-10 py-2 rounded-xl bg-slate-950 border border-cyan-500/40 text-cyan-200 text-xs font-semibold focus:outline-none focus:border-cyan-400"
                            />
                            <div className="absolute right-2.5 flex items-center justify-center cursor-pointer text-cyan-400 hover:text-cyan-300">
                              <Calendar className="w-4 h-4 pointer-events-none" />
                              <input
                                type="date"
                                value={convertBrToIsoDate(reportIssueDate)}
                                onChange={(e) => {
                                  if (e.target.value) setReportIssueDate(convertIsoToBrDate(e.target.value));
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-emerald-400 mb-1">📱 Tel / WhatsApp do Paciente</label>
                          <input
                            type="text"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            placeholder="(69) 99234-5678"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-200 text-xs font-semibold"
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
                              <div className="flex items-center gap-1.5 flex-wrap">
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

                                {/* Undo / Redo Buttons */}
                                <button
                                  type="button"
                                  onClick={handleUndo}
                                  disabled={historyIndex <= 0}
                                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition ${historyIndex > 0 ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-200 hover:bg-indigo-600/50 cursor-pointer' : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'}`}
                                  title={labels.undoBtn}
                                >
                                  <Undo className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Desfazer</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={handleRedo}
                                  disabled={historyIndex >= reportHistory.length - 1}
                                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition ${historyIndex < reportHistory.length - 1 ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-200 hover:bg-indigo-600/50 cursor-pointer' : 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'}`}
                                  title={labels.redoBtn}
                                >
                                  <Redo className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Refazer</span>
                                </button>

                                <div className="h-4 w-px bg-slate-800 mx-1" />

                                <span className="text-[10px] font-bold text-slate-400">Fonte:</span>
                                <button
                                  type="button"
                                  onClick={() => setEditorFontSize(prev => Math.max(11, prev - 1))}
                                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold text-xs"
                                  title="Diminuir Fonte (Edição & PDF)"
                                >
                                  A-
                                </button>
                                <span className="text-xs font-mono font-bold text-cyan-400 px-1">
                                  {editorFontSize}px <span className="text-[10px] text-amber-400 font-semibold">(PDF: {(8.5 * (editorFontSize / 13)).toFixed(1)}pt)</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setEditorFontSize(prev => Math.min(20, prev + 1))}
                                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold text-xs"
                                  title="Aumentar Fonte (Edição & PDF)"
                                >
                                  A+
                                </button>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  type="button"
                                  onClick={handleUpdateCurrentTemplate}
                                  className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 transition"
                                  title="Salvar alterações pontuais mantendo o modelo na sua posição original na árvore"
                                >
                                  <Save className="w-3.5 h-3.5 text-emerald-400" /> {labels.updateCurrentModelBtn || "💾 Salvar no Modelo Atual"}
                                </button>
                                <button
                                  type="button"
                                  onClick={handleOpenAddTemplate}
                                  className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition"
                                  title="Salvar como um novo modelo independente na árvore"
                                >
                                  <PlusCircle className="w-3.5 h-3.5 text-amber-400" /> {labels.saveNewModelBtn || "➕ Salvar Novo Modelo"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateFullReportText('')}
                                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 text-[11px] font-bold transition"
                                >
                                  {labels.clearBtn}
                                </button>
                              </div>
                            </div>

                            <textarea
                              id="unified-editor-textarea"
                              rows={isTreeVisible ? 14 : 18}
                              value={fullReportText}
                              onChange={(e) => updateFullReportText(e.target.value)}
                              onKeyDown={(e) => {
                                if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
                                  e.preventDefault();
                                  handleUndo();
                                } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
                                  e.preventDefault();
                                  handleRedo();
                                }
                              }}
                              placeholder="Edite aqui todo o texto do laudo (Suporta Atalhos Ctrl+Z para Desfazer e Ctrl+Y para Refazer)..."
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

                        {(currentUserRole === 'doctor' || currentUserRole === 'superadmin') && (
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

            {activeTab === 'winsoft' && (
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 flex flex-col min-h-0">
                
                {/* Header & Main Control Bar */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                        <Database className="w-4.5 h-4.5 text-cyan-400" />
                        <span>Base de Dados de Pacientes — Clínica Dr. Eduardo Magalhães</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                          {filteredPatients.length} de {patientDb.length} registros
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Consulte, inclua, edite ou exclua registros de pacientes. Filtre por CPF, Nome, Data de Nascimento ou Status de Laudo.
                      </p>
                    </div>

                    {/* Actions, View Switcher & Per Page Selector */}
                    <div className="flex items-center flex-wrap gap-3">
                      <button
                        onClick={handleOpenAddPatient}
                        className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Novo Paciente
                      </button>

                      <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                        <button
                          onClick={() => setPatientViewMode('table')}
                          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                            patientViewMode === 'table' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                          }`}
                          title="Visualização em Lista / Tabela"
                        >
                          <List className="w-3.5 h-3.5" /> Tabela
                        </button>
                        <button
                          onClick={() => setPatientViewMode('cards')}
                          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer ${
                            patientViewMode === 'cards' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                          }`}
                          title="Visualização em Grade de Cards"
                        >
                          <Grid className="w-3.5 h-3.5" /> Cards
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span>Exibir:</span>
                        <select
                          value={patientPerPage}
                          onChange={(e) => setPatientPerPage(Number(e.target.value))}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100 por página</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Inputs Bar: Search & Quick Filters */}
                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                    
                    {/* Universal Search Input */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={patientSearchQuery}
                        onChange={(e) => setPatientSearchQuery(e.target.value)}
                        placeholder="Buscar por Nome, CPF (números ou formatado), Data Nasc (DD/MM/AAAA) ou Cidade..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                      />
                      {patientSearchQuery && (
                        <button
                          onClick={() => setPatientSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filter Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                      <button
                        onClick={() => setPatientFilterType('all')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                          patientFilterType === 'all'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        Todos ({patientDb.length})
                      </button>
                      
                      <button
                        onClick={() => setPatientFilterType('has_cpf')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                          patientFilterType === 'has_cpf'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        Com CPF
                      </button>

                      <button
                        onClick={() => setPatientFilterType('has_dob')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                          patientFilterType === 'has_dob'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        Com Data Nasc
                      </button>

                      <button
                        onClick={() => setPatientFilterType('has_laudo')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                          patientFilterType === 'has_laudo'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        Com Laudo / Exame
                      </button>

                      <button
                        onClick={() => setPatientFilterType('has_phone')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                          patientFilterType === 'has_phone'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        Com Telefone
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Area: Table View vs Cards View */}
                {paginatedPatients.length === 0 ? (
                  <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                    <Database className="w-10 h-10 text-slate-600 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-300">Nenhum paciente encontrado</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Não encontramos nenhum registro correspondente aos filtros atuais. Verifique a digitação ou cadastre um novo paciente.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => { setPatientSearchQuery(''); setPatientFilterType('all'); }}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold hover:bg-slate-700 transition cursor-pointer"
                      >
                        Limpar Filtros
                      </button>
                      <button
                        onClick={handleOpenAddPatient}
                        className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs hover:bg-cyan-400 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" /> Cadastrar Paciente
                      </button>
                    </div>
                  </div>
                ) : patientViewMode === 'table' ? (
                  /* Elegant Data Table */
                  <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl flex-1 flex flex-col">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-950/90 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold select-none sticky top-0 z-10">
                            <th className="py-3 px-4 w-12 text-center">#</th>
                            
                            {/* Column: Nome */}
                            <th 
                              onClick={() => handleSortToggle('name')}
                              className="py-3 px-4 cursor-pointer hover:text-cyan-400 transition"
                            >
                              <div className="flex items-center gap-1.5">
                                <span>Nome Completo do Paciente</span>
                                {patientSortField === 'name' ? (
                                  patientSortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-cyan-400" /> : <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                                ) : (
                                  <ArrowUpDown className="w-3 h-3 text-slate-600" />
                                )}
                              </div>
                            </th>

                            {/* Column: CPF */}
                            <th 
                              onClick={() => handleSortToggle('cpf')}
                              className="py-3 px-4 cursor-pointer hover:text-cyan-400 transition"
                            >
                              <div className="flex items-center gap-1.5">
                                <span>CPF</span>
                                {patientSortField === 'cpf' ? (
                                  patientSortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-cyan-400" /> : <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                                ) : (
                                  <ArrowUpDown className="w-3 h-3 text-slate-600" />
                                )}
                              </div>
                            </th>

                            {/* Column: Data Nasc */}
                            <th 
                              onClick={() => handleSortToggle('birthDate')}
                              className="py-3 px-4 cursor-pointer hover:text-cyan-400 transition"
                            >
                              <div className="flex items-center gap-1.5">
                                <span>Data Nasc</span>
                                {patientSortField === 'birthDate' ? (
                                  patientSortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-cyan-400" /> : <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                                ) : (
                                  <ArrowUpDown className="w-3 h-3 text-slate-600" />
                                )}
                              </div>
                            </th>

                            {/* Column: Laudos / Exames */}
                            <th 
                              onClick={() => handleSortToggle('hasLaudo')}
                              className="py-3 px-4 cursor-pointer hover:text-cyan-400 transition"
                            >
                              <div className="flex items-center gap-1.5">
                                <FileText className="w-3 h-3 text-slate-500" />
                                <span>Status de Laudo</span>
                                {patientSortField === 'hasLaudo' ? (
                                  patientSortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-cyan-400" /> : <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                                ) : (
                                  <ArrowUpDown className="w-3 h-3 text-slate-600" />
                                )}
                              </div>
                            </th>

                            {/* Column: Telefone / WhatsApp */}
                            <th className="py-3 px-4">
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-3 h-3 text-slate-500" />
                                <span>Telefone / WhatsApp</span>
                              </div>
                            </th>

                            {/* Column: Cidade / UF */}
                            <th 
                              onClick={() => handleSortToggle('city')}
                              className="py-3 px-4 cursor-pointer hover:text-cyan-400 transition"
                            >
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-slate-500" />
                                <span>Cidade / UF</span>
                                {patientSortField === 'city' ? (
                                  patientSortOrder === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-cyan-400" /> : <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
                                ) : (
                                  <ArrowUpDown className="w-3 h-3 text-slate-600" />
                                )}
                              </div>
                            </th>

                            {/* Column: Actions */}
                            <th className="py-3 px-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs">
                          {paginatedPatients.map((pt, idx) => {
                            const globalIndex = (patientPage - 1) * patientPerPage + idx + 1;
                            const age = calculateAge(pt.birthDate);
                            const hasValidCpf = pt.cpf && pt.cpf.trim().length > 0;
                            const laudoCount = (pt.examHistory?.length || 0) + (pt.lastExam ? 1 : 0);

                            return (
                              <tr key={idx} className="hover:bg-slate-800/50 transition-colors group">
                                <td className="py-3 px-4 font-mono text-[11px] text-slate-500 text-center font-semibold">
                                  {globalIndex}
                                </td>

                                {/* Name */}
                                <td className="py-3 px-4 font-bold text-white group-hover:text-cyan-300 transition">
                                  <div className="flex items-center gap-2">
                                    <User className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 flex-shrink-0" />
                                    <span className="truncate max-w-xs">{pt.name}</span>
                                  </div>
                                </td>

                                {/* CPF */}
                                <td className="py-3 px-4 font-mono">
                                  {hasValidCpf ? (
                                    <div className="flex items-center gap-1.5">
                                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold text-[11px]">
                                        {pt.cpf}
                                      </span>
                                      <button
                                        onClick={() => handleCopyCpf(pt.cpfClean || pt.cpf)}
                                        className="p-1 rounded text-slate-500 hover:text-cyan-300 hover:bg-slate-800 transition cursor-pointer"
                                        title="Copiar CPF"
                                      >
                                        {copiedCpf === (pt.cpfClean || pt.cpf) ? (
                                          <Check className="w-3 h-3 text-emerald-400" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-slate-600 text-[11px] italic">Sem CPF</span>
                                  )}
                                </td>

                                {/* Birth Date & Age */}
                                <td className="py-3 px-4 text-slate-300 font-mono">
                                  {pt.birthDate ? (
                                    <div className="flex items-center gap-1.5">
                                      <Calendar className="w-3 h-3 text-slate-500" />
                                      <span>{pt.birthDate}</span>
                                      {age !== null && (
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                                          {age}a
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-slate-600 text-[11px] italic">N/A</span>
                                  )}
                                </td>

                                {/* Status de Laudo */}
                                <td className="py-3 px-4 font-mono">
                                  {laudoCount > 0 ? (
                                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold text-[11px] inline-flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                      {laudoCount === 1 ? '1 Exame' : `${laudoCount} Exames`}
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-500 border border-slate-700/50 text-[11px] inline-flex items-center gap-1">
                                      Sem Laudo
                                    </span>
                                  )}
                                </td>

                                {/* Phone / WhatsApp */}
                                <td className="py-3 px-4 font-mono text-slate-300">
                                  {pt.phone ? (
                                    <a
                                      href={`https://wa.me/55${pt.phone.replace(/\D/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition"
                                      title="Abrir WhatsApp"
                                    >
                                      <Phone className="w-3 h-3 text-emerald-500" />
                                      <span>{pt.phone}</span>
                                    </a>
                                  ) : (
                                    <span className="text-slate-600 text-[11px] italic">Sem telefone</span>
                                  )}
                                </td>

                                {/* City / UF */}
                                <td className="py-3 px-4 text-slate-300">
                                  {pt.city || pt.state ? (
                                    <span className="truncate max-w-[130px] block">
                                      {[pt.city, pt.state].filter(Boolean).join(' - ')}
                                    </span>
                                  ) : (
                                    <span className="text-slate-600 text-[11px] italic">Porto Velho - RO</span>
                                  )}
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => {
                                        if (pt.cpf) setCpf(pt.cpf);
                                        setPatientName(pt.name);
                                        if (pt.birthDate) setBirthDate(pt.birthDate);
                                        if (pt.phone) setPatientPhone(pt.phone);
                                        if (pt.lastExam) setExamDate(pt.lastExam);
                                        setSelectedPatientExams(pt.examHistory || []);
                                        setActiveTab('generator');
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer shadow-sm"
                                      title="Carregar dados no gerador de laudos"
                                    >
                                      <FileText className="w-3 h-3" /> Gerar Laudo
                                    </button>
                                    <button
                                      onClick={() => handleOpenEditPatient(pt)}
                                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                                      title="Editar paciente"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeletePatient(pt)}
                                      className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/50 transition cursor-pointer"
                                      title="Excluir paciente"
                                    >
                                      <Trash className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  /* Grid Cards View Alternative */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paginatedPatients.map((pt, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 hover:border-cyan-500/40 transition shadow-md">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs font-bold text-white truncate max-w-[180px]">{pt.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                            {pt.cpf || 'Sem CPF'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 space-y-1">
                          <div><strong className="text-slate-400">Data Nasc:</strong> {pt.birthDate || 'N/A'}</div>
                          <div><strong className="text-slate-400">WhatsApp:</strong> {pt.phone || 'N/A'}</div>
                          <div><strong className="text-slate-400">Cidade:</strong> {[pt.city, pt.state].filter(Boolean).join(' - ') || 'Porto Velho - RO'}</div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => {
                              if (pt.cpf) setCpf(pt.cpf);
                              setPatientName(pt.name);
                              if (pt.birthDate) setBirthDate(pt.birthDate);
                              if (pt.phone) setPatientPhone(pt.phone);
                              if (pt.lastExam) setExamDate(pt.lastExam);
                              setSelectedPatientExams(pt.examHistory || []);
                              setActiveTab('generator');
                            }}
                            className="flex-1 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" /> Gerar Laudo
                          </button>
                          <button
                            onClick={() => handleOpenEditPatient(pt)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                            title="Editar paciente"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePatient(pt)}
                            className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/50 transition cursor-pointer"
                            title="Excluir paciente"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination Bar */}
                {filteredPatients.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-400">
                    <div>
                      Exibindo <span className="text-white font-bold font-mono">{(patientPage - 1) * patientPerPage + 1}</span> a{' '}
                      <span className="text-white font-bold font-mono">{Math.min(patientPage * patientPerPage, filteredPatients.length)}</span> de{' '}
                      <span className="text-cyan-400 font-bold font-mono">{filteredPatients.length}</span> pacientes
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPatientPage(p => Math.max(1, p - 1))}
                        disabled={patientPage === 1}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" /> Anterior
                      </button>

                      <span className="font-mono text-slate-300 px-2">
                        Página <strong className="text-cyan-400">{patientPage}</strong> de <strong>{totalPages}</strong>
                      </span>

                      <button
                        onClick={() => setPatientPage(p => Math.min(totalPages, p + 1))}
                        disabled={patientPage === totalPages}
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
                      >
                        Próxima <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="flex-1 overflow-y-auto pr-1 space-y-5">
                {/* Header Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-xl flex items-center justify-between flex-wrap gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-indigo-400" />
                      <span>Gestão de Usuários & Direitos de Acesso ao Sistema</span>
                    </h3>
                    <p className="text-xs text-slate-400 max-w-2xl">
                      Painel de Administração Master. Controle de perfis de privilégio (SuperAdmin, Gestor/Médico, Secretária), cadastramento de e-mails Google autorizados e conformidade LGPD.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddUser}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" /> Cadastrar Novo Usuário / Autorizar E-mail
                  </button>
                </div>

                {/* Role Privilege Legend Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-purple-300 flex items-center gap-1.5">
                        ⚡ SuperAdmin (Master)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold">Acesso Total</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Administração completa do ambiente, edição de modelos, inclusão de e-mails na whitelist Google Cloud e gestão de direitos.
                    </p>
                    <div className="text-[10px] font-mono text-purple-400 font-bold">
                      E-mail: helpus.ecommerce@gmail.com
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                        👑 Gestor do Site / Médico
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">Clínico Completo</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Emissão de laudos de EEG e Eletroneuromiografia, assinatura digital ICP-Brasil com QR Code e edição de corpo técnico.
                    </p>
                    <div className="text-[10px] font-mono text-amber-400 font-bold">
                      E-mail: eduardojcmagalhaes@gmail.com
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-cyan-300 flex items-center gap-1.5">
                        📋 Secretária / Atendimento
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">Restrito LGPD</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Busca CPF (Winsoft/Mevo) e envio de links no WhatsApp. Conclusões médicas ocultas por sigilo LGPD.
                    </p>
                    <div className="text-[10px] font-mono text-cyan-400 font-bold">
                      E-mail: juliana@clinica.com.br / fernanda...
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-indigo-400" />
                      <span>Lista de Usuários Cadastrados & Autorizados ({employees.length})</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Autenticação Google OAuth 2.0 Ativa
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                          <th className="p-3.5">Usuário / Nome</th>
                          <th className="p-3.5">E-mail Google Autorizado</th>
                          <th className="p-3.5">Papel / Função</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Direitos de Acesso</th>
                          <th className="p-3.5 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-xs font-medium">
                        {employees.map((emp) => (
                          <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                            <td className="p-3.5 font-bold text-white flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                                {emp.name.charAt(0)}
                              </div>
                              <span>{emp.name}</span>
                            </td>

                            <td className="p-3.5 font-mono text-cyan-300">
                              {emp.email}
                            </td>

                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                                emp.role === 'superadmin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                                emp.role === 'doctor' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              }`}>
                                {emp.roleTitle || emp.role}
                              </span>
                            </td>

                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                                emp.status === 'Ativo' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}>
                                {emp.status || 'Ativo'}
                              </span>
                            </td>

                            <td className="p-3.5">
                              <div className="flex flex-wrap gap-1 text-[10px]">
                                {emp.role === 'superadmin' && (
                                  <>
                                    <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-200 border border-purple-800 font-mono">✓ Acesso Total</span>
                                    <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-200 border border-purple-800 font-mono">✓ Gestão Usuários</span>
                                    <span className="px-2 py-0.5 rounded bg-purple-900/40 text-purple-200 border border-purple-800 font-mono">✓ Whitelist GCP</span>
                                  </>
                                )}
                                {emp.role === 'doctor' && (
                                  <>
                                    <span className="px-2 py-0.5 rounded bg-amber-900/40 text-amber-200 border border-amber-800 font-mono">✓ Emissão Laudos</span>
                                    <span className="px-2 py-0.5 rounded bg-amber-900/40 text-amber-200 border border-amber-800 font-mono">✓ Assinatura ICP</span>
                                    <span className="px-2 py-0.5 rounded bg-amber-900/40 text-amber-200 border border-amber-800 font-mono">✓ Modelos EEG/ENMG</span>
                                  </>
                                )}
                                {emp.role === 'reception' && (
                                  <>
                                    <span className="px-2 py-0.5 rounded bg-cyan-900/40 text-cyan-200 border border-cyan-800 font-mono">✓ Busca CPF Winsoft</span>
                                    <span className="px-2 py-0.5 rounded bg-cyan-900/40 text-cyan-200 border border-cyan-800 font-mono">✓ Envio WhatsApp</span>
                                    <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800 font-mono">🔒 Conclusão Oculta</span>
                                  </>
                                )}
                              </div>
                            </td>

                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditUser(emp)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 transition cursor-pointer"
                                  title="Editar Direitos do Usuário"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                {emp.email !== 'helpus.ecommerce@gmail.com' && emp.email !== 'eduardojcmagalhaes@gmail.com' && (
                                  <button
                                    onClick={() => handleDeleteUser(emp.id)}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-400 hover:text-rose-300 transition cursor-pointer"
                                    title="Revogar Acesso"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Management Edit/Add Modal */}
        {isUserModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
            <div className="relative z-[100000] w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 space-y-4 shadow-2xl my-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-cyan-400" />
                  <span>{editingUserId ? 'Editar Direitos de Usuário' : 'Cadastrar Usuário / Autorizar E-mail'}</span>
                </h3>
                <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nome Completo do Usuário</label>
                  <input
                    type="text"
                    required
                    value={userFormName}
                    onChange={(e) => setUserFormName(e.target.value)}
                    placeholder="Ex: Dr. Eduardo Magalhães"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">E-mail de Conta Google Autorizado</label>
                  <input
                    type="email"
                    required
                    value={userFormEmail}
                    onChange={(e) => setUserFormEmail(e.target.value)}
                    placeholder="exemplo@gmail.com"
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Papel / Perfil de Privilégios</label>
                  <select
                    value={userFormRole}
                    onChange={(e) => setUserFormRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-cyan-400"
                  >
                    <option value="superadmin">⚡ SuperAdmin Master (Acesso Completo + Whitelist)</option>
                    <option value="doctor">👑 Gestor do Site / Médico (Laudos, PDF & ICP-Brasil)</option>
                    <option value="reception">📋 Secretária / Atendimento (Busca Winsoft & LGPD)</option>
                    <option value="technician">🔬 Técnico de Exames (Anexos & Traçados)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status da Conta</label>
                  <select
                    value={userFormStatus}
                    onChange={(e) => setUserFormStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Ativo">Ativo (Acesso Liberado)</option>
                    <option value="Inativo">Inativo (Acesso Revogado)</option>
                  </select>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold shadow-md cursor-pointer"
                  >
                    Salvar Permissões
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Patient CRUD Modal (Cadastrar / Editar Paciente) */}
        {isPatientModalOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
            <div className="relative z-[100000] w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    {editingPatientIndex !== null ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      {editingPatientIndex !== null ? 'Editar Cadastro do Paciente' : 'Cadastrar Novo Paciente'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Preencha os dados do paciente para salvar na base de dados da clínica.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPatientModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSavePatient} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Nome Completo do Paciente *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientFormData.name}
                    onChange={(e) => setPatientFormData({ ...patientFormData, name: e.target.value })}
                    placeholder="Ex: MARIA DA SILVA SOUZA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      CPF (11 dígitos)
                    </label>
                    <input
                      type="text"
                      value={patientFormData.cpf}
                      onChange={(e) => {
                        const formatted = formatDateMask(e.target.value);
                        setPatientFormData({ ...patientFormData, cpf: formatted });
                      }}
                      placeholder="000.000.000-00"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="text"
                      value={patientFormData.birthDate}
                      onChange={(e) => {
                        const formatted = formatDateMask(e.target.value);
                        setPatientFormData({ ...patientFormData, birthDate: formatted });
                      }}
                      placeholder="DD/MM/AAAA"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={patientFormData.phone}
                      onChange={(e) => setPatientFormData({ ...patientFormData, phone: e.target.value })}
                      placeholder="(69) 99999-9999"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      UF (Estado)
                    </label>
                    <input
                      type="text"
                      value={patientFormData.state}
                      onChange={(e) => setPatientFormData({ ...patientFormData, state: e.target.value.toUpperCase() })}
                      placeholder="RO"
                      maxLength={2}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={patientFormData.city}
                    onChange={(e) => setPatientFormData({ ...patientFormData, city: e.target.value })}
                    placeholder="Porto Velho"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsPatientModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Salvar Paciente
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
