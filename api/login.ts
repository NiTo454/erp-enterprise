import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    try {
      // Buscamos si existe un usuario con esas credenciales exactas
      const { rows } = await sql`SELECT username, role FROM users WHERE username = ${username} AND password = ${password} LIMIT 1`;

      if (rows.length > 0) {
        return res.status(200).json(rows[0]); // Usuario encontrado
      } else {
        return res.status(401).json({ error: 'Credenciales inválidas' }); // No encontrado
      }
    } catch (error: any) {
      console.error('Error POST /api/login:', error);
      return res.status(500).json({ error: 'Error interno', details: error.message });
    }
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}
