import connection from '@/lib/db'
import verifySuperadmin from '@/lib/api/middleware/verifySuperadmin'

// /api/superadmin/createUniversity
async function handler(req, res) {
  // Create university profile
  if (req.method === 'POST') {
    const { locationId, name, population, description } = req.body;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      const query = "INSERT INTO university (superadmin_id, location_id, name, population, description) VALUES (?, ?, ?, ?, ?);";
      const values = [userId, locationId, name, population, description];
      await connection.execute(query, values);

      return res.status(200).json({ message: 'University created', university: name });
    } catch (error) {
      return res.status(400).json({ message: 'Error creating university', error: error?.response?.message || error?.message });
    }
  }
}

// Middleware determines if user is a superadmin and if they have already created a university
export default verifySuperadmin('createUniversity', handler);