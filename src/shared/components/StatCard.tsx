import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

export const StatCard = ({ label, value, icon, color = "bg-white" }: StatCardProps) => (
  <div className={`${color} p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300`}>
    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium mb-1">{label}</p>
      <h3 className="text-3xl font-black text-slate-800">{value}</h3>
    </div>
  </div>
);
