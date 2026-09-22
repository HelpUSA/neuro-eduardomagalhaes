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

    title_style = ParagraphStyle('DocTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=12, leading=16, textColor=PRIMARY, spaceAfter=4)
    subtitle_style = ParagraphStyle('DocSubtitle', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=11.5, textColor=SECONDARY, spaceAfter=8)
    h1_style = ParagraphStyle('SectionH1', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9.5, leading=12.5, textColor=PRIMARY, spaceBefore=8, spaceAfter=3)
    h2_style = ParagraphStyle('SectionH2', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8.5, leading=11.5, textColor=ACCENT, spaceBefore=4, spaceAfter=2)
    body_style = ParagraphStyle('BodyDark', parent=styles['Normal'], fontName='Helvetica', fontSize=7.6, leading=10.5, textColor=TEXT_DARK, spaceAfter=2.5)
    caption_style = ParagraphStyle('Caption', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=7, leading=9.5, textColor=colors.HexColor("#64748B"), spaceAfter=4, alignment=1)

    story = []

    # Header Banner
    img_path = os.path.join(docs_dir, "foto eduardo.jpg")
    if os.path.exists(img_path):
        doctor_img = Image(img_path, width=42, height=42)
        header_text = [
            Paragraph("RELATÓRIO DE ACOMPANHAMENTO & ROTEIRO DE USO (22/09/2026)", title_style),
            Paragraph("Campo de Edição Único | Árvore A-Z Default | Responsividade F11 Fullscreen", subtitle_style)
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
    story.append(Paragraph("PARTE 1: SOLICITAÇÕES E MATERIAIS DISPONIBILIZADOS PELO CLIENTE", h1_style))
    story.append(Paragraph(
        "Registro das novas observações do <b>Dr. Eduardo Magalhães</b> enviadas via WhatsApp na data de hoje (<b>22/09/2026</b>) "
        "referentes à ordenação alfabética A-Z por padrão na árvore de modelos, criação do Campo de Edição Único para o texto integral "
        "do laudo (EEG/ENMG) e correção de responsividade do layout em tela cheia (F11).", body_style
    ))

    req_table = [
        [Paragraph("<b>ID</b>", h2_style), Paragraph("<b>Solicitação do Dr. Eduardo</b>", h2_style), Paragraph("<b>Solução Técnica Implementada</b>", h2_style), Paragraph("<b>Status</b>", h2_style)],
        [
            Paragraph("REQ-13", body_style),
            Paragraph("<b>Layout 2 Colunas Explorer:</b> Árvore de modelos à esquerda e edição à direita.", body_style),
            Paragraph("Grid Split-Screen em 2 colunas eliminando necessidade de scroll horizontal.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ],
        [
            Paragraph("REQ-14", body_style),
            Paragraph("<b>Ordem Alfabética A-Z por Padrão:</b> Pastas e modelos ordenados de A a Z.", body_style),
            Paragraph("Ordenação alfabética automática em todas as categorias e subpastas de templates.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído (22/09)</b></font>", body_style)
        ],
        [
            Paragraph("REQ-15", body_style),
            Paragraph("<b>Campo de Edição Único:</b> Editar texto integral em caixa de texto única.", body_style),
            Paragraph("Caixa de texto único de texto amplo para EEG/ENMG com seletor alternável de sub-seções.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído (22/09)</b></font>", body_style)
        ],
        [
            Paragraph("REQ-16", body_style),
            Paragraph("<b>Ajuste de Tela F11:</b> Garantir visibilidade do topo ao entrar/sair de F11.", body_style),
            Paragraph("Responsividade ajustada com max-h-[92vh] e scroll interno no corpo do modal.", body_style),
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
    story.append(Paragraph("<b>2.1. Ordenação Alfabética A-Z (REQ-14):</b> Todas as categorias e modelos de laudos organizados alfabeticamente de cima a baixo.", body_style))
    story.append(Paragraph("<b>2.2. Campo de Edição Único do Laudo (REQ-15):</b> Edição direta do texto completo em uma única caixa de texto contínua, com barra de alternância para sub-seções.", body_style))
    story.append(Paragraph("<b>2.3. Ajuste de Responsividade F11 (REQ-16):</b> Cabeçalho e botões de fechamento 100% visíveis ao alternar modo tela cheia.", body_style))
    story.append(Spacer(1, 4))

    # PARTE 3: ROTEIRO PASSO A PASSO
    story.append(Paragraph("PARTE 3: ROTEIRO PASSO A PASSO DE USO COM CAPTURAS DE TELA ATUALIZADAS", h1_style))

    story.append(Paragraph("Passo 1: Visualização da Árvore de Modelos em Ordem Alfabética A-Z", h2_style))
    story.append(Paragraph("Acesse <b>neuroeduardomagalhaes.vercel.app</b>. A árvore de modelos à esquerda lista as pastas em ordem A-Z por padrão.", body_style))

    img_az = os.path.join(docs_dir, "arvore_ordem_alfabetica.jpg")
    if os.path.exists(img_az):
        story.append(Image(img_az, width=483, height=220))
        story.append(Paragraph("Figura 1: Árvore de modelos estilo Windows Explorer com ordenação alfabética A-Z por padrão.", caption_style))

    story.append(Paragraph("Passo 2: Seleção do Modelo e Edição em Campo Único", h2_style))
    story.append(Paragraph("Ao clicar em qualquer modelo, o texto integral do laudo é carregado na caixa de texto única do lado direito.", body_style))

    img_unic = os.path.join(docs_dir, "painel_campo_unico_edicao.jpg")
    if os.path.exists(img_unic):
        story.append(Image(img_unic, width=483, height=255))
        story.append(Paragraph("Figura 2: Novo painel de laudos em 2 colunas com o Campo Único de Edição de Texto Integral.", caption_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF Documentacao_Acompanhamento_2026-09-22.pdf criado com sucesso!")

if __name__ == '__main__':
    build_pdf()
