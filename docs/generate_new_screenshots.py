import os
from PIL import Image, ImageDraw, ImageFont

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def generate_screenshots():
    docs_dir = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs"
    
    try:
        font_title = ImageFont.truetype("arial.ttf", 20)
        font_bold = ImageFont.truetype("arialbd.ttf", 14)
        font_medium = ImageFont.truetype("arial.ttf", 12)
        font_small = ImageFont.truetype("arial.ttf", 10.5)
        font_mono = ImageFont.truetype("cour.ttf", 11)
    except:
        font_title = ImageFont.load_default()
        font_bold = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()
        font_mono = ImageFont.load_default()

    # --- SCREENSHOT 1: COPIAR & COLAR TEXTO DO WORD (.DOCX) (21/09/2026) ---
    img1 = Image.new('RGB', (1000, 620), color='#090d16')
    draw1 = ImageDraw.Draw(img1)
    
    # Outer Frame
    draw_rounded_rect(draw1, (20, 20, 980, 600), 20, fill='#0f172a', outline='#38bdf8', width=2)
    
    # Header Bar
    draw_rounded_rect(draw1, (40, 35, 960, 90), 14, fill='#1e293b', outline='#334155')
    draw1.text((55, 45), "Painel do Consultório — Copiar & Colar Texto Livre do Word (.docx)", fill='#ffffff', font=font_title)
    draw1.text((55, 68), "👑 Perfil Dr. Eduardo Magalhães | Importador de Modelos Locais & Arquivos do Drive", fill='#38bdf8', font=font_small)
    
    # Importer Box (REQ-12)
    draw_rounded_rect(draw1, (40, 105, 960, 290), 14, fill='#1e1b4b', outline='#6366f1', width=2)
    draw1.text((55, 115), "📋 Copiar & Colar Texto do Word (.docx) / Importador de Texto Livre:", fill='#818cf8', font=font_bold)
    draw1.text((55, 135), "Cole aqui qualquer texto ou modelo customizado vindo do seu Word (computador ou Google Drive):", fill='#cbd5e1', font=font_small)
    
    # Textarea inside Importer
    draw_rounded_rect(draw1, (55, 155, 945, 245), 10, fill='#020617', outline='#4338ca')
    word_snippet = "Exame compatível com neuropatia sensitivo-motora de caráter desmielinizante em nervos medianos.\nRecomendado acompanhamento clínico e eletrofisiológico seriado."
    draw1.text((65, 165), word_snippet, fill='#a5f3fc', font=font_mono)
    
    # Importer Buttons
    draw_rounded_rect(draw1, (780, 252, 945, 282), 8, fill='#06b6d4', outline='#22d3ee')
    draw1.text((795, 260), "✨ Carregar no Laudo", fill='#020617', font=font_bold)
    
    # Report Body Fields populated
    draw_rounded_rect(draw1, (40, 305, 490, 435), 10, fill='#020617', outline='#334155')
    draw1.text((50, 313), "1. Neurocondução Motora:", fill='#38bdf8', font=font_bold)
    draw1.text((50, 335), "Realizada em nervos ulnares e medianos.\nAmplitudes conservadas e latências distais normais.", fill='#f8fafc', font=font_small)

    draw_rounded_rect(draw1, (510, 305, 960, 435), 10, fill='#020617', outline='#334155')
    draw1.text((520, 313), "2. Neurocondução Sensitiva:", fill='#38bdf8', font=font_bold)
    draw1.text((520, 335), "Potenciais de ação com latências prolongadas\ne velocidades de condução diminuídas em medianos.", fill='#f8fafc', font=font_small)

    # Conclusion Box updated with Word content
    draw_rounded_rect(draw1, (40, 445, 960, 535), 12, fill='#0f172a', outline='#0284c7', width=2)
    draw1.text((55, 455), "5. Conclusão Médica do Laudo (Preenchida via Copiar & Colar do Word):", fill='#f59e0b', font=font_bold)
    draw1.text((55, 480), "Exame compatível com neuropatia sensitivo-motora de caráter desmielinizante em nervos medianos.\nRecomendado acompanhamento clínico e eletrofisiológico seriado.", fill='#ffffff', font=font_medium)

    # Footer Action
    draw_rounded_rect(draw1, (40, 545, 960, 588), 10, fill='#1e293b', outline='#334155')
    draw1.text((55, 558), "✓ Texto do Word integrado com sucesso. Clique em 'Assinar' para gerar o PDF Oficial.", fill='#10b981', font=font_bold)
    draw_rounded_rect(draw1, (710, 552, 945, 582), 8, fill='#0284c7', outline='#38bdf8')
    draw1.text((725, 560), "🖨️ Assinar & Gerar PDF", fill='#ffffff', font=font_bold)

    img1.save(os.path.join(docs_dir, "painel_copiar_colar_word.jpg"))
    print("painel_copiar_colar_word.jpg gerado!")

    # --- SCREENSHOT 2: EDICAO INTEGRAL DO CORPO DO LAUDO (15/09/2026) ---
    img2 = Image.new('RGB', (1000, 600), color='#090d16')
    draw2 = ImageDraw.Draw(img2)
    
    draw_rounded_rect(draw2, (20, 20, 980, 580), 20, fill='#0f172a', outline='#38bdf8', width=2)
    draw_rounded_rect(draw2, (40, 35, 960, 90), 14, fill='#1e293b', outline='#334155')
    draw2.text((55, 45), "Painel do Consultório — Edição Integral do Corpo do Laudo", fill='#ffffff', font=font_title)
    draw2.text((55, 68), "👑 Perfil Dr. Eduardo Magalhães | Todas as seções técnicas liberadas para personalização", fill='#38bdf8', font=font_small)
    
    draw_rounded_rect(draw2, (40, 105, 490, 225), 10, fill='#020617', outline='#334155')
    draw2.text((50, 113), "1. Neurocondução Motora (Editável):", fill='#38bdf8', font=font_bold)
    draw2.text((50, 135), "Realizada em nervos ulnares e medianos.\nObservamos amplitudes conservadas, com velocidades\nde condução normais e latências distais limítrofes.", fill='#f8fafc', font=font_small)

    draw_rounded_rect(draw2, (510, 105, 960, 225), 10, fill='#020617', outline='#334155')
    draw2.text((520, 113), "2. Neurocondução Sensitiva (Editável):", fill='#38bdf8', font=font_bold)
    draw2.text((520, 135), "Realizada em nervos ulnares, medianos e radiais.\nEm nervos medianos observamos potenciais de ação\ncom latências prolongadas e velocidades diminuídas.", fill='#f8fafc', font=font_small)

    draw_rounded_rect(draw2, (40, 235, 490, 355), 10, fill='#020617', outline='#334155')
    draw2.text((50, 243), "3. Onda F / Resposta Tardia (Editável):", fill='#38bdf8', font=font_bold)
    draw2.text((50, 265), "Pesquisada em nervos medianos e ulnares,\ncom latências mínimas normais e respostas síncronas.", fill='#f8fafc', font=font_small)

    draw_rounded_rect(draw2, (510, 235, 960, 355), 10, fill='#020617', outline='#334155')
    draw2.text((520, 243), "4. Eletromiografia / Registro (Editável):", fill='#38bdf8', font=font_bold)
    draw2.text((520, 265), "Realizada com agulha monopolar em músculos paracervicais,\ndeltoide, bíceps, extensor comum dos dedos e primeiro\ninterósseo dorsal.", fill='#f8fafc', font=font_small)

    draw_rounded_rect(draw2, (40, 365, 960, 495), 12, fill='#0f172a', outline='#0284c7', width=2)
    draw2.text((55, 375), "5. Conclusão Médica do Laudo (Síntese Diagnóstica - Editável):", fill='#f59e0b', font=font_bold)
    draw2.text((55, 400), "Exame compatível com neuropatia do mediano ao nível do carpo, com comprometimento parcial de fibras sensitivas,\nde caráter desmielinizante (grau 2), bilateral. Não foram evidenciados sinais de comprometimento radicular.", fill='#ffffff', font=font_medium)

    draw_rounded_rect(draw2, (40, 510, 960, 560), 10, fill='#1e293b', outline='#334155')
    draw2.text((55, 526), "✓ Alterações aplicadas no corpo do laudo são sincronizadas no PDF Timbrado com QR Code", fill='#10b981', font=font_bold)
    draw_rounded_rect(draw2, (650, 518, 945, 552), 8, fill='#0284c7', outline='#38bdf8')
    draw2.text((665, 529), "🖨️ Assinar & Gerar PDF Timbrado", fill='#ffffff', font=font_bold)

    img2.save(os.path.join(docs_dir, "painel_edicao_corpo_laudo.jpg"))
    print("painel_edicao_corpo_laudo.jpg gerado!")

if __name__ == '__main__':
    generate_screenshots()
