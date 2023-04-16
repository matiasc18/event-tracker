import connection from '@/lib/db'

// /api/events/public
export default async function handler(req, res) {
  // Get all public events
  if (req.method === 'GET') {
    try {
      const query = 'SELECT E.*, R.name AS rso_name, L.name AS location_name, U.abbreviation FROM event E INNER JOIN rso R ON R.rso_id = E.rso_id INNER JOIN location L ON L.location_id = E.location_id INNER JOIN university U ON U.univ_id = E.univ_id WHERE E.type = "public";';
      
      const [result] = await connection.execute(query);

      return res.status(200).json({ events: result });
    } catch (error) {
      return res.status(401).json({ message: 'Error getting events', error: error?.response?.message || error?.message });
    }
  }
}