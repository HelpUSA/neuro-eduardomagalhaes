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

    # --- SCREENSHOT: EDICAO INTEGRAL DO CORPO DO LAUDO (15/09/2026) ---
    img = Image.new('RGB', (1000, 600), color='#090d16')
    draw = ImageDraw.Draw(img)
    
    # Outer Frame
    draw_rounded_rect(draw, (20, 20, 980, 580), 20, fill='#0f172a', outline='#38bdf8', width=2)
    
    # Header
    draw_rounded_rect(draw, (40, 35, 960, 90), 14, fill='#1e293b', outline='#334155')
    draw.text((55, 45), "Painel do Consultório — Edição Integral do Corpo do Laudo", fill='#ffffff', font=font_title)
    draw.text((55, 68), "👑 Perfil Dr. Eduardo Magalhães | Todas as seções técnicas liberadas para personalização", fill='#38bdf8', font=font_small)
    
    # Textarea 1: Neurocondução Motora
    draw_rounded_rect(draw, (40, 105, 490, 225), 10, fill='#020617', outline='#334155')
    draw.text((50, 113), "1. Neurocondução Motora (Editável):", fill='#38bdf8', font=font_bold)
    draw.text((50, 135), "Realizada em nervos ulnares e medianos.\nObservamos amplitudes conservadas, com velocidades\nde condução normais e latências distais limítrofes.", fill='#f8fafc', font=font_small)

    # Textarea 2: Neurocondução Sensitiva
    draw_rounded_rect(draw, (510, 105, 960, 225), 10, fill='#020617', outline='#334155')
    draw.text((520, 113), "2. Neurocondução Sensitiva (Editável):", fill='#38bdf8', font=font_bold)
    draw.text((520, 135), "Realizada em nervos ulnares, medianos e radiais.\nEm nervos medianos observamos potenciais de ação\ncom latências prolongadas e velocidades diminuídas.", fill='#f8fafc', font=font_small)

    # Textarea 3: Onda F / Resposta Tardia
    draw_rounded_rect(draw, (40, 235, 490, 355), 10, fill='#020617', outline='#334155')
    draw.text((50, 243), "3. Onda F / Resposta Tardia (Editável):", fill='#38bdf8', font=font_bold)
    draw.text((50, 265), "Pesquisada em nervos medianos e ulnares,\ncom latências mínimas normais e respostas síncronas.", fill='#f8fafc', font=font_small)

    # Textarea 4: Eletromiografia / Registro Cerebral
    draw_rounded_rect(draw, (510, 235, 960, 355), 10, fill='#020617', outline='#334155')
    draw.text((520, 243), "4. Eletromiografia / Registro (Editável):", fill='#38bdf8', font=font_bold)
    draw.text((520, 265), "Realizada com agulha monopolar em músculos paracervicais,\ndeltoide, bíceps, extensor comum dos dedos e primeiro\ninterósseo dorsal.", fill='#f8fafc', font=font_small)

    # Textarea 5: Conclusão Médica do Laudo
    draw_rounded_rect(draw, (40, 365, 960, 495), 12, fill='#0f172a', outline='#0284c7', width=2)
    draw.text((55, 375), "5. Conclusão Médica do Laudo (Síntese Diagnóstica - Editável):", fill='#f59e0b', font=font_bold)
    draw.text((55, 400), "Exame compatível com neuropatia do mediano ao nível do carpo, com comprometimento parcial de fibras sensitivas,\nde caráter desmielinizante (grau 2), bilateral. Não foram evidenciados sinais de comprometimento radicular.", fill='#ffffff', font=font_medium)

    # Bottom Footer Actions
    draw_rounded_rect(draw, (40, 510, 960, 560), 10, fill='#1e293b', outline='#334155')
    draw.text((55, 526), "✓ Alterações aplicadas no corpo do laudo são sincronizadas no PDF Timbrado com QR Code", fill='#10b981', font=font_bold)
    
    draw_rounded_rect(draw, (650, 518, 945, 552), 8, fill='#0284c7', outline='#38bdf8')
    draw.text((665, 529), "🖨️ Assinar & Gerar PDF Timbrado", fill='#ffffff', font=font_bold)

    img.save(os.path.join(docs_dir, "painel_edicao_corpo_laudo.jpg"))
    print("painel_edicao_corpo_laudo.jpg gerado!")

if __name__ == '__main__':
    generate_screenshots()
