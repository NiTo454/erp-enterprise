import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { Package, Lock, User } from 'lucide-react';
import { ToastContainer } from '../../shared/components/ToastContainer';

export const LoginView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore(state => state.login);
  const addToast = useToastStore(state => state.addToast);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (!success) {
      setError('Usuario o contraseña incorrectos');
      addToast('Error al iniciar sesión', 'error');
    } else {
      addToast('¡Bienvenido al sistema!', 'success');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/30 mb-4">
            <Package size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Nexus ERP</h1>
          <p className="text-slate-500 mt-2 text-center">Ingresa tus credenciales para acceder</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium mb-6 text-center animate-fade-in-up">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-slate-400" />
              </div>
              <input
                type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                placeholder="ej. admin"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-500/30 mt-2">
            Entrar al Sistema
          </button>
        </form>

        <div className="mt-8 text-xs text-center text-slate-400">
          <p>Credenciales de prueba:</p>
          <p className="mt-1">Admin: <span className="font-bold text-slate-600">admin / admin123</span></p>
          <p>Vendedor: <span className="font-bold text-slate-600">vendedor / ventas123</span></p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
