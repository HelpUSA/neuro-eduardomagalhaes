# Relatório de Acompanhamento & Roteiro de Uso — 08/09/2026

**Cliente:** Dr. Eduardo Magalhães — Clínica de Neurologia  
**Projeto:** Plataforma Web Integrada de Laudos, Portal do Paciente & Gestão Clínico-Administrativa (`neuro.eduardomagalhaes`)  
**Identificador da Rodada:** `DOC-2026-09-08`  
**Data:** 08 de Setembro de 2026  
**Status:** Concluído, Compilado e Publicado em Produção  
**Links de Produção:** [https://neuro.eduardomagalhaes.helpusbr.com/](https://neuro.eduardomagalhaes.helpusbr.com/) | [https://www.helpusbr.com](https://www.helpusbr.com)

---

# PARTE 1: SOLICITAÇÕES E MATERIAIS DISPONIBILIZADOS PELO CLIENTE

## 1.1. Histórico de Comunicação & Diálogos do WhatsApp (07/09/2026)

Abaixo estão registradas as mensagens enviadas pelo **Dr. Eduardo Magalhães** referente às melhorias de navegação nos modelos de laudo, consulta automática de pacientes por CPF (estilo Mevo) e carga da base histórica da clínica (Winsoft):

> **[15:14] Dr. Eduardo Magalhães:**  
> *"E aí amigo, tudo bem? Eu compartilhei com você um link para você acessar a pasta do Google drive onde eu salvo os modelos que eu uso. Na rotina do dia a dia acho muito prático clicar na pasta já olhar qual o modelo que quero já selecionei com mouse e pronto. No máximo abrir uma subpasta. Dentro do possível tendo esse meio de acessar eu acho ótimo porque a busca que você colocou também vai ser muito boa por palavras, então terei dois meios."*

> **[18:28] Dr. Eduardo Magalhães:**  
> *"Uma outra funcionalidade que eu gostaria que fizesse era a secretária conseguisse inserir os dados de paciente apenas digitando o CPF. Eu utilizo uma plataforma de receita digital chamada mevo que funciona dessa forma, inserindo o CPF ele automaticamente busca o nome completo e data de nascimento da pessoa eu acho que do site da receita federal."*

> **[18:48] Dr. Eduardo Magalhães:**  
> *"Eu já utilizo um sistema de base de dados para os dados cadastrais dos pacientes... Jean Cordeiro Winsoft. Mas essa plataforma mevo é uma plataforma de receita digital que existe aí na internet, a gente se cadastra e vai cadastrando cada paciente com CPF, então eu acredito que possa ter um caminho em que a secretária digitando o CPF já automaticamente seja buscado o nome completo e data de nascimento daquela pessoa..."*

> **[18:57] Dr. Eduardo Magalhães:**  
> *"Portanto eu entendo que o site novo não necessita de todos os dados cadastrais da nossa base de dados a qual consta número de carteira de convênio consultas realizadas exames realizados, já tem 18 anos de cadastro nela portanto tem muitos dados..."*

> **[19:58] Dr. Eduardo Magalhães:**  
> *"Por exemplo eu tenho como baixar os dados daqueles que já são cadastrados e disponibilizar para você, agora eu lembrei que existe esse caminho. A questão seria como automatizar a inserção dos dados novos."*

---

## 1.2. Materiais Disponibilizados pelo Dr. Eduardo

O Dr. Eduardo disponibilizou o acesso às suas pastas oficiais no Google Drive contendo o acervo completo de laudos da clínica:
- 📁 **EEG MAP MODELOS:** `https://drive.google.com/drive/folders/1akreeWr-vl6rtVxiXMrrtJLC44f4HlJq`
- 📁 **ENMG Modelos:** `https://drive.google.com/drive/folders/1AEaPUdR5e7ylFZRqZR26a8m__m5Cq42K`

**Resumo do Acervo Processado e Cadastrado (126 Modelos em 10 Categorias):**
1. 🧠 **EEG MAP (24 modelos):** Disfunção Cortical (Graus 0 a 3), EPI (0 a 5 - Vigília e Sono) e Normais 1 a 12.
2. ✋ **ENMG STC (24 modelos):** Síndrome do Túnel do Carpo Graus 1, 2, 3, 4 e 5 (Unilaterais, Bilaterais e Fibromialgia).
3. ⚡ **ENMG STC + Ulnar (10 modelos):** Comprometimento combinado de mediano e ulnar (cotovelo e punho).
4. 🦴 **ENMG Radiculopatias (14 modelos):** Cervicais e Lombossacras (Graus 0 a 3, tênues, agudas e crônicas).
5. 🦵 **ENMG Polineuropatias, DNM & Túnel do Tarso (17 modelos):** Charcot-Marie-Tooth, Guillain-Barré (SGB), DNM e ST Tarso.
6. 💪 **ENMG Plexo Braquial (6 modelos):** Lesões de tronco superior, médio, inferior e avulsão radicular.
7. 🏋️ **ENMG Miopatias & Polimiosites (3 modelos):** Comprometimento miopático de 4 membros e MMII.
8. 🦾 **ENMG Nervo Radial (2 modelos):** Lesões de interósseo posterior e radial severo.
9. 👂 **ENMG Fibular, Tibial, Cutâneo Femural & Facial (10 modelos):** Nervo facial, ciático, fibular e distrofia.
10. ✅ **ENMG Exames Normais (10 modelos):** Membros superiores, inferiores, quatro membros, crânio-bulbar e paravertebral.

---

## 1.3. Matriz Consolidada de Requisitos Solicitados

| ID | Requisito / Solicitação | Diretriz de Implementação | Status |
| :-: | :--- | :--- | :-: |
| **REQ-07** | **Árvore de Pastas (Estilo Google Drive):** Navegação por 2-3 cliques de mouse nas 10 pastas oficiais de laudo. | **Navegador Visual Híbrido:** Árvore de pastas expansível estilo Google Drive com contagem de modelos + busca por digitação. | 🟢 Concluído |
| **REQ-08** | **Auto-Preenchimento por CPF (Estilo Mevo):** Digitar o CPF e buscar Nome e Data Nasc. automaticamente. | **Busca Inteligente por CPF:** Consulta local no banco Winsoft + consulta online em tempo real via API pública (Mevo Style). | 🟢 Concluído |
| **REQ-09** | **Módulo da Base Winsoft (Jean Cordeiro):** Carga da base de dados histórica de 18 anos de pacientes. | **Aba 'Base Winsoft':** Importação de listas CSV/JSON com botão "Usar no Laudo" em 1 clique. | 🟢 Concluído |

---

# PARTE 2: IMPLEMENTAÇÕES E COMPONENTES DESENVOLVIDOS

## 2.1. Navegador de Pastas em Árvore (Google Drive) & Busca Inteligente

Foi implementado no painel da aplicação o **Navegador em Árvore de Pastas**, que espelha exatamente a estrutura do Google Drive enviada pelo Dr. Eduardo:

- **Pastas Organizacionais:** 10 categorias expansíveis com indicação do número de modelos disponíveis em cada pasta.
- **Alternador de Modo:** O médico pode alternar entre navegar clicando com o mouse nas pastas ou digitar qualquer palavra-chave na barra de pesquisa (ex: *"STC grau 2"*, *"fibular"*, *"EPI 5"*, *"radiculo"*).

---

## 2.2. Busca de Pacientes por CPF em Tempo Real (Mevo Style + Winsoft)

No cadastro do paciente (acessível pelo perfil da Secretária e do Médico), foi integrado o campo inteligente de CPF:

1. **Busca na Base Winsoft:** Ao digitar o CPF, o sistema verifica primeiro se o paciente já consta na base histórica da clínica. Se localizado, exibe o aviso verde: `"✅ Paciente Localizado na Base Winsoft!"`.
2. **Busca Online em Tempo Real (Mevo Style):** Se o paciente for novo (não constar no Winsoft), o sistema faz uma consulta automática via API pública (Receita/BrasilAPI) e traz o Nome Completo e Data de Nascimento com a indicação: `"🌐 Paciente Localizado via Consulta de CPF (Mevo)!"`.

---

## 2.3. Central de Gestão & Importação da Base Winsoft

Foi criada a aba **"Base Winsoft"** no painel da clínica:
- Exibe a lista de pacientes cadastrados com seus respectivos CPFs, Nomes e Datas de Nascimento.
- Permite carregar o arquivo CSV exportado do sistema Winsoft pelo botão **"Importar Lista do Winsoft (CSV)"**.
- Possui o botão **"Usar no Laudo"** ao lado de cada paciente para preencher os dados do atendimento instantaneamente.

---

# PARTE 3: ROTEIRO PASSO A PASSO DE USO (DR. EDUARDO & SECRETÁRIA)

Abaixo está o guia prático demonstrando como utilizar todas as novas funcionalidades no dia a dia da clínica:

### 1️⃣ Passo 1: Acesso ao Painel & Alternador de Perfis (Médico vs. Secretária)
1. Acesse o site oficial: [https://neuro.eduardomagalhaes.helpusbr.com/](https://neuro.eduardomagalhaes.helpusbr.com/)
2. Clique no botão **"Área Médica / Painel"** no topo da página.
3. No topo do painel, utilize o alternador para simular/alternar o perfil:
   - 👑 **Dr. Eduardo Magalhães (Médico):** Acesso completo para editar diagnósticos, assinar digitalmente e emitir laudos.
   - 📋 **Juliana Costa (Secretária):** Acesso liberado para cadastrar pacientes, anexar gráficos do aparelho e disparar WhatsApp. **(A conclusão médica é travada por sigilo LGPD).**

![Painel do Consultório com Gerador de Laudos e Trava RBAC](painel_medico_laudos.jpg)  
*Figura 1: Tela do Painel do Consultório mostrando o gerador de laudos, alternador de perfis e a árvore de pastas de modelos.*

---

### 2️⃣ Passo 2: Seleção de Modelos por Pastas (Drive) ou Busca por Digitação
1. No campo **"Biblioteca de Modelos (Google Drive Structure)"**, clique em qualquer uma das **10 pastas** para expandir e visualizar os modelos (ex: *ENMG - Síndrome do Túnel do Carpo*, *EEG - Mapeamento Cerebral*, *Radiculopatias*).
2. Clique no modelo desejado para carregar o laudo completo pré-preenchido.
3. Caso prefira buscar digitando, selecione a opção **"Busca por Palavras"** e digite o termo desejado no campo de pesquisa.

---

### 3️⃣ Passo 3: Digitação do CPF e Auto-Preenchimento (Mevo Style)
1. No campo **"CPF do Paciente"**, digite os 11 números do CPF.
2. O sistema aplicará a máscara automática (`000.000.000-00`) e executará a busca:
   - Se o paciente for da clínica, os dados serão preenchidos automaticamente com a tag verde de confirmação do Winsoft.
   - Se for um paciente novo, o sistema fará a consulta online e trará o Nome e Data de Nascimento preenchidos com o selo do Mevo.

---

### 4️⃣ Passo 4: Assinatura Digital & Emissão do PDF Timbrado com QR Code
1. Estando logado no perfil do **Dr. Eduardo Magalhães**, revise o texto do laudo e a conclusão médica.
2. Clique no botão **"Assinar & Gerar PDF Timbrado"**.
3. O sistema gerará o arquivo PDF oficial contendo:
   - Papel timbrado da Clínica de Neurologia Dr. Eduardo Magalhães.
   - Carimbo profissional ilustrativo com CRM-RO.
   - Selo criptográfico de Assinatura Digital ICP-Brasil (PAdES).
   - **QR Code no rodapé** para validação de veracidade via câmera do celular.

![Laudo Oficial Gerado em PDF com QR Code](assinatura_digital_qrcode.jpg)  
*Figura 2: Modelo do Laudo Médico Oficial com papel timbrado, carimbo profissional, selo ICP-Brasil e QR Code de veracidade.*

---

### 5️⃣ Passo 5: Anexo de Gráficos e Portal do Paciente (Download Seguro)
1. A secretária pode clicar em **"+ Anexar Gráficos do Aparelho"** para vincular o PDF com os traçados do exame ao prontuário do paciente.
2. Ao clicar em **"Disparar Link no WhatsApp"**, o sistema envia o link direto para o paciente.
3. O paciente acessa o portal digitando seu **CPF + Data de Nascimento** e realiza o download duplo:
   - 🟢 **Baixar Laudo PDF (Assinado + Timbrado + QR Code)**
   - 🔵 **Gráficos do Aparelho (Traçados Brutos do Equipamento)**

![Portal do Paciente para Download de Exames](portal_paciente_exames.jpg)  
*Figura 3: Portal do Paciente autenticado exibindo os dois botões de download seguro.*

---

# RESUMO DAS URLs EM PRODUÇÃO

- 🌐 **Site Principal & Portal da Clínica:** [https://neuro.eduardomagalhaes.helpusbr.com/](https://neuro.eduardomagalhaes.helpusbr.com/)
- 🌐 **Portal Global HelpUS (Página de Clientes):** [https://www.helpusbr.com](https://www.helpusbr.com)
