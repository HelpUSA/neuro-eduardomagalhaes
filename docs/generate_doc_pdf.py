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
        self.drawString(54, 32, "Documentação Oficial de Requisitos do Sistema - HelpUS Technology")
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

    title_style = ParagraphStyle('DocTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=15, leading=19, textColor=PRIMARY, spaceAfter=4)
    subtitle_style = ParagraphStyle('DocSubtitle', parent=styles['Normal'], fontName='Helvetica', fontSize=10, leading=13, textColor=SECONDARY, spaceAfter=8)
    h1_style = ParagraphStyle('SectionH1', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11.5, leading=15, textColor=PRIMARY, spaceBefore=10, spaceAfter=5)
    h2_style = ParagraphStyle('SectionH2', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=9.5, leading=13, textColor=ACCENT, spaceBefore=7, spaceAfter=3)
    body_style = ParagraphStyle('BodyDark', parent=styles['Normal'], fontName='Helvetica', fontSize=8.5, leading=12, textColor=TEXT_DARK, spaceAfter=4)
    bullet_style = ParagraphStyle('BulletText', parent=body_style, leftIndent=10, spaceAfter=2)

    story = []

    # Header Banner
    img_path = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\foto eduardo.jpg"
    if os.path.exists(img_path):
        doctor_img = Image(img_path, width=46, height=46)
        header_text = [
            Paragraph("RELATÓRIO DE REQUISITOS, ARQUITETURA & EVOLUÇÃO", title_style),
            Paragraph("Acompanhamento Clínico, Modelos DOCX, Banco de Dados & Assinatura Digital", subtitle_style)
        ]
        t_header = Table([[header_text, doctor_img]], colWidths=[435, 48])
        t_header.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('ALIGN', (1,0), (1,0), 'RIGHT')]))
        story.append(t_header)

    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceAfter=6))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Cliente:</b> Dr. Eduardo Magalhães", body_style), Paragraph("<b>Data:</b> 06/09/2026", body_style)],
        [Paragraph("<b>Projeto:</b> Plataforma neuro.eduardomagalhaes", body_style), Paragraph("<b>Canal:</b> WhatsApp Oficial + 24 DOCX EEG", body_style)],
        [Paragraph("<b>Domínio Final:</b> clinicaeduardomagalhaes.com.br", body_style), Paragraph("<b>Desenvolvimento:</b> HelpUS Technology", body_style)]
    ]
    t_meta = Table(meta_data, colWidths=[240, 243])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 6))

    # 1. Introdução
    story.append(Paragraph("1. Introdução & Objetivo", h1_style))
    story.append(Paragraph(
        "Este relatório atualizado consolida a especificação de requisitos, o fluxo de digitalização dos <b>24 modelos de EEG</b>, "
        "o modelo de base de dados relacional de pacientes (PostgreSQL), o controle de sigilo da secretária (LGPD) e o mecanismo "
        "de <b>dupla assinatura (Visual + Digital ICP-Brasil + QR Code)</b>.", body_style
    ))

    # 2. Tabela de Requisitos
    story.append(Paragraph("2. Mapeamento dos Requisitos Solicitados", h1_style))

    req_table = [
        [Paragraph("<b>ID</b>", h2_style), Paragraph("<b>Solicitação do Dr. Eduardo</b>", h2_style), Paragraph("<b>Solução Projetada / Implementação</b>", h2_style), Paragraph("<b>Status</b>", h2_style)],
        [
            Paragraph("REQ-01", body_style),
            Paragraph("<b>Privacidade da Secretária:</b> Secretária cadastra paciente mas não enxerga laudo médico.", body_style),
            Paragraph("Módulo RBAC onde o perfil Recepção acessa apenas dados de cadastro e oculta o diagnóstico médico.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ],
        [
            Paragraph("REQ-02", body_style),
            Paragraph("<b>Organização por Pastas & Busca:</b> Navegar por pastas/subpastas e busca rápida de modelos.", body_style),
            Paragraph("Árvore de pastas por patologia + filtro de pesquisa inteligente por palavras-chave.", body_style),
            Paragraph("<font color='#0d9488'><b>Concluído</b></font>", body_style)
        ],
        [
            Paragraph("REQ-03", body_style),
            Paragraph("<b>Assinatura Digital & Jurídica:</b> Assinatura com certificado digital ICP-Brasil + carimbo visual.", body_style),
            Paragraph("Integração de assinatura PAdES/ICP-Brasil + carimbo visual + QR Code de validação no rodapé.", body_style),
            Paragraph("<font color='#0284c7'><b>Em Andamento</b></font>", body_style)
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
            Paragraph("<font color='#0284c7'><b>Em Andamento</b></font>", body_style)
        ],
        [
            Paragraph("REQ-06", body_style),
            Paragraph("<b>Modelos de EEG:</b> Incorporar os 24 modelos de Eletroencefalograma e Mapeamento Cerebral.", body_style),
            Paragraph("Cadastramento dos 24 modelos (Disfunção Cortical, Paroxismos/EPI e Normais) em variáveis do sistema.", body_style),
            Paragraph("<font color='#0284c7'><b>Em Andamento</b></font>", body_style)
        ]
    ]

    t_req = Table(req_table, colWidths=[38, 162, 220, 63])
    t_req.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_req)
    story.append(Spacer(1, 6))

    # 3. Funcionamento dos Modelos DOCX
    story.append(Paragraph("3. Estruturação dos Modelos `.docx` & Variáveis Automáticas", h1_style))
    story.append(Paragraph("• <b>Digitalização Inteligente:</b> Os 24 modelos de EEG e ENMG foram mapeados em variáveis automáticas: <i>{{NOME_PACIENTE}}</i>, <i>{{DATA_NASCIMENTO}}</i>, <i>{{MEDICO_SOLICITANTE}}</i>, <i>{{DATA_EXAME}}</i> e <i>{{CONCLUSAO_LAUDO}}</i>.", body_style))
    story.append(Paragraph("• <b>Fluxo em 3 Passos:</b> (1) Seleção do Paciente -> (2) Escolha do Modelo via Árvore/Busca com Texto Pré-preenchido -> (3) Finalização & Geração do PDF Timbrado.", body_style))

    # 4. Assinatura Digital
    story.append(Paragraph("4. Assinatura Eletrônica em 2 Camadas & QR Code", h1_style))
    story.append(Paragraph("• <b>Camada Visual:</b> Imagem do carimbo oficial e assinatura física do Dr. Eduardo com CRM.", bullet_style))
    story.append(Paragraph("• <b>Camada Criptográfica (ICP-Brasil PAdES):</b> Assinatura digital com Certificado A1/A3 selando o PDF contra adulteração.", bullet_style))
    story.append(Paragraph("• <b>QR Code de Validação Antifraude:</b> Leitura de QR Code no rodapé que confirma a veracidade no site da clínica.", bullet_style))

    # 5. Anexo de Gráficos e LGPD
    story.append(Paragraph("5. Anexo de Gráficos do Aparelho & Sigilo da Secretária (LGPD)", h1_style))
    story.append(Paragraph("• <b>Eliminação do Risco de Troca de Exames:</b> O PDF de gráficos gerado pelo aparelho é anexado diretamente ao prontuário do paciente no sistema. A secretária envia apenas o link seguro do portal, zerando manuseio de PDFs avulsos.", body_style))
    story.append(Paragraph("• <b>Sigilo Garantido:</b> A secretária gerencia agendamentos e envios sem visualizar diagnósticos médicos.", body_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF de Documentação atualizado com sucesso!")

if __name__ == '__main__':
    build_pdf()
