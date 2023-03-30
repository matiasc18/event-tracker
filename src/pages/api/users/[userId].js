import jwt from 'jsonwebtoken'
import createConnection from '@/lib/db'

export default async function handler(req, res) {
  // Get user's information
  if (req.method === 'GET') {
    // Get auth token from request header
    const { authorization } = req.headers;

    // If there is no auth token
    if (!authorization) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Decode user ID from auth token
      const decodedToken = jwt.verify(authorization, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      // Create connection and execute query
      const connection = await createConnection();
      const [rows, fields] = await connection.execute(`SELECT * FROM user WHERE user.user_id = ${userId}`);

      return res.status(200).json({ rows: rows, fields: fields });
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized', error: error });
    }
  }
}