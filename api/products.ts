import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  // Obtener productos
  if (req.method === 'GET') {
    try {
      const { rows } = await sql`SELECT * FROM products ORDER BY "createdAt" DESC`;
      return res.status(200).json(rows);
    } catch (error: any) {
      console.error('Error GET /api/products:', error);
      return res.status(500).json({ error: 'Error fetching products', details: error.message });
    }
  }

  // Crear producto
  if (req.method === 'POST') {
    const { sku, name, price, stock, category } = req.body;
    try {
      await sql`INSERT INTO products (sku, name, price, stock, category) VALUES (${sku}, ${name}, ${price}, ${stock}, ${category})`;
      return res.status(201).json({ message: 'Producto creado con éxito' });
    } catch (error: any) {
      console.error('Error POST /api/products:', error);
      return res.status(500).json({ error: 'Error creating product', details: error.message });
    }
  }

  // Actualizar producto
  if (req.method === 'PUT') {
    const { id, sku, name, price, stock, category } = req.body;
    try {
      await sql`UPDATE products SET sku = ${sku}, name = ${name}, price = ${price}, stock = ${stock}, category = ${category} WHERE id = ${id}`;
      return res.status(200).json({ message: 'Producto actualizado con éxito' });
    } catch (error: any) {
      console.error('Error PUT /api/products:', error);
      return res.status(500).json({ error: 'Error updating product', details: error.message });
    }
  }

  // Eliminar producto
  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await sql`DELETE FROM products WHERE id = ${id}`;
      return res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error: any) {
      console.error('Error DELETE /api/products:', error);
      return res.status(500).json({ error: 'Error deleting product', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
