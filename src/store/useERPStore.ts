import { create } from 'zustand';
import { Product, Sale } from '../core/types/erp.types';

interface ERPState {
  products: Product[];
  sales: Sale[];
  isLoading: boolean;
  sessionStartDate: string;
  initData: () => Promise<void>;
  processSale: (productId: string, quantity: number, customerName?: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  startNewDay: () => Promise<void>;
}

export const useERPStore = create<ERPState>()((set, get) => ({
  products: [],
  sales: [],
  isLoading: false,
  sessionStartDate: new Date(new Date().setHours(0,0,0,0)).toISOString(), // Valor por defecto temporal

  initData: async () => {
    set({ isLoading: true });
    try {
      const reqOpts: RequestInit = { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } };
      const [productsRes, salesRes, settingsRes] = await Promise.all([
        fetch('/api/products', reqOpts),
        fetch('/api/sales', reqOpts),
        fetch('/api/settings', reqOpts)
      ]);
      const products = await productsRes.json();
      const sales = await salesRes.json();
      const settings = await settingsRes.json();

      set({ products, sales, sessionStartDate: settings.sessionStartDate, isLoading: false });
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      set({ isLoading: false });
    }
  },

  processSale: async (productId, quantity, customerName = 'Público General') => {
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
          total: product.price * quantity,
          customerName
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

  startNewDay: async () => {
    // Sumamos 1 segundo para garantizar que supere la hora exacta de cualquier venta anterior
    const now = new Date();
    now.setSeconds(now.getSeconds() + 1);
    const sessionStart = now.toISOString();

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionStartDate: sessionStart })
      });
      if (!res.ok) throw new Error('Error al guardar en base de datos');
      set({ sessionStartDate: sessionStart });
    } catch (error) {
      console.error("Error al iniciar nuevo día:", error);
      throw error; // Lanzamos el error para que la interfaz muestre el Toast rojo
    }
  }
}));
