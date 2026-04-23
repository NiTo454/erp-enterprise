import React, { useState } from 'react';
import { useERPStore } from '../../store/useERPStore';
import { useToastStore } from '../../store/useToastStore';
import { ShoppingCart, X } from 'lucide-react';
import { useFormat } from '../../hooks/useFormat';
import { generateReceipt } from '../dashboard/pdfGenerator';

export const SalesView = () => {
  const { products, processSale, isLoading } = useERPStore();
  const { addToast } = useToastStore();
  const { currency } = useFormat();

  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');

  const handleOpenModal = (product: any) => {
    setSelectedProduct(product);
    setQuantity(1);
    setCustomerName('');
  };

  const handleConfirmSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      await processSale(selectedProduct.id, quantity, customerName);
      addToast('Venta registrada exitosamente', 'success');

      // Generar y descargar el ticket en PDF automáticamente
      const saleTicket = {
        id: Date.now().toString(36).toUpperCase(), // Generamos un ID de recibo temporal
        productName: selectedProduct.name,
        quantity: quantity,
        total: selectedProduct.price * quantity,
        customerName: customerName,
        createdAt: new Date().toISOString()
      };
      generateReceipt(saleTicket);

      setSelectedProduct(null);
    } catch (error) {
      addToast('Error al registrar la venta', 'error');
    }
  };

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
              onClick={() => handleOpenModal(p)}
              disabled={p.stock <= 0 || isLoading}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-600 disabled:bg-slate-100 disabled:text-slate-400 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:scale-100"
            >
              <ShoppingCart size={18} /> {isLoading ? 'Procesando...' : 'Vender'}
            </button>
          </div>
        ))}
      </div>

      {/* Modal de Venta */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in-up">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-2 text-slate-800">Confirmar Venta</h3>
            <p className="text-slate-500 mb-6 font-medium">{selectedProduct.name}</p>

            <form onSubmit={handleConfirmSale} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Cliente (Opcional)</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Cantidad a vender</label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
                <p className="text-xs text-slate-400 mt-2">Máximo disponible: {selectedProduct.stock}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Total a cobrar:</span>
                <span className="text-2xl font-black text-indigo-600">{currency(selectedProduct.price * quantity)}</span>
              </div>

              <button
                type="submit"
                disabled={isLoading || quantity < 1 || quantity > selectedProduct.stock}
                className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl mt-6 hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                {isLoading ? 'Procesando...' : 'Confirmar Venta'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
