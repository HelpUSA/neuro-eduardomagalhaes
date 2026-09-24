import os
from PIL import Image, ImageDraw, ImageFont

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def text_wrap(text, font, max_width, draw):
    lines = []
    for line in text.split('\n'):
        if not line:
            lines.append('')
            continue
        words = line.split(' ')
        current_line = []
        for word in words:
            test_line = ' '.join(current_line + [word])
            try:
                bbox = draw.textbbox((0, 0), test_line, font=font)
                w = bbox[2] - bbox[0]
            except:
                w = font.getlength(test_line)
            if w <= max_width:
                current_line.append(word)
            else:
                lines.append(' '.join(current_line))
                current_line = [word]
        if current_line:
            lines.append(' '.join(current_line))
    return lines

def generate_screenshots():
    docs_dir = os.path.dirname(os.path.abspath(__file__))
    
    try:
        font_title = ImageFont.truetype("arial.ttf", 20)
        font_bold = ImageFont.truetype("arialbd.ttf", 13)
        font_medium = ImageFont.truetype("arial.ttf", 11.5)
        font_small = ImageFont.truetype("arial.ttf", 10)
        font_mono = ImageFont.truetype("cour.ttf", 10.5)
    except:
        font_title = ImageFont.load_default()
        font_bold = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()
        font_mono = ImageFont.load_default()

    # --- SCREENSHOT 1: PAINEL DE EDIÇÃO EXPANSÍVEL 100% COM BARRA DE FORMATAÇÃO (REQ-18, REQ-19) ---
    img1 = Image.new('RGB', (1080, 680), color='#090d16')
    draw1 = ImageDraw.Draw(img1)
    
    # Outer Frame
    draw_rounded_rect(draw1, (15, 15, 1065, 665), 18, fill='#0f172a', outline='#38bdf8', width=2)
    
    # Header Bar
    draw_rounded_rect(draw1, (30, 25, 1050, 75), 12, fill='#1e293b', outline='#334155')
    draw1.text((45, 33), "Painel do Consultório — Modo de Edição Expandido (100% de Largura)", fill='#ffffff', font=font_title)
    draw1.text((45, 55), "👑 Perfil Dr. Eduardo Magalhães | Árvore Ocultável | Barra de Formatação Rica (Negrito/Itálico/Fonte)", fill='#38bdf8', font=font_small)

    # Top Toggle Bar (REQ-18)
    draw_rounded_rect(draw1, (30, 85, 1050, 120), 8, fill='#020617', outline='#334155')
    draw_rounded_rect(draw1, (40, 90, 360, 115), 6, fill='#1e293b', outline='#0284c7')
    draw1.text((50, 97), "📂 Ocultar Árvore (Maximizar Espaço de Edição)", fill='#fde047', font=font_bold)
    draw1.text((380, 97), "✨ Área de Edição Expandida em 100% da Tela para Máximo Conforto Visual", fill='#94a3b8', font=font_small)

    # FULL WIDTH REPORT EDITOR (col-span-12)
    draw_rounded_rect(draw1, (30, 130, 1050, 650), 14, fill='#0f172a', outline='#334155', width=1)
    
    # Section 1: Patient Credentials + History Badge (REQ-21)
    draw_rounded_rect(draw1, (45, 142, 1035, 230), 10, fill='#020617', outline='#1e293b')
    draw1.text((55, 149), "👤 Dados Cadastrais do Paciente (Busca Inteligente por CPF):", fill='#38bdf8', font=font_bold)
    draw_rounded_rect(draw1, (780, 146, 1025, 168), 6, fill='#4338ca', outline='#818cf8')
    draw1.text((790, 151), "📜 Exames Anteriores (3 Registros)", fill='#ffffff', font=font_bold)
    
    draw1.text((55, 172), "CPF: 123.456.789-00 (Mevo) | PACIENTE: CLELIA MARI DE CARVALHO", fill='#ffffff', font=font_medium)
    draw1.text((55, 192), "DATA NASC: 07/05/1967 | SOLICITANTE: DR HEMANOEL FERRO | EXAME: 03/10/2025", fill='#cbd5e1', font=font_small)
    draw1.text((55, 210), "📎 Traçados Anexados: Graficos_Aparelho_ENMG_Clelia.pdf", fill='#10b981', font=font_small)

    # Section 2: Rich Text Toolbar (REQ-19)
    draw_rounded_rect(draw1, (45, 240, 1035, 280), 8, fill='#020617', outline='#38bdf8')
    draw1.text((55, 252), "Formatação:", fill='#94a3b8', font=font_bold)
    
    draw_rounded_rect(draw1, (135, 247, 165, 273), 5, fill='#1e293b', outline='#475569')
    draw1.text((145, 253), "B", fill='#ffffff', font=font_bold)
    
    draw_rounded_rect(draw1, (172, 247, 202, 273), 5, fill='#1e293b', outline='#475569')
    draw1.text((184, 253), "I", fill='#ffffff', font=font_bold)

    draw_rounded_rect(draw1, (209, 247, 239, 273), 5, fill='#1e293b', outline='#475569')
    draw1.text((220, 253), "U", fill='#ffffff', font=font_bold)

    draw1.text((255, 253), "Fonte:", fill='#94a3b8', font=font_bold)
    draw_rounded_rect(draw1, (295, 247, 325, 273), 5, fill='#1e293b', outline='#475569')
    draw1.text((303, 253), "A-", fill='#38bdf8', font=font_bold)

    draw1.text((335, 253), "14px", fill='#38bdf8', font=font_mono)

    draw_rounded_rect(draw1, (375, 247, 405, 273), 5, fill='#1e293b', outline='#475569')
    draw1.text((383, 253), "A+", fill='#38bdf8', font=font_bold)

    draw_rounded_rect(draw1, (820, 247, 1025, 273), 6, fill='#d97706', outline='#f59e0b')
    draw1.text((830, 253), "💾 Salvar como Novo Modelo", fill='#020617', font=font_bold)

    # Section 3: CLEAN FULL TEXT EDITOR AREA WITH AUTO WORD WRAP (REQ-17, REQ-18)
    draw_rounded_rect(draw1, (45, 290, 1035, 600), 10, fill='#020617', outline='#38bdf8', width=2)
    
    raw_text = (
        "ELETRONEUROMIOGRAFIA DOS MEMBROS SUPERIORES\n\n"
        "Realizada eletroneuromiografia de membros superiores.\n"
        "A neurocondução motora foi realizada em nervos medianos e ulnares. Os potenciais de ação motores apresentaram "
        "velocidades de condução normais, latência distal limítrofe e amplitudes conservadas.\n"
        "A neurocondução sensitiva foi realizada em nervos medianos, ulnares e radiais. Em nervos medianos observamos "
        "potenciais de ação com latências prolongadas, velocidades de condução diminuídas e amplitudes normais.\n"
        "A onda F foi pesquisada em nervos medianos e ulnares, apresentando latências mínimas preservadas.\n"
        "A eletromiografia realizada com agulha monopolar exibiu potenciais de ação de unidades motoras com recrutamento "
        "normal e ausência de atividade espontânea.\n\n"
        "CONCLUSÃO:\n"
        "Exame compatível com neuropatia do mediano ao nível do carpo, com comprometimento parcial de fibras sensitivas, "
        "de caráter desmielinizante (grau 2), bilateral."
    )
    
    wrapped_lines = text_wrap(raw_text, font_medium, 960, draw1)
    
    y_text = 302
    for line in wrapped_lines:
        if y_text > 585:
            break
        draw1.text((60, y_text), line, fill='#f8fafc', font=font_medium)
        y_text += 17

    # Action Bar
    draw_rounded_rect(draw1, (45, 608, 1035, 642), 8, fill='#1e293b', outline='#334155')
    draw1.text((55, 620), "✓ Assinatura Digital ICP-Brasil + Carimbo Visual e QR Code", fill='#10b981', font=font_bold)
    draw_rounded_rect(draw1, (815, 613, 1025, 637), 6, fill='#0284c7', outline='#38bdf8')
    draw1.text((825, 620), "🖨️ Assinar & Gerar PDF Timbrado", fill='#ffffff', font=font_bold)

    img1.save(os.path.join(docs_dir, "painel_editor_expansivel.jpg"))
    print("painel_editor_expansivel.jpg gerado com quebra de linha perfeita!")

    # --- SCREENSHOT 2: HISTÓRICO DE EXAMES ANTERIORES DO PACIENTE (REQ-21) ---
    img2 = Image.new('RGB', (600, 480), color='#090d16')
    draw2 = ImageDraw.Draw(img2)
    draw_rounded_rect(draw2, (10, 10, 590, 470), 14, fill='#0f172a', outline='#6366f1', width=2)
    draw2.text((25, 22), "📜 Histórico de Exames Anteriores do Paciente", fill='#818cf8', font=font_title)
    draw2.text((25, 48), "Paciente: CLELIA MARI DE CARVALHO (CPF: 123.456.789-00)", fill='#94a3b8', font=font_small)

    y_hist = 75
    # Exam 1
    draw_rounded_rect(draw2, (25, y_hist, 575, y_hist + 110), 8, fill='#020617', outline='#334155')
    draw2.text((35, y_hist + 8), "ENMG - STC Grau 2 (Moderado Bilateral)", fill='#fde047', font=font_bold)
    draw2.text((450, y_hist + 8), "📅 03/10/2025", fill='#38bdf8', font=font_mono)
    draw2.text((35, y_hist + 32), "Exame compatível com neuropatia do mediano ao nível do carpo (grau 2).", fill='#f8fafc', font=font_small)
    draw2.text((35, y_hist + 55), "Solicitante: DR HEMANOEL FERRO | Status: Concluído", fill='#cbd5e1', font=font_small)
    draw_rounded_rect(draw2, (340, y_hist + 75, 565, y_hist + 100), 6, fill='#4338ca')
    draw2.text((350, y_hist + 82), "👁️ Reutilizar Achados no Laudo", fill='#ffffff', font=font_bold)

    y_hist += 120
    # Exam 2
    draw_rounded_rect(draw2, (25, y_hist, 575, y_hist + 110), 8, fill='#020617', outline='#334155')
    draw2.text((35, y_hist + 8), "ENMG - STC Grau 1 (Leve Bilateral)", fill='#fde047', font=font_bold)
    draw2.text((450, y_hist + 8), "📅 14/04/2024", fill='#38bdf8', font=font_mono)
    draw2.text((35, y_hist + 32), "Exame compatível com neuropatia leve do mediano ao nível do carpo.", fill='#f8fafc', font=font_small)
    draw2.text((35, y_hist + 55), "Solicitante: DR EDUARDO MAGALHÃES | Status: Concluído", fill='#cbd5e1', font=font_small)
    draw_rounded_rect(draw2, (340, y_hist + 75, 565, y_hist + 100), 6, fill='#4338ca')
    draw2.text((350, y_hist + 82), "👁️ Reutilizar Achados no Laudo", fill='#ffffff', font=font_bold)

    y_hist += 120
    # Exam 3
    draw_rounded_rect(draw2, (25, y_hist, 575, y_hist + 110), 8, fill='#020617', outline='#334155')
    draw2.text((35, y_hist + 8), "EEG - Vigília e Sono Normal", fill='#fde047', font=font_bold)
    draw2.text((450, y_hist + 8), "📅 10/01/2023", fill='#38bdf8', font=font_mono)
    draw2.text((35, y_hist + 32), "Eletroencefalograma dentro dos padrões da normalidade para a idade.", fill='#f8fafc', font=font_small)
    draw2.text((35, y_hist + 55), "Solicitante: DR EDUARDO MAGALHÃES | Status: Concluído", fill='#cbd5e1', font=font_small)
    draw_rounded_rect(draw2, (340, y_hist + 75, 565, y_hist + 100), 6, fill='#4338ca')
    draw2.text((350, y_hist + 82), "👁️ Reutilizar Achados no Laudo", fill='#ffffff', font=font_bold)

    img2.save(os.path.join(docs_dir, "historico_exames_paciente.jpg"))
    print("historico_exames_paciente.jpg gerado!")

    # --- SCREENSHOT 3: EDIÇÃO E REMOÇÃO DE MODELOS NA ÁRVORE (REQ-20) ---
    img3 = Image.new('RGB', (500, 480), color='#090d16')
    draw3 = ImageDraw.Draw(img3)
    draw_rounded_rect(draw3, (10, 10, 490, 470), 14, fill='#020617', outline='#f59e0b', width=2)
    draw3.text((25, 22), "📂 Gestão de Modelos na Árvore", fill='#fde047', font=font_title)
    draw3.text((25, 48), "Dr. Eduardo pode editar, remover ou criar templates", fill='#94a3b8', font=font_small)

    y_mod = 75
    # Category: STC
    draw_rounded_rect(draw3, (25, y_mod, 475, y_mod + 180), 8, fill='#0f172a', outline='#334155')
    draw3.text((35, y_mod + 8), "📁 SÍNDROME DO TÚNEL DO CARPO (STC)", fill='#fde047', font=font_bold)
    
    # Template item 1 with action buttons
    draw_rounded_rect(draw3, (35, y_mod + 32, 465, y_mod + 68), 6, fill='#1e293b', outline='#0284c7')
    draw3.text((45, y_mod + 43), "📄 STC Grau 1 (Leve Bilateral)", fill='#ffffff', font=font_bold)
    draw_rounded_rect(draw3, (360, y_mod + 40, 405, y_mod + 60), 4, fill='#0284c7')
    draw3.text((368, y_mod + 44), "✏️ Edit", fill='#ffffff', font=font_small)
    draw_rounded_rect(draw3, (412, y_mod + 40, 455, y_mod + 60), 4, fill='#991b1b')
    draw3.text((420, y_mod + 44), "🗑️ Del", fill='#ffffff', font=font_small)

    # Template item 2 with action buttons
    draw_rounded_rect(draw3, (35, y_mod + 75, 465, y_mod + 111), 6, fill='#1e293b', outline='#334155')
    draw3.text((45, y_mod + 86), "📄 STC Grau 2 (Moderado Bilateral)", fill='#cbd5e1', font=font_bold)
    draw_rounded_rect(draw3, (360, y_mod + 83, 405, y_mod + 103), 4, fill='#334155')
    draw3.text((368, y_mod + 87), "✏️ Edit", fill='#ffffff', font=font_small)
    draw_rounded_rect(draw3, (412, y_mod + 83, 455, y_mod + 103), 4, fill='#991b1b')
    draw3.text((420, y_mod + 87), "🗑️ Del", fill='#ffffff', font=font_small)

    # Template item 3 (Custom added)
    draw_rounded_rect(draw3, (35, y_mod + 118, 465, y_mod + 154), 6, fill='#1e1b4b', outline='#6366f1')
    draw3.text((45, y_mod + 129), "✨ STC Grau 3 (Modelo Personalizado Dr. Eduardo)", fill='#a5b4fc', font=font_bold)
    draw_rounded_rect(draw3, (360, y_mod + 126, 405, y_mod + 146), 4, fill='#4338ca')
    draw3.text((368, y_mod + 130), "✏️ Edit", fill='#ffffff', font=font_small)
    draw_rounded_rect(draw3, (412, y_mod + 126, 455, y_mod + 146), 4, fill='#991b1b')
    draw3.text((420, y_mod + 130), "🗑️ Del", fill='#ffffff', font=font_small)

    # Modal Form Preview
    y_form = 270
    draw_rounded_rect(draw3, (25, y_form, 475, y_form + 180), 10, fill='#020617', outline='#f59e0b', width=2)
    draw3.text((35, y_form + 10), "💾 Modal: Salvar / Editar Modelo Personalizado", fill='#f59e0b', font=font_bold)
    draw3.text((35, y_form + 35), "Título: ENMG - STC Grau 2 com Neuropatia Ulnar", fill='#ffffff', font=font_small)
    draw3.text((35, y_form + 55), "Categoria: ENMG - Síndrome do Túnel do Carpo (STC)", fill='#cbd5e1', font=font_small)
    draw_rounded_rect(draw3, (35, y_form + 75, 465, y_form + 140), 6, fill='#0f172a', outline='#334155')
    draw3.text((42, y_form + 82), "Texto completo do modelo editado pelo Dr. Eduardo...", fill='#94a3b8', font=font_mono)
    draw_rounded_rect(draw3, (340, y_form + 148, 465, y_form + 170), 6, fill='#f59e0b')
    draw3.text((350, y_form + 154), "✓ Salvar Modelo", fill='#020617', font=font_bold)

    img3.save(os.path.join(docs_dir, "edicao_remocao_modelos.jpg"))
    print("edicao_remocao_modelos.jpg gerado!")

    # --- SCREENSHOT 4: BOTÕES DESFAZER / REFAZER E ATALHOS CTRL+Z / CTRL+Y (24/09/2026) ---
    img4 = Image.new('RGB', (750, 420), color='#090d16')
    draw4 = ImageDraw.Draw(img4)
    draw_rounded_rect(draw4, (10, 10, 740, 410), 14, fill='#0f172a', outline='#818cf8', width=2)
    draw4.text((25, 22), "🔄 Botões Desfazer / Refazer na Edição de Laudos", fill='#818cf8', font=font_title)
    draw4.text((25, 48), "Recuperação instantânea de digitações acidentais e históricos de alterações", fill='#94a3b8', font=font_small)

    # Toolbar Zoom Card
    draw_rounded_rect(draw4, (25, 80, 725, 140), 10, fill='#020617', outline='#38bdf8', width=2)
    draw4.text((35, 88), "Barra de Ferramentas do Editor de Laudos:", fill='#38bdf8', font=font_small)

    # Bold, Italic, Underline
    draw_rounded_rect(draw4, (35, 105, 60, 130), 4, fill='#1e293b')
    draw4.text((43, 110), "B", fill='#ffffff', font=font_bold)
    draw_rounded_rect(draw4, (65, 105, 90, 130), 4, fill='#1e293b')
    draw4.text((73, 110), "I", fill='#ffffff', font=font_bold)
    draw_rounded_rect(draw4, (95, 105, 120, 130), 4, fill='#1e293b')
    draw4.text((103, 110), "U", fill='#ffffff', font=font_bold)

    # HIGHLIGHTED UNDO / REDO BUTTONS
    draw_rounded_rect(draw4, (135, 105, 275, 130), 6, fill='#312e81', outline='#818cf8', width=2)
    draw4.text((143, 110), "↩️ Desfazer (Ctrl+Z)", fill='#e0e7ff', font=font_bold)

    draw_rounded_rect(draw4, (285, 105, 420, 130), 6, fill='#312e81', outline='#818cf8', width=2)
    draw4.text((293, 110), "↪️ Refazer (Ctrl+Y)", fill='#e0e7ff', font=font_bold)

    # Font Controls
    draw4.text((435, 111), "Fonte:", fill='#94a3b8', font=font_bold)
    draw_rounded_rect(draw4, (480, 105, 505, 130), 4, fill='#1e293b')
    draw4.text((487, 110), "A-", fill='#38bdf8', font=font_bold)
    draw4.text((512, 110), "14px", fill='#38bdf8', font=font_mono)
    draw_rounded_rect(draw4, (550, 105, 575, 130), 4, fill='#1e293b')
    draw4.text((557, 110), "A+", fill='#38bdf8', font=font_bold)

    # Text Area simulation with history annotation
    draw_rounded_rect(draw4, (25, 155, 725, 390), 10, fill='#020617', outline='#334155')
    draw4.text((35, 165), "ELETRONEUROMIOGRAFIA DOS MEMBROS SUPERIORES", fill='#38bdf8', font=font_bold)
    draw4.text((35, 190), "Realizada eletroneuromiografia de membros superiores.", fill='#f8fafc', font=font_medium)
    draw4.text((35, 210), "A neurocondução motora foi realizada em nervos medianos e ulnares...", fill='#cbd5e1', font=font_medium)
    draw4.text((35, 240), "[ Pressione Ctrl + Z no teclado para desfazer qualquer trecho digitado ]", fill='#818cf8', font=font_bold)
    draw4.text((35, 260), "[ Pressione Ctrl + Y ou Ctrl + Shift + Z para refazer a edição anterior ]", fill='#818cf8', font=font_bold)

    draw_rounded_rect(draw4, (35, 300, 715, 375), 8, fill='#1e1b4b', outline='#6366f1')
    draw4.text((45, 310), "💡 Como usar:", fill='#fde047', font=font_bold)
    draw4.text((45, 330), "• Clique no botão 'Desfazer' ou use a tecla de atalho Ctrl+Z no teclado.", fill='#ffffff', font=font_small)
    draw4.text((45, 350), "• Clique no botão 'Refazer' ou use a tecla de atalho Ctrl+Y no teclado.", fill='#ffffff', font=font_small)

    img4.save(os.path.join(docs_dir, "desfazer_refazer_editor.jpg"))
    print("desfazer_refazer_editor.jpg gerado!")

    # --- SCREENSHOT 5: COMPATIBILIDADE DE FONTE DO EDITOR COM O PDF (24/09/2026) ---
    img5 = Image.new('RGB', (750, 460), color='#090d16')
    draw5 = ImageDraw.Draw(img5)
    draw_rounded_rect(draw5, (10, 10, 740, 450), 14, fill='#0f172a', outline='#f59e0b', width=2)
    draw5.text((25, 22), "🖨️ Sincronização Dinâmica da Fonte (Edição ➔ PDF)", fill='#fde047', font=font_title)
    draw5.text((25, 48), "Ajustar o tamanho da fonte na edição altera automaticamente o tamanho no PDF timbrado", fill='#94a3b8', font=font_small)

    # Font size control highlight
    draw_rounded_rect(draw5, (25, 80, 725, 145), 10, fill='#020617', outline='#f59e0b', width=2)
    draw5.text((35, 88), "Controle de Tamanho de Fonte na Tela de Edição:", fill='#38bdf8', font=font_bold)
    
    draw_rounded_rect(draw5, (35, 110, 75, 135), 4, fill='#1e293b', outline='#475569')
    draw5.text((47, 115), "A-", fill='#38bdf8', font=font_bold)

    draw_rounded_rect(draw5, (85, 110, 260, 135), 6, fill='#451a03', outline='#f59e0b')
    draw5.text((95, 115), "16px (PDF: 10.5pt)", fill='#fde047', font=font_bold)

    draw_rounded_rect(draw5, (270, 110, 310, 135), 4, fill='#1e293b', outline='#475569')
    draw5.text((282, 115), "A+", fill='#38bdf8', font=font_bold)

    draw5.text((325, 115), "⬅️ Selecione o tamanho desejado (ex: 16px ➔ 10.5pt no PDF)", fill='#cbd5e1', font=font_small)

    # PDF Output Simulation Comparison
    draw_rounded_rect(draw5, (25, 160, 725, 430), 10, fill='#020617', outline='#334155')
    draw5.text((35, 172), "📄 Resultado no PDF Oficial Timbrado (Laudo Médico):", fill='#10b981', font=font_bold)

    # Simulated PDF Document
    draw_rounded_rect(draw5, (45, 200, 705, 415), 6, fill='#ffffff')
    draw_rounded_rect(draw5, (45, 200, 705, 235), 0, fill='#0f172a')
    draw5.text((55, 208), "CLÍNICA DE NEUROLOGIA DR. EDUARDO MAGALHÃES", fill='#ffffff', font=font_bold)
    draw5.text((55, 222), "Neurologia & Neurofisiologia Clínica | Laudo de Exame Oficial", fill='#38bdf8', font=font_small)

    # Patient info box
    draw_rounded_rect(draw5, (55, 245, 695, 280), 4, fill='#f8fafc', outline='#cbd5e1')
    draw5.text((65, 252), "PACIENTE: CLELIA MARI DE CARVALHO    DATA NASC: 07/05/1967", fill='#0f172a', font=font_bold)
    draw5.text((65, 266), "SOLICITANTE: DR HEMANOEL FERRO       DATA EXAME: 03/10/2025", fill='#0f172a', font=font_bold)

    # Body text rendered with enlarged font size (10.5pt proportional)
    draw5.text((55, 290), "CORPO TÉCNICO & LAUDO DIAGNÓSTICO:", fill='#0369a1', font=font_bold)
    draw5.text((55, 310), "ELETRONEUROMIOGRAFIA DOS MEMBROS SUPERIORES", fill='#1e293b', font=font_bold)
    draw5.text((55, 330), "Realizada eletroneuromiografia de membros superiores com fonte expandida.", fill='#1e293b', font=font_medium)
    draw5.text((55, 350), "A neurocondução motora apresentou velocidades normais e latência preservada.", fill='#1e293b', font=font_medium)
    draw5.text((55, 375), "CONCLUSÃO: Exame compatível com neuropatia do mediano no carpo (grau 2).", fill='#0f172a', font=font_bold)
    draw5.text((55, 395), "✨ Quebra automática de página habilitada se o texto exceder a folha!", fill='#059669', font=font_small)

    img5.save(os.path.join(docs_dir, "fonte_dinamica_pdf.jpg"))
    print("fonte_dinamica_pdf.jpg gerado!")

    # Maintain copies for fallback compatibility
    img1.save(os.path.join(docs_dir, "painel_campo_unico_edicao.jpg"))
    img1.save(os.path.join(docs_dir, "painel_layout_duas_colunas.jpg"))

if __name__ == '__main__':
    generate_screenshots()
