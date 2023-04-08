import connection from '@/lib/db'
import verifyAdmin from '@/lib/api/middleware/verifyAdmin'

// /api/admin/requestEvent/:eventId
async function handler(req, res) {
  // Request public event
  if (req.method === 'POST') {
    const { eventId } = req.query;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    // Create public event request with event ID, and the admin's superadmin ID
    try {
      const query = 'INSERT INTO public_event_request (event_id, superadmin_id) VALUES (?, (SELECT superadmin_id FROM university WHERE univ_id = (SELECT univ_id FROM user WHERE user_id = ?)));';
      const values = [eventId, req.adminId];

      await connection.execute(query, values);
      return res.status(200).json({ message: 'Event request submitted' });
    } catch (error) {
      return res.status(409).json({ message: 'Error: Event already requested', error: error?.response?.message || error?.message });
    }
  }
}

// Middleware checks if the user is the event's RSO's admin
export default verifyAdmin('eventAdmin', handler);