import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8.5)
        self.setFillColor(colors.HexColor("#64748B"))
        
        if self._pageNumber > 1:
            self.drawString(54, 800, "Relatório de Acompanhamento & Roteiro de Uso | Clínica Dr. Eduardo Magalhães")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 792, 541, 792)
        
        footer_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(541, 32, footer_text)
        self.drawString(54, 32, "Documentação Oficial de Acompanhamento - HelpUS Technology")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 44, 541, 44)
        self.restoreState()

def build_pdf():
    pdf_filename = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\Documentacao_Acompanhamento_2026-09-08.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    PRIMARY = colors.HexColor("#0F172A")
    SECONDARY = colors.HexColor("#0284C7")
    TEXT_DARK = colors.HexColor("#1E293B")
    BG_LIGHT = colors.HexColor("#F8FAFC")
    ACCENT = colors.HexColor("#0369A1")

    title_style = ParagraphStyle('DocTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=13, leading=17, textColor=PRIMARY, spaceAfter=4)
    subtitle_style = ParagraphStyle('DocSubtitle', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=11.5, textColor=SECONDARY, spaceAfter=8)
    h1_style = ParagraphStyle('SectionH1', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=PRIMARY, spaceBefore=9, spaceAfter=3)
    h2_style = ParagraphStyle('SectionH2', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11.5, textColor=ACCENT, spaceBefore=5, spaceAfter=2)
    body_style = ParagraphStyle('BodyDark', parent=styles['Normal'], fontName='Helvetica', fontSize=7.8, leading=10.8, textColor=TEXT_DARK, spaceAfter=2.5)
    caption_style = ParagraphStyle('Caption', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=7, leading=9.5, textColor=colors.HexColor("#64748B"), spaceAfter=5, alignment=1)

    story = []

    # Header Banner
    img_path = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\foto eduardo.jpg"
    if os.path.exists(img_path):
        doctor_img = Image(img_path, width=44, height=44)
        header_text = [
            Paragraph("RELATÓRIO DE ACOMPANHAMENTO & ROTEIRO DE USO", title_style),
            Paragraph("Parte 1: Solicitações & Modelos Drive | Parte 2: Funcionalidades | Parte 3: Roteiro Passo a Passo", subtitle_style)
        ]
        t_header = Table([[header_text, doctor_img]], colWidths=[435, 48])
        t_header.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('ALIGN', (1,0), (1,0), 'RIGHT')]))
        story.append(t_header)

    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceAfter=5))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Cliente:</b> Dr. Eduardo Magalhães", body_style), Paragraph("<b>Data da Rodada:</b> 08/09/2026", body_style)],
        [Paragraph("<b>Identificador:</b> DOC-2026-09-08", body_style), Paragraph("<b>Status:</b> Concluído & Publicado em Produção", body_style)],
        [Paragraph("<b>Plataforma:</b> neuro.eduardomagalhaes.helpusbr.com", body_style), Paragraph("<b>Desenvolvimento:</b> HelpUS Technology", body_style)]
    ]
    t_meta = Table(meta_data, colWidths=[240, 243])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 4))

    # PARTE 1
    story.append(Paragraph("PARTE 1: SOLICITAÇÕES E MATERIAIS DISPONIBILIZADOS PELO CLIENTE", h1_style))
    story.append(Paragraph(
        "Registro detalhado das solicitações enviadas pelo <b>Dr. Eduardo Magalhães</b> via WhatsApp sobre a navegação visual em árvore por 2-3 cliques nas pastas do Google Drive, "
        "auto-busca de dados por CPF (estilo Mevo), integração com a base histórica de 18 anos da clínica (Winsoft - Jean Cordeiro) e gestão de usuários/senhas. "
        "Foram extraídos e cadastrados <b>126 modelos de laudo em 10 categorias oficiais</b> enviadas no Google Drive.", body_style
    ))

    req_table = [
        [Paragraph("<b>ID</b>", h2_style), Paragraph("<b>Solicitação do Dr. Eduardo</b>", h2_style), Paragraph("<b>Solução Técnica Projetada</b>", h2_style), Paragraph("<b>Status</b>", h2_style)],
        [
            Paragraph("REQ-07", body_style),
            Paragraph("<b>Árvore de Pastas (Drive):</b> Navegar por 2-3 cliques de mouse nas 10 pastas oficiais de laudo.", body_style),
            Paragraph("Navegador visual de pastas expansível (126 modelos em 10 categorias) + alternador de pesquisa.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ],
        [
            Paragraph("REQ-08", body_style),
            Paragraph("<b>Auto-Preenchimento por CPF:</b> Digitar CPF e buscar Nome e Data Nasc. automaticamente (estilo Mevo).", body_style),
            Paragraph("Busca inteligente por CPF com consulta local no Winsoft + consulta online em tempo real via API pública.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ],
        [
            Paragraph("REQ-09", body_style),
            Paragraph("<b>Integração Base Winsoft:</b> Carga de dados históricos de 18 anos da clínica (Jean Cordeiro).", body_style),
            Paragraph("Aba 'Base Winsoft' com suporte para importação de CSV/JSON e seleção direta 'Usar no Laudo'.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ],
        [
            Paragraph("REQ-10", body_style),
            Paragraph("<b>Gestão de Usuários & Senhas:</b> Cadastro, edição e revogação de acessos de secretárias e médicos.", body_style),
            Paragraph("Módulo de Gestão de Usuários (CRUD) com seleção de níveis de acesso (Médico, Secretária LGPD, Técnico).", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ]
    ]

    t_req = Table(req_table, colWidths=[38, 162, 220, 63])
    t_req.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_req)
    story.append(Spacer(1, 5))

    # PARTE 2
    story.append(Paragraph("PARTE 2: IMPLEMENTAÇÕES E COMPONENTES DESENVOLVIDOS", h1_style))
    story.append(Paragraph("<b>2.1. Tela de Autenticação & Login por Usuário/Senha:</b> Acesso restrito com tela inicial de login e botão de encerramento de sessão (Logout).", body_style))
    story.append(Paragraph("<b>2.2. Navegador de Pastas em Árvore (126 Modelos):</b> Implementadas 10 categorias expansíveis espelhando as pastas do Google Drive (STC, STC+Ulnar, Radiculopatias, PNP, Plexo, Miopatias, Radial, Fibular/Facial, Normais e EEG MAP).", body_style))
    story.append(Paragraph("<b>2.3. Busca Online de CPF (Mevo Style):</b> Consulta em tempo real na base Winsoft + API pública de CPF preenchendo automaticamente Nome e Data de Nascimento.", body_style))
    story.append(Paragraph("<b>2.4. Módulo de Gestão de Usuários & Níveis de Acesso (RBAC):</b> Modal interativo de criação/edição/exclusão de secretárias e médicos pelo Dr. Eduardo.", body_style))
    story.append(Spacer(1, 5))

    # PARTE 3: ROTEIRO PASSO A PASSO
    story.append(Paragraph("PARTE 3: ROTEIRO PASSO A PASSO DE USO (DR. EDUARDO & SECRETÁRIA)", h1_style))

    story.append(Paragraph("1️⃣ Passo 1: Autenticação de Acesso (Login com E-mail e Senha)", h2_style))
    story.append(Paragraph("Acesse <b>neuro.eduardomagalhaes.helpusbr.com</b> e clique em 'Painel'. Faça login com 👑 <b>Dr. Eduardo</b> (eduardo@clinica.com.br / 123) para acesso total ou 📋 <b>Secretária</b> (juliana@clinica.com.br / 123) com trava de sigilo LGPD.", body_style))

    img_painel = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\painel_medico_laudos.jpg"
    if os.path.exists(img_painel):
        story.append(Image(img_painel, width=483, height=245))
        story.append(Paragraph("Figura 1: Tela do Painel do Consultório com autenticação por login, árvore de pastas e emissor de laudos.", caption_style))

    story.append(Paragraph("2️⃣ Passo 2: Seleção de Modelos por Pastas (Drive) ou Busca por Digitação", h2_style))
    story.append(Paragraph("Clique nas pastas de categorias (ex: STC, Mapeamento Cerebral, Radiculopatias) para selecionar qualquer um dos 126 modelos com 2 cliques, ou use a barra de busca por palavra-chave.", body_style))

    story.append(Paragraph("3️⃣ Passo 3: Digitação do CPF e Auto-Preenchimento (Mevo Style + Winsoft)", h2_style))
    story.append(Paragraph("Digite os 11 números do CPF. O sistema aplica a máscara (000.000.000-00), consulta a base local do Winsoft ou a API online (estilo Mevo) e preenche o Nome e Data Nasc. automaticamente.", body_style))

    story.append(Paragraph("4️⃣ Passo 4: Gestão de Equipe & Cadastro de Secretárias/Médicos (Dr. Eduardo)", h2_style))
    story.append(Paragraph("Estando logado como Dr. Eduardo, acesse a aba 'Gestão de Equipe' para cadastrar novos funcionários, definir e-mails/senhas, alterar níveis de acesso (RBAC) ou revogar usuários.", body_style))

    story.append(Paragraph("5️⃣ Passo 5: Assinatura Digital & Emissão do PDF Timbrado com QR Code", h2_style))
    story.append(Paragraph("No perfil do Dr. Eduardo, revise o laudo e clique em 'Assinar & Gerar PDF Timbrado' para produzir o PDF oficial com carimbo profissional, selo ICP-Brasil e QR Code antifraude no rodapé.", body_style))

    img_laudo = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\assinatura_digital_qrcode.jpg"
    if os.path.exists(img_laudo):
        story.append(Image(img_laudo, width=483, height=245))
        story.append(Paragraph("Figura 2: Laudo Oficial gerado pelo sistema com papel timbrado, carimbo médico, selo ICP-Brasil e QR Code de validação.", caption_style))

    story.append(Paragraph("6️⃣ Passo 6: Anexo de Gráficos e Portal do Paciente (Download Seguro)", h2_style))
    story.append(Paragraph("Anexe os gráficos do aparelho e envie o link via WhatsApp. O paciente acessa o portal digitando CPF + Data Nasc. e baixa o Laudo Oficial PDF e os Gráficos do Aparelho.", body_style))

    img_portal = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\portal_paciente_exames.jpg"
    if os.path.exists(img_portal):
        story.append(Image(img_portal, width=483, height=245))
        story.append(Paragraph("Figura 3: Portal do Paciente com autenticação CPF e download seguro dos laudos e gráficos.", caption_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF Documentacao_Acompanhamento_2026-09-08.pdf re-compilado com REQ-10 e todas as secoes!")

if __name__ == '__main__':
    build_pdf()
