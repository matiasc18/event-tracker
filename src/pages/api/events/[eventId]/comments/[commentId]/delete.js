import commentAuthorization from '@/lib/api/middleware/commentAuthorization'
import connection from '@/lib/db'

// /api/events/:eventId/comments/:commentId/delete
async function handler(req, res) {
  // Delete comment for an event
  if (req.method === 'DELETE') {
    const { commentId } = req.query;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      const query = 'DELETE FROM event_comment WHERE comment_id = ? AND user_id = ?;';
      const values = [commentId, req.userId];
      await connection.execute(query, values);

      return res.status(200).json({ message: 'Event comment deleted' });
    } catch (error) {
      // console.log(error);
      return res.status(400).json({ message: 'Error deleting event', error: error?.response?.message || error?.message });
    }
  }
}

// Middleware determines if user is authorized to delete this comment
export default commentAuthorization('delete', handler);