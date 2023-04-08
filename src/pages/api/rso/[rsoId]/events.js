import connection from '@/lib/db'
import verifyRsoMember from '@/lib/api/middleware/verifyRsoMember'

// /api/rso/:rsoiId/events
async function handler(req, res) {
  // Get all events for an RSO
  if (req.method === 'GET') {
    const { rsoId } = req.query;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      const query = "SELECT * FROM event WHERE rso_id = ?;";
      const values = [rsoId];
      const [result] = await connection.execute(query, values);

      if (result.length === 0) {
        return res.status(404).json({ message: 'Events not found for this RSO' });
      }

      return res.status(200).json({ message: `All events for this RSO`, events: result });
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized', error: error?.response?.message || error?.message });
    }
  }
}

export default verifyRsoMember(handler);