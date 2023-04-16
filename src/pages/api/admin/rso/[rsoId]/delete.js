import connection from '@/lib/db'
import verifyAdmin from '@/lib/api/middleware/verifyAdmin'

// /api/admin/rso/:rsoId/delete
async function handler(req, res) {
  // Delete rso
  if (req.method === 'DELETE') {
    const { rsoId } = req.query;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      const query = 'DELETE FROM rso WHERE rso_id = ? AND admin_id = ?;';
      const values = [rsoId, userId];
      const result = await connection.execute(query, values);

      return res.status(200).json({ message: 'RSO deleted' });
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting RSO', error: error?.response?.message || error?.message });
    }
  }
}

export default verifyAdmin('rsoAdmin', handler);