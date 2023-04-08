import jwt from 'jsonwebtoken'
import connection from '@/lib/db'

// /api/rso/:rsoiId/leave
export default async function handler(req, res) {
  // Leave an RSO
  if (req.method === 'DELETE') {
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

      // Check if user is an admin
      if (role === 'admin')
        return res.status(401).json({ message: 'You cannot leave your own RSO' });

      const query = "DELETE FROM rso_member WHERE member_id = ? AND rso_id = ?;";
      const values = [userId, rsoId];
      await connection.execute(query, values);

      return res.status(200).json({ message: `Left RSO` });
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized', error: error?.response?.message || error?.message });
    }
  }
}