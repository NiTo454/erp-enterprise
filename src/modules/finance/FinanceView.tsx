import { useERPStore } from '../../store/useERPStore';
import { useFormat } from '../../hooks/useFormat';
import React from 'react';

export const FinanceView = () => {
  const { sales } = useERPStore();
  const { currency, formatDate } = useFormat();
  const totalRevenue = sales.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 rounded-3xl text-white shadow-lg shadow-emerald-200">
        <p className="text-emerald-50 font-medium mb-1">Ingresos Totales</p>
        <h2 className="text-4xl font-black">{currency(totalRevenue)}</h2>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-xl mb-6 text-slate-800">Historial de Transacciones</h3>
        {sales.length === 0 ? (
          <p className="text-gray-400 italic">No hay ventas registradas hoy.</p>
        ) : (
          <div className="space-y-4">
            {sales.map(s => (
              <div key={s.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                <div>
                  <p className="font-bold text-slate-800">{s.productName}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(s.createdAt)}</p>
                </div>
                <p className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">+ {currency(s.total)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
