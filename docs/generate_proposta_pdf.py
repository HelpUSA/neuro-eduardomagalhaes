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
        
        # Header (pages after page 1)
        if self._pageNumber > 1:
            self.drawString(54, 800, "Proposta de Solução Tecnológica | Clínica Eduardo Magalhães")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 792, 541, 792)
        
        # Footer
        footer_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(541, 32, footer_text)
        self.drawString(54, 32, "Documento Confidencial - Proposta de Projeto para o Dr. Eduardo Magalhães")
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 44, 541, 44)
        self.restoreState()

def create_proposal_pdf(output_filename):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    PRIMARY = colors.HexColor("#0F172A")    # Dark Slate
    SECONDARY = colors.HexColor("#0284C7")  # Deep Blue
    TEXT_DARK = colors.HexColor("#1E293B")  # Charcoal Body Text
    BG_LIGHT = colors.HexColor("#F8FAFC")   # Light Cool Neutral
    ACCENT = colors.HexColor("#0369A1")     # Rich Blue Accent

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=SECONDARY,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=12,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=ACCENT,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=TEXT_DARK,
        spaceAfter=5
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=body_style,
        leftIndent=12,
        spaceAfter=3
    )

    story = []

    # Header section with title and photo if available
    img_path = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\foto eduardo.jpg"
    if os.path.exists(img_path):
        doctor_img = Image(img_path, width=54, height=54)
        header_text = [
            Paragraph("PROPOSTA DE SOLUÇÃO & OTIMIZAÇÃO TECNOLÓGICA", title_style),
            Paragraph("Plataforma de Laudos, Busca Inteligente & Portal do Paciente", subtitle_style)
        ]
        t_header = Table([[header_text, doctor_img]], colWidths=[420, 63])
        t_header.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('ALIGN', (1,0), (1,0), 'RIGHT'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(t_header)
    else:
        story.append(Paragraph("PROPOSTA DE SOLUÇÃO & OTIMIZAÇÃO TECNOLÓGICA", title_style))
        story.append(Paragraph("Plataforma de Laudos, Busca Inteligente & Portal do Paciente", subtitle_style))

    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=SECONDARY, spaceAfter=10))

    # Meta Table
    meta_data = [
        [Paragraph("<b>Cliente:</b> Dr. Eduardo Magalhães", body_style), Paragraph("<b>Data:</b> 06/09/2026", body_style)],
        [Paragraph("<b>Especialidade:</b> Neurologia & Neurofisiologia", body_style), Paragraph("<b>Tecnologia:</b> 100% Nuvem (Vercel + Railway)", body_style)],
        [Paragraph("<b>Projeto:</b> Plataforma neuro.eduardomagalhaes", body_style), Paragraph("<b>Acesso:</b> Web App Multidispositivo", body_style)]
    ]
    t_meta = Table(meta_data, colWidths=[240, 243])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 10))

    # 1. Resumo Executivo
    story.append(Paragraph("1. Resumo Executivo & Objetivos", h1_style))
    story.append(Paragraph(
        "Esta proposta apresenta o projeto de desenvolvimento da nova plataforma tecnológica sob medida para a clínica do "
        "<b>Dr. Eduardo Magalhães</b>. O objetivo principal é automatizar o fluxo de emissão de laudos de exames "
        "(como Eletroneuromiografia - ENMG, EEG e Mapeamento Cerebral), instituir um mecanismo moderno de busca de histórico por palavras-chave "
        "e oferecer aos pacientes um Portal de Exames seguro, com integração para envio via WhatsApp.", body_style
    ))

    # 2. Diagnóstico Comparativo
    story.append(Paragraph("2. Diagnóstico dos Processos Atuais vs. Nova Plataforma", h1_style))
    
    diag_data = [
        [Paragraph("<b>Processo Atual (Gargalos)</b>", h2_style), Paragraph("<b>Solução Proposta (Nova Plataforma)</b>", h2_style)],
        [
            Paragraph("Edição manual de arquivos Word (.docx) soltos na nuvem/pasta local.", body_style),
            Paragraph("Emissor web com modelos pré-configurados (ENMG, EEG). Preenchimento rápido e PDF gerado no papel timbrado oficial.", body_style)
        ],
        [
            Paragraph("Busca de laudos restrita exclusivamente ao nome do arquivo.", body_style),
            Paragraph("Mecanismo de busca inteligente por diagnósticos ('STC Grau 2', 'Túnel do Carpo'), CPF, Nome, Data Nasc ou Período.", body_style)
        ],
        [
            Paragraph("Envio manual de arquivos por WhatsApp ou impressão inteira no balcão.", body_style),
            Paragraph("Portal do Paciente autônomo (login por CPF + Data Nasc) + botão de envio no WhatsApp com link/PDF direto em 1 clique.", body_style)
        ],
        [
            Paragraph("Risco de substituição acidental de arquivos e falta de controle de acessos.", body_style),
            Paragraph("Banco de dados na nuvem (Railway/PostgreSQL) com criptografia, backup automático contínuo e perfis de permissão (LGPD).", body_style)
        ]
    ]
    t_diag = Table(diag_data, colWidths=[235, 248])
    t_diag.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor("#F1F5F9")),
        ('BACKGROUND', (1,0), (1,0), colors.HexColor("#E0F2FE")),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(t_diag)
    story.append(Spacer(1, 10))

    # 3. Módulos do Sistema
    story.append(Paragraph("3. Módulos e Funcionalidades do Sistema", h1_style))

    story.append(Paragraph("A. Emissor Inteligente de Laudos (Painel do Médico)", h2_style))
    story.append(Paragraph("• <b>Templates Pré-determinados:</b> Seleção direta do modelo do exame (ex: <i>ENMG - STC Grau 2 Bilateral</i>).", bullet_style))
    story.append(Paragraph("• <b>Campos Dinâmicos:</b> Preenchimento rápido de paciente, solicitante, data do exame e achados clínicos.", bullet_style))
    story.append(Paragraph("• <b>PDF Timbrado & QR Code:</b> Geração instantânea no papel timbrado oficial da Clínica Eduardo Magalhães com QR Code de verificação.", bullet_style))

    story.append(Paragraph("B. Mecanismo de Busca Inteligente & Histórico", h2_style))
    story.append(Paragraph("• <b>Busca por Diagnósticos (Full-Text):</b> Localização imediata de exames por conclusões médicas (ex: <i>'Túnel do Carpo'</i>, <i>'Radiculopatia'</i>).", bullet_style))
    story.append(Paragraph("• <b>Filtros Avançados:</b> Pesquisa por Data de Nascimento, CPF, Nome do Paciente, Médico Solicitante ou Período.", bullet_style))

    story.append(Paragraph("C. Portal do Paciente & Disparo via WhatsApp", h2_style))
    story.append(Paragraph("• <b>Área do Paciente:</b> O paciente acessa o site e digita seu CPF + Data de Nascimento para visualizar/baixar o laudo em PDF.", bullet_style))
    story.append(Paragraph("• <b>Envio via WhatsApp:</b> Envio direto de mensagem personalizada com link seguro com apenas 1 clique no painel.", bullet_style))

    story.append(Paragraph("D. Gestão de Funcionários & Controle de Permissões (RBAC)", h2_style))
    story.append(Paragraph("• <b>Perfis de Acesso Personalizados:</b>", bullet_style))
    story.append(Paragraph("  - <b>👑 Administrador (Dr. Eduardo):</b> Acesso total, edição de modelos de laudo, assinatura e gestão de funcionários.", ParagraphStyle('Sub1', parent=bullet_style, leftIndent=22)))
    story.append(Paragraph("  - <b>📋 Recepção / Secretária:</b> Cadastro de pacientes, preenchimento inicial, impressão e disparo por WhatsApp (sem alterar laudos técnicos).", ParagraphStyle('Sub2', parent=bullet_style, leftIndent=22)))
    story.append(Paragraph("• <b>Segurança & Auditoria:</b> Desativação instantânea de acessos e registro completo de logs (LGPD).", bullet_style))

    story.append(Spacer(1, 10))

    # 4. Infraestrutura na Nuvem
    story.append(Paragraph("4. Arquitetura Técnica & Deploy na Nuvem", h1_style))
    story.append(Paragraph("• <b>Plataforma 100% na Nuvem:</b> Acessível de qualquer computador, tablet ou celular sem necessidade de instalação.", bullet_style))
    story.append(Paragraph("• <b>Frontend / Interface:</b> Desenvolvido em React / Next.js / Vite (Hospedado no <b>Vercel</b>).", bullet_style))
    story.append(Paragraph("• <b>Backend & Banco de Dados:</b> Servidor Node.js / Python + PostgreSQL criptografado (Hospedado no <b>Railway</b>).", bullet_style))
    story.append(Paragraph("• <b>Domínio & Integração:</b> Configuração no domínio principal via <b>Squarespace</b> (ex: <i>clinicaeduardomagalhaes.com.br</i>).", bullet_style))

    story.append(Spacer(1, 10))

    # 5. Resumo de Benefícios
    story.append(Paragraph("5. Principais Benefícios para o Consultório", h1_style))
    
    ben_box = [
        [Paragraph("⚡ <b>Otimização de Tempo:</b> Emissão de laudos em fração do tempo atual, sem digitação repetitiva.", body_style)],
        [Paragraph("🔒 <b>Segurança de Dados:</b> Backup contínuo na nuvem e conformidade total com a LGPD.", body_style)],
        [Paragraph("🔍 <b>Recuperação Instantânea:</b> Localize qualquer laudo emitido em segundos por diagnósticos ou dados cadastrais.", body_style)],
        [Paragraph("🌟 <b>Experiência do Paciente:</b> Portal de exames inovador e canal direto via WhatsApp sem gastos com papel.", body_style)],
        [Paragraph("👥 <b>Controle de Equipe:</b> Gestão simples de usuários com permissões específicas para secretárias e médicos.", body_style)]
    ]
    t_ben = Table(ben_box, colWidths=[483])
    t_ben.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_LIGHT),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_ben)

    # Build PDF
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF criado com sucesso em: {output_filename}")

if __name__ == '__main__':
    target_pdf = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs\Proposta_Solucao_Otimizacao_Laudos_Dr_Eduardo_Magalhaes.pdf"
    create_proposal_pdf(target_pdf)
