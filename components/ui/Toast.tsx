
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Toast } from '../../types';
import { useData } from '../../context/DataContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useData();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (toast.duration !== Infinity) {
        const timer = setTimeout(() => {
            onDismiss(toast.id);
        }, toast.duration || 4000);
        return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle size={20} className="text-emerald-500" />,
    warning: <AlertTriangle size={20} className="text-amber-500" />,
    error: <AlertCircle size={20} className="text-rose-500" />,
    info: <Info size={20} className="text-blue-500" />
  };

  const styles = {
      success: 'border-emerald-500/20 bg-emerald-500/5',
      warning: 'border-amber-500/20 bg-amber-500/5',
      error: 'border-rose-500/20 bg-rose-500/5',
      info: 'border-blue-500/20 bg-blue-500/5'
  };

  return (
    <div className={`pointer-events-auto backdrop-blur-xl border ${styles[toast.type]} rounded-xl shadow-2xl p-4 flex gap-3 min-w-[320px] max-w-[400px] animate-in slide-in-from-right-10 fade-in duration-300 ring-1 ring-white/5`}>
      <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-textMain">{toast.title}</h4>
        {toast.message && <p className="text-xs text-textMuted mt-1 leading-relaxed">{toast.message}</p>}
      </div>
      <button 
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 text-textMuted hover:text-white transition-colors self-start"
      >
        <X size={16} />
      </button>
    </div>
  );
};
