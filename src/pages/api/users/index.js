import connection from '@/lib/db'

// /api/users
export default async function handler(req, res) {
  // Get all users
  if (req.method === 'GET') {
    try {
      const [result] = await connection.execute('SELECT * FROM user');

      return res.status(200).json({ users: result });
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  }
}