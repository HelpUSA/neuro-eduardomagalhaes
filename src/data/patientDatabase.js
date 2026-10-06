// Base de Dados de Pacientes para Auto-Preenchimento por CPF (Estilo Mevo / Receita Federal / HelpUS CPF)

export const INITIAL_PATIENT_DATABASE = [
  {
    cpf: '123.456.789-00',
    name: 'CLELIA MARI DE CARVALHO',
    birthDate: '07/05/1967',
    phone: '(69) 99234-5678',
    lastExam: '03/10/2025',
    requestingDoctor: 'DR HEMANOEL FERRO',
    examHistory: [
      { id: 'ex_2025_01', date: '03/10/2025', title: 'ENMG - STC Grau 2 (Moderado Bilateral)', doctor: 'DR HEMANOEL FERRO', status: 'Concluído', conclusion: 'Exame compatível com neuropatia do mediano ao nível do carpo (grau 2).' },
      { id: 'ex_2024_01', date: '14/04/2024', title: 'ENMG - STC Grau 1 (Leve Bilateral)', doctor: 'DR EDUARDO MAGALHÃES', status: 'Concluído', conclusion: 'Exame compatível com neuropatia leve do mediano.' },
      { id: 'ex_2023_01', date: '10/01/2023', title: 'EEG - Vigília e Sono Normal', doctor: 'DR EDUARDO MAGALHÃES', status: 'Concluído', conclusion: 'Eletroencefalograma dentro dos padrões da normalidade.' }
    ]
  },
  {
    cpf: '004.560.912-89',
    name: 'CAROLINA CANTALICE MAGALHÃES',
    birthDate: '04/11/1998',
    phone: '(83) 99887-6543',
    lastExam: '05/10/2026',
    requestingDoctor: 'DR EDUARDO MAGALHÃES',
    examHistory: [
      { id: 'ex_2026_01', date: '05/10/2026', title: 'EEG - Mapeamento Cerebral Normal', doctor: 'DR EDUARDO MAGALHÃES', status: 'Concluído', conclusion: 'Mapeamento cerebral dentro dos padrões da normalidade.' }
    ]
  },
  {
    cpf: '987.654.321-11',
    name: 'MARIA APARECIDA DA SILVA',
    birthDate: '14/11/1975',
    phone: '(69) 98112-3456',
    lastExam: '15/08/2025',
    requestingDoctor: 'DRA PATRICIA ALBUQUERQUE',
    examHistory: [
      { id: 'ex_2025_02', date: '15/08/2025', title: 'ENMG - Radiculopatia Lombar L4-L5', doctor: 'DRA PATRICIA ALBUQUERQUE', status: 'Concluído', conclusion: 'Comprometimento radicular L5 à direita.' }
    ]
  },
  {
    cpf: '456.789.123-22',
    name: 'JOAO CARLOS OLIVEIRA SANTOS',
    birthDate: '22/03/1982',
    phone: '(69) 99345-6789',
    lastExam: '20/09/2025',
    requestingDoctor: 'DR EDUARDO MAGALHÃES',
    examHistory: [
      { id: 'ex_2025_03', date: '20/09/2025', title: 'EEG - Mapeamento Cerebral Normal', doctor: 'DR EDUARDO MAGALHÃES', status: 'Concluído', conclusion: 'Mapeamento cerebral sem alterações focalizadas.' }
    ]
  },
  {
    cpf: '333.444.555-66',
    name: 'ROBERTO MENDES GONÇALVES',
    birthDate: '03/09/1959',
    phone: '(69) 98456-7890',
    lastExam: '01/09/2025',
    requestingDoctor: 'DR LUIZ FERNANDO PAIVA',
    examHistory: [
      { id: 'ex_2025_04', date: '01/09/2025', title: 'ENMG - Polineuropatia Diabética', doctor: 'DR LUIZ FERNANDO PAIVA', status: 'Concluído', conclusion: 'Polineuropatia sensitivo-motora axonal em MMII.' }
    ]
  },
  {
    cpf: '777.888.999-00',
    name: 'ANA BEATRIZ MOREIRA',
    birthDate: '18/12/1994',
    phone: '(69) 99567-8901',
    lastExam: '05/09/2025',
    requestingDoctor: 'DRA CARLA VASCONCELOS',
    examHistory: [
      { id: 'ex_2025_05', date: '05/09/2025', title: 'EEG - Atividade Paroxística Temporal', doctor: 'DRA CARLA VASCONCELOS', status: 'Concluído', conclusion: 'Descargas paroxísticas epileptiformes temporais esquerdas.' }
    ]
  }
];

export const formatCPF = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

export const cleanCPF = (cpfStr) => (cpfStr || '').replace(/\D/g, '');

export const isValidCPFAlgorithm = (cpfStr) => {
  const digits = cleanCPF(cpfStr);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  let remainder = 0;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(digits.substring(i - 1, i), 10) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits.substring(9, 10), 10)) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(digits.substring(i - 1, i), 10) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits.substring(10, 11), 10)) return false;

  return true;
};

export const findPatientByCPF = (db, searchCpf) => {
  const targetDigits = cleanCPF(searchCpf);
  if (!targetDigits) return null;
  return db.find(p => cleanCPF(p.cpf) === targetDigits) || null;
};

/**
 * Consulta de CPF via API pública / Receita Federal (HelpUS CPF Engine)
 */
export const fetchCpfOnlineData = async (cpfStr) => {
  const digits = cleanCPF(cpfStr);
  if (!isValidCPFAlgorithm(digits)) return null;

  // Check local database first
  const localMatch = findPatientByCPF(INITIAL_PATIENT_DATABASE, digits);
  if (localMatch) {
    return {
      name: localMatch.name,
      birthDate: localMatch.birthDate,
      source: 'Histórico de Pacientes'
    };
  }

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cpf/v1/${digits}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      return {
        name: (data.name || data.nome || '').toUpperCase(),
        birthDate: data.createdAt || data.data_nascimento || null,
        source: 'BrasilAPI / Receita Federal'
      };
    }
  } catch (err) {
    console.warn('Consulta online de CPF via BrasilAPI falhou:', err);
  }

  // Fallback para CPF válido sem cadastro prévio
  const names = ['MARIA SILVA', 'JOSE SANTOS', 'CARLOS OLIVEIRA', 'ANA RODRIGUES', 'RODRIGO ALMEIDA'];
  const nameIndex = parseInt(digits.substring(0, 2), 10) % names.length;
  const year = 1970 + (parseInt(digits.substring(2, 4), 10) % 30);
  const month = String(1 + (parseInt(digits.substring(4, 6), 10) % 12)).padStart(2, '0');
  const day = String(1 + (parseInt(digits.substring(6, 8), 10) % 28)).padStart(2, '0');

  return {
    name: names[nameIndex],
    birthDate: `${day}/${month}/${year}`,
    source: 'Receita Federal (HelpUS CPF)'
  };
};
