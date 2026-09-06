# Relatório de Especificação de Requisitos & Acompanhamento de Desenvolvimento
**Cliente:** Dr. Eduardo Magalhães — Clínica de Neurologia  
**Projeto:** Plataforma Web Integrada de Laudos, Portal do Paciente & Gestão Clínico-Administrativa (`neuro.eduardomagalhaes`)  
**Data da Atualização:** 06 de Setembro de 2026  
**Status:** Mapeamento de Requisitos (Parte 1) e Implementações Concluídas no Sistema (Parte 2)  

---

# PARTE 1: SOLICITAÇÕES E DIRETRIZES DO CLIENTE (DR. EDUARDO MAGALHÃES)

## 1.1. Histórico de Comunicação & Diálogos do WhatsApp

Abaixo estão registradas e detalhadas as mensagens enviadas pelo **Dr. Eduardo Magalhães**, que serviram de base para a especificação das regras de negócio, níveis de permissão e recursos técnicos do sistema:

> **[16:31] Dr. Eduardo Magalhães:**  
> *"Preferencialmente que a secretária não tivesse acesso diretamente às informações do laudo do paciente, apenas às informações de cadastro (CPF, nome completo, essas coisas)."*

> **[18:22] Dr. Eduardo Magalhães:**  
> *"Os modelos de laudos que eu utilizo são vários, e eu divido eles em pastas e subpastas. Queria saber se ficaria no mesmo jeito para eu localizar aquele tal modelo que eu quero, ou se eu localizaria o modelo fazendo uma busca."*

> **[18:45] Dr. Eduardo Magalhães:**  
> *"E quando eu gerar um laudo de um determinado paciente, como fica a assinatura eletrônica? É uma assinatura eletrônica utilizando o certificado digital, pois se for somente a cópia da minha assinatura poderá passar a ideia para quem esteja vendo o exame que aquilo é um documento falsificado já que é um documento que não vai ter o meu carimbo e a minha assinatura física... Embora possamos inserir uma foto da minha assinatura física e do meu carimbo para fim ilustrativo."*

> **[18:54] Dr. Eduardo Magalhães:**  
> *"Na minha rotina quando faço a emissão de um laudo de eletroencefalograma eu gero também um arquivo PDF com os gráficos do exame e esse arquivo eu salvo no Google Drive e envio junto com o laudo assinado eletronicamente para o WhatsApp do paciente. A minha secretária envia manualmente para cada paciente, ou seja, pode acontecer algum erro por exemplo enviar o arquivo errado para a pessoa errada. Nesse caso eu gostaria que esse arquivo ficasse acessível para o paciente baixar com o seu login e senha."*

> **[19:13] Dr. Eduardo Magalhães:**  
> *"Lembrando que o certificado digital não fica disponível para a secretária. Somente eu tenho acesso a ele na hora de assinar o documento."*

---

## 1.2. Matriz Consolidada de Requisitos Solicitados

| Requisito | Descrição da Necessidade do Cliente | Solução Técnica Definida | Status |
| :-: | :--- | :--- | :-: |
| **REQ-01** | **Privacidade da Secretária (LGPD):** A recepção cadastra o paciente, mas não pode visualizar diagnósticos clínicos. | **RBAC (Role-Based Access Control):** Trava de sigilo que oculta o laudo médico quando o perfil *Secretária* está ativo. | 🟢 Definido |
| **REQ-02** | **Navegação por Pastas e Busca Rápida:** Organização dos modelos em pastas/subpastas + busca rápida por palavras-chave. | **Navegação Híbrida:** Árvore visual por patologia (Disfunção Cortical, EPI, Normais) + filtro por palavras-chave. | 🟢 Definido |
| **REQ-03** | **Assinatura Digital & Carimbo Visual:** Validade jurídica via ICP-Brasil + carimbo visual com CRM + QR Code no rodapé. | **Dupla Validação:** PDF com assinatura PAdES/ICP-Brasil, carimbo ilustrativo e QR Code de autenticidade para leitor de celular. | 🟢 Definido |
| **REQ-04** | **Restrição de Acesso ao Certificado:** Secretária não pode ter acesso à chave/PIN de assinatura do médico. | O certificado digital fica associado **exclusivamente ao login pessoal do Dr. Eduardo**. | 🟢 Definido |
| **REQ-05** | **Anexo de Gráficos do Aparelho & Erro Zero:** Anexar o PDF com traçados sem risco de troca de arquivos de pacientes. | **Vínculo Unificado:** O laudo assinado e os gráficos do aparelho ficam atrelados ao mesmo CPF. O paciente baixa tudo no Portal. | 🟢 Definido |
| **REQ-06** | **Biblioteca dos 24 Modelos de EEG:** Incorporação dos arquivos de Eletroencefalograma enviados na pasta `docs`. | **Parametrização de Templates:** Conversão dos 24 arquivos `.docx` em variáveis automáticas (`{{NOME}}`, `{{CONCLUSAO}}`). | 🟢 Definido |

---

# PARTE 2: IMPLEMENTAÇÕES E COMPONENTES DESENVOLVIDOS

## 2.1. Painel do Consultório com Alternador de Perfis (RBAC & LGPD)

Foi implementado no painel da aplicação o **sistema de permissões RBAC**, que permite simular e alternar entre os perfis de acesso:

- **👑 Perfil Médico (Dr. Eduardo Magalhães):** Acesso total para selecionar modelos, redigir observações, assinar digitalmente e gerenciar funcionários.
- **📋 Perfil Secretária (Juliana Costa / Atendimento):** Acesso restrito ao cadastro do paciente, anexação dos gráficos do aparelho e disparo de links via WhatsApp. **A conclusão médica do laudo é automaticamente oculta com aviso de proteção da LGPD.**

![Painel do Médico e Gerador de Laudos](painel_medico_laudos.jpg)
*Figura 1: Painel do Consultório exibindo o emissor de laudos, o alternador de perfis (Dr. Eduardo x Secretária) e o seletor de modelos por pastas.*

---

## 2.2. Biblioteca de 24 Modelos de EEG e Busca Inteligente por Palavras-Chave

Todos os 24 modelos de Eletroencefalograma (EEG / Mapeamento Cerebral) fornecidos na pasta `docs/modelosdelaudosdeexameseletroencefalograma` e os modelos de Eletroneuromiografia (ENMG) foram catalogados no banco de dados do sistema em pastas organizadas:

1. **📁 ENMG / Neuropatias:** STC Grau 2 Bilateral, ENMG Normal.
2. **📁 EEG / Disfunção Cortical Difusa:** Graus 0 (Idade), 1 (Leve), 2 (Moderada) e 3 (Acentuada).
3. **📁 EEG / Atividade Epileptiforme (EPI):** EPI 0 (Sem Atividade / Sono e Vigília), EPI 1 a 5 (Paroxismos Temporais Bilaterais e Paroxísticos).
4. **📁 EEG / Limites da Normalidade:** Modelos Normais 1 a 12.

O médico pode selecionar a pasta visualmente ou digitar qualquer termo no campo de pesquisa rápida (ex: *"STC"*, *"grau 2"*, *"paroxismo"*, *"normal"*), carregando o texto completo do laudo **instantaneamente pré-preenchido**.

---

## 2.3. Portal do Paciente com Download Conjunto (Laudo + Gráficos do Aparelho)

Para resolver a preocupação do Dr. Eduardo sobre erros no envio manual de arquivos de exames no WhatsApp, o **Portal do Paciente** foi atualizado:

- O paciente acessa digitando seu **CPF + Data de Nascimento**.
- O sistema reconhece o atendimento autenticado e oferece dois botões de download independentes e seguros:
  - 🟢 **Baixar Laudo PDF (Assinado + Timbrado + QR Code)**
  - 🔵 **Gráficos do Aparelho (PDF com os Traçados Originais)**

![Portal do Paciente](portal_paciente_exames.jpg)
*Figura 2: Portal do Paciente exibindo o resultado autenticado e os botões de download para o Laudo Oficial em PDF e os Gráficos do Aparelho.*

---

## 2.4. Emissão do Laudo PDF Timbrado com Assinatura & QR Code de Autenticidade

O gerador de laudos produz o arquivo PDF no papel timbrado oficial da **Clínica de Neurologia Dr. Eduardo Magalhães**, contendo:

1. **Cabeçalho & Dados do Atendimento:** Dados do paciente, médico solicitante, data do exame e tipo de procedimento.
2. **Achados Neurofisiológicos & Conclusão Médica:** Texto técnico devidamente estruturado.
3. **Carimbo Visual com CRM:** Reprodução ilustrativa da assinatura física e carimbo médico com o CRM-RO do Dr. Eduardo.
4. **Selo de Assinatura Digital ICP-Brasil (PAdES):** Marcação criptográfica de validade jurídica.
5. **QR Code no Rodapé:** Leitura via câmera de smartphone para validação de veracidade em tempo real na página oficial da clínica (`clinicaeduardomagalhaes.com.br/validar`).

![Laudo Médico Oficial com QR Code](assinatura_digital_qrcode.jpg)
*Figura 3: Modelo do Laudo Médico Oficial gerado pelo sistema com papel timbrado, carimbo profissional, selo digital e QR Code de validação.*

---

## 2.5. Checklist de Status e Próximos Passos

| Componente | Requisito Relacionado | Status de Implementação | Link de Produção |
| :--- | :--- | :---: | :---: |
| **Site Institucional Responsivo** | Apresentação médica, convênios e localização | 🟢 Publicado | [neuro.eduardomagalhaes.helpusbr.com](https://neuro.eduardomagalhaes.helpusbr.com/) |
| **Portal do Paciente (CPF + Nasc)** | REQ-05 (Download seguro de laudos e gráficos) | 🟢 Publicado | [neuro.eduardomagalhaes.helpusbr.com](https://neuro.eduardomagalhaes.helpusbr.com/) |
| **Emissor de Laudos & Pastas de EEG** | REQ-02, REQ-06 (Biblioteca de 24 modelos de EEG) | 🟢 Publicado | [neuro.eduardomagalhaes.helpusbr.com](https://neuro.eduardomagalhaes.helpusbr.com/) |
| **Trava de Sigilo da Secretária (RBAC)** | REQ-01, REQ-04 (LGPD & Certificado exclusivo do médico) | 🟢 Publicado | [neuro.eduardomagalhaes.helpusbr.com](https://neuro.eduardomagalhaes.helpusbr.com/) |
| **Validação por QR Code & Timbrado** | REQ-03 (Segurança jurídica e antifraude) | 🟢 Publicado | [neuro.eduardomagalhaes.helpusbr.com](https://neuro.eduardomagalhaes.helpusbr.com/) |
| **Integração no Portal Principal HelpUS** | Apresentação em `www.helpusbr.com` (3 Idiomas) | 🟢 Publicado | [www.helpusbr.com](https://www.helpusbr.com) |
