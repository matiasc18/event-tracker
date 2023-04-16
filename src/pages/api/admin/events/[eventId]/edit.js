import connection from '@/lib/db'
import { buildEditQuery } from '@/utils/utils';
import verifyAdmin from '@/lib/api/middleware/verifyAdmin'

// /api/admin/events/:eventId/edit
async function handler(req, res) {
  // Edit event details
  if (req.method === 'PUT') {
    // Body format:
    // category, locationId, contactEmail, 
    // contactName, contactPhone, date, 
    // description, timeEnd, timeStart
    const body = req.body;
    const { eventId } = req.query;
    
    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      // Build query for editing event details
      const { query, values } = buildEditQuery(body, eventId);
      await connection.execute(query, values);

      return res.status(200).json({ message: 'Event updated' });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating event', error: error?.response?.message || error?.message });
    }
  }
}

export default verifyAdmin('eventAdmin', handler);