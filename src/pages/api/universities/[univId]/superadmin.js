import connection from '@/lib/db'

// /api/universities/:univId/superadmin
export default async function handler(req, res) {
  // Get superadmin for a university
  if (req.method === 'GET') {
    const { univId } = req.query;
    
    // If there is no university provided
    if (!univId) {
      return res.status(401).json({ message: 'No university selected' });
    }
    
    try {
      const query = 'SELECT user.first_name, user.last_name FROM university INNER JOIN user ON university.superadmin_id = user.user_id WHERE university.univ_id = ?;';
      const values = [univId];
      const [result] = await connection.execute(query, values);

      return res.status(200).json({ superAdminName: `${result[0].first_name} ${result[0].last_name}` });
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized', error: error?.response?.message || error?.message });
    }
  }
}