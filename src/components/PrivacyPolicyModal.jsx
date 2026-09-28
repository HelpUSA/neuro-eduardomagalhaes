import React from 'react';
import { ShieldCheck, X, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyModal = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-cyan-500/30 my-4 max-h-[90vh] flex flex-col overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>Política de Privacidade & Proteção de Dados (LGPD)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Clínica de Neurologia Dr. Eduardo Magalhães & Plataforma HelpUS Technology
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-2 py-5 space-y-6 text-xs leading-relaxed text-slate-300">
          
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>1. Compromisso com a Segurança e Transparência</span>
            </h3>
            <p>
              A <strong>Clínica de Neurologia Dr. Eduardo Magalhães</strong> e a <strong>HelpUS Technology</strong> estão comprometidas com a proteção dos dados pessoais e sensíveis dos nossos pacientes e usuários. Nossa política segue rigorosamente a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018) e as normas éticas do Conselho Federal de Medicina (CFM).
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>2. Dados Coletados e Finalidade</span>
            </h3>
            <ul className="space-y-2 list-disc list-inside text-slate-300">
              <li><strong>Dados de Identificação do Paciente:</strong> CPF, Nome Completo, Data de Nascimento e Telefone de Contato (utilizados para autenticação segura no Portal do Paciente e envio de laudos).</li>
              <li><strong>Dados de Saúde e Exames:</strong> Registros de Eletroneuromiografia (ENMG), Eletroencefalograma (EEG), laudos e traçados médicos para emissão de diagnósticos oficiais.</li>
              <li><strong>Dados de Acesso Técnico:</strong> Endereço IP, registros de login, horário e preferências de sessão armazenados localmente para garantir a integridade do sistema.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>3. Criptografia & Proteção de Laudos Digitais</span>
            </h3>
            <p>
              Todos os laudos emitidos pela clínica são protegidos por criptografia de ponta a ponta (SSL/TLS) e assinados digitalmente com certificado ICP-Brasil (PAdES), garantindo autenticidade jurídica, imutabilidade e rastreabilidade por QR Code.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>4. Política de Cookies e Armazenamento Local</span>
            </h3>
            <p>
              Utilizamos cookies estritamente necessários e armazenamento seguro no navegador (`localStorage`) para salvar a sessão autenticada do médico/secretária, preferências de idioma (Português, Inglês, Espanhol) e o estado do aviso de privacidade. Nenhum cookie de rastreamento de terceiros é comercializado.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>5. Direitos do Titular dos Dados (LGPD)</span>
            </h3>
            <p>
              O paciente ou responsável legal pode solicitar a qualquer momento a confirmação de tratamento, acesso, correção ou esclarecimentos sobre o armazenamento de seus dados de exames através dos canais de atendimento da clínica ou pelo suporte HelpUS.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
            📍 <strong>Dúvidas ou Requisições de Privacidade:</strong> Entre em contato com a nossa recepção pelo telefone (69) 3223-5805 ou acesse a nossa sede na Av. Dom Pedro II, 637 - Sala 07, Centro, Porto Velho - RO.
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs transition shadow-md"
          >
            Compreendi & Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
