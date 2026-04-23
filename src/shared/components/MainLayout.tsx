import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Menu, X } from 'lucide-react';
import React, { useState } from 'react';

export const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const NavItem = ({ to, icon, children }: { to: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <NavLink
      to={to}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 p-3.5 rounded-xl font-medium transition-all duration-200 ${
          isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'hover:bg-slate-800 hover:text-white'
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  );

  return (
    <div className="relative min-h-screen md:flex bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-slate-900 text-slate-300 w-72 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:flex md:flex-col shadow-2xl z-30`}>
        <div className="p-6 md:p-8 flex items-center justify-between">
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/30">
              <Package size={24} className="text-white" />
            </div>
            Nexus ERP
          </h1>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="space-y-1 px-4 flex-1 mt-4">
          <NavItem to="/" icon={<LayoutDashboard size={20} />}>Dashboard</NavItem>
          <NavItem to="/inventory" icon={<Package size={20} />}>Inventario</NavItem>
          <NavItem to="/sales" icon={<ShoppingCart size={20} />}>Ventas</NavItem>
          <NavItem to="/finance" icon={<BarChart3 size={20} />}>Finanzas</NavItem>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="p-4 md:hidden flex items-center bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-100">
          <button className="text-slate-600" onClick={() => setSidebarOpen(true)}>
            <Menu size={28} />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
