import jwt from 'jsonwebtoken'
import connection from '@/lib/db'

// /api/rso/create
export default async function handler(req, res) {
  // Create RSO (inactive until 5 members join and superadmin approves)
  if (req.method === 'POST') {
    const { authorization } = req.headers;
    const { name } = req.body;

    // If there is no auth token
    if (!authorization) {
      return res.status(401).json({ message: 'Unauthorized: auth token not provided' });
    }

    try {
      // Decode user ID and role
      const decodedToken = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
      const userId = decodedToken.user_id;
      const role = decodedToken.role

      // TODO allow superadmin to make an already-active RSO
      // If user is a superadmin
      if (role === 'superadmin') {
        return res.status(401).json({ message: 'Superadmins cannot create RSOs' });
      }

      const query = "INSERT INTO rso (admin_id, name) VALUES (?, ?);";
      const values = [userId, name];
      await connection.execute(query, values);

      return res.status(200).json({ message: 'RSO created', rso: name });
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized', error: error?.response?.message || error?.message });
    }
  }
}