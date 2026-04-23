import React, { useEffect, useState } from 'react';
import { useERPStore } from '../../store/useERPStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { useFormat } from '../../hooks/useFormat';
import { Plus, X, Trash2, AlertTriangle, Edit2, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const InventoryView = () => {
  const { products, initData, addProduct, updateProduct, deleteProduct, isLoading } = useERPStore();
  const { currency } = useFormat();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { register, handleSubmit, reset } = useForm();

  const user = useAuthStore(state => state.user);
  const addToast = useToastStore(state => state.addToast);
  const isAdmin = user?.role === 'admin';

  useEffect(() => { if(products.length === 0) initData(); }, []);

  const handleCloseModal = () => {
    setEditingProduct(null);
    reset({ name: '', sku: '', category: '', price: '', stock: '' });
    setIsModalOpen(false);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    reset(product);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock)
    };
    try {
      if (editingProduct) {
        await updateProduct({ ...editingProduct, ...payload });
        addToast('Producto actualizado exitosamente', 'success');
      } else {
        await addProduct(payload);
        addToast('Producto guardado exitosamente', 'success');
      }
      handleCloseModal();
    } catch (error) {
      addToast('Error al guardar el producto', 'error');
    }
  };

  // Filtramos los productos según lo que el usuario escriba (por nombre o SKU)
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Control de Stock</h2>

        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:min-w-[280px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar producto o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm shadow-sm"
            />
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 whitespace-nowrap shadow-sm"
            >
              <Plus size={20} /> <span className="hidden sm:inline">Nuevo Producto</span><span className="sm:hidden">Nuevo</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-slate-50 border-b border-gray-100">
            <tr>
              <th className="p-5 text-sm font-bold text-slate-700">Producto</th>
              <th className="p-5 text-sm font-bold text-slate-700">SKU</th>
              <th className="p-5 text-sm font-bold text-slate-700">Precio</th>
              <th className="p-5 text-sm font-bold text-slate-700">Stock</th>
              <th className="p-5 text-sm font-bold text-slate-700 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id} className="border-b last:border-0 border-gray-50 hover:bg-slate-50 transition-colors">
                <td className="p-5 font-medium text-slate-800">{p.name}</td>
                <td className="p-5 text-slate-500 text-sm">{p.sku}</td>
                <td className="p-5 font-mono font-medium text-slate-700">{currency(p.price)}</td>
                <td className="p-5">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${p.stock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {p.stock} uds
                  </span>
                </td>
                <td className="p-5 text-right flex items-center justify-end gap-2">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => handleEdit(p)}
                        disabled={isLoading}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Editar producto"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setProductToDelete(p.id)}
                        disabled={isLoading}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Eliminar producto"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium px-2 bg-slate-100 rounded-lg py-1">Solo lectura</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                  No se encontraron productos que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Agregar Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in-up">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-slate-800">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto</label>
                <input {...register("name", { required: true })} className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="Ej. Teclado Mecánico" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                  <input {...register("sku", { required: true })} className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="TEC-001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                  <input {...register("category", { required: true })} className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="Periféricos" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio ($)</label>
                  <input type="number" step="0.01" {...register("price", { required: true, min: 0 })} className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock Inicial</label>
                  <input type="number" {...register("stock", { required: true, min: 0 })} className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="10" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl mt-4 hover:bg-indigo-600 transition-colors disabled:bg-slate-300"
              >
                {isLoading ? 'Guardando...' : 'Guardar Producto'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Eliminar */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in-up">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl relative text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-slate-800">¿Eliminar producto?</h3>
            <p className="text-slate-500 mb-8 text-sm">Esta acción no se puede deshacer. El producto será eliminado de forma permanente.</p>

            <div className="flex gap-4">
              <button
                onClick={() => setProductToDelete(null)}
                disabled={isLoading}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteProduct(productToDelete);
                    addToast('Producto eliminado correctamente', 'success');
                  } catch (error) {
                    addToast('Error al intentar eliminar el producto', 'error');
                  } finally {
                    setProductToDelete(null);
                  }
                }}
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors disabled:bg-red-400"
              >
                {isLoading ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
