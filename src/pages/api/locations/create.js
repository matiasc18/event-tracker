import connection from '@/lib/db'

// /api/superadmin/university/create
export default async function handler(req, res) {
  // Create university profile
  if (req.method === 'POST') {
    const { locationId, latitude, longitude, locationName, locationUrl } = req.body;

    try {
      const query = "INSERT INTO location (location_id, latitude, longitude, name, location_url) VALUES (?, ?, ?, ?, ?);";
      const values = [locationId, latitude, longitude, locationName, locationUrl];
      await connection.execute(query, values);

      return res.status(200).json({ message: 'Location created', location: { locationId, latitude, longitude, locationName, locationUrl } });
    } catch (error) {
      // If user attempts to create location that already exists, simply use that location
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Location already exists, use anyway' });
      }
      return res.status(400).json({ message: 'Error creating location', error: error?.response?.message || error?.message });
    }
  }
}