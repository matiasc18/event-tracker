import connection from '@/lib/db'
import verifySuperadmin from '@/lib/api/middleware/verifySuperadmin'

// /api/superadmin/university/create
async function handler(req, res) {
  // Create university profile
  if (req.method === 'POST') {
    const { locationId, name, abbreviation, population, description } = req.body;

    // Check if middleware caught an error
    if (res.statusCode >= 400) {
      return res;
    }

    try {
      const query = "INSERT INTO university (superadmin_id, location_id, name, abbreviation, population, description) VALUES (?, ?, ?, ?, ?, ?);";
      const values = [req.superadminId, locationId, name, abbreviation, population, description];
      console.log(values);
      const result = await connection.execute(query, values);

      return res.status(200).json({ message: 'University created', univId: result[0].insertId });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'University already exists', errror: error?.response?.message || error?.message });
      }
      return res.status(400).json({ message: 'Error creating university', error: error?.response?.message || error?.message });
    }
  }
}

// Middleware determines if user is a superadmin and if they have already created a university
export default verifySuperadmin('createUniversity', handler);