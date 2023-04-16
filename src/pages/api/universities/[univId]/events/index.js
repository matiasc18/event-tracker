import verifyStudent from '@/lib/api/middleware/verifyStudent';
import connection from '@/lib/db'

// /api/universities/:univId/events
async function handler(req, res) {
  // Get all events for a university
  if (req.method === 'GET') {
    const { univId } = req.query;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      // const query = "SELECT event.* FROM event INNER JOIN rso ON event.rso_id = rso.rso_id INNER JOIN user ON rso.admin_id = user.user_id INNER JOIN university ON user.univ_id = university.univ_id WHERE university.univ_id = ?;";
      const query = "SELECT * FROM event WHERE univ_id = ?;";
      const values = [univId];
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

// Middleware determines if student attends this university
export default verifyStudent(handler);