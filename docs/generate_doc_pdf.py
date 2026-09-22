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

    title_style = ParagraphStyle('DocTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=12.5, leading=16.5, textColor=PRIMARY, spaceAfter=4)
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
            Paragraph("Parte 1: Solicitações WhatsApp | Parte 2: Layout 2 Colunas Explorer | Parte 3: Roteiro com Telas", subtitle_style)
        ]
        t_header = Table([[header_text, doctor_img]], colWidths=[435, 48])
        t_header.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('ALIGN', (1,0), (1,0), 'RIGHT')]))
        story.append(t_header)

    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceAfter=5))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Cliente:</b> Dr. Eduardo Magalhães", body_style), Paragraph("<b>Data da Rodada:</b> 22/09/2026", body_style)],
        [Paragraph("<b>Identificador:</b> DOC-2026-09-22", body_style), Paragraph("<b>Status:</b> Concluído & Publicado em Produção", body_style)],
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
        "Registro das novas solicitações do <b>Dr. Eduardo Magalhães</b> enviadas via WhatsApp na data de hoje (<b>22/09/2026</b>) "
        "referentes à reestruturação de <b>diagramação em 2 colunas side-by-side</b> (Árvore de modelos estilo Windows Explorer à esquerda "
        "e formulário completo de laudos à direita), otimizando a visualização sem necessidade de rolagem de tela.", body_style
    ))

    req_table = [
        [Paragraph("<b>ID</b>", h2_style), Paragraph("<b>Solicitação do Dr. Eduardo</b>", h2_style), Paragraph("<b>Solução Técnica Implementada</b>", h2_style), Paragraph("<b>Status</b>", h2_style)],
        [
            Paragraph("REQ-12", body_style),
            Paragraph("<b>Copiar & Colar Texto do Word:</b> Importar modelos locais do computador.", body_style),
            Paragraph("Área de colagem livre com pré-preenchimento automático dos blocos do laudo.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ],
        [
            Paragraph("REQ-13", body_style),
            Paragraph("<b>Layout 2 Colunas (Windows Explorer):</b> Eliminar rolagem de tela e exibir subpastas abertas.", body_style),
            Paragraph("Grid Split-Screen em 2 colunas com expansão simultânea de todas as pastagens à esquerda.", body_style),
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
    story.append(Paragraph("<b>2.1. Diagramação Split-Screen em 2 Colunas (REQ-13):</b> Painel ajustado para exibição lado a lado na tela com expansão do container principal (max-w-7xl).", body_style))
    story.append(Paragraph("<b>2.2. Árvore de Pastas Estilo Windows Explorer:</b> Todas as subpastas vêm abertas por padrão com botões rápidos de <b>[Tudo]</b> e <b>[Fechar]</b>.", body_style))
    story.append(Paragraph("<b>2.3. Sincronização do Formulário de Laudos:</b> A seleção de qualquer modelo na árvore carrega instantaneamente no painel direito sem necessidade de rolar a página.", body_style))
    story.append(Paragraph("<b>2.4. Validação ICP-Brasil & QR Code:</b> Geração do PDF timbrado assinado digitalmente com preservação do sigilo médico LGPD.", body_style))
    story.append(Spacer(1, 4))

    # PARTE 3: ROTEIRO PASSO A PASSO
    story.append(Paragraph("PARTE 3: ROTEIRO PASSO A PASSO DE USO COM CAPTURAS DE TELA ATUALIZADAS", h1_style))

    story.append(Paragraph("Passo 1: Acessar a Nova Interface em 2 Colunas Lado a Lado", h2_style))
    story.append(Paragraph("Acesse <b>neuro.eduardomagalhaes.helpusbr.com</b> com o perfil do <b>Dr. Eduardo Magalhães</b>. O painel será exibido na nova diagramação de duas colunas.", body_style))

    img_layout = os.path.join(docs_dir, "painel_layout_duas_colunas.jpg")
    if os.path.exists(img_layout):
        story.append(Image(img_layout, width=483, height=275))
        story.append(Paragraph("Figura 1: Nova interface em 2 colunas com a árvore estilo Windows Explorer à esquerda e o formulário completo à direita.", caption_style))

    story.append(Paragraph("Passo 2: Navegar pela Árvore de Pastas Expandida (Esquerda)", h2_style))
    story.append(Paragraph("Localize a pasta desejada (STC, Radiculopatias, Polineuropatias, EEG) e clique no modelo para carregar no laudo.", body_style))

    story.append(Paragraph("Passo 3: Assinatura Digital & PDF Timbrado (Direita)", h2_style))
    story.append(Paragraph("Após conferir o laudo no lado direito ou colar textos do Word, clique em 'Assinar & Gerar PDF Timbrado' para emitir o documento oficial com QR Code de validação.", body_style))

    img_word = os.path.join(docs_dir, "painel_copiar_colar_word.jpg")
    if os.path.exists(img_word):
        story.append(Image(img_word, width=483, height=225))
        story.append(Paragraph("Figura 2: Detalhe da funcionalidade de importação de texto livre do Word e acionamento da assinatura digital.", caption_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF Documentacao_Acompanhamento_2026-09-22.pdf criado com sucesso!")

if __name__ == '__main__':
    build_pdf()
