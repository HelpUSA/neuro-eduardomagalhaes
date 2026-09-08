import os
from PIL import Image, ImageDraw, ImageFont

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def generate_screenshots():
    docs_dir = r"d:\dev\AntiG\neuro.eduardomagalhaes\docs"
    
    # Try loading default fonts
    try:
        font_title = ImageFont.truetype("arial.ttf", 22)
        font_subtitle = ImageFont.truetype("arial.ttf", 14)
        font_bold = ImageFont.truetype("arialbd.ttf", 15)
        font_medium = ImageFont.truetype("arial.ttf", 13)
        font_small = ImageFont.truetype("arial.ttf", 11)
        font_mono = ImageFont.truetype("cour.ttf", 12)
    except:
        font_title = ImageFont.load_default()
        font_subtitle = ImageFont.load_default()
        font_bold = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()
        font_mono = ImageFont.load_default()

    # --- SCREENSHOT 1: PAINEL MEDICO COM ARVORE DRIVE & CPF MEVO ---
    img1 = Image.new('RGB', (1000, 560), color='#090d16')
    draw1 = ImageDraw.Draw(img1)
    
    # Outer Panel Box
    draw_rounded_rect(draw1, (20, 20, 980, 540), 20, fill='#0f172a', outline='#38bdf8', width=2)
    
    # Header Bar
    draw_rounded_rect(draw1, (40, 35, 960, 95), 14, fill='#1e293b', outline='#334155')
    draw1.text((55, 47), "Painel do Consultório — Dr. Eduardo Magalhães", fill='#ffffff', font=font_title)
    draw1.text((55, 73), "Perfil Ativo: 👑 Dr. Eduardo (Médico / Administrador) | Clínica de Neurologia", fill='#94a3b8', font=font_small)
    draw_rounded_rect(draw1, (780, 50, 940, 80), 8, fill='#f59e0b', outline='#d97706')
    draw1.text((800, 58), "Sessão Ativa", fill='#0f172a', font=font_bold)
    
    # Drive Folders Box
    draw_rounded_rect(draw1, (40, 110, 480, 380), 14, fill='#020617', outline='#1e293b')
    draw1.text((55, 120), "📁 Árvore de Pastas (Google Drive - 126 Modelos):", fill='#38bdf8', font=font_bold)
    
    folders = [
        ("📁 EEG - Mapeamento Cerebral", "24 modelos", '#a855f7'),
        ("📁 ENMG - Síndrome do Túnel do Carpo", "24 modelos", '#06b6d4'),
        ("📁 ENMG - STC + Lesão Ulnar", "10 modelos", '#06b6d4'),
        ("📁 ENMG - Radiculopatias Cervicais/Lombossacras", "14 modelos", '#06b6d4'),
        ("📁 ENMG - Polineuropatias (PNP / SGB)", "17 modelos", '#06b6d4'),
        ("📁 ENMG - Plexo Braquial & Miopatias", "9 modelos", '#06b6d4'),
        ("📁 ENMG - Radial, Fibular, Facial & Normais", "28 modelos", '#10b981')
    ]
    
    y = 150
    for name, count, color in folders:
        draw_rounded_rect(draw1, (55, y, 465, y + 28), 6, fill='#0f172a', outline='#334155')
        draw1.text((65, y + 6), name, fill='#f8fafc', font=font_small)
        draw1.text((380, y + 6), count, fill=color, font=font_small)
        y += 32
        
    # Patient CPF Box (Mevo Style)
    draw_rounded_rect(draw1, (500, 110, 960, 380), 14, fill='#020617', outline='#1e293b')
    draw1.text((515, 120), "🔍 Dados Cadastrais & Auto-Preenchimento por CPF:", fill='#38bdf8', font=font_bold)
    
    # Toast Mevo Badge
    draw_rounded_rect(draw1, (515, 145, 945, 175), 8, fill='#312e81', outline='#6366f1')
    draw1.text((530, 153), "🌐 Paciente Localizado via Consulta de CPF em Tempo Real (Mevo Style)!", fill='#c7d2fe', font=font_small)
    
    # Inputs
    draw1.text((515, 185), "CPF do Paciente (Mevo):", fill='#94a3b8', font=font_small)
    draw_rounded_rect(draw1, (515, 202, 700, 232), 6, fill='#0f172a', outline='#06b6d4')
    draw1.text((525, 210), "123.456.789-00", fill='#38bdf8', font=font_bold)
    
    draw1.text((715, 185), "Data Nasc.:", fill='#94a3b8', font=font_small)
    draw_rounded_rect(draw1, (715, 202, 945, 232), 6, fill='#0f172a', outline='#334155')
    draw1.text((725, 210), "07/05/1967", fill='#ffffff', font=font_medium)
    
    draw1.text((515, 240), "Nome Completo do Paciente:", fill='#94a3b8', font=font_small)
    draw_rounded_rect(draw1, (515, 257, 945, 287), 6, fill='#0f172a', outline='#334155')
    draw1.text((525, 265), "CLELIA MARI DE CARVALHO", fill='#ffffff', font=font_bold)

    draw1.text((515, 295), "Conclusão Médica do Laudo:", fill='#94a3b8', font=font_small)
    draw_rounded_rect(draw1, (515, 312, 945, 368), 6, fill='#0f172a', outline='#0284c7')
    draw1.text((525, 320), "Exame compatível com neuropatia do mediano ao nível do carpo...", fill='#f8fafc', font=font_small)
    
    # Bottom Action Bar
    draw_rounded_rect(draw1, (40, 395, 960, 520), 14, fill='#1e293b', outline='#334155')
    draw1.text((55, 410), "Assinatura Digital ICP-Brasil + Carimbo Ilustrativo & QR Code no Rodapé", fill='#10b981', font=font_bold)
    
    draw_rounded_rect(draw1, (620, 440, 940, 495), 10, fill='#0284c7', outline='#38bdf8')
    draw1.text((640, 458), "🖨️ Assinar & Gerar PDF Timbrado", fill='#ffffff', font=font_bold)
    
    img1.save(os.path.join(docs_dir, "painel_medico_laudos_novo.jpg"))
    print("painel_medico_laudos_novo.jpg gerado!")

    # --- SCREENSHOT 2: GESTAO DE USUARIOS & NIVEIS DE ACESSO (RBAC) ---
    img2 = Image.new('RGB', (1000, 560), color='#090d16')
    draw2 = ImageDraw.Draw(img2)
    
    draw_rounded_rect(draw2, (20, 20, 980, 540), 20, fill='#0f172a', outline='#f59e0b', width=2)
    
    # Header
    draw_rounded_rect(draw2, (40, 35, 960, 95), 14, fill='#1e293b', outline='#334155')
    draw2.text((55, 47), "Gestão de Usuários & Níveis de Acesso (RBAC)", fill='#ffffff', font=font_title)
    draw2.text((55, 73), "Dr. Eduardo cria, edita e revoga acessos de secretárias e médicos na clínica", fill='#94a3b8', font=font_small)
    
    draw_rounded_rect(draw2, (740, 48, 940, 82), 10, fill='#f59e0b', outline='#b45309')
    draw2.text((755, 57), "+ Cadastrar Usuário", fill='#0f172a', font=font_bold)
    
    # Users Table
    draw_rounded_rect(draw2, (40, 110, 560, 510), 14, fill='#020617', outline='#1e293b')
    draw2.text((55, 125), "Usuários Cadastrados no Sistema:", fill='#38bdf8', font=font_bold)
    
    users = [
        ("Dr. Eduardo Magalhães", "eduardo@clinica.com.br", "👑 Administrador / Médico", "Total (Assinatura)", '#10b981'),
        ("Juliana Costa", "juliana@clinica.com.br", "📋 Secretária / Atendimento", "Oculto (Sigilo LGPD)", '#f59e0b'),
        ("Fernanda Souza", "fernanda@clinica.com.br", "📋 Secretária / Atendimento", "Oculto (Sigilo LGPD)", '#f59e0b'),
        ("Dr. Paulo Henrique", "paulo@clinica.com.br", "👑 Médico Neurologista", "Total (Assinatura)", '#10b981')
    ]
    
    y = 155
    for name, email, role, access, acc_color in users:
        draw_rounded_rect(draw2, (55, y, 545, y + 75), 8, fill='#0f172a', outline='#334155')
        draw2.text((65, y + 8), name, fill='#ffffff', font=font_bold)
        draw2.text((65, y + 28), email, fill='#94a3b8', font=font_small)
        draw2.text((65, y + 48), role, fill='#38bdf8', font=font_small)
        draw2.text((360, y + 28), access, fill=acc_color, font=font_small)
        draw2.text((480, y + 48), "✏️  🗑️", fill='#cbd5e1', font=font_small)
        y += 85
        
    # Modal Form (Creating / Editing User)
    draw_rounded_rect(draw2, (580, 110, 960, 510), 14, fill='#1e293b', outline='#f59e0b', width=2)
    draw2.text((600, 125), "Cadastrar / Editar Usuário:", fill='#f59e0b', font=font_bold)
    
    draw2.text((600, 160), "Nome Completo:", fill='#94a3b8', font=font_small)
    draw_rounded_rect(draw2, (600, 178, 940, 208), 6, fill='#020617', outline='#334155')
    draw2.text((610, 186), "Dra. Juliana Santos", fill='#ffffff', font=font_medium)
    
    draw2.text((600, 220), "E-mail de Login:", fill='#94a3b8', font=font_small)
    draw_rounded_rect(draw2, (600, 238, 940, 268), 6, fill='#020617', outline='#334155')
    draw2.text((610, 246), "juliana@clinica.com.br", fill='#ffffff', font=font_medium)
    
    draw2.text((600, 280), "Senha de Acesso:", fill='#94a3b8', font=font_small)
    draw_rounded_rect(draw2, (600, 298, 940, 328), 6, fill='#020617', outline='#334155')
    draw2.text((610, 306), "•••••••• (123456)", fill='#ffffff', font=font_mono)

    draw2.text((600, 340), "Nível de Acesso (RBAC):", fill='#94a3b8', font=font_small)
    draw_rounded_rect(draw2, (600, 358, 940, 388), 6, fill='#020617', outline='#06b6d4')
    draw2.text((610, 366), "📋 Secretária / Atendimento (LGPD)", fill='#38bdf8', font=font_bold)

    draw_rounded_rect(draw2, (760, 440, 940, 485), 8, fill='#f59e0b', outline='#b45309')
    draw2.text((780, 455), "Salvar Usuário", fill='#0f172a', font=font_bold)

    img2.save(os.path.join(docs_dir, "gestao_usuarios_rbac.jpg"))
    print("gestao_usuarios_rbac.jpg gerado!")

    # --- SCREENSHOT 3: BASE WINSOFT DE PACIENTES ---
    img3 = Image.new('RGB', (1000, 560), color='#090d16')
    draw3 = ImageDraw.Draw(img3)
    
    draw_rounded_rect(draw3, (20, 20, 980, 540), 20, fill='#0f172a', outline='#6366f1', width=2)
    
    # Header
    draw_rounded_rect(draw3, (40, 35, 960, 95), 14, fill='#1e293b', outline='#334155')
    draw3.text((55, 47), "Base de Dados de Pacientes (Winsoft - Jean Cordeiro)", fill='#ffffff', font=font_title)
    draw3.text((55, 73), "Cadastros históricos de 18 anos sincronizados para busca por CPF e carga CSV", fill='#94a3b8', font=font_small)
    
    draw_rounded_rect(draw3, (710, 48, 940, 82), 10, fill='#4f46e5', outline='#6366f1')
    draw3.text((725, 57), "📤 Importar Lista (CSV)", fill='#ffffff', font=font_bold)
    
    # Patient List Box
    draw_rounded_rect(draw3, (40, 110, 960, 510), 14, fill='#020617', outline='#1e293b')
    draw3.text((55, 125), "Pacientes Cadastrados no Sistema:", fill='#38bdf8', font=font_bold)
    
    patients = [
        ("123.456.789-00", "CLELIA MARI DE CARVALHO", "07/05/1967", "03/10/2025", "DR HEMANOEL FERRO"),
        ("987.654.321-11", "MARIA APARECIDA DA SILVA", "14/11/1975", "15/08/2025", "DRA PATRICIA ALBUQUERQUE"),
        ("456.789.123-22", "JOAO CARLOS OLIVEIRA SANTOS", "22/03/1982", "20/09/2025", "DR EDUARDO MAGALHÃES"),
        ("333.444.555-66", "ROBERTO MENDES GONÇALVES", "03/09/1959", "01/09/2025", "DR LUIZ FERNANDO PAIVA"),
        ("777.888.999-00", "ANA BEATRIZ MOREIRA", "18/12/1994", "05/09/2025", "DRA CARLA VASCONCELOS")
    ]
    
    y = 160
    for cpf_str, pname, dob, lexam, req_doc in patients:
        draw_rounded_rect(draw3, (55, y, 945, y + 55), 8, fill='#0f172a', outline='#334155')
        draw3.text((65, y + 10), cpf_str, fill='#38bdf8', font=font_bold)
        draw3.text((220, y + 10), pname, fill='#ffffff', font=font_bold)
        draw3.text((500, y + 10), f"Nasc: {dob}", fill='#94a3b8', font=font_small)
        draw3.text((640, y + 10), f"Exame: {lexam}", fill='#94a3b8', font=font_small)
        
        draw_rounded_rect(draw3, (820, y + 12, 930, y + 42), 6, fill='#0284c7', outline='#38bdf8')
        draw3.text((832, y + 20), "Usar no Laudo", fill='#ffffff', font=font_small)
        y += 68

    img3.save(os.path.join(docs_dir, "base_winsoft_pacientes.jpg"))
    print("base_winsoft_pacientes.jpg gerado!")

if __name__ == '__main__':
    generate_screenshots()
