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
            self.drawString(54, 800, "Relatório de Acompanhamento & Roteiro de Uso | Clínica Dr. Eduardo Magalhães (24/09/2026)")
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

def build_pdf_2026_09_24():
    docs_dir = os.path.dirname(os.path.abspath(__file__))
    pdf_filename = os.path.join(docs_dir, "Documentacao_Acompanhamento_2026-09-24.pdf")
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
    caption_style = ParagraphStyle('Caption', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=7, leading=9.5, textColor=colors.HexColor("#64748B"), spaceAfter=4, alignment=1)

    story = []

    # Header Banner
    img_path = os.path.join(docs_dir, "foto eduardo.jpg")
    if os.path.exists(img_path):
        doctor_img = Image(img_path, width=42, height=42)
        header_text = [
            Paragraph("RELATÓRIO DE ACOMPANHAMENTO & ROTEIRO DE USO (24/09/2026)", title_style),
            Paragraph("Botões Desfazer / Refazer (Ctrl+Z/Ctrl+Y) | Salvar Modelo Atual | Fonte Dinâmica PDF", subtitle_style)
        ]
        t_header = Table([[header_text, doctor_img]], colWidths=[435, 48])
        t_header.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('ALIGN', (1,0), (1,0), 'RIGHT')]))
        story.append(t_header)

    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceAfter=5))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Cliente:</b> Dr. Eduardo Magalhães", body_style), Paragraph("<b>Data da Rodada:</b> 24/09/2026", body_style)],
        [Paragraph("<b>Identificador:</b> DOC-2026-09-24", body_style), Paragraph("<b>Status:</b> Concluído & Publicado em Produção", body_style)],
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
    story.append(Paragraph("PARTE 1: NOVAS SOLICITAÇÕES DO DR. EDUARDO MAGALHÃES (24/09/2026)", h1_style))
    story.append(Paragraph(
        "Atendimento às solicitações do <b>Dr. Eduardo Magalhães</b> referentes aos botões de <b>Desfazer e Refazer</b> no editor, "
        "à sincronização dinâmica do tamanho de fonte no PDF timbrado e à gravação de alterações no <b>próprio modelo da árvore</b> mantendo sua posição original.", body_style
    ))

    req_table = [
        [Paragraph("<b>ID</b>", h2_style), Paragraph("<b>Solicitação do Dr. Eduardo</b>", h2_style), Paragraph("<b>Solução Técnica Implementada</b>", h2_style), Paragraph("<b>Status</b>", h2_style)],
        [
            Paragraph("REQ-22", body_style),
            Paragraph("<b>Botões Desfazer / Refazer no Editor:</b> Função Undo/Redo para reverter alterações.", body_style),
            Paragraph("Adicionados botões [Desfazer] (Ctrl+Z) e [Refazer] (Ctrl+Y/Ctrl+Shift+Z) com pilha de histórico.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído (24/09)</b></font>", body_style)
        ],
        [
            Paragraph("REQ-23", body_style),
            Paragraph("<b>Sincronização de Fonte (Edição ➔ PDF):</b> Fonte maior na edição reflete no PDF.", body_style),
            Paragraph("Cálculo proporcional de fonte no jsPDF (7.2pt a 13.1pt) com altura de linha e suporte multi-páginas.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído (24/09)</b></font>", body_style)
        ],
        [
            Paragraph("REQ-24", body_style),
            Paragraph("<b>Salvar no Próprio Modelo da Árvore:</b> Gravar alterações pontuais sem criar novo modelo.", body_style),
            Paragraph("Botão [Salvar no Modelo Atual] atualiza o texto do modelo selecionado na sua posição original da árvore.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído (24/09)</b></font>", body_style)
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
    story.append(Spacer(1, 4))

    # PARTE 2
    story.append(Paragraph("PARTE 2: DETALHAMENTO DAS SOLUÇÕES TÉCNICAS", h1_style))
    story.append(Paragraph("<b>2.1. Botões Desfazer/Refazer com Atalhos (REQ-22):</b> Histórico de edição registrado a cada alteração. Teclas de atalho nativas Ctrl+Z e Ctrl+Y integradas.", body_style))
    story.append(Paragraph("<b>2.2. Fonte Dinâmica no PDF Timbrado (REQ-23):</b> Tamanho da fonte na edição (11px a 20px) repassado proporcionalmente ao PDF com quebra automática de páginas.", body_style))
    story.append(Paragraph("<b>2.3. Gravação de Modificações no Modelo Atual (REQ-24):</b> Atualização in-place (`templateOverrides`) preserva o modelo na sua pasta e posição original na árvore sem criar duplicatas.", body_style))
    story.append(Paragraph("<b>2.4. Suporte Completo a Idiomas:</b> Novas opções 100% integradas nos idiomas Português 🇧🇷, English 🇺🇸 e Español 🇪🇸.", body_style))
    story.append(Spacer(1, 4))

    # PARTE 3: ROTEIRO PASSO A PASSO
    story.append(Paragraph("PARTE 3: ROTEIRO PASSO A PASSO DE USO COM CAPTURAS DE TELA", h1_style))

    story.append(Paragraph("Passo 1: Salvar Alterações Pontuais no Modelo Atual da Árvore (REQ-24)", h2_style))
    story.append(Paragraph("Ao realizar alterações em um modelo aberto (negrito, espaçamentos, correções de frases), clique no botão verde <b>[Salvar no Modelo Atual]</b> para gravar as modificações mantendo a posição original do modelo na árvore.", body_style))

    img_save = os.path.join(docs_dir, "salvar_modelo_atual.jpg")
    if os.path.exists(img_save):
        story.append(Image(img_save, width=483, height=270))
        story.append(Paragraph("Figura 1: Atualização do modelo selecionado mantendo sua posição original na árvore sem duplicar.", caption_style))

    story.append(Paragraph("Passo 2: Utilizando os Botões Desfazer e Refazer (Ctrl+Z e Ctrl+Y)", h2_style))
    story.append(Paragraph("No editor de laudos, utilize os botões <b>[Desfazer]</b> e <b>[Refazer]</b> ou pressione <b>Ctrl+Z</b> / <b>Ctrl+Y</b> para reverter ou restaurar alterações rapidamente.", body_style))

    img_undo = os.path.join(docs_dir, "desfazer_refazer_editor.jpg")
    if os.path.exists(img_undo):
        story.append(Image(img_undo, width=483, height=270))
        story.append(Paragraph("Figura 2: Botões Desfazer e Refazer na barra de ferramentas do editor de laudos com atalhos Ctrl+Z e Ctrl+Y.", caption_style))

    story.append(Paragraph("Passo 3: Sincronização Dinâmica do Tamanho de Fonte na Edição e no PDF", h2_style))
    story.append(Paragraph("Ao ajustar a fonte no editor (A- / A+), o indicador mostra a pré-visualização em pt no PDF. O PDF timbrado gerado utilizará exatamente o mesmo tamanho de fonte ampliado.", body_style))

    img_font = os.path.join(docs_dir, "fonte_dinamica_pdf.jpg")
    if os.path.exists(img_font):
        story.append(Image(img_font, width=483, height=296))
        story.append(Paragraph("Figura 3: Ajuste de tamanho de fonte no editor refletido diretamente no laudo em PDF com quebra automática de página.", caption_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF Documentacao_Acompanhamento_2026-09-24.pdf criado com sucesso!")

if __name__ == '__main__':
    build_pdf_2026_09_24()
