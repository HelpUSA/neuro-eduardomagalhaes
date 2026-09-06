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
            self.drawString(54, 800, "Relatório de Requisitos & Acompanhamento | Clínica Dr. Eduardo Magalhães")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 792, 541, 792)
        
        footer_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(541, 32, footer_text)
        self.drawString(54, 32, "Documentação Oficial de Requisitos e Implementações - HelpUS Technology")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 44, 541, 44)
        self.restoreState()

def build_pdf():
    pdf_filename = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\Documentacao_Requisitos_e_Acompanhamento_Dr_Eduardo.pdf"
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

    title_style = ParagraphStyle('DocTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=PRIMARY, spaceAfter=4)
    subtitle_style = ParagraphStyle('DocSubtitle', parent=styles['Normal'], fontName='Helvetica', fontSize=9.5, leading=13, textColor=SECONDARY, spaceAfter=8)
    h1_style = ParagraphStyle('SectionH1', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, leading=14, textColor=PRIMARY, spaceBefore=10, spaceAfter=4)
    h2_style = ParagraphStyle('SectionH2', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=ACCENT, spaceBefore=6, spaceAfter=3)
    body_style = ParagraphStyle('BodyDark', parent=styles['Normal'], fontName='Helvetica', fontSize=8, leading=11.5, textColor=TEXT_DARK, spaceAfter=3)
    bullet_style = ParagraphStyle('BulletText', parent=body_style, leftIndent=10, spaceAfter=2)
    caption_style = ParagraphStyle('Caption', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=7.5, leading=10, textColor=colors.HexColor("#64748B"), spaceAfter=6, alignment=1)

    story = []

    # Header Banner
    img_path = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\foto eduardo.jpg"
    if os.path.exists(img_path):
        doctor_img = Image(img_path, width=44, height=44)
        header_text = [
            Paragraph("RELATÓRIO DE ESPECIFICAÇÃO & IMPLEMENTAÇÕES", title_style),
            Paragraph("Parte 1: Requisitos Solicitados pelo Dr. Eduardo | Parte 2: Funcionalidades & Telas", subtitle_style)
        ]
        t_header = Table([[header_text, doctor_img]], colWidths=[435, 48])
        t_header.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('ALIGN', (1,0), (1,0), 'RIGHT')]))
        story.append(t_header)

    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceAfter=6))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Cliente:</b> Dr. Eduardo Magalhães", body_style), Paragraph("<b>Data:</b> 06/09/2026", body_style)],
        [Paragraph("<b>Projeto:</b> Plataforma neuro.eduardomagalhaes", body_style), Paragraph("<b>Status:</b> Produção Ativa com Imagens", body_style)],
        [Paragraph("<b>Domínio Final:</b> clinicaeduardomagalhaes.com.br", body_style), Paragraph("<b>Desenvolvimento:</b> HelpUS Technology", body_style)]
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
    story.append(Paragraph("PARTE 1: SOLICITAÇÕES E DIRETRIZES DO CLIENTE", h1_style))
    story.append(Paragraph(
        "Consolidação de todas as solicitações enviadas pelo <b>Dr. Eduardo Magalhães</b> via WhatsApp sobre o sigilo da secretária, "
        "organização de laudos por pastas/subpastas, biblioteca de 24 modelos de EEG, dupla validação com certificado digital e QR Code, "
        "e eliminação de riscos de envio de exames.", body_style
    ))

    req_table = [
        [Paragraph("<b>ID</b>", h2_style), Paragraph("<b>Solicitação do Dr. Eduardo</b>", h2_style), Paragraph("<b>Solução Técnica Projetada</b>", h2_style), Paragraph("<b>Status</b>", h2_style)],
        [
            Paragraph("REQ-01", body_style),
            Paragraph("<b>Privacidade da Secretária:</b> Secretária cadastra paciente mas não enxerga o laudo médico.", body_style),
            Paragraph("Módulo RBAC onde o perfil Recepção acessa apenas dados de cadastro e oculta o diagnóstico médico.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ],
        [
            Paragraph("REQ-02", body_style),
            Paragraph("<b>Pastas & Busca de Modelos:</b> Navegar por pastas/subpastas e busca rápida de modelos.", body_style),
            Paragraph("Árvore de pastas por patologia + filtro de pesquisa inteligente por palavras-chave.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ],
        [
            Paragraph("REQ-03", body_style),
            Paragraph("<b>Assinatura Digital & Jurídica:</b> Assinatura com certificado digital ICP-Brasil + carimbo visual.", body_style),
            Paragraph("Integração de assinatura PAdES/ICP-Brasil + carimbo visual + QR Code de validação no rodapé.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ],
        [
            Paragraph("REQ-04", body_style),
            Paragraph("<b>Restrição do Certificado:</b> Certificado digital exclusivo do médico (secretária sem acesso).", body_style),
            Paragraph("A chave de assinatura e PIN ficam vinculados exclusivamente à conta de login do médico.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ],
        [
            Paragraph("REQ-05", body_style),
            Paragraph("<b>Anexo de Gráficos do Aparelho:</b> Anexar o PDF de gráficos sem risco de troca de arquivos.", body_style),
            Paragraph("Vínculo direto do Laudo Assinado + PDF de Gráficos no prontuário. O paciente baixa tudo no Portal.", body_style),
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
    story.append(Paragraph("PARTE 2: IMPLEMENTAÇÕES E TELAS DESENVOLVIDAS", h1_style))

    story.append(Paragraph("2.1. Painel do Consultório & Alternador de Perfis (RBAC & LGPD)", h2_style))
    story.append(Paragraph("Implementado o alternador de perfis (Médico Dr. Eduardo vs. Secretária Juliana Costa). Quando o perfil Secretária está ativo, a conclusão médica é oculta automaticamente.", body_style))

    img_painel = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\painel_medico_laudos.jpg"
    if os.path.exists(img_painel):
        story.append(Image(img_painel, width=483, height=270))
        story.append(Paragraph("Figura 1: Painel do Consultório exibindo o gerador de laudos, alternador de perfis e seletor de modelos por pastas.", caption_style))

    story.append(Paragraph("2.2. Portal do Paciente com Download Conjunto (Laudo + Gráficos)", h2_style))
    story.append(Paragraph("Desenvolvido o portal seguro (CPF + Nasc) com dois botões independentes para baixar o Laudo Oficial em PDF e os Gráficos do Aparelho.", body_style))

    img_portal = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\portal_paciente_exames.jpg"
    if os.path.exists(img_portal):
        story.append(Image(img_portal, width=483, height=270))
        story.append(Paragraph("Figura 2: Portal do Paciente exibindo os botões de download para o Laudo Oficial PDF e os Gráficos do Aparelho.", caption_style))

    story.append(Paragraph("2.3. Laudo Oficial PDF Timbrado com Assinatura & QR Code", h2_style))
    story.append(Paragraph("Gerador de PDF timbrado contendo carimbo profissional com CRM, selo de assinatura digital ICP-Brasil e QR Code de autenticidade no rodapé.", body_style))

    img_laudo = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\assinatura_digital_qrcode.jpg"
    if os.path.exists(img_laudo):
        story.append(Image(img_laudo, width=483, height=270))
        story.append(Paragraph("Figura 3: Laudo Oficial gerado pelo sistema com papel timbrado, carimbo médico, selo digital e QR Code de validação.", caption_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF de Documentação com Imagens criado com sucesso!")

if __name__ == '__main__':
    build_pdf()
