import jwt from 'jsonwebtoken'
import connection from '@/lib/db'

// /api/rso/:rsoiId/join
export default async function handler(req, res) {
  // Join an RSO
  if (req.method === 'POST') {
    const { authorization } = req.headers;
    const { rsoId } = req.query;

    // If there is no auth token
    if (!authorization) {
      return res.status(401).json({ message: 'Unauthorized: auth token not provided' });
    }

    try {
      // Decode user ID and role
      const decodedToken = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
      const userId = decodedToken.user_id;
      const role = decodedToken.role

      // If user is a superadmin
      if (role === 'superadmin')
        return res.status(401).json({ message: 'Superadmins cannot join RSOs' });

      const query = "INSERT INTO rso_member (member_id, rso_id) VALUES (?, ?);";
      const values = [userId, rsoId];
      await connection.execute(query, values);

      return res.status(200).json({ message: `Joined RSO` });
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized', error: error?.response?.message || error?.message });
    }
  }
}