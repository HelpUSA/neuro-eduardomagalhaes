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

    # --- SCREENSHOT 1: PAINEL COM CAMPO ÚNICO DE EDIÇÃO INTEG-RAL (22/09/2026) ---
    img1 = Image.new('RGB', (1080, 680), color='#090d16')
    draw1 = ImageDraw.Draw(img1)
    
    # Outer Frame
    draw_rounded_rect(draw1, (15, 15, 1065, 665), 18, fill='#0f172a', outline='#38bdf8', width=2)
    
    # Header Bar
    draw_rounded_rect(draw1, (30, 25, 1050, 75), 12, fill='#1e293b', outline='#334155')
    draw1.text((45, 33), "Painel do Consultório — Campo Único de Edição de Laudo (EEG / ENMG)", fill='#ffffff', font=font_title)
    draw1.text((45, 55), "👑 Perfil Dr. Eduardo Magalhães | Árvore A-Z à Esquerda | Campo de Texto Único Editável à Direita", fill='#38bdf8', font=font_small)
    
    # LEFT COLUMN: WINDOWS EXPLORER TREE VIEW (A-Z ALPHABETICAL ORDER)
    draw_rounded_rect(draw1, (30, 88, 350, 650), 14, fill='#020617', outline='#334155', width=1)
    draw1.text((42, 98), "📂 Árvore de Modelos (Ordem A-Z)", fill='#f59e0b', font=font_bold)
    draw_rounded_rect(draw1, (265, 96, 340, 116), 6, fill='#1e293b', outline='#475569')
    draw1.text((272, 100), "📂 Tudo | 📁 Fechar", fill='#38bdf8', font=font_small)

    # Search Box in Tree
    draw_rounded_rect(draw1, (42, 125, 338, 150), 8, fill='#0f172a', outline='#334155')
    draw1.text((50, 131), "🔍 Buscar modelo...", fill='#64748b', font=font_small)

    # A-Z Sorted Categories
    y_tree = 160

    # 1. ELETROENCEFALOGRAMA (EEG)
    draw_rounded_rect(draw1, (42, y_tree, 338, y_tree + 110), 8, fill='#090d16', outline='#0284c7', width=1)
    draw1.text((48, y_tree + 5), "📁 ELETROENCEFALOGRAMA (EEG)", fill='#fde047', font=font_bold)
    draw_rounded_rect(draw1, (55, y_tree + 23, 330, y_tree + 43), 5, fill='#0284c7', outline='#38bdf8')
    draw1.text((60, y_tree + 27), "✓ EEG Vigília e Sono Normal [Ativo]", fill='#ffffff', font=font_bold)
    draw1.text((58, y_tree + 48), "📄 EEG Disfunção Cortical Difusa Grau 1", fill='#94a3b8', font=font_small)
    draw1.text((58, y_tree + 68), "📄 EEG Atividade Paroxística Focal", fill='#94a3b8', font=font_small)
    draw1.text((58, y_tree + 88), "📄 EEG Com Registro Encefalográfico", fill='#94a3b8', font=font_small)

    y_tree += 118
    # 2. POLINEUROPATIAS PERIFÉRICAS
    draw_rounded_rect(draw1, (42, y_tree, 338, y_tree + 85), 8, fill='#090d16', outline='#1e293b')
    draw1.text((48, y_tree + 5), "📁 POLINEUROPATIAS PERIFÉRICAS", fill='#fde047', font=font_bold)
    draw1.text((58, y_tree + 25), "📄 Polineuropatia Diabética Simétrica", fill='#94a3b8', font=font_small)
    draw1.text((58, y_tree + 45), "📄 Polineuropatia Axonal Crônica", fill='#94a3b8', font=font_small)
    draw1.text((58, y_tree + 65), "📄 Polineuropatia Desmielinizante", fill='#94a3b8', font=font_small)

    y_tree += 93
    # 3. RADICULOPATIAS CERVICAIS / LOMBARES
    draw_rounded_rect(draw1, (42, y_tree, 338, y_tree + 85), 8, fill='#090d16', outline='#1e293b')
    draw1.text((48, y_tree + 5), "📁 RADICULOPATIAS CERVICAIS / LOMBARES", fill='#fde047', font=font_bold)
    draw1.text((58, y_tree + 25), "📄 Radiculopatia Cervical C5-C6", fill='#94a3b8', font=font_small)
    draw1.text((58, y_tree + 45), "📄 Radiculopatia Lombar L4-L5-S1", fill='#94a3b8', font=font_small)
    draw1.text((58, y_tree + 65), "📄 Polirradiculopatia Inflamatória", fill='#94a3b8', font=font_small)

    y_tree += 93
    # 4. SÍNDROME DO TÚNEL DO CARPO (STC)
    draw_rounded_rect(draw1, (42, y_tree, 338, y_tree + 85), 8, fill='#090d16', outline='#1e293b')
    draw1.text((48, y_tree + 5), "📁 SÍNDROME DO TÚNEL DO CARPO (STC)", fill='#fde047', font=font_bold)
    draw1.text((58, y_tree + 25), "📄 STC Grau 1 (Leve Bilateral)", fill='#94a3b8', font=font_small)
    draw1.text((58, y_tree + 45), "📄 STC Grau 2 (Moderado Bilateral)", fill='#94a3b8', font=font_small)
    draw1.text((58, y_tree + 65), "📄 STC Grau 3 (Grave Uni/Bilateral)", fill='#94a3b8', font=font_small)

    # RIGHT COLUMN: UNIFIED SINGLE TEXT EDITOR (col-span-8)
    draw_rounded_rect(draw1, (365, 88, 1050, 650), 14, fill='#0f172a', outline='#334155', width=1)
    
    # Section 1: Patient Credentials (CPF Mevo)
    draw_rounded_rect(draw1, (375, 98, 1040, 185), 10, fill='#020617', outline='#1e293b')
    draw1.text((385, 105), "👤 Dados Cadastrais do Paciente (Busca por CPF):", fill='#38bdf8', font=font_bold)
    draw1.text((385, 128), "CPF: 123.456.789-00 | PACIENTE: CLELIA MARI DE CARVALHO", fill='#ffffff', font=font_medium)
    draw1.text((385, 148), "DATA NASC: 07/05/1967 | SOLICITANTE: DR HEMANOEL FERRO | EXAME: 03/10/2025", fill='#cbd5e1', font=font_small)
    draw1.text((385, 166), "📎 Anexos: Graficos_Aparelho_ENMG_Clelia.pdf", fill='#10b981', font=font_small)

    # Section 2: Mode Toggle Bar (REQ-15)
    draw_rounded_rect(draw1, (375, 192, 1040, 230), 8, fill='#1e293b', outline='#475569')
    draw_rounded_rect(draw1, (380, 196, 680, 226), 6, fill='#0284c7', outline='#38bdf8')
    draw1.text((390, 204), "📝 Campo Único (Texto Integral EEG/ENMG)", fill='#ffffff', font=font_bold)
    
    draw_rounded_rect(draw1, (690, 196, 1030, 226), 6, fill='#090d16', outline='#334155')
    draw1.text((700, 204), "📑 Sub-seções Separadas ENMG", fill='#94a3b8', font=font_medium)

    # Section 3: UNIFIED FULL-TEXT BOX
    draw_rounded_rect(draw1, (375, 238, 1040, 600), 10, fill='#020617', outline='#38bdf8', width=2)
    draw1.text((385, 246), "📝 Corpo Integral do Laudo Médico (Texto Continuo Totalmente Editável):", fill='#f59e0b', font=font_bold)
    
    unified_text = (
        "ELETROENCEFALOGRAMA DE VIGÍLIA E SONO\n\n"
        "TÉCNICA:\n"
        "Exame realizado com eletrodos posicionados segundo o Sistema Internacional 10-20, "
        "com registros em vigília, sonolência e sono espontâneo.\n\n"
        "DESCRIÇÃO DOS ACHADOS:\n"
        "- Ritmo de fundo posterior constituído por ondas alfa de 9,5 a 10 Hz, simétrico, "
        "reativo à abertura e fechamento ocular.\n"
        "- Durante a sonolência e sono espontâneo, observam-se elementos de sono (ondas agudas do vértex, "
        "fusos de sono) bem configurados e simétricos.\n"
        "- Métodos de ativação (Hiperpneia e Fotoestimulação Intermitente) não desencadearam anormalidades.\n\n"
        "CONCLUSÃO:\n"
        "Eletroencefalograma de vigília e sono dentro dos padrões da normalidade para a faixa etária."
    )
    
    y_text = 270
    for line in unified_text.split('\n'):
        draw1.text((385, y_text), line, fill='#f8fafc', font=font_small)
        y_text += 18

    # Action Bar
    draw_rounded_rect(draw1, (375, 608, 1040, 642), 8, fill='#1e293b', outline='#334155')
    draw1.text((385, 620), "✓ Assinatura Digital ICP-Brasil + Carimbo Visual e QR Code", fill='#10b981', font=font_bold)
    draw_rounded_rect(draw1, (820, 613, 1030, 637), 6, fill='#0284c7', outline='#38bdf8')
    draw1.text((830, 620), "🖨️ Assinar & Gerar PDF Timbrado", fill='#ffffff', font=font_bold)

    img1.save(os.path.join(docs_dir, "painel_campo_unico_edicao.jpg"))
    print("painel_campo_unico_edicao.jpg gerado!")

    # --- SCREENSHOT 2: ARVORE EM ORDEM ALFABETICA A-Z ---
    img2 = Image.new('RGB', (500, 600), color='#090d16')
    draw2 = ImageDraw.Draw(img2)
    draw_rounded_rect(draw2, (10, 10, 490, 590), 14, fill='#020617', outline='#38bdf8', width=2)
    draw2.text((25, 22), "📂 Árvore de Modelos — Ordem A-Z (Default)", fill='#38bdf8', font=font_title)
    draw2.text((25, 48), "Todas as pastas e subpastas organizadas de A a Z", fill='#94a3b8', font=font_small)

    y_az = 75
    # Category 1: ELETROENCEFALOGRAMA
    draw_rounded_rect(draw2, (25, y_az, 475, y_az + 115), 8, fill='#0f172a', outline='#0284c7')
    draw2.text((35, y_az + 8), "📁 1. ELETROENCEFALOGRAMA (EEG)", fill='#fde047', font=font_bold)
    draw2.text((45, y_az + 30), "📄 EEG Atividade Paroxística Temporal", fill='#cbd5e1', font=font_small)
    draw2.text((45, y_az + 50), "📄 EEG Disfunção Cortical Difusa Grau 1", fill='#cbd5e1', font=font_small)
    draw2.text((45, y_az + 70), "📄 EEG Vigília/Sono Normal", fill='#cbd5e1', font=font_small)
    draw2.text((45, y_az + 90), "📄 EEG com Ativação por Hiperpneia", fill='#cbd5e1', font=font_small)

    y_az += 125
    # Category 2: POLINEUROPATIAS
    draw_rounded_rect(draw2, (25, y_az, 475, y_az + 95), 8, fill='#0f172a', outline='#1e293b')
    draw2.text((35, y_az + 8), "📁 2. POLINEUROPATIAS PERIFÉRICAS", fill='#fde047', font=font_bold)
    draw2.text((45, y_az + 30), "📄 Polineuropatia Axonal Crônica", fill='#cbd5e1', font=font_small)
    draw2.text((45, y_az + 50), "📄 Polineuropatia Desmielinizante", fill='#cbd5e1', font=font_small)
    draw2.text((45, y_az + 70), "📄 Polineuropatia Diabética Simétrica", fill='#cbd5e1', font=font_small)

    y_az += 105
    # Category 3: RADICULOPATIAS
    draw_rounded_rect(draw2, (25, y_az, 475, y_az + 95), 8, fill='#0f172a', outline='#1e293b')
    draw2.text((35, y_az + 8), "📁 3. RADICULOPATIAS CERVICAIS / LOMBARES", fill='#fde047', font=font_bold)
    draw2.text((45, y_az + 30), "📄 Polirradiculopatia Inflamatória", fill='#cbd5e1', font=font_small)
    draw2.text((45, y_az + 50), "📄 Radiculopatia Cervical C5-C6", fill='#cbd5e1', font=font_small)
    draw2.text((45, y_az + 70), "📄 Radiculopatia Lombar L4-L5-S1", fill='#cbd5e1', font=font_small)

    y_az += 105
    # Category 4: SÍNDROME DO TÚNEL DO CARPO
    draw_rounded_rect(draw2, (25, y_az, 475, y_az + 95), 8, fill='#0f172a', outline='#1e293b')
    draw2.text((35, y_az + 8), "📁 4. SÍNDROME DO TÚNEL DO CARPO (STC)", fill='#fde047', font=font_bold)
    draw2.text((45, y_az + 30), "📄 STC Grau 1 (Leve Bilateral)", fill='#cbd5e1', font=font_small)
    draw2.text((45, y_az + 50), "📄 STC Grau 2 (Moderado Bilateral)", fill='#cbd5e1', font=font_small)
    draw2.text((45, y_az + 70), "📄 STC Grau 3 (Grave Uni/Bilateral)", fill='#cbd5e1', font=font_small)

    img2.save(os.path.join(docs_dir, "arvore_ordem_alfabetica.jpg"))
    print("arvore_ordem_alfabetica.jpg gerado!")

    # Save copy for painel_layout_duas_colunas and arvore_pastas_estilo_windows as fallback
    img1.save(os.path.join(docs_dir, "painel_layout_duas_colunas.jpg"))
    img2.save(os.path.join(docs_dir, "arvore_pastas_estilo_windows.jpg"))

if __name__ == '__main__':
    generate_screenshots()
