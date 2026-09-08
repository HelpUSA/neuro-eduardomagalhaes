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
            self.drawString(54, 800, "Relatório de Acompanhamento | Clínica Dr. Eduardo Magalhães (08/09/2026)")
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
    subtitle_style = ParagraphStyle('DocSubtitle', parent=styles['Normal'], fontName='Helvetica', fontSize=9, leading=12, textColor=SECONDARY, spaceAfter=8)
    h1_style = ParagraphStyle('SectionH1', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=PRIMARY, spaceBefore=10, spaceAfter=4)
    h2_style = ParagraphStyle('SectionH2', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=ACCENT, spaceBefore=6, spaceAfter=3)
    body_style = ParagraphStyle('BodyDark', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11.5, textColor=TEXT_DARK, spaceAfter=3)
    caption_style = ParagraphStyle('Caption', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=7.5, leading=10, textColor=colors.HexColor("#64748B"), spaceAfter=6, alignment=1)

    story = []

    # Header Banner
    img_path = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\foto eduardo.jpg"
    if os.path.exists(img_path):
        doctor_img = Image(img_path, width=44, height=44)
        header_text = [
            Paragraph("RELATÓRIO DE ACOMPANHAMENTO DE IMPLEMENTAÇÕES", title_style),
            Paragraph("Parte 1: Requisitos Solicitados pelo Dr. Eduardo | Parte 2: Funcionalidades Implementadas", subtitle_style)
        ]
        t_header = Table([[header_text, doctor_img]], colWidths=[435, 48])
        t_header.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('ALIGN', (1,0), (1,0), 'RIGHT')]))
        story.append(t_header)

    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceAfter=6))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Cliente:</b> Dr. Eduardo Magalhães", body_style), Paragraph("<b>Data da Rodada:</b> 08/09/2026", body_style)],
        [Paragraph("<b>Identificador:</b> DOC-2026-09-08", body_style), Paragraph("<b>Status:</b> Concluído em Produção", body_style)],
        [Paragraph("<b>Projeto:</b> neuro.eduardomagalhaes", body_style), Paragraph("<b>Desenvolvimento:</b> HelpUS Technology", body_style)]
    ]
    t_meta = Table(meta_data, colWidths=[240, 243])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 6))

    # PARTE 1
    story.append(Paragraph("PARTE 1: SOLICITAÇÕES E DIRETRIZES DO CLIENTE (DR. EDUARDO MAGALHÃES)", h1_style))
    story.append(Paragraph(
        "Registro detalhado das mensagens de WhatsApp enviadas pelo <b>Dr. Eduardo Magalhães</b> em 07/09/2026 referentes à "
        "navegação visual em árvore por 2-3 cliques nas pastas do Google Drive (EEG MAP MODELOS e ENMG Modelos), auto-busca de dados por CPF (estilo Mevo) "
        "e integração com a base histórica de 18 anos da clínica (Winsoft - Jean Cordeiro).", body_style
    ))

    req_table = [
        [Paragraph("<b>ID</b>", h2_style), Paragraph("<b>Solicitação do Dr. Eduardo</b>", h2_style), Paragraph("<b>Solução Técnica Projetada</b>", h2_style), Paragraph("<b>Status</b>", h2_style)],
        [
            Paragraph("REQ-07", body_style),
            Paragraph("<b>Árvore de Pastas (Drive):</b> Navegação por 2-3 cliques nas pastas oficiais do Google Drive.", body_style),
            Paragraph("Navegador visual de pastas expansível (ENMG Modelos + EEG MAP MODELOS) + alternador de pesquisa.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ],
        [
            Paragraph("REQ-08", body_style),
            Paragraph("<b>Auto-Preenchimento por CPF:</b> Digitar CPF e buscar Nome e Data Nasc. automaticamente (estilo Mevo).", body_style),
            Paragraph("Busca inteligente no campo CPF que consulta a base Winsoft e preenche instantaneamente o cadastro.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ],
        [
            Paragraph("REQ-09", body_style),
            Paragraph("<b>Integração Base Winsoft:</b> Carga de dados históricos de pacientes do Winsoft (Jean Cordeiro).", body_style),
            Paragraph("Aba 'Base Winsoft' com suporte para importação de CSV/JSON e seleção direta 'Usar no Laudo'.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ]
    ]

    t_req = Table(req_table, colWidths=[38, 162, 220, 63])
    t_req.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_req)
    story.append(Spacer(1, 8))

    # PARTE 2
    story.append(Paragraph("PARTE 2: IMPLEMENTAÇÕES REALIZADAS E TELAS DO SISTEMA", h1_style))

    story.append(Paragraph("2.1. Navegador de Pastas em Árvore (Estrutura do Google Drive)", h2_style))
    story.append(Paragraph("Desenvolvida a navegação visual de pastas com ícones expansíveis para 'ENMG Modelos' e 'EEG MAP MODELOS', permitindo selecionar laudos com 2 cliques ou usar busca por palavras-chave.", body_style))

    img_painel = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\painel_medico_laudos.jpg"
    if os.path.exists(img_painel):
        story.append(Image(img_painel, width=483, height=270))
        story.append(Paragraph("Figura 1: Painel do Consultório com o Navegador de Pastas e emissor de laudos.", caption_style))

    story.append(Paragraph("2.2. Busca por CPF e Auto-Preenchimento Mevo + Módulo Winsoft", h2_style))
    story.append(Paragraph("Campo inteligente de CPF com busca direta na base histórica do Winsoft, preenchendo automaticamente Nome e Data de Nascimento, com aba para importação de arquivos CSV.", body_style))

    img_portal = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\portal_paciente_exames.jpg"
    if os.path.exists(img_portal):
        story.append(Image(img_portal, width=483, height=270))
        story.append(Paragraph("Figura 2: Portal do Paciente com autenticação CPF e download seguro dos laudos e gráficos.", caption_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF Documentacao_Acompanhamento_2026-09-08.pdf criado com sucesso!")

if __name__ == '__main__':
    build_pdf()
