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
    pdf_filename = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\Documentacao_Acompanhamento_2026-09-15.pdf"
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
            Paragraph("Parte 1: Solicitações do Cliente | Parte 2: Edição do Corpo do Laudo | Parte 3: Roteiro com Telas", subtitle_style)
        ]
        t_header = Table([[header_text, doctor_img]], colWidths=[435, 48])
        t_header.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('ALIGN', (1,0), (1,0), 'RIGHT')]))
        story.append(t_header)

    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceAfter=5))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Cliente:</b> Dr. Eduardo Magalhães", body_style), Paragraph("<b>Data da Rodada:</b> 15/09/2026", body_style)],
        [Paragraph("<b>Identificador:</b> DOC-2026-09-15", body_style), Paragraph("<b>Status:</b> Concluído & Publicado em Produção", body_style)],
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
        "Registro da nova solicitação enviada pelo <b>Dr. Eduardo Magalhães</b> via WhatsApp em 15/09/2026 sobre a necessidade de "
        "personalizar e editar integralmente não apenas a Conclusão Médica, mas também <b>todas as seções técnicas do corpo do laudo</b> "
        "(Neurocondução Motora, Neurocondução Sensitiva, Onda F e Eletromiografia / Registro Cerebral).", body_style
    ))

    req_table = [
        [Paragraph("<b>ID</b>", h2_style), Paragraph("<b>Solicitação do Dr. Eduardo</b>", h2_style), Paragraph("<b>Solução Técnica Projetada</b>", h2_style), Paragraph("<b>Status</b>", h2_style)],
        [
            Paragraph("REQ-11", body_style),
            Paragraph("<b>Edição Integral do Corpo do Laudo:</b> Poder editar todas as seções do exame além da Conclusão.", body_style),
            Paragraph("5 caixas de texto editáveis (textarea) no perfil do médico para ajuste irrestrito dos 5 blocos do laudo.", body_style),
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
    story.append(Paragraph("<b>2.1. Liberdade de Edição Integral do Corpo Diagnóstico:</b> Adicionados campos editáveis para Neurocondução Motora, Sensitiva, Onda F, Eletromiografia e Conclusão no perfil 👑 Dr. Eduardo Magalhães.", body_style))
    story.append(Paragraph("<b>2.2. Manutenção do Sigilo LGPD na Recepção:</b> No perfil 📋 Secretária (Juliana Costa), o corpo do laudo e diagnósticos permanecem devidamente travados e protegidos.", body_style))
    story.append(Paragraph("<b>2.3. Sincronização em Tempo Real no PDF Assinado:</b> Todas as alterações do corpo são aplicadas instantaneamente no PDF timbrado com carimbo profissional, selo ICP-Brasil PAdES e QR Code.", body_style))
    story.append(Spacer(1, 5))

    # PARTE 3: ROTEIRO PASSO A PASSO
    story.append(Paragraph("PARTE 3: ROTEIRO PASSO A PASSO DE USO (EDITION INTEGRAL DO LAUDO)", h1_style))

    story.append(Paragraph("1️⃣ Passo 1: Autenticação & Seleção do Modelo por Pastas", h2_style))
    story.append(Paragraph("Acesse <b>neuro.eduardomagalhaes.helpusbr.com</b>, faça login com o perfil do 👑 <b>Dr. Eduardo Magalhães</b> e selecione qualquer um dos 126 modelos de exame nas 10 pastas do Drive.", body_style))

    story.append(Paragraph("2️⃣ Passo 2: Personalização dos 5 Blocos do Corpo do Laudo", h2_style))
    story.append(Paragraph("Modifique livremente as caixas de texto de Neurocondução Motora, Sensitiva, Onda F, Eletromiografia e Conclusão Diagnóstica de acordo com os achados do exame do paciente.", body_style))

    img_edicao = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\painel_edicao_corpo_laudo.jpg"
    if os.path.exists(img_edicao):
        story.append(Image(img_edicao, width=483, height=270))
        story.append(Paragraph("Figura 1: Nova Tela do Painel do Consultório com os 5 campos de edição integral do corpo do laudo técnico.", caption_style))

    story.append(Paragraph("3️⃣ Passo 3: Geração do PDF Timbrado com Assinatura Digital & QR Code", h2_style))
    story.append(Paragraph("Clique em 'Assinar & Gerar PDF Timbrado' para emitir o laudo com todas as alterações personalizadas no corpo, selo ICP-Brasil PAdES e QR Code de autenticidade no rodapé.", body_style))

    img_laudo = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\assinatura_digital_qrcode.jpg"
    if os.path.exists(img_laudo):
        story.append(Image(img_laudo, width=483, height=255))
        story.append(Paragraph("Figura 2: Laudo Médico Oficial gerado pelo sistema com papel timbrado, carimbo profissional, selo digital e QR Code.", caption_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF Documentacao_Acompanhamento_2026-09-15.pdf criado com sucesso!")

if __name__ == '__main__':
    build_pdf()
