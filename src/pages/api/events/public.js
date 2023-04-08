import connection from '@/lib/db'

// /api/events/public
export default async function handler(req, res) {
  // Get all public events
  if (req.method === 'GET') {
    try {
      const [result] = await connection.execute('SELECT * FROM event E WHERE E.type = "public";');

      return res.status(200).json({ events: result });
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized', error: error?.response?.message || error?.message });
    }
  }
}