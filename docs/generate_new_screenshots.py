import os
from PIL import Image, ImageDraw, ImageFont

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

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

    # --- SCREENSHOT 3: LAYOUT DUAL COLUMN SPLIT-SCREEN (22/09/2026) ---
    img3 = Image.new('RGB', (1080, 680), color='#090d16')
    draw3 = ImageDraw.Draw(img3)
    
    # Outer Frame
    draw_rounded_rect(draw3, (15, 15, 1065, 665), 18, fill='#0f172a', outline='#38bdf8', width=2)
    
    # Header Bar
    draw_rounded_rect(draw3, (30, 25, 1050, 75), 12, fill='#1e293b', outline='#334155')
    draw3.text((45, 33), "Painel do Consultório — Layout de 2 Colunas (Estilo Windows Explorer)", fill='#ffffff', font=font_title)
    draw3.text((45, 55), "👑 Perfil Dr. Eduardo Magalhães | Lado Esquerdo: Árvore de Pastas | Lado Direito: Formulário de Laudo", fill='#38bdf8', font=font_small)
    
    # LEFT COLUMN: WINDOWS EXPLORER TREE VIEW (col-span-4)
    draw_rounded_rect(draw3, (30, 88, 350, 650), 14, fill='#020617', outline='#334155', width=1)
    draw3.text((42, 98), "📂 Árvore de Modelos (Explorer)", fill='#f59e0b', font=font_bold)
    draw_rounded_rect(draw3, (265, 96, 340, 116), 6, fill='#1e293b', outline='#475569')
    draw3.text((272, 100), "📂 Tudo | 📁 Fechar", fill='#38bdf8', font=font_small)

    # Search Box in Tree
    draw_rounded_rect(draw3, (42, 125, 338, 150), 8, fill='#0f172a', outline='#334155')
    draw3.text((50, 131), "🔍 Buscar modelo na árvore...", fill='#64748b', font=font_small)

    # Tree Categories with Expanded Subfolders
    y_tree = 160

    # Folder 1: STC
    draw_rounded_rect(draw3, (42, y_tree, 338, y_tree + 110), 8, fill='#090d16', outline='#1e293b')
    draw3.text((48, y_tree + 5), "📁 SÍNDROME DO TÚNEL DO CARPO (STC)", fill='#fde047', font=font_bold)
    draw3.text((58, y_tree + 25), "📄 STC Grau 1 (Leve Bilateral)", fill='#94a3b8', font=font_small)
    draw_rounded_rect(draw3, (55, y_tree + 42, 330, y_tree + 62), 5, fill='#0284c7', outline='#38bdf8')
    draw3.text((60, y_tree + 46), "✓ STC Grau 2 (Moderado Bilateral) [Ativo]", fill='#ffffff', font=font_bold)
    draw3.text((58, y_tree + 68), "📄 STC Grau 3 (Grave Uni/Bilateral)", fill='#94a3b8', font=font_small)
    draw3.text((58, y_tree + 88), "📄 STC Pós-Cirúrgico", fill='#94a3b8', font=font_small)

    y_tree += 118
    # Folder 2: RADICULOPATIAS
    draw_rounded_rect(draw3, (42, y_tree, 338, y_tree + 85), 8, fill='#090d16', outline='#1e293b')
    draw3.text((48, y_tree + 5), "📁 RADICULOPATIAS CERVICAIS / LOMBARES", fill='#fde047', font=font_bold)
    draw3.text((58, y_tree + 25), "📄 Radiculopatia Cervical C5-C6", fill='#94a3b8', font=font_small)
    draw3.text((58, y_tree + 45), "📄 Radiculopatia Lornbar L4-L5-S1", fill='#94a3b8', font=font_small)
    draw3.text((58, y_tree + 65), "📄 Polirradiculopatia Inflamatória", fill='#94a3b8', font=font_small)

    y_tree += 93
    # Folder 3: POLINEUROPATIAS
    draw_rounded_rect(draw3, (42, y_tree, 338, y_tree + 85), 8, fill='#090d16', outline='#1e293b')
    draw3.text((48, y_tree + 5), "📁 POLINEUROPATIAS PERIFÉRICAS", fill='#fde047', font=font_bold)
    draw3.text((58, y_tree + 25), "📄 Polineuropatia Diabética Simétrica", fill='#94a3b8', font=font_small)
    draw3.text((58, y_tree + 45), "📄 Polineuropatia Axonal Crônica", fill='#94a3b8', font=font_small)
    draw3.text((58, y_tree + 65), "📄 Polineuropatia Desmielinizante", fill='#94a3b8', font=font_small)

    y_tree += 93
    # Folder 4: EEG NORMAL & ALTERADO
    draw_rounded_rect(draw3, (42, y_tree, 338, y_tree + 85), 8, fill='#090d16', outline='#1e293b')
    draw3.text((48, y_tree + 5), "📁 ELETROENCEFALOGRAMA (EEG)", fill='#fde047', font=font_bold)
    draw3.text((58, y_tree + 25), "📄 EEG Vigília/Sono Normal", fill='#94a3b8', font=font_small)
    draw3.text((58, y_tree + 45), "📄 EEG Disfunção Cortical Difusa Grau 1", fill='#94a3b8', font=font_small)
    draw3.text((58, y_tree + 65), "📄 EEG Atividade Paroxística Temporal", fill='#94a3b8', font=font_small)

    # RIGHT COLUMN: REPORT EDITOR FORM (col-span-8)
    draw_rounded_rect(draw3, (365, 88, 1050, 650), 14, fill='#0f172a', outline='#334155', width=1)
    
    # Section 1: Patient Credentials (CPF Mevo)
    draw_rounded_rect(draw3, (375, 98, 1040, 195), 10, fill='#020617', outline='#1e293b')
    draw3.text((385, 105), "👤 Dados Cadastrais do Paciente (Busca Inteligente por CPF):", fill='#38bdf8', font=font_bold)
    draw3.text((385, 128), "CPF: 123.456.789-00 (Mevo) | PACIENTE: CLELIA MARI DE CARVALHO", fill='#ffffff', font=font_medium)
    draw3.text((385, 148), "DATA NASC: 07/05/1967 | SOLICITANTE: DR HEMANOEL FERRO | EXAME: 03/10/2025", fill='#cbd5e1', font=font_small)
    draw3.text((385, 170), "📎 Traçados Anexados: Graficos_Aparelho_ENMG_Clelia.pdf", fill='#10b981', font=font_small)

    # Section 2: Word Text Importer Box (REQ-12)
    draw_rounded_rect(draw3, (375, 205, 1040, 295), 10, fill='#1e1b4b', outline='#6366f1')
    draw3.text((385, 212), "📋 Copiar & Colar Texto do Word (.docx) / Importador de Texto Livre:", fill='#818cf8', font=font_bold)
    draw_rounded_rect(draw3, (385, 232, 1030, 268), 6, fill='#020617', outline='#4338ca')
    draw3.text((392, 240), "Cole aqui qualquer texto ou modelo vindo do Word para carregar instantaneamente...", fill='#64748b', font=font_mono)
    draw_rounded_rect(draw3, (900, 271, 1030, 290), 6, fill='#06b6d4')
    draw3.text((910, 275), "✨ Carregar no Laudo", fill='#020617', font=font_bold)

    # Section 3: 5 Report Body Blocks (REQ-11)
    draw_rounded_rect(draw3, (375, 305, 700, 415), 8, fill='#020617', outline='#334155')
    draw3.text((382, 312), "1. Neurocondução Motora:", fill='#38bdf8', font=font_bold)
    draw3.text((382, 330), "Realizada em nervos ulnares e medianos.\nAmplitudes conservadas e latências distais normais.", fill='#f8fafc', font=font_small)

    draw_rounded_rect(draw3, (715, 305, 1040, 415), 8, fill='#020617', outline='#334155')
    draw3.text((722, 312), "2. Neurocondução Sensitiva:", fill='#38bdf8', font=font_bold)
    draw3.text((722, 330), "Potenciais de ação com latências prolongadas\ne velocidades de condução diminuídas em medianos.", fill='#f8fafc', font=font_small)

    draw_rounded_rect(draw3, (375, 423, 700, 520), 8, fill='#020617', outline='#334155')
    draw3.text((382, 430), "3. Onda F / Resposta Tardia:", fill='#38bdf8', font=font_bold)
    draw3.text((382, 448), "Pesquisada em nervos medianos e ulnares,\ncom latências mínimas normais.", fill='#f8fafc', font=font_small)

    draw_rounded_rect(draw3, (715, 423, 1040, 520), 8, fill='#020617', outline='#334155')
    draw3.text((722, 430), "4. Eletromiografia / Registro:", fill='#38bdf8', font=font_bold)
    draw3.text((722, 448), "Realizada com agulha monopolar em músculos\nparacervicais e interósseo dorsal.", fill='#f8fafc', font=font_small)

    # Conclusion Box
    draw_rounded_rect(draw3, (375, 528, 1040, 600), 10, fill='#090d16', outline='#0284c7', width=2)
    draw3.text((385, 535), "5. Conclusão Médica do Laudo (Síntese Diagnóstica - Editável):", fill='#f59e0b', font=font_bold)
    draw3.text((385, 555), "Exame compatível com neuropatia do mediano ao nível do carpo, com comprometimento parcial de fibras sensitivas,\nde caráter desmielinizante (grau 2), bilateral.", fill='#ffffff', font=font_medium)

    # Action Bar
    draw_rounded_rect(draw3, (375, 608, 1040, 642), 8, fill='#1e293b', outline='#334155')
    draw3.text((385, 620), "✓ Assinatura Digital ICP-Brasil + Carimbo Visual e QR Code", fill='#10b981', font=font_bold)
    draw_rounded_rect(draw3, (820, 613, 1030, 637), 6, fill='#0284c7', outline='#38bdf8')
    draw3.text((830, 620), "🖨️ Assinar & Gerar PDF Timbrado", fill='#ffffff', font=font_bold)

    img3.save(os.path.join(docs_dir, "painel_layout_duas_colunas.jpg"))
    print("painel_layout_duas_colunas.jpg gerado!")

    # Re-save old screenshots to ensure completeness
    if not os.path.exists(os.path.join(docs_dir, "arvore_pastas_estilo_windows.jpg")):
        img3.save(os.path.join(docs_dir, "arvore_pastas_estilo_windows.jpg"))
        print("arvore_pastas_estilo_windows.jpg gerado!")

if __name__ == '__main__':
    generate_screenshots()
