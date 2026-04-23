import React from 'react';
import { useToastStore } from '../../store/useToastStore';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className={`flex items-center gap-3 min-w-[300px] p-4 rounded-xl shadow-2xl animate-fade-in-up text-white pointer-events-auto ${
          toast.type === 'success' ? 'bg-emerald-600' :
          toast.type === 'error' ? 'bg-rose-600' : 'bg-blue-600'
        }`}>
          {toast.type === 'success' && <CheckCircle size={20} />}
          {toast.type === 'error' && <XCircle size={20} />}
          {toast.type === 'info' && <Info size={20} />}
          <span className="flex-1 font-medium text-sm">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="opacity-70 hover:opacity-100 transition-opacity">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
