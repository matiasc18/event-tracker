import connection from '@/lib/db'

// /api/universities/getAll
export default async function handler(req, res) {
  // Getfor all university names and ID's
  if (req.method === 'GET') {
    try {
      const [result] = await connection.execute('SELECT univ_id, name FROM university;');

      return res.status(200).json({ universities: result });
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized', error: error?.response?.message || error?.message });
    }
  }
}