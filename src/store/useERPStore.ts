import { create } from 'zustand';
import { Product, Sale } from '../core/types/erp.types';

interface ERPState {
  products: Product[];
  sales: Sale[];
  isLoading: boolean;
  initData: () => Promise<void>;
  processSale: (productId: string, quantity: number) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
}

export const useERPStore = create<ERPState>()((set, get) => ({
  products: [],
  sales: [],
  isLoading: false,

  initData: async () => {
    set({ isLoading: true });
    try {
      const [productsRes, salesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/sales')
      ]);
      const products = await productsRes.json();
      const sales = await salesRes.json();
      set({ products, sales, isLoading: false });
    } catch (error) {
      console.error("Error al cargar los datos desde Postgres:", error);
      set({ isLoading: false });
    }
  },

  processSale: async (productId, quantity) => {
    const product = get().products.find(p => p.id === productId);
    if (!product || product.stock < quantity) return;

    set({ isLoading: true });

    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          quantity,
          total: product.price * quantity
        })
      });
      if (!res.ok) throw new Error('Error al procesar la venta');
      // Recargamos los datos para tener el stock y las ventas actualizadas
      get().initData();
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      set({ isLoading: false });
    }
  },

  addProduct: async (newProduct) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (!res.ok) throw new Error('Error al guardar el producto');
      await get().initData();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar el producto');
      await get().initData();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      set({ isLoading: false });
    }
  },

  updateProduct: async (product) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (!res.ok) throw new Error('Error al actualizar el producto');
      await get().initData();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      set({ isLoading: false });
    }
  },
}));
