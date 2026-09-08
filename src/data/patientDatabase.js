// Base de Dados de Pacientes para Auto-Preenchimento por CPF (Estilo Mevo / Integração Winsoft)

export const INITIAL_PATIENT_DATABASE = [
  {
    cpf: '123.456.789-00',
    name: 'CLELIA MARI DE CARVALHO',
    birthDate: '07/05/1967',
    phone: '(69) 99234-5678',
    lastExam: '03/10/2025',
    requestingDoctor: 'DR HEMANOEL FERRO'
  },
  {
    cpf: '987.654.321-11',
    name: 'MARIA APARECIDA DA SILVA',
    birthDate: '14/11/1975',
    phone: '(69) 98112-3456',
    lastExam: '15/08/2025',
    requestingDoctor: 'DRA PATRICIA ALBUQUERQUE'
  },
  {
    cpf: '456.789.123-22',
    name: 'JOAO CARLOS OLIVEIRA SANTOS',
    birthDate: '22/03/1982',
    phone: '(69) 99345-6789',
    lastExam: '20/09/2025',
    requestingDoctor: 'DR EDUARDO MAGALHÃES'
  },
  {
    cpf: '333.444.555-66',
    name: 'ROBERTO MENDES GONÇALVES',
    birthDate: '03/09/1959',
    phone: '(69) 98456-7890',
    lastExam: '01/09/2025',
    requestingDoctor: 'DR LUIZ FERNANDO PAIVA'
  },
  {
    cpf: '777.888.999-00',
    name: 'ANA BEATRIZ MOREIRA',
    birthDate: '18/12/1994',
    phone: '(69) 99567-8901',
    lastExam: '05/09/2025',
    requestingDoctor: 'DRA CARLA VASCONCELOS'
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
