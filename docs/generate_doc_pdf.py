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
            self.drawString(54, 800, "Relatório de Acompanhamento & Roteiro de Uso | Clínica Dr. Eduardo Magalhães (22/09/2026)")
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
    docs_dir = os.path.dirname(os.path.abspath(__file__))
    pdf_filename = os.path.join(docs_dir, "Documentacao_Acompanhamento_2026-09-22.pdf")
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
    SUCCESS = colors.HexColor("#0D9488")

    title_style = ParagraphStyle('DocTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=PRIMARY, spaceAfter=4)
    subtitle_style = ParagraphStyle('DocSubtitle', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=11.5, textColor=SECONDARY, spaceAfter=8)
    h1_style = ParagraphStyle('SectionH1', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9.5, leading=12.5, textColor=PRIMARY, spaceBefore=8, spaceAfter=3)
    h2_style = ParagraphStyle('SectionH2', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11.5, textColor=ACCENT, spaceBefore=4, spaceAfter=2)
    body_style = ParagraphStyle('BodyDark', parent=styles['Normal'], fontName='Helvetica', fontSize=7.6, leading=10.5, textColor=TEXT_DARK, spaceAfter=2.5)
    qa_style = ParagraphStyle('QABox', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=7.8, leading=11, textColor=colors.HexColor("#4338CA"), spaceAfter=3)
    caption_style = ParagraphStyle('Caption', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=7, leading=9.5, textColor=colors.HexColor("#64748B"), spaceAfter=4, alignment=1)

    story = []

    # Header Banner
    img_path = os.path.join(docs_dir, "foto eduardo.jpg")
    if os.path.exists(img_path):
        doctor_img = Image(img_path, width=42, height=42)
        header_text = [
            Paragraph("RELATÓRIO DE ACOMPANHAMENTO & ROTEIRO DE USO (22/09/2026)", title_style),
            Paragraph("Carregamento 1:1 Limpo | Edição Expandida 100% | Histórico por CPF | Formatação Rica", subtitle_style)
        ]
        t_header = Table([[header_text, doctor_img]], colWidths=[435, 48])
        t_header.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('ALIGN', (1,0), (1,0), 'RIGHT')]))
        story.append(t_header)

    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceAfter=5))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Cliente:</b> Dr. Eduardo Magalhães", body_style), Paragraph("<b>Data da Rodada:</b> 22/09/2026", body_style)],
        [Paragraph("<b>Identificador:</b> DOC-2026-09-22", body_style), Paragraph("<b>Status:</b> Concluído & Publicado em Produção", body_style)],
        [Paragraph("<b>Plataforma:</b> neuroeduardomagalhaes.vercel.app", body_style), Paragraph("<b>Desenvolvimento:</b> HelpUS Technology", body_style)]
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
    story.append(Paragraph("PARTE 1: SOLICITAÇÕES E PERGUNTAS DO DR. EDUARDO MAGALHÃES (21:01 e 21:04)", h1_style))
    story.append(Paragraph(
        "Registro das novas observações enviadas pelo <b>Dr. Eduardo Magalhães</b> na noite de <b>22/09/2026</b> referentes à fidelidade do texto carregado dos modelos, "
        "espaçamento entre parágrafos, maximização da janela de edição em 100%, respostas sobre busca de exames anteriores por CPF e gerenciamento de modelos na árvore.", body_style
    ))

    # Respostas Oficiais Box
    qa_data = [
        [Paragraph("<b>Pergunta 1 (Dr. Eduardo):</b> <i>'Haverá um meio de buscar os exames anteriores caso o paciente tenha ao longo do tempo?'</i><br/>"
                   "<b>RESPOSTA OFICIAL: SIM!</b> O sistema indexa todo o histórico de exames anteriores por CPF. Ao pesquisar o CPF do paciente, surge o botão "
                   "<b>'Exames Anteriores ({qtd})'</b>, abrindo a linha do tempo de laudos passados com a opção <b>'Reutilizar Achados no Laudo Atual'</b>.", body_style)],
        [Paragraph("<b>Pergunta 2 (Dr. Eduardo):</b> <i>'Os modelos salvos podem ser editáveis, ou removidos da árvore futuramente por mim?'</i><br/>"
                   "<b>RESPOSTA OFICIAL: SIM!</b> Todos os modelos da árvore contam com os botões diretos de <b>'Editar Modelo'</b> e <b>'Excluir Modelo'</b>. "
                   "Além disso, o Dr. Eduardo pode clicar em <b>'Salvar como Novo Modelo'</b> no próprio editor para gravar suas alterações como novos templates.", body_style)]
    ]
    t_qa = Table(qa_data, colWidths=[483])
    t_qa.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#EEF2FF")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#6366F1")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_qa)
    story.append(Spacer(1, 4))

    req_table = [
        [Paragraph("<b>ID</b>", h2_style), Paragraph("<b>Solicitação do Dr. Eduardo</b>", h2_style), Paragraph("<b>Solução Técnica Implementada</b>", h2_style), Paragraph("<b>Status</b>", h2_style)],
        [
            Paragraph("REQ-17", body_style),
            Paragraph("<b>Carregamento Limpo 1:1 sem Frases Estranhas:</b> Eliminar / EEG e parágrafos colados.", body_style),
            Paragraph("Carregamento de texto original sem inserções artificiais de cabeçalhos e mantendo espaçamentos.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído (22/09)</b></font>", body_style)
        ],
        [
            Paragraph("REQ-18", body_style),
            Paragraph("<b>Janela de Edição Expandida 100%:</b> Ocultar árvore após seleção do modelo.", body_style),
            Paragraph("Botão [Ocultar Árvore] expande a área de edição para 100% da largura da tela.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído (22/09)</b></font>", body_style)
        ],
        [
            Paragraph("REQ-19", body_style),
            Paragraph("<b>Barra de Formatação Rica:</b> Botões de negrito, itálico e tamanho de fonte.", body_style),
            Paragraph("Barra de ferramentas de texto no topo do editor (B, I, U, A-, A+ e Salvar Modelo).", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído (22/09)</b></font>", body_style)
        ],
        [
            Paragraph("REQ-20", body_style),
            Paragraph("<b>Gestão de Modelos na Árvore:</b> Editar, excluir e salvar modelos na árvore.", body_style),
            Paragraph("Menu de ações [Editar] e [Excluir] nos templates da árvore e modal de criação.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído (22/09)</b></font>", body_style)
        ],
        [
            Paragraph("REQ-21", body_style),
            Paragraph("<b>Histórico de Exames por CPF:</b> Buscar laudos anteriores do paciente ao longo do tempo.", body_style),
            Paragraph("Painel de histórico retroativo por CPF com reutilização rápida de diagnósticos prévios.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído (22/09)</b></font>", body_style)
        ]
    ]

    t_req = Table(req_table, colWidths=[38, 162, 220, 63])
    t_req.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_req)
    story.append(Spacer(1, 4))

    # PARTE 2
    story.append(Paragraph("PARTE 2: IMPLEMENTAÇÕES E COMPONENTES DESENVOLVIDOS", h1_style))
    story.append(Paragraph("<b>2.1. Fidelidade de Texto & Espaçamento (REQ-17):</b> Carregamento 100% fiel dos modelos originais do Dr. Eduardo sem títulos forçados.", body_style))
    story.append(Paragraph("<b>2.2. Modo de Edição Expandido em 100% (REQ-18):</b> Possibilidade de ocultar a árvore de modelos para maximizar a área de trabalho.", body_style))
    story.append(Paragraph("<b>2.3. Barra de Formatação Rica (REQ-19):</b> Inserção rápida de Negrito, Itálico, Sublinhado e controle de tamanho da fonte (11px a 18px).", body_style))
    story.append(Paragraph("<b>2.4. Gestão de Modelos (REQ-20):</b> Controle total para editar, excluir ou adicionar novos templates personalizados à árvore.", body_style))
    story.append(Paragraph("<b>2.5. Histórico de Exames por CPF (REQ-21):</b> Módulo de consulta retroativa a exames anteriores do mesmo paciente ao longo do tempo.", body_style))
    story.append(Spacer(1, 4))

    # PARTE 3: ROTEIRO PASSO A PASSO
    story.append(Paragraph("PARTE 3: ROTEIRO PASSO A PASSO DE USO COM CAPTURAS DE TELA ATUALIZADAS", h1_style))

    story.append(Paragraph("Passo 1: Modo de Edição Expandido em 100% da Tela e Formatação Rica", h2_style))
    story.append(Paragraph("Ao selecionar o modelo desejado, clique em <b>[Ocultar Árvore]</b> no topo. A janela expande para 100% da largura. Utilize os botões <b>B</b>, <i>I</i>, <u>U</u> e <b>A+</b> para formatar o laudo.", body_style))

    img_exp = os.path.join(docs_dir, "painel_editor_expansivel.jpg")
    if os.path.exists(img_exp):
        story.append(Image(img_exp, width=483, height=255))
        story.append(Paragraph("Figura 1: Modo de Edição Expandido em 100% da tela com barra de formatação rica e carregamento limpo de texto.", caption_style))

    story.append(Paragraph("Passo 2: Consulta do Histórico de Exames Anteriores por CPF", h2_style))
    story.append(Paragraph("Ao digitar o CPF do paciente, clique no botão <b>[Exames Anteriores]</b> para visualizar a linha do tempo de laudos passados e reutilizar achados anteriores.", body_style))

    img_hist = os.path.join(docs_dir, "historico_exames_paciente.jpg")
    if os.path.exists(img_hist):
        story.append(Image(img_hist, width=483, height=210))
        story.append(Paragraph("Figura 2: Consulta ao histórico retroativo de exames do paciente indexado por CPF.", caption_style))

    story.append(Paragraph("Passo 3: Editar, Excluir e Criar Modelos na Árvore", h2_style))
    story.append(Paragraph("Na árvore de modelos, utilize os botões <b>[Edit]</b> e <b>[Del]</b> em cada template para gerenciar o catálogo ou salve novas versões pelo editor.", body_style))

    img_mod = os.path.join(docs_dir, "edicao_remocao_modelos.jpg")
    if os.path.exists(img_mod):
        story.append(Image(img_mod, width=483, height=210))
        story.append(Paragraph("Figura 3: Recursos de edição, exclusão e inclusão de novos templates na árvore da clínica.", caption_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF Documentacao_Acompanhamento_2026-09-22.pdf criado com sucesso!")

if __name__ == '__main__':
    build_pdf()
