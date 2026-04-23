import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="h-[80vh] flex flex-col items-center justify-center text-center">
    <h1 className="text-6xl font-black text-indigo-200">404</h1>
    <p className="text-xl font-bold text-slate-800 mt-4">¿Te has perdido?</p>
    <p className="text-slate-500 mb-8">Esta área no existe en el sistema.</p>
    <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">
      Volver al Inicio
    </Link>
  </div>
);
