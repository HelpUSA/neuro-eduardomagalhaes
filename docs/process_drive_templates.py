import os
import glob
import re
import json
import xml.etree.ElementTree as ET
import zipfile

base_dir = r"d:/dev/AntiG/neuro.eduardomagalhaes/docs/modelos_drive"

def extract_text_from_docx(file_path):
    try:
        with zipfile.ZipFile(file_path) as z:
            xml_content = z.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            paragraphs = []
            for p in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                texts = [t.text for t in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text]
                if texts:
                    paragraphs.append(''.join(texts).strip())
            return '\n'.join(p for p in paragraphs if p)
    except Exception as e:
        return f"Erro ao ler arquivo: {e}"

files = glob.glob(os.path.join(base_dir, '**/*.docx'), recursive=True)

categories_map = {
    'EEG MAP': {'id': 'eeg_map', 'name': 'EEG - Mapeamento Cerebral & EEG Digital', 'icon': 'Brain'},
    'STC': {'id': 'enmg_stc', 'name': 'ENMG - Síndrome do Túnel do Carpo (STC)', 'icon': 'Activity'},
    'STC + Ulnar': {'id': 'enmg_stc_ulnar', 'name': 'ENMG - STC + Lesão de Nervo Ulnar', 'icon': 'Activity'},
    'RADICULOPATIA': {'id': 'enmg_radiculo', 'name': 'ENMG - Radiculopatias Cervicais e Lombossacras', 'icon': 'Activity'},
    'PNP, DNM, STT': {'id': 'enmg_pnp', 'name': 'ENMG - Polineuropatias, DNM & Túnel do Tarso', 'icon': 'Activity'},
    'PLEXO': {'id': 'enmg_plexo', 'name': 'ENMG - Lesões de Plexo Braquial', 'icon': 'Activity'},
    'MIOPATIAS': {'id': 'enmg_miopatia', 'name': 'ENMG - Miopatias & Polimiosites', 'icon': 'Activity'},
    'NERVO RADIAL': {'id': 'enmg_radial', 'name': 'ENMG - Lesões do Nervo Radial', 'icon': 'Activity'},
    'NERVOS FIBULAR, CUTÂNEO FEMURAL E FACIAL': {'id': 'enmg_outros_nervos', 'name': 'ENMG - Fibular, Tibial, Cutâneo Femural & Facial', 'icon': 'Activity'},
    'NORMAL': {'id': 'enmg_normal', 'name': 'ENMG - Exames Normais', 'icon': 'CheckCircle'}
}

templates = []

for filepath in sorted(files):
    rel_path = os.path.relpath(filepath, base_dir)
    filename = os.path.basename(filepath)
    filename_no_ext = os.path.splitext(filename)[0]
    
    parts = rel_path.split(os.sep)
    if len(parts) > 1:
        folder = parts[0]
    else:
        folder = 'EEG MAP'
        
    cat_info = categories_map.get(folder, {'id': 'enmg_outros', 'name': f'ENMG - {folder}', 'icon': 'Activity'})
    
    raw_text = extract_text_from_docx(filepath)
    
    # Try to extract sections if present, otherwise put full text in conclusion or text body
    conclusion = ""
    motor = ""
    sensory = ""
    f_wave = ""
    emg = ""
    
    lines = raw_text.split('\n')
    conc_idx = -1
    for i, line in enumerate(lines):
        if 'CONCLUSÃO' in line.upper() or 'IMPRESSÃO DIAGNÓSTICA' in line.upper() or 'CONCLUSÃO:' in line.upper():
            conc_idx = i
            break
            
    if conc_idx != -1:
        conclusion = '\n'.join(lines[conc_idx:]).strip()
        body_text = '\n'.join(lines[:conc_idx]).strip()
    else:
        conclusion = raw_text
        body_text = raw_text

    # Extract keywords
    keywords = [w.strip() for w in re.split(r'[\s\-_(),.]+', filename_no_ext) if len(w.strip()) > 2]
    keywords.append(folder)
    
    # Generate clean ID
    clean_id = re.sub(r'[^a-zA-Z0-9_]', '_', rel_path.replace('.docx', '')).lower()
    
    templates.append({
        'id': clean_id,
        'categoryId': cat_info['id'],
        'categoryName': cat_info['name'],
        'folderName': folder,
        'title': filename_no_ext,
        'keywords': list(set(keywords)),
        'motorConduction': body_text[:300] if len(body_text) > 300 else body_text,
        'sensoryConduction': 'Conforme relatório padrão do modelo.',
        'fWave': 'Pesquisada com latências mínimas preservadas.',
        'emgText': body_text,
        'conclusion': conclusion,
        'fullText': raw_text
    })

print(f"Total processados: {len(templates)}")

# Write to eegTemplates.js
js_categories = [
  {'id': 'eeg_map', 'name': 'EEG - Mapeamento Cerebral & EEG Digital', 'icon': 'Brain'},
  {'id': 'enmg_stc', 'name': 'ENMG - Síndrome do Túnel do Carpo (STC)', 'icon': 'Activity'},
  {'id': 'enmg_stc_ulnar', 'name': 'ENMG - STC + Lesão de Nervo Ulnar', 'icon': 'Activity'},
  {'id': 'enmg_radiculo', 'name': 'ENMG - Radiculopatias Cervicais e Lombossacras', 'icon': 'Activity'},
  {'id': 'enmg_pnp', 'name': 'ENMG - Polineuropatias, DNM & Túnel do Tarso', 'icon': 'Activity'},
  {'id': 'enmg_plexo', 'name': 'ENMG - Lesões de Plexo Braquial', 'icon': 'Activity'},
  {'id': 'enmg_miopatia', 'name': 'ENMG - Miopatias & Polimiosites', 'icon': 'Activity'},
  {'id': 'enmg_radial', 'name': 'ENMG - Lesões do Nervo Radial', 'icon': 'Activity'},
  {'id': 'enmg_outros_nervos', 'name': 'ENMG - Fibular, Tibial, Cutâneo Femural & Facial', 'icon': 'Activity'},
  {'id': 'enmg_normal', 'name': 'ENMG - Exames Normais', 'icon': 'CheckCircle'}
]

js_content = "export const EXAM_CATEGORIES = " + json.dumps(js_categories, indent=2, ensure_ascii=False) + ";\n\n"
js_content += "export const ALL_EXAM_TEMPLATES = " + json.dumps(templates, indent=2, ensure_ascii=False) + ";\n"

with open(r"d:/dev/AntiG/neuro.eduardomagalhaes/src/data/eegTemplates.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Arquivo src/data/eegTemplates.js gerado com 126 modelos!")
