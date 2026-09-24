import os

path = r'D:\AntiG\neuro.eduardomagalhaes\src\components\MedicalLaudosApp.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

target_str = '<span className="truncate">{tmpl.title}</span>'
replacement_str = '<span className="truncate" title={tmpl.title}>{tmpl.title}</span>'

old_item = '''                                      {catTemplates.map(tmpl => (
                                        <div
                                          key={tmpl.id}
                                          onClick={() => handleSelectTemplate(tmpl)}
                                          className={`w-full p-2 rounded-lg border text-left text-[11px] font-sans transition flex items-center justify-between gap-1 cursor-pointer group ${selectedTemplateId === tmpl.id ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold shadow-sm' : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white'}`}
                                        >
                                          <span className="truncate flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{tmpl.title}</span>
                                          </span>

                                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                                            {currentUserRole === 'doctor' && (
                                              <>
                                                <button
                                                  type="button"
                                                  onClick={(e) => handleOpenEditTemplate(e, tmpl)}
                                                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-300"
                                                  title="Editar Modelo"
                                                >
                                                  <Edit3 className="w-3 h-3" />
                                                </button>
                                                <button
                                                  type="button"
                                                  onClick={(e) => handleDeleteTemplate(e, tmpl.id)}
                                                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                                                  title="Excluir Modelo"
                                                >
                                                  <Trash2 className="w-3 h-3" />
                                                </button>
                                              </>
                                            )}
                                            {selectedTemplateId === tmpl.id && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />}
                                          </div>
                                        </div>
                                      ))}'''

old_item = old_item.replace('\r\n', '\n')

new_item = '''                                      {catTemplates.map(tmpl => (
                                        <div key={tmpl.id} className="relative group">
                                          <div
                                            onClick={() => handleSelectTemplate(tmpl)}
                                            title={tmpl.title}
                                            className={`w-full p-2 rounded-lg border text-left text-[11px] font-sans transition flex items-center justify-between gap-1 cursor-pointer ${selectedTemplateId === tmpl.id ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 font-bold shadow-sm' : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white'}`}
                                          >
                                            <span className="truncate flex items-center gap-1.5" title={tmpl.title}>
                                              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                              <span className="truncate" title={tmpl.title}>{tmpl.title}</span>
                                            </span>

                                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                                              {currentUserRole === 'doctor' && (
                                                <>
                                                  <button
                                                    type="button"
                                                    onClick={(e) => handleOpenEditTemplate(e, tmpl)}
                                                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-300"
                                                    title="Editar Modelo"
                                                  >
                                                    <Edit3 className="w-3 h-3" />
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteTemplate(e, tmpl.id)}
                                                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                                                    title="Excluir Modelo"
                                                  >
                                                    <Trash2 className="w-3 h-3" />
                                                  </button>
                                                </>
                                              )}
                                              {selectedTemplateId === tmpl.id && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />}
                                            </div>
                                          </div>

                                          {/* Floating Hover Tooltip: Complete Model Title Preview */}
                                          <div className="absolute left-0 bottom-full mb-1.5 z-40 hidden group-hover:block pointer-events-none w-max max-w-xs p-2.5 rounded-xl bg-slate-950/95 border border-cyan-400 text-white text-[11px] font-semibold shadow-2xl backdrop-blur-md">
                                            <div className="text-[9px] uppercase tracking-wider text-amber-400 font-extrabold mb-0.5 flex items-center gap-1">
                                              <FileText className="w-3 h-3 text-amber-400" /> Título Completo do Modelo:
                                            </div>
                                            <div className="text-slate-100 leading-snug break-words font-medium">
                                              {tmpl.title}
                                            </div>
                                          </div>
                                        </div>
                                      ))}'''

new_item = new_item.replace('\r\n', '\n')

if old_item in content:
    content = content.replace(old_item, new_item)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESSFULLY REPLACED!")
else:
    print("STILL NOT MATCHED")
