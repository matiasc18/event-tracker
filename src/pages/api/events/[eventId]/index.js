import connection from '@/lib/db'

// /api/events/:eventId
export default async function handler(req, res) {
  // Get public event details
  if (req.method === 'GET') {
    const { eventId } = req.query;

    try {
      const query = 'SELECT E.*, R.name AS rso_name, L.name AS location_name, U.abbreviation, U.name AS univ_name FROM event E INNER JOIN rso R ON R.rso_id = E.rso_id INNER JOIN location L ON L.location_id = E.location_id INNER JOIN university U ON U.univ_id = E.univ_id WHERE E.event_id = ? AND E.type = "public";';
      const values = [eventId];
      const [result] = await connection.execute(query, values);

      // There is no event with specified RSO and event ID
      if (result.length === 0) {
        return res.status(404).json({ message: 'Public event not found' });
      }
      
      return res.status(200).json({ event: result[0] });
    } catch (error) {
      return res.status(401).json({ message: 'Error while retrieving event', error: error?.response?.message || error?.message });
    }
  }
}