// Base de Dados de Pacientes para Auto-Preenchimento por CPF (Estilo Mevo / Integração Winsoft)

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

/**
 * Formata uma string de CPF para o padrão 000.000.000-00
 */
export const formatCPF = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

/**
 * Limpa o CPF para apenas dígitos
 */
export const cleanCPF = (cpfStr) => cpfStr.replace(/\D/g, '');

/**
 * Pesquisa o paciente pelo CPF na base local/Winsoft
 */
export const findPatientByCPF = (db, searchCpf) => {
  const targetDigits = cleanCPF(searchCpf);
  if (!targetDigits) return null;
  return db.find(p => cleanCPF(p.cpf) === targetDigits) || null;
};

/**
 * Consulta de CPF via API pública (BrasilAPI / Consulta Mevo)
 */
export const fetchCpfOnlineData = async (cpfStr) => {
  const digits = cleanCPF(cpfStr);
  if (digits.length !== 11) return null;

  try {
    const response = await fetch(`https://brasilapi.com.br/api/cpf/v1/${digits}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      return {
        name: data.name || data.nome || null,
        birthDate: data.type === 'PF' ? (data.createdAt || null) : null,
        source: 'BrasilAPI / Receita Federal'
      };
    }
  } catch (err) {
    console.warn('Consulta online de CPF falhou ou indisponível:', err);
  }

  return null;
};
