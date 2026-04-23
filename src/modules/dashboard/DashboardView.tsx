import { useERPStore } from '../../store/useERPStore';
import { StatCard } from '../../shared/components/StatCard';
import { Package, DollarSign, TrendingUp } from 'lucide-react';
import { useFormat } from '../../hooks/useFormat';
import React from 'react';

export const DashboardView = () => {
  const { products, sales } = useERPStore();
  const { currency } = useFormat();

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-3xl text-white shadow-lg shadow-indigo-200 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black mb-2">Panel General</h2>
          <p className="text-indigo-100 opacity-90 text-lg">Bienvenido de nuevo. Aquí tienes el estado de tu empresa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Ventas Totales" value={currency(totalRevenue)} icon={<DollarSign />} />
        <StatCard label="Productos en Stock" value={totalStock} icon={<Package />} />
        <StatCard label="Transacciones" value={sales.length} icon={<TrendingUp />} />
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-xl mb-6 text-slate-800">Actividad Reciente</h3>
        <div className="space-y-5">
          {sales.slice(0, 3).map(sale => (
            <div key={sale.id} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
              <span className="text-base font-medium text-slate-700">{sale.productName}</span>
              <span className="text-base bg-green-50 text-green-700 px-3 py-1 rounded-lg font-bold">+ {currency(sale.total)}</span>
            </div>
          ))}
          {sales.length === 0 && <p className="text-slate-400 text-sm italic text-center py-6 bg-slate-50 rounded-xl">Esperando primeras ventas...</p>}
        </div>
      </div>
    </div>
  );
};
