import verifyRsoMember from '@/lib/api/middleware/verifyRsoMember'
import connection from '@/lib/db'

// /api/rsp/:rsoId/events/:eventId
async function handler(req, res) {
  // Get RSO event details
  if (req.method === 'GET') {
    const { rsoId, eventId } = req.query;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      const query = 'SELECT E.*, R.name AS rso_name, L.name AS location_name, U.abbreviation, U.name AS univ_name FROM event E INNER JOIN rso R ON R.rso_id = E.rso_id INNER JOIN location L ON L.location_id = E.location_id INNER JOIN university U ON U.univ_id = E.univ_id WHERE E.type = "rso" AND E.rso_id = ? AND E.event_id = ?;';
      const values = [rsoId, eventId];
      const [result] = await connection.execute(query, values);

      // There is no event with specified RSO and event ID
      if (result.length === 0) {
        return res.status(404).json({ message: 'RSO event not found' });
      }

      return res.status(200).json({ event: result[0] });
    } catch (error) {
      return res.status(401).json({ message: 'Error getting event details', error: error?.response?.message || error?.message });
    }
  }
}

// Middleware verifies if user is a member in the RSO
export default verifyRsoMember(handler);