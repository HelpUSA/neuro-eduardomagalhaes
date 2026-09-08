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

Abaixo estão registradas as mensagens enviadas pelo **Dr. Eduardo Magalhães** referente às melhorias de navegação nos modelos de laudo, consulta automática de pacientes por CPF (estilo Mevo), carga da base histórica da clínica (Winsoft) e gestão de usuários:

> **[15:14] Dr. Eduardo Magalhães:**  
> *"E aí amigo, tudo bem? Eu compartilhei com você um link para você acessar a pasta do Google drive onde eu salvo os modelos que eu uso. Na rotina do dia a dia acho muito prático clicar na pasta já olhar qual o modelo que quero já selecionei com mouse e pronto. No máximo abrir uma subpasta. Dentro do possível tendo esse meio de acessar eu acho ótimo porque a busca que você colocou também vai ser muito boa por palavras, então terei dois meios."*

> **[18:28] Dr. Eduardo Magalhães:**  
> *"Uma outra funcionalidade que eu gostaria que fizesse era a secretária conseguisse inserir os dados de paciente apenas digitando o CPF. Eu utilizo uma plataforma de receita digital chamada mevo que funciona dessa forma, inserindo o CPF ele automaticamente busca o nome completo e data de nascimento da pessoa eu acho que do site da receita federal."*

> **[18:48] Dr. Eduardo Magalhães:**  
> *"Eu já utilizo um sistema de base de dados para os dados cadastrais dos pacientes... Jean Cordeiro Winsoft. Mas essa plataforma mevo é uma plataforma de receita digital que existe aí na internet, a gente se cadastra e vai cadastrando cada paciente com CPF, então eu acredito que possa ter um caminho em que a secretária digitando o CPF já automaticamente seja buscado o nome completo e data de nascimento daquela pessoa..."*

---

## 1.2. Materiais Disponibilizados pelo Dr. Eduardo

O Dr. Eduardo disponibilizou o acesso às suas pastas oficiais no Google Drive contendo o acervo completo de laudos da clínica:
- 📁 **EEG MAP MODELOS:** `https://drive.google.com/drive/folders/1akreeWr-vl6rtVxiXMrrtJLC44f4HlJq`
- 📁 **ENMG Modelos:** `https://drive.google.com/drive/folders/1AEaPUdR5e7ylFZRqZR26a8m__m5Cq42K`

---

## 1.3. Matriz Consolidada de Requisitos Solicitados

| ID | Requisito / Solicitação | Diretriz de Implementação | Status |
| :-: | :--- | :--- | :-: |
| **REQ-07** | **Árvore de Pastas (Estilo Google Drive):** Navegação por 2-3 cliques de mouse nas 10 pastas oficiais de laudo. | **Navegador Visual Híbrido:** Árvore de pastas expansível estilo Google Drive com contagem de modelos + busca por digitação. | 🟢 Concluído |
| **REQ-08** | **Auto-Preenchimento por CPF (Estilo Mevo):** Digitar o CPF e buscar Nome e Data Nasc. automaticamente. | **Busca Inteligente por CPF:** Consulta local no banco Winsoft + consulta online em tempo real via API pública (Mevo Style). | 🟢 Concluído |
| **REQ-09** | **Módulo da Base Winsoft (Jean Cordeiro):** Carga da base de dados histórica de 18 anos de pacientes. | **Aba 'Base Winsoft':** Importação de listas CSV/JSON com botão "Usar no Laudo" em 1 clique. | 🟢 Concluído |
| **REQ-10** | **Gestão de Usuários & Níveis de Acesso (RBAC):** Dr. Eduardo cria, edita e revoga acessos de secretárias e médicos. | **Módulo de Gestão de Usuários (CRUD):** Modal interativo de criação/edição com seleção de Nível de Acesso (Médico, Secretária LGPD, Técnico). | 🟢 Concluído |

---

# PARTE 2: IMPLEMENTAÇÕES E COMPONENTES DESENVOLVIDOS

## 2.1. Tela de Autenticação por Usuário e Senha (Login Seguro)

- **Tela de Login Inicial:** Acesso bloqueado por e-mail e senha.
- **Botão Logout:** Encerramento seguro da sessão.

## 2.2. Módulo de Gestão de Equipe (CRUD de Usuários pelo Dr. Eduardo)

Na aba **"Gestão de Equipe (RBAC)"**, exclusiva do Dr. Eduardo Magalhães (Perfil Administrador/Médico):
- **+ Cadastrar Novo Usuário:** Formulário para cadastrar novos funcionários definindo Nome, E-mail, Senha e Perfil de Acesso.
- **Níveis de Acesso Disponíveis:**
  1. 👑 **Administrador / Médico:** Acesso total aos laudos, edição de conclusões diagnósticas, assinatura digital PAdES e gestão da equipe.
  2. 📋 **Secretária / Atendimento (LGPD):** Acesso liberado ao cadastro por CPF, anexo de traçados e envio por WhatsApp. Conclusão médica travada sob sigilo LGPD.
  3. 🔬 **Técnico de Exames:** Acesso ao anexo de arquivos brutos do aparelho e prontuários.
- **Ações de Edição & Exclusão:** Ícones para modificar permissões, redefinir senhas ou revogar acessos.

---

# PARTE 3: ROTEIRO PASSO A PASSO DE USO (DR. EDUARDO & SECRETÁRIA)

### 1️⃣ Passo 1: Autenticação de Acesso (Login com E-mail e Senha)
1. Acesse o site oficial: [https://neuro.eduardomagalhaes.helpusbr.com/](https://neuro.eduardomagalhaes.helpusbr.com/)
2. Clique no botão **"Área Médica / Painel"** no topo da página.
3. Digite o E-mail e a Senha cadastrados:
   - 👑 **Dr. Eduardo:** `eduardo@clinica.com.br` (Senha: `123`)
   - 📋 **Secretária:** `juliana@clinica.com.br` (Senha: `123`)

### 2️⃣ Passo 2: Gestão de Usuários & Níveis de Acesso (Exclusivo Dr. Eduardo)
1. Estando logado como **Dr. Eduardo Magalhães**, clique na aba **"Gestão de Equipe"**.
2. Clique no botão **"+ Cadastrar Novo Usuário"** para registrar uma nova secretária ou médico.
3. Preencha o Nome, E-mail, Senha e selecione o **Nível de Acesso (RBAC)**.
4. Para alterar ou remover acessos de funcionários, utilize os botões de **Editar (Lápis)** ou **Excluir (Lixeira)** ao lado de cada usuário.

---

# RESUMO DAS URLs EM PRODUÇÃO

- 🌐 **Site Principal & Portal da Clínica:** [https://neuro.eduardomagalhaes.helpusbr.com/](https://neuro.eduardomagalhaes.helpusbr.com/)
- 🌐 **Portal Global HelpUS (Página de Clientes):** [https://www.helpusbr.com](https://www.helpusbr.com)
