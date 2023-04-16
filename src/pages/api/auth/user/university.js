import jwt from 'jsonwebtoken'
import connection from '@/lib/db'

// /api/auth/user/university
export default async function handler(req, res) {
  // Get user's university
  if (req.method === 'GET') {
    const { authorization } = req.headers;

    // If there is no auth token
    if (!authorization) {
      return res.status(401).json({ message: 'Unauthorized: auth token not provided' });
    }

    try {
      // Decode user ID from auth token
      const decodedToken = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
      const userId = decodedToken.user_id;

      // Return name, email, and university name
      const query = 'SELECT Univ.name AS univ_name, Univ.abbreviation FROM user U INNER JOIN university Univ ON U.univ_id = Univ.univ_id WHERE U.user_id = ?;';
      const values = [userId]
      const [result] = await connection.execute(query, values);

      return res.status(200).json({ university: result[0] });
    } catch (error) {
      return res.status(401).json({ message: 'Error getting user\'s university', error: error?.response?.message || error?.message });
    }
  }
}