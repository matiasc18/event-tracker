import createConnection from '@/lib/db'

export default async function handler(req, res) {
  // Get all users
  if (req.method === 'GET') {
    try {
      // Create connection and execute query
      const connection = await createConnection();
      const [rows, fields] = await connection.execute('SELECT * FROM user');

      return res.status(200).json({ rows: rows, fields: fields });
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  }
}