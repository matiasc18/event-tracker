import connection from '@/lib/db'
import verifySuperadmin from '@/lib/api/middleware/verifySuperadmin'

// /api/superadmin/authorize/rso/:rsoId
async function handler(req, res) {
  // Authorize RSO creation
  if (req.method === 'PUT') {
    const { rsoId } = req.query;
    const { newStatus } = req.body;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      const query = `UPDATE rso SET rso_status = ? WHERE rso_id = ?;`;
      const values = [newStatus, rsoId];
      const result = await connection.execute(query, values);

      // If superadmin tries updating an RSO that has already been updated
      if (result[0].changedRows === 0) {
        return res.status(409).json({ message: `RSO already ${newStatus ? 'active' : 'inactive'}` });
      }

      return res.status(200).json({ message: `RSO status set to ${newStatus ? 'active' : 'inactive'}` });
    } catch (error) {
      return res.status(40).json({ message: 'Error authorizing RSO', error: error?.response?.message || error?.message });
    }
  }
}

// Middleware checks if the user is the rso's superadmin
export default verifySuperadmin('rsoSuperadmin', handler);