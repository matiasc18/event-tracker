import connection from '@/lib/db'
import verifyAdmin from '@/lib/api/middleware/verifyAdmin'

// /api/admin/cancelRequest/:eventId
async function handler(req, res) {
  // Remove public event request
  if (req.method === 'DELETE') {
    const { eventId } = req.query;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      // Delete request for the given event ID, where the superadmin in charge belongs to the admin's university
      const query = 'DELETE FROM public_event_request WHERE event_id = ? AND superadmin_id = (SELECT superadmin_id FROM university WHERE univ_id = (SELECT univ_id FROM user WHERE user_id = ?));';
      const values = [eventId, req.adminId];
      await connection.execute(query, values);

      return res.status(200).json({ message: 'Public event request cancelled' });
    } catch (error) {
      return res.status(400).json({ message: 'Error removing event', error: error?.response?.message || error?.message });
    }
  }
}

export default verifyAdmin('eventAdmin', handler);