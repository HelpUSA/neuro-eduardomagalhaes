export const EXAM_CATEGORIES = [
  { id: 'enmg', name: 'Eletroneuromiografia (ENMG)', icon: 'Activity' },
  { id: 'eeg_disfuncao', name: 'EEG - Disfunção Cortical Difusa', icon: 'Brain' },
  { id: 'eeg_epi', name: 'EEG - Atividade Epileptiforme (EPI)', icon: 'Zap' },
  { id: 'eeg_normal', name: 'EEG - Limites da Normalidade', icon: 'CheckCircle' }
];

export const ALL_EXAM_TEMPLATES = [
  // --- ENMG TEMPLATES ---
  {
    id: 'enmg_stc_grau2',
    categoryId: 'enmg',
    folderName: 'ENMG / Neuropatias Compressivas',
    title: 'ENMG - STC Grau 2 Bilateral (Síndrome do Túnel do Carpo)',
    keywords: ['Túnel do Carpo', 'STC', 'Grau 2', 'Desmielinizante', 'Bilateral', 'Mediano', 'Membros Superiores'],
    motorConduction: 'Realizada em nervos ulnares e medianos. Observamos amplitudes conservadas, com velocidades de condução normais, e latências distais limítrofes em medianos. Em nervos ulnares não foram observadas anormalidades.',
    sensoryConduction: 'Realizada em nervos ulnares, medianos e radiais. Em nervos medianos observamos potenciais de ação com latências prolongadas, velocidades de condução diminuídas e amplitudes normais. Em nervos ulnares e radiais não foram observadas anormalidades.',
    fWave: 'Pesquisada em nervos medianos e ulnares, com latências mínimas normais.',
    emgText: 'Realizada com agulha monopolar em músculos paracervicais, deltoide, bíceps, extensor comum dos dedos, primeiro interósseo dorsal e abdutor curto do polegar. Evidenciou ausência de atividade espontânea (como fibrilações e ondas agudas positivas) e potenciais de ação normais.',
    conclusion: 'Exame compatível com neuropatia do mediano ao nível do carpo, com comprometimento parcial de fibras sensitivas, de caráter desmielinizante (grau 2), bilateral. Não foram evidenciados sinais de comprometimento radicular ou miopático no presente exame.'
  },
  {
    id: 'enmg_normal_mms',
    categoryId: 'enmg',
    folderName: 'ENMG / Exames Normais',
    title: 'ENMG - Membros Superiores Dentro da Normalidade',
    keywords: ['ENMG Normal', 'Membros Superiores', 'Sem Neuropatia', 'Condução Normal'],
    motorConduction: 'Realizada em nervos ulnares, medianos e radiais bilateralmente. Amplitudes, velocidades de condução e latências distais dentro dos padrões de normalidade.',
    sensoryConduction: 'Potenciais de ação sensitivos com amplitudes, latências e velocidades de condução preservadas em todos os nervos testados.',
    fWave: 'Latências mínimas da onda F normais em nervos medianos e ulnares.',
    emgText: 'Eletromiografia de agulha sem sinais de desnervação ativa e com recrutamento de unidades motoras normal.',
    conclusion: 'Estudo eletroneuromiográfico dos membros superiores dentro dos limites da normalidade.'
  },

  // --- EEG DISFUNÇÃO CORTICAL DIFUSA ---
  {
    id: 'eeg_disf_grau0',
    categoryId: 'eeg_disfuncao',
    folderName: 'EEG / Disfunção Cortical',
    title: 'EEG - Disfunção Cortical Difusa Grau 0 (Mínima / Compatível com Idade)',
    keywords: ['Discretamente Lentificado', 'Grau 0', 'Disfunção Cortical Mínima', 'Idade'],
    motorConduction: 'Registro em vigília. Ritmo de base occipital Alfa regular a 8-9 Hz, simétrico e síncrono, com atenuação adequada à abertura dos olhos.',
    sensoryConduction: 'Fotoestimulação e hiperventilação não alteram significativamente o ritmo de base.',
    fWave: 'Mapeamento cerebral revela topografia de frequências preservada com discreto desaceleramento compatível com a faixa etária.',
    emgText: 'Registro de eletroencefalografia digital sem paroxismos epileptiformes.',
    conclusion: 'Eletroencefalograma digital e mapeamento cerebral evidenciando disfunção cortical difusa de grau 0 (mínima), podendo estar relacionada à faixa etária do paciente.'
  },
  {
    id: 'eeg_disf_grau1_ocasionais',
    categoryId: 'eeg_disfuncao',
    folderName: 'EEG / Disfunção Cortical',
    title: 'EEG - Disfunção Cortical Difusa Grau 1 (Ritmos Lentios Ocasionais)',
    keywords: ['Discreta', 'Grau 1', 'Ritmos Lentios', 'Theta Ocasional', 'Disfunção Cortical'],
    motorConduction: 'Ritmo Alfa posterior regular a 9 Hz. Ocorrência ocasional de ondas lentas Theta de média amplitude em áreas temporo-frontais.',
    sensoryConduction: 'Hiperventilação acentua discretamente a proporção de ritmos lentos sem precipitar descargas paroxísticas.',
    fWave: 'Mapeamento cerebral quantitativo demonstrando predomínio alfa posterior com assimetrias transitórias não focais.',
    emgText: 'Ausência de ondas agudas ou pontas epileptiformes registradas.',
    conclusion: 'Exame compatível com disfunção cortical difusa de grau 1 (leve), caracterizada pelo aparecimento ocasional de ritmos lentos intercalados ao ritmo de base.'
  },
  {
    id: 'eeg_disf_grau2',
    categoryId: 'eeg_disfuncao',
    folderName: 'EEG / Disfunção Cortical',
    title: 'EEG - Disfunção Cortical Difusa Grau 2 (Moderada)',
    keywords: ['Moderada', 'Grau 2', 'Lentificação Difusa', 'Theta e Delta', 'Disfunção Cortical'],
    motorConduction: 'Desorganização moderada do ritmo de base Alfa. Interpolação frequente de ondas Theta e surtos curtos de ondas Delta difusas.',
    sensoryConduction: 'Abertura dos olhos produz atenuação incompleta do ritmo posterior.',
    fWave: 'Mapeamento quantitativo revela desvio da potência espectral para bandas de menor frequência (Theta/Delta).',
    emgText: 'Registro sem episódios de ponta-onda ou paroxismos focais nítidos.',
    conclusion: 'Eletroencefalograma e mapeamento cerebral com achados sugestivos de disfunção cortical difusa de grau 2 (moderada).'
  },
  {
    id: 'eeg_disf_grau3',
    categoryId: 'eeg_disfuncao',
    folderName: 'EEG / Disfunção Cortical',
    title: 'EEG - Disfunção Cortical Difusa Grau 3 (Acentuada)',
    keywords: ['Acentuada', 'Grau 3', 'Lentificação Grave', 'Delta Difuso', 'Disfunção Grave'],
    motorConduction: 'Ausência de ritmo Alfa organizado. Ritmo de base dominado por atividade Delta e Theta de elevada amplitude difusamente.',
    sensoryConduction: 'Sem reatividade clara a estímulos somatossensoriais ou fóticos.',
    fWave: 'Mapeamento cerebral com lentificação difusa acentuada bilateral.',
    emgText: 'Trilhas eletroencefalográficas com graves alterações no ritmo eletrogênico cerebral.',
    conclusion: 'Exame compatível com disfunção cortical difusa de grau 3 (acentuada/grave). Correlacionar com quadro clínico neurológico.'
  },

  // --- EEG EPILEPSIA / PAROXISMOS (EPI) ---
  {
    id: 'eeg_epi_0_sem',
    categoryId: 'eeg_epi',
    folderName: 'EEG / Epilepsia & Paroxismos',
    title: 'EEG Map EPI - 0 (Sem Atividade Epileptiforme)',
    keywords: ['EPI 0', 'Sem Epilepsia', 'Sem Atividade Epileptiforme', 'Normal EPI'],
    motorConduction: 'Registro em vigília. Ritmo Alfa occipital síncrono e simétrico a 10 Hz.',
    sensoryConduction: 'Respostas normais à fotoestimulação intermitente.',
    fWave: 'Mapeamento cerebral dentro dos limites normais.',
    emgText: 'Não foram observadas pontas, agulhas, complexos espícula-onda ou paroxismos durante todo o registro.',
    conclusion: 'Eletroencefalograma digital e mapeamento cerebral sem evidência de atividade epileptiforme durante o presente registro.'
  },
  {
    id: 'eeg_epi_1_paroxismo_temporal',
    categoryId: 'eeg_epi',
    folderName: 'EEG / Epilepsia & Paroxismos',
    title: 'EEG Map EPI - 1 (Paroxismo Temporal Bilateral Leve)',
    keywords: ['EPI 1', 'Paroxismo Temporal', 'Bilateral', 'Epileptiforme Leve', 'Espículas'],
    motorConduction: 'Ritmo de base Alfa preservado a 9.5 Hz. Ocorrência de paroxismos de ondas agudas de projeção temporal bilateral.',
    sensoryConduction: 'Manobra de hiperventilação potencializa o aparecimento de surtos paroxísticos temporais.',
    fWave: 'Mapeamento quantitativo destaca foco de assimetria de voltagem em regiões temporais.',
    emgText: 'Descargas paroxísticas de projeção temporal ocasional.',
    conclusion: 'Registro com achados de atividade paroxística epileptiforme de projeção temporal bilateral (Grau 1).'
  },
  {
    id: 'eeg_epi_5_sono_vigilia',
    categoryId: 'eeg_epi',
    folderName: 'EEG / Epilepsia & Paroxismos',
    title: 'EEG Map EPI - 5 (Sono e Vigília com Atividade Paroxística Frequente)',
    keywords: ['EPI 5', 'Sono e Vigília', 'Paroxística Frequente', 'Ponta Onda', 'Crises'],
    motorConduction: 'Registros obtidos em estados de vigília e sono espontâneo. Elementos fisiológicos do sono (fusos e complexos K) identificados.',
    sensoryConduction: 'No sono leve, observa-se acentuação marcante de descargas paroxísticas de ponta-onda lenta difusas e temporais.',
    fWave: 'Mapeamento cerebral com focos múltiplos e sincronia bilateral secundária.',
    emgText: 'Frequente atividade epileptiforme registrada tanto na vigília quanto durante as etapas de sono.',
    conclusion: 'Eletroencefalograma digital de vigília e sono com frequente atividade paroxística epileptiforme difusa e focal.'
  },

  // --- EEG DENTRO DOS LIMITES DA NORMALIDADE ---
  {
    id: 'eeg_normal_padrao1',
    categoryId: 'eeg_normal',
    folderName: 'EEG / Limites da Normalidade',
    title: 'EEG Digital Normal (Padrão 1 - Vigília e Sono)',
    keywords: ['Normal 1', 'EEG Normal', 'Vigília e Sono', 'Sem Alterações'],
    motorConduction: 'Ritmo posterior Alfa regular a 10 Hz, síncrono, simétrico e bem reativo à abertura dos olhos.',
    sensoryConduction: 'Fotoestimulação intermitente sem anomalias. Hiperventilação sem alterar o ritmo.',
    fWave: 'Mapeamento cerebral quantitativo com distribuição topográfica de frequências e amplitudes normais.',
    emgText: 'Não foram observadas atividades irritativas paroxísticas ou focais.',
    conclusion: 'Eletroencefalograma digital e mapeamento cerebral de vigília e sono dentro dos limites da normalidade para a idade.'
  }
];
