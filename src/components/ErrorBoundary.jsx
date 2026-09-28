import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center text-xl font-bold shrink-0">
                !
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Ops! Algo deu errado</h2>
                <p className="text-xs text-slate-400">Diagnóstico de erro em tempo de execução</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-red-500/30 rounded-2xl space-y-2 overflow-auto max-h-80">
              <p className="text-xs font-mono text-red-400 font-bold select-all">
                {this.state.error?.toString()}
              </p>
              {this.state.errorInfo?.componentStack && (
                <pre className="text-[10px] font-mono text-slate-400 whitespace-pre-wrap select-all border-t border-slate-800 pt-2 mt-2">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">Neuro Clínica Dr. Eduardo Magalhães</span>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20 text-sm"
              >
                Recarregar Página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
