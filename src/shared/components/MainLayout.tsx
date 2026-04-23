import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart3 } from 'lucide-react';
import React from 'react';

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-10">
        <div className="p-8">
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/30">
              <Package size={24} className="text-white" />
            </div>
            Nexus ERP
          </h1>
        </div>
        <nav className="space-y-1 px-4 flex-1 mt-4">
          <NavLink to="/" className={({isActive}) => `flex items-center gap-3 p-3.5 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/inventory" className={({isActive}) => `flex items-center gap-3 p-3.5 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'hover:bg-slate-800 hover:text-white'}`}>
            <Package size={20} /> Inventario
          </NavLink>
          <NavLink to="/sales" className={({isActive}) => `flex items-center gap-3 p-3.5 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'hover:bg-slate-800 hover:text-white'}`}>
            <ShoppingCart size={20} /> Ventas
          </NavLink>
          <NavLink to="/finance" className={({isActive}) => `flex items-center gap-3 p-3.5 rounded-xl font-medium transition-all duration-200 ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'hover:bg-slate-800 hover:text-white'}`}>
            <BarChart3 size={20} /> Finanzas
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-10 lg:p-14">
        <Outlet />
      </main>
    </div>
  );
};
