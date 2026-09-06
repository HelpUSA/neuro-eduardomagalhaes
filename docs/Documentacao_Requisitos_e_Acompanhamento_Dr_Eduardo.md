# Relatório de Especificação de Requisitos, Arquitetura & Acompanhamento de Desenvolvimento
**Cliente:** Dr. Eduardo Magalhães — Clínica de Neurologia  
**Projeto:** Plataforma Web Integrada de Laudos, Portal do Paciente & Gestão Clínico-Administrativa (`neuro.eduardomagalhaes`)  
**Data da Atualização:** 06 de Setembro de 2026  
**Status da Fase:** Mapeamento de Requisitos, Especificação da Assinatura Digital, Estrutura de Modelos & Alinhamento Clínico  

---

## 1. Introdução & Objetivo da Documentação

Este documento registra formalmente as solicitações, dúvidas e requisitos técnicos alinhados diretamente com o **Dr. Eduardo Magalhães** via comunicação oficial (WhatsApp), bem como a análise dos modelos de exames fornecidos (Eletroneuromiografia e 24 modelos de Eletroencefalograma / Mapeamento Cerebral).

O objetivo é manter um **histórico auditável de desenvolvimento**, garantindo que todas as necessidades clínicas, legais (LGPD / CFM) e de fluxo operacional da equipe sejam atendidas com máxima precisão antes da implementação final das alterações.

---

## 2. Síntese dos Requisitos Solicitados pelo Cliente (Dr. Eduardo)

| ID | Solicitação do Dr. Eduardo | Impacto Operacional / Necessidade | Solução Técnica Projetada | Status |
| :-: | :--- | :--- | :--- | :-: |
| **REQ-01** | **Privacidade da Secretária (LGPD):** A secretária deve cadastrar o paciente (CPF, nome, etc.), mas **não deve ver o laudo médico**. | Proteger dados de saúde sensíveis contra acessos não autorizados dentro da clínica. | **RBAC (Role-Based Access Control):** Perfil "Recepção" tem acesso restrito a dados cadastrais e agendamentos. A conclusão médica fica oculta para este perfil. | 🟢 Projetado |
| **REQ-02** | **Organização de Modelos de Laudos:** Deseja navegar por **pastas/subpastas** e também fazer **busca rápida** de modelos. | Facilitar a localização de dezenas de modelos de laudos (ENMG e EEG). | **Navegação Híbrida:** Árvore visual de pastas organizadas por tipo/patologia + campo de busca instantânea com autocompletar. | 🟢 Projetado |
| **REQ-03** | **Assinatura Digital & Jurídica:** Assinatura com Certificado Digital (ICP-Brasil) e visualização ilustrativa de carimbo/assinatura. | Dar respaldo jurídico ao exame digital e evitar parecer de documento falsificado. | **Autenticação Dupla:** Assinatura Digital ICP-Brasil (A1/A3) com Hash PAdES + QR Code de Verificação no rodapé do laudo + imagem ilustrativa da assinatura/carimbo. | 🟢 Projetado |
| **REQ-04** | **Certificado Restrito ao Médico:** A secretária não pode ter acesso ao certificado digital do médico. | Garantir que apenas o Dr. Eduardo assine e libere laudos. | O Certificado Digital e o PIN de assinatura ficam associados **exclusivamente à conta de login do Dr. Eduardo**. | 🟢 Projetado |
| **REQ-05** | **Anexo de Gráficos do Exame & Fim dos Erros de Envio:** Anexar o PDF com gráficos gerado pelo aparelho junto ao laudo. | Eliminar risco de envio manual do exame do paciente A para o WhatsApp do paciente B. | **Vínculo Unificado no Prontuário:** O laudo assinado e o PDF de gráficos do aparelho são anexados ao mesmo cadastro. O paciente baixa tudo no Portal. | 🟢 Projetado |
| **REQ-06** | **Estruturação dos 24 Modelos de EEG:** Incorporação dos modelos Word de Eletroencefalograma enviados. | Evitar digitação repetitiva de laudos de EEG e Mapeamento Cerebral. | **Banco de Templates EEG:** Cadastramento dos 24 modelos (Disfunção Cortical 0-3, EPI 0-5 e Normais 1-12) em variáveis dinâmicas no sistema. | 🟡 Em Estruturação |
| **REQ-07** | **Domínio do Consultório:** Dúvida sobre o endereço final de acesso (`clinicaeduardomagalhaes.com.br`). | Manter a autoridade da marca da clínica no endereço web. | O site institucional, portal e painel ficarão sob o domínio próprio do médico, integrado no Squarespace/Vercel. | 🟢 Definido |

---

## 3. Funcionamento e Digitalização dos Modelos `.docx`

### 3.1. Transição do Word para o Emissor Web Dinâmico
Atualmente, o procedimento manual exige abrir arquivos `.docx` individuais, alterar dados cadastrais no topo e salvar uma cópia. Na nova plataforma:

1. **Digitalização com Variáveis Dinâmicas:**
   Os modelos são importados para o banco de dados e parametrizados com marcadores automáticos:
   - `{{NOME_PACIENTE}}`
   - `{{DATA_NASCIMENTO}}`
   - `{{MEDICO_SOLICITANTE}}`
   - `{{DATA_EXAME}}`
   - `{{CORPO_LAUDO}}`
   - `{{CONCLUSAO_LAUDO}}`

2. **Fluxo de Emissão em 3 Passos (Menos de 1 minuto):**
   - **Passo 1 (Seleção do Paciente):** O médico escolhe o paciente cadastrado. Os dados demográficos são preenchidos automaticamente.
   - **Passo 2 (Escolha do Template):** Seleção do modelo via árvore de pastas (*EEG -> Atividade Epileptiforme*) ou busca por palavras-chave (*"Paroxismo temporal"*). O texto surge preenchido na tela e pode ser ajustado pontualmente.
   - **Passo 3 (Assinatura & Geração de PDF):** Ao clicar em "Finalizar", o sistema salva a ficha no banco de dados e gera o PDF timbrado com assinatura digital e QR Code.

---

## 4. Arquitetura da Base de Dados e Separação de Privilégios (LGPD)

O sistema utilizará uma **Base de Dados Relacional Criptografada (PostgreSQL no Railway)**:

- **Prontuário Único por Paciente:** Todos os exames do mesmo paciente (ENMG, EEG, retornos) ficam agrupados sob o seu **CPF + Data de Nascimento**.
- **Controle Rigoroso de Perfis (RBAC):**
  - **Recepção / Secretária:** Pode cadastrar pacientes, agendar atendimentos e disparar links de portal via WhatsApp. **A conclusão e os achados médicos ficam ocultos para este perfil.**
  - **Médico (Dr. Eduardo):** Acesso completo aos dados clínicos, histórico de laudos, edição técnica e acionamento da assinatura digital.

---

## 5. Arquitetura de Assinatura Eletrônica e Validação em 2 Camadas

Para garantir **respaldo jurídico total** e evitar impressões de documentos falsificados, o laudo conterá duas camadas de validação:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      PDF TIMBRADO OFICIAL DO LAUDO                      │
│                                                                         │
│  [Dados do Paciente, Tipo de Exame, Achados Clínicos e Conclusão...]    │
│                                                                         │
│ ─────────────────────────────────────────────────────────────────────── │
│  Assinatura Visual:              Assinatura Digital & Criptografia:     │
│  [ Foto Carimbo + CRM ]          [ Selo Criptográfico ICP-Brasil PAdES ]│
│  Dr. Eduardo Magalhães           Código Hash: e8f94a2b1049c0...        │
│                                  Validação via QR Code no Rodapé        │
└─────────────────────────────────────────────────────────────────────────┘
```

1. **Camada Visual (Carimbo e Assinatura):** Imagem em alta resolução do carimbo profissional com CRM e assinatura física do Dr. Eduardo.
2. **Camada Criptográfica (Certificado Digital ICP-Brasil A1/A3 - PAdES):** Aplicação de Hash PKCS#7 que sela o PDF contra qualquer alteração de terceiros. A chave fica associada exclusivamente ao login do Dr. Eduardo.
3. **Validação Antifraude por QR Code:** QR Code único no rodapé que direciona para a página de verificação da clínica (`clinicaeduardomagalhaes.com.br/validar`), confirmando a autenticidade e emissão oficial pelo médico.

---

## 6. Fluxo Unificado de Anexo dos Gráficos do Aparelho

Para eliminar o risco relatado pela clínica de enviar o arquivo de um paciente para outro via WhatsApp:

1. **Upload no Atendimento:** O arquivo PDF gerado pelo aparelho de EEG/ENMG (com os gráficos e traçados) é anexado diretamente à ficha do paciente no sistema.
2. **Fusão de Documentos:** O sistema une o **Laudo Técnico Assinado + PDF de Gráficos do Aparelho** em um único prontuário digital.
3. **Portal Autônomo do Paciente:** O paciente acessa o portal com CPF + Data Nasc e realiza o download seguro de todos os seus arquivos. A secretária envia apenas o link seguro, zerando o manuseio manual de PDFs anexos.

---

## 7. Mapeamento dos 24 Modelos de EEG / Mapeamento Cerebral Registrados

Relação dos modelos `.docx` recebidos e catalogados na pasta `docs/modelosdelaudosdeexameseletroencefalograma`:

### A. Disfunção Cortical Difusa (5 Modelos):
1. `Map Disfunção Cortical Difusa - grau 0 - IDADE.docx`
2. `Map Disfunção Cortical Difusa - grau 1 - CORRELACIONAR CLINICAMENTE.docx`
3. `Map Disfunção Cortical Difusa - grau 1 - RITMOS LENTOS OCASIONAIS.docx`
4. `Map Disfunção Cortical Difusa - grau 2.docx`
5. `Map Disfunção Cortical Difusa - grau 3.docx`

### B. Atividade Epileptiforme / Paroxística (EPI - 6 Modelos):
6. `Map EPI - 0 - SEM ATIVIDADE EPILEPTIFORME.docx`
7. `Map EPI - 0 - SONO E VIGILIA - SEM ATIVIDADE EPILEPTIFORME.docx`
8. `Map EPI - 1 - Paroxismo temporal bilateral.docx`
9. `Map EPI - 2 - Paroxismo temporal bilateral.docx`
10. `Map EPI - 3 - Paroxismo temporal bilateral.docx`
11. `Map EPI - 4 - Paroxismo temporal bilateral - com data de nascimento.docx`
12. `Map EPI - 5 - Sono e Vigília com atividade paroxistica 1).docx`

### C. Eletroencefalogramas Dentro dos Limites da Normalidade (13 Modelos):
13. `Map Normal (1).docx` até `Map Normal (12).docx` (Variações de registros em vigília, sono espontâneo, fotoestimulação e hiperventilação).

---

## 8. Matriz de Acompanhamento do Desenvolvimento (Checklist de Evolução)

| Módulo / Funcionalidade | Descrição | Status de Desenvolvimento |
| :--- | :--- | :---: |
| **Site Institucional Responsivo** | Landing page com apresentação do médico, convênios, exames e localização. | 🟢 Concluído & Publicado |
| **Portal do Paciente (Autenticação)** | Acesso seguro via CPF + Data Nasc para visualização e download de laudos em PDF. | 🟢 Concluído & Publicado |
| **Gerador Dinâmico de Laudos (UI)** | Interface gráfica para seleção de modelos e preenchimento de achados do exame. | 🟢 Concluído & Publicado |
| **Suporte Multilingue (PT, EN, ES)** | Seletor de 3 idiomas no cabeçalho e rodapé. | 🟢 Concluído & Publicado |
| **Assinatura Visual & Timbrado Oficial** | Layout em papel timbrado com carimbo e QR Code de autenticidade. | 🟢 Concluído & Publicado |
| **Cadastro dos 24 Templates de EEG** | Importação e parametrização dos 24 arquivos `.docx` de EEG no banco do sistema. | 🟡 Em Estruturação |
| **Módulo de Anexo de Gráficos do Aparelho** | Upload do PDF com traçados/gráficos do EEG para download conjunto pelo paciente. | 🟡 Em Estruturação |
| **Mecanismo de Assinatura Digital ICP-Brasil** | Integração da assinatura via certificado A1/A3 no PDF final. | 🟡 Em Planejamento |
| **Restrição Rigorosa de Secretária (RBAC)** | Ocultação automática de conclusões médicas no perfil de atendimento. | 🟡 Em Estruturação |
