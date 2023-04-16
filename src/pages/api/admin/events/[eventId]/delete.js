import connection from '@/lib/db'
import verifyAdmin from '@/lib/api/middleware/verifyAdmin'

// /api/admin/events/:eventId/delete
async function handler(req, res) {
  // Delete event
  if (req.method === 'DELETE') {
    const { eventId } = req.query;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      await connection.execute('DELETE FROM event WHERE event_id = ?;', [eventId]);

      return res.status(200).json({ message: 'Event deleted' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting event', error: error?.response?.message || error?.message });
    }
  }
}

// Middleware checks if the user is the rso's admin
export default verifyAdmin('eventAdmin', handler);