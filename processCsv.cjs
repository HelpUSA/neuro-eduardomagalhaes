const fs = require('fs');
const path = require('path');

const csvPath = 'D:/AntiG/neuro.eduardomagalhaes/scratch_extract/06-10-2026-patient.csv';
const content = fs.readFileSync(csvPath, 'utf-8');
const lines = content.split('\n');

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}

const headers = parseCSVLine(lines[0]);
console.log('Headers:', headers.slice(0, 15));

const patients = [];
let validCpfCount = 0;

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  const cols = parseCSVLine(lines[i]);
  const name = (cols[2] || cols[3] || '').replace(/"/g, '').trim().toUpperCase();
  const birthdateRaw = (cols[4] || '').trim();
  const cpfRaw = (cols[7] || '').replace(/\D/g, '');
  const phone = (cols[11] || cols[10] || cols[12] || '').replace(/"/g, '').trim();

  let formattedBirthDate = '';
  if (birthdateRaw && birthdateRaw.includes('-')) {
    const parts = birthdateRaw.split('-');
    if (parts.length === 3) {
      formattedBirthDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  let formattedCpf = '';
  if (cpfRaw.length === 11) {
    formattedCpf = `${cpfRaw.slice(0, 3)}.${cpfRaw.slice(3, 6)}.${cpfRaw.slice(6, 9)}-${cpfRaw.slice(9)}`;
    validCpfCount++;
  } else if (cpfRaw.length > 0) {
    formattedCpf = cpfRaw;
  }

  if (name) {
    patients.push({
      cpf: formattedCpf,
      cpfClean: cpfRaw,
      name: name,
      birthDate: formattedBirthDate,
      phone: phone,
      city: cols[26] ? cols[26].replace(/"/g, '') : '',
      state: cols[27] ? cols[27].replace(/"/g, '') : ''
    });
  }
}

console.log('Parsed patients total:', patients.length);
console.log('Parsed patients with CPF:', validCpfCount);
console.log('Sample patient 1:', patients[0]);
console.log('Sample patient 5:', patients[4]);
console.log('Sample patient 10:', patients[9]);

// Now let's generate the complete patientDatabase.js file!
const jsContent = `// Base de Dados de Pacientes Oficiais da Clínica de Neurologia Dr. Eduardo Magalhães
// Importado automaticamente do arquivo oficial de exportação de pacientes (${patients.length} registros, ${validCpfCount} com CPF)

export const INITIAL_PATIENT_DATABASE = ${JSON.stringify(patients, null, 2)};

export const formatCPF = (value) => {
  const digits = (value || '').replace(/\\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return \`\${digits.slice(0, 3)}.\${digits.slice(3)}\`;
  if (digits.length <= 9) return \`\${digits.slice(0, 3)}.\${digits.slice(3, 6)}.\${digits.slice(6)}\`;
  return \`\${digits.slice(0, 3)}.\${digits.slice(3, 6)}.\${digits.slice(6, 9)}-\${digits.slice(9)}\`;
};

export const cleanCPF = (cpfStr) => (cpfStr || '').replace(/\\D/g, '');

export const isValidCPFAlgorithm = (cpfStr) => {
  const digits = cleanCPF(cpfStr);
  if (digits.length !== 11) return false;
  if (/^(\\d)\\1{10}$/.test(digits)) return false;

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
  return db.find(p => (p.cpfClean === targetDigits || cleanCPF(p.cpf) === targetDigits)) || null;
};

/**
 * Pesquisa de Paciente por Nome Completo ou CPF (Base de Dados da Clínica)
 */
export const searchPatientsInClinicDB = (db, query) => {
  if (!query || !query.trim()) return [];
  const q = query.trim().toUpperCase();
  const qClean = cleanCPF(q);

  return db.filter(p => {
    if (qClean && qClean.length >= 3 && (p.cpfClean.includes(qClean) || cleanCPF(p.cpf).includes(qClean))) {
      return true;
    }
    return p.name.includes(q);
  });
};

/**
 * Consulta de CPF na Base da Clínica Dr. Eduardo Magalhães
 */
export const fetchCpfOnlineData = async (cpfStr, customDb = null) => {
  const dbToUse = customDb || INITIAL_PATIENT_DATABASE;
  const digits = cleanCPF(cpfStr);
  if (!isValidCPFAlgorithm(digits)) return null;

  // 1. Check local clinic database first
  const localMatch = findPatientByCPF(dbToUse, digits);
  if (localMatch) {
    return {
      name: localMatch.name,
      birthDate: localMatch.birthDate,
      phone: localMatch.phone || '',
      city: localMatch.city || '',
      state: localMatch.state || '',
      source: 'Base de Dados do Consultório (WinSoft / Dr. Eduardo)'
    };
  }

  // 2. Online Receita Federal fallback
  try {
    const response = await fetch(\`https://brasilapi.com.br/api/cpf/v1/\${digits}\`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      const data = await response.json();
      const rawName = data.name || data.nome || '';
      if (rawName && !rawName.toLowerCase().includes('paciente') && !rawName.toLowerCase().includes('registrado')) {
        return {
          name: rawName.toUpperCase(),
          birthDate: data.createdAt || data.data_nascimento || null,
          source: 'Receita Federal'
        };
      }
    }
  } catch (err) {
    console.warn('Consulta online de CPF falhou:', err);
  }

  return null;
};
`;

fs.writeFileSync('D:/AntiG/neuro.eduardomagalhaes/src/data/patientDatabase.js', jsContent, 'utf-8');
console.log('Successfully updated D:/AntiG/neuro.eduardomagalhaes/src/data/patientDatabase.js!');
