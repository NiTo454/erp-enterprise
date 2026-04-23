export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product extends BaseEntity {
  sku: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface Sale extends BaseEntity {
  productId: string;
  productName: string;
  quantity: number;
  total: number;
  customerName?: string;
}
