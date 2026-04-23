import { useERPStore } from '../../store/useERPStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { StatCard } from '../../shared/components/StatCard';
import { Package, DollarSign, TrendingUp, FileText, Sun } from 'lucide-react';
import { useFormat } from '../../hooks/useFormat';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import React from 'react';
import { generateReceipt } from './pdfGenerator';

export const DashboardView = () => {
  const { products, sales, sessionStartDate, startNewDay } = useERPStore();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const { currency } = useFormat();

  const isAdmin = user?.role === 'admin';

  // Filtramos las ventas para que solo aparezcan las del "Día Actual"
  const currentSales = sales.filter(s => new Date(s.createdAt).getTime() >= new Date(sessionStartDate).getTime());

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalRevenue = currentSales.reduce((acc, s) => acc + s.total, 0);

  // Preparar datos para el gráfico (Ventas agrupadas por producto - Top 5)
  const chartData = currentSales.reduce((acc: any[], sale) => {
    const existing = acc.find(item => item.name === sale.productName);
    if (existing) existing.total += sale.total;
    else acc.push({ name: sale.productName, total: sale.total });
    return acc;
  }, []).sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-3xl text-white shadow-lg shadow-indigo-200 flex items-center justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-black mb-2">Panel General</h2>
          <p className="text-indigo-100 opacity-90 text-base md:text-lg">Bienvenido de nuevo. Aquí tienes el estado de tu empresa.</p>
        </div>
        {isAdmin && (
          <button
            onClick={async () => {
              const confirmed = window.confirm('¿Estás seguro de hacer el corte de caja? Esto pondrá las ventas de hoy en ceros.');
              if (!confirmed) return;
              try {
                await startNewDay();
                addToast('¡Nuevo día iniciado! Contadores en cero.', 'success');
              } catch (error) {
                addToast('Error al conectar con la base de datos.', 'error');
              }
            }}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 backdrop-blur-sm"
          >
            <Sun size={20} /> <span className="hidden sm:inline">Comenzar Día</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Ventas Totales" value={currency(totalRevenue)} icon={<DollarSign />} />
        <StatCard label="Productos en Stock" value={totalStock} icon={<Package />} />
        <StatCard label="Transacciones" value={currentSales.length} icon={<TrendingUp />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Ventas */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-xl mb-6 text-slate-800">Top Productos (Ingresos)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `$${val}`} width={60} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} formatter={(value: any) => [currency(value), 'Ingresos']} />
                <Bar dataKey="total" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-xl mb-6 text-slate-800">Actividad Reciente</h3>
          <div className="space-y-5 flex-1 overflow-y-auto">
            {currentSales.slice(0, 5).map(sale => (
              <div key={sale.id} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="text-base font-medium text-slate-700 truncate pr-4">{sale.productName}</span>
                  <span className="text-xs text-slate-400">{sale.customerName || 'Público General'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base bg-green-50 text-green-700 px-3 py-1 rounded-lg font-bold whitespace-nowrap">+ {currency(sale.total)}</span>
                  <button onClick={() => generateReceipt(sale)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Descargar Recibo">
                    <FileText size={18} />
                  </button>
                </div>
              </div>
            ))}
            {currentSales.length === 0 && <p className="text-slate-400 text-sm italic text-center py-6 bg-slate-50 rounded-xl">Caja en ceros. Esperando ventas...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
