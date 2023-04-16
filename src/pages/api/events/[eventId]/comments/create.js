import commentAuthorization from '@/lib/api/middleware/commentAuthorization';
import connection from '@/lib/db'

// /api/events/:eventId/comments/create
async function handler(req, res) {
  // Create comment for an event
  if (req.method === 'POST') {
    const { eventId } = req.query;
    const { rating, comment } = req.body;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      const query = 'INSERT INTO event_comment (event_id, user_id, rating, comment) VALUES (?, ?, ?, ?);';
      const values = [eventId, req.userId, rating, comment];
      await connection.execute(query, values);
      
      return res.status(200).json({ message: 'Event comment created' });
    } catch (error) {
      // console.log(error);
      return res.status(400).json({ message: 'Error creating event', error: error?.response?.message || error?.message });
    }
  }
}

// Middleware determines if user is authorized to add a comment for this event
export default commentAuthorization('create', handler);