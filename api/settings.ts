import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  // Desactivar caché en Vercel
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  // Obtener la configuración (fecha de inicio del día)
  if (req.method === 'GET') {
    try {
      const { rows } = await sql`SELECT value FROM settings WHERE key = 'sessionStartDate'`;
      const date = rows.length > 0 ? rows[0].value : new Date(new Date().setHours(0,0,0,0)).toISOString();
      return res.status(200).json({ sessionStartDate: date });
    } catch (error: any) {
      console.error('Error GET /api/settings:', error);
      return res.status(500).json({ error: 'Error fetching settings', details: error.message });
    }
  }

  // Actualizar la configuración (guardar el nuevo corte de caja)
  if (req.method === 'POST') {
    const { sessionStartDate } = req.body;
    try {
      await sql`INSERT INTO settings (key, value) VALUES ('sessionStartDate', ${sessionStartDate}) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
      return res.status(200).json({ message: 'Configuración actualizada' });
    } catch (error: any) {
      console.error('Error POST /api/settings:', error);
      return res.status(500).json({ error: 'Error updating settings', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
