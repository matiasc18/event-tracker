import connection from '@/lib/db'
import verifyAdmin from '@/lib/api/middleware/verifyAdmin'

// /api/admin/rso/:rsoId/events/create
async function handler(req, res) {
  // Create rso or private event
  if (req.method === 'POST') {
    const { rsoId } = req.query;
    const { locationId, category, name, contactEmail, contactName,
      contactPhone, date, description, timeEnd, timeStart, type } = req.body;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      const query = 'INSERT INTO event (univ_id, rso_id, location_id, category, name, contact_email, contact_name, contact_phone, date, description, time_end, time_start, type) VALUES ((SELECT univ_id FROM user WHERE user_id = ?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
      const values = [req.adminId, rsoId, locationId, category, name, contactEmail,
        contactName, contactPhone, new Date(Date.parse(date)), description,
        new Date(Date.parse(timeEnd)), new Date(Date.parse(timeStart)), type
      ];

      await connection.execute(query, values);
      return res.status(200).json({ message: 'RSO event created' });
    } catch (error) {
      // console.log(error);
      return res.status(400).json({ message: 'Error creating event', error: error?.response?.message || error?.message });
    }
  }
}

// Middleware checks if the user is the rso's admin
export default verifyAdmin('rsoAdmin', handler);