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
            self.drawString(54, 800, "Relatório de Acompanhamento & Roteiro de Uso | Clínica Dr. Eduardo Magalhães (21/09/2026)")
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
    pdf_filename = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\Documentacao_Acompanhamento_2026-09-21.pdf"
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
    img_path = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\foto eduardo.jpg"
    if os.path.exists(img_path):
        doctor_img = Image(img_path, width=42, height=42)
        header_text = [
            Paragraph("RELATÓRIO DE ACOMPANHAMENTO & ROTEIRO DE USO (21/09/2026)", title_style),
            Paragraph("Parte 1: Solicitações WhatsApp | Parte 2: Importador Word & Edição Livre | Parte 3: Roteiro com Telas", subtitle_style)
        ]
        t_header = Table([[header_text, doctor_img]], colWidths=[435, 48])
        t_header.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('ALIGN', (1,0), (1,0), 'RIGHT')]))
        story.append(t_header)

    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceAfter=5))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Cliente:</b> Dr. Eduardo Magalhães", body_style), Paragraph("<b>Data da Rodada:</b> 21/09/2026", body_style)],
        [Paragraph("<b>Identificador:</b> DOC-2026-09-21", body_style), Paragraph("<b>Status:</b> Concluído & Publicado em Produção", body_style)],
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
        "Registro das novas solicitações do <b>Dr. Eduardo Magalhães</b> enviadas via WhatsApp (vídeo do dia 19/09/2026 e mensagens de 21/09/2026) "
        "referentes à necessidade de um <b>Importador / Campo de Copiar & Colar Texto Livre do Word (.docx)</b> diretamente no formulário de emissão de laudos.", body_style
    ))

    req_table = [
        [Paragraph("<b>ID</b>", h2_style), Paragraph("<b>Solicitação do Dr. Eduardo</b>", h2_style), Paragraph("<b>Solução Técnica Implementada</b>", h2_style), Paragraph("<b>Status</b>", h2_style)],
        [
            Paragraph("REQ-11", body_style),
            Paragraph("<b>Edição Integral do Corpo do Laudo:</b> Personalizar todas as seções do exame além da Conclusão.", body_style),
            Paragraph("5 caixas de texto editáveis (textarea) para Neurocondução, Onda F, EMG e Conclusão.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ],
        [
            Paragraph("REQ-12", body_style),
            Paragraph("<b>Copiar & Colar Texto Livre do Word (.docx):</b> Importar textos de arquivos locais/Drive.", body_style),
            Paragraph("Área de colagem de texto livre com importação e distribuição automática nos blocos do laudo.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído (21/09)</b></font>", body_style)
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
    story.append(Paragraph("<b>2.1. Importador de Texto Livre do Word (REQ-12):</b> Caixa de colagem expansível que permite copiar qualquer texto do Word (`.docx`) e carregá-lo instantaneamente no formulário.", body_style))
    story.append(Paragraph("<b>2.2. Edição Integral do Corpo Diagnóstico:</b> 5 seções do corpo do laudo (Neurocondução Motora, Sensitiva, Onda F, Eletromiografia e Conclusão) 100% liberadas no perfil médico.", body_style))
    story.append(Paragraph("<b>2.3. Gestão RBAC & Sigilo LGPD:</b> O perfil de secretária mantém os diagnósticos ocultos e protegidos, conforme normas do CFM e LGPD.", body_style))
    story.append(Paragraph("<b>2.4. Validação ICP-Brasil & QR Code:</b> Sincronização em tempo real das alterações do texto no PDF timbrado com assinatura digital PAdES e QR Code.", body_style))
    story.append(Spacer(1, 4))

    # PARTE 3: ROTEIRO PASSO A PASSO
    story.append(Paragraph("PARTE 3: ROTEIRO PASSO A PASSO DE USO COM CAPTURAS DE TELA ATUALIZADAS", h1_style))

    story.append(Paragraph("1️⃣ Passo 1: Copiar & Colar Texto Livre do Word (.docx)", h2_style))
    story.append(Paragraph("Acesse <b>neuro.eduardomagalhaes.helpusbr.com</b> com o perfil do 👑 <b>Dr. Eduardo Magalhães</b>. Cole qualquer modelo ou texto do Word na caixa do importador e clique em <b>'✨ Carregar no Laudo'</b>.", body_style))

    img_word = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\painel_copiar_colar_word.jpg"
    if os.path.exists(img_word):
        story.append(Image(img_word, width=483, height=230))
        story.append(Paragraph("Figura 1: Nova área de colagem de texto do Word (.docx) e preenchimento automático das seções do laudo.", caption_style))

    story.append(Paragraph("2️⃣ Passo 2: Edição Integral e Ajuste dos 5 Blocos Técnicos", h2_style))
    story.append(Paragraph("Revise ou personalize os blocos de Neurocondução Motora, Sensitiva, Onda F, Eletromiografia e Conclusão Diagnóstica.", body_style))

    img_edicao = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\painel_edicao_corpo_laudo.jpg"
    if os.path.exists(img_edicao):
        story.append(Image(img_edicao, width=483, height=225))
        story.append(Paragraph("Figura 2: Formulário com os 5 blocos do corpo do laudo liberados para personalização técnica.", caption_style))

    story.append(Paragraph("3️⃣ Passo 3: Geração do PDF Timbrado com Assinatura Digital & QR Code", h2_style))
    story.append(Paragraph("Clique em 'Assinar & Gerar PDF Timbrado' para emitir o documento oficial com selo ICP-Brasil PAdES e QR Code de verificação.", body_style))

    img_laudo = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\assinatura_digital_qrcode.jpg"
    if os.path.exists(img_laudo):
        story.append(Image(img_laudo, width=483, height=215))
        story.append(Paragraph("Figura 3: Laudo Médico Oficial gerado pelo sistema com papel timbrado, carimbo profissional e QR Code.", caption_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF Documentacao_Acompanhamento_2026-09-21.pdf criado com sucesso!")

if __name__ == '__main__':
    build_pdf()
