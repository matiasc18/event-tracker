import connection from '@/lib/db'
import jwt from 'jsonwebtoken'

// /api/events/public
export default async function handler(req, res) {
  // Get all events that user is allowed to see
  if (req.method === 'GET') {
    try {
      // Get and verify auth token
      const { authorization } = req.headers;

      let decodedToken;
      try {
        decodedToken = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ message: 'Auth token error', error: error?.response?.message || error?.message });
      }
      const userId = decodedToken.user_id;

      const publicQuery = 'SELECT E.*, R.name AS rso_name, L.name AS location_name, U.abbreviation FROM event E INNER JOIN rso R ON R.rso_id = E.rso_id INNER JOIN location L ON L.location_id = E.location_id INNER JOIN university U ON U.univ_id = E.univ_id WHERE E.type = "public"';
      const privateQuery = 'SELECT E1.*, R1.name AS rso_name, L1.name AS location_name, U1.abbreviation FROM event E1 INNER JOIN rso R1 ON R1.rso_id = E1.rso_id INNER JOIN location L1 ON L1.location_id = E1.location_id INNER JOIN university U1 ON U1.univ_id = E1.univ_id WHERE E1.type = "private" AND E1.univ_id = (SELECT univ_id FROM user WHERE user_id = ?)';
      const rsoQuery = 'SELECT E2.*, R2.name AS rso_name, L2.name AS location_name, U2.abbreviation FROM event E2 INNER JOIN rso R2 ON R2.rso_id = E2.rso_id INNER JOIN rso_member M ON M.rso_id = E2.rso_id INNER JOIN location L2 ON L2.location_id = E2.location_id INNER JOIN university U2 ON U2.univ_id = E2.univ_id WHERE M.member_id = ? AND E2.type = "rso"';

      const finalQuery = `${publicQuery} UNION ${privateQuery} UNION ${rsoQuery};`;
      const values = [userId, userId];
      const [result] = await connection.execute(finalQuery, values);

      return res.status(200).json({ events: result });
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized', error: error?.response?.message || error?.message });
    }
  }
}