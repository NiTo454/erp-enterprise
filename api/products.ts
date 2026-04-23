import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  // Obtener productos
  if (req.method === 'GET') {
    try {
      const { rows } = await sql`SELECT * FROM products ORDER BY "createdAt" DESC`;
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching products' });
    }
  }

  // Crear producto
  if (req.method === 'POST') {
    const { sku, name, price, stock, category } = req.body;
    try {
      await sql`INSERT INTO products (sku, name, price, stock, category) VALUES (${sku}, ${name}, ${price}, ${stock}, ${category})`;
      return res.status(201).json({ message: 'Producto creado con éxito' });
    } catch (error) {
      return res.status(500).json({ error: 'Error creating product' });
    }
  }

  // Actualizar producto
  if (req.method === 'PUT') {
    const { id, sku, name, price, stock, category } = req.body;
    try {
      await sql`UPDATE products SET sku = ${sku}, name = ${name}, price = ${price}, stock = ${stock}, category = ${category} WHERE id = ${id}`;
      return res.status(200).json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
      return res.status(500).json({ error: 'Error updating product' });
    }
  }

  // Eliminar producto
  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await sql`DELETE FROM products WHERE id = ${id}`;
      return res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
      return res.status(500).json({ error: 'Error deleting product' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
