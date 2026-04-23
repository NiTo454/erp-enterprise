import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  // Desactivar caché en Vercel
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  // Obtener ventas
  if (req.method === 'GET') {
    try {
      const { rows } = await sql`SELECT * FROM sales ORDER BY "createdAt" DESC`;
      return res.status(200).json(rows);
    } catch (error: any) {
      console.error('Error GET /api/sales:', error);
      return res.status(500).json({ error: 'Error fetching sales', details: error.message });
    }
  }

  // Realizar una venta
  if (req.method === 'POST') {
    const { productId, productName, quantity, total, customerName } = req.body;
    try {
      await sql`UPDATE products SET stock = stock - ${quantity} WHERE id = ${productId}`;
      await sql`INSERT INTO sales ("productId", "productName", quantity, total, "customerName") VALUES (${productId}, ${productName}, ${quantity}, ${total}, ${customerName || 'Público General'})`;
      return res.status(201).json({ message: 'Venta registrada con éxito' });
    } catch (error: any) {
      console.error('Error POST /api/sales:', error);
      return res.status(500).json({ error: 'Error processing sale', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
