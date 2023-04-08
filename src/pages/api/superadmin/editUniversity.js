import connection from '@/lib/db'
import { buildEditUniQuery } from '@/utils/utils'
import verifySuperadmin from '@/lib/api/middleware/verifySuperadmin'

// /api/superadmin/editUniversity
async function handler(req, res) {
  // Edit university profile
  if (req.method === 'PUT') {
    // Body format:
    // locationId, name, population, description
    const body = req.body;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      // Build query for editing university profile
      const { query, values } = buildEditUniQuery(body, req.superadminId);
      await connection.execute(query, values);  

      return res.status(200).json({ message: 'University updated', university: body.name });
    } catch (error) {
      return res.status(400).json({ message: 'Error updating university', error: error?.response?.message || error?.message });
    }
  }
}

// Middleware determines if the user is a superadmin
export default verifySuperadmin('editUniversity', handler);