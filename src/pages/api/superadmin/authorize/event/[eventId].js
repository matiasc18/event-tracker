import connection from '@/lib/db'
import verifySuperadmin from '@/lib/api/middleware/verifySuperadmin'

// /api/superadmin/authorize/event/:eventId
async function handler(req, res) {
  // Authorize public event request
  if (req.method === 'PUT') {
    const { eventId } = req.query;
    const { newStatus } = req.body;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      const query = 'UPDATE public_event_request SET status = ? WHERE event_id = ? AND superadmin_id = ?;'
      const values = [newStatus, eventId, req.superadminId];
      await connection.execute(query, values);

      return res.status(200).json({ message: `${newStatus ? 'Approved public event request' : 'Denied public event request'}` });
    } catch (error) {
      return res.status(400).json({ message: 'Error authorizing event request', error: error?.response?.message || error?.message });
    }
  }
}

// Middleware checks if the user is the event's superadmin
export default verifySuperadmin('requestSuperadmin', handler);