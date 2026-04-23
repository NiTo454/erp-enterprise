import React from 'react';
import { useERPStore } from '../../store/useERPStore';
import { ShoppingCart } from 'lucide-react';
import { useFormat } from '../../hooks/useFormat';

export const SalesView = () => {
  const { products, processSale, isLoading } = useERPStore();
  const { currency } = useFormat();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Punto de Venta</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p className="text-indigo-600 font-black text-2xl my-2">{currency(p.price)}</p>
            <p className={`text-sm mb-4 font-medium ${p.stock < 5 ? 'text-red-500' : 'text-slate-500'}`}>Disponibles: {p.stock}</p>
            <button
              onClick={() => processSale(p.id, 1)}
              disabled={p.stock <= 0 || isLoading}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:scale-100"
            >
              <ShoppingCart size={18} /> {isLoading ? 'Procesando...' : 'Vender'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
