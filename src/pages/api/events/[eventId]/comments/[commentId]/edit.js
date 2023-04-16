import commentAuthorization from '@/lib/api/middleware/commentAuthorization'
import connection from '@/lib/db'
import { buildEditCommentQuery } from '@/utils/utils'

// /api/events/:eventId/comments/:commentId/edit
async function handler(req, res) {
  // Edit comment for an event
  if (req.method === 'PUT') {
    const { commentId } = req.query;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      // Build query for editing comment details
      const { query, values } = buildEditCommentQuery(req.body, req.userId, commentId);
      await connection.execute(query, values);

      return res.status(200).json({ message: 'Event comment edited' });
    } catch (error) {
      // console.log(error);
      return res.status(400).json({ message: 'Error editing event', error: error?.response?.message || error?.message });
    }
  }
}

// Middleware determines if user is authorized to edit this comment
export default commentAuthorization('edit', handler);