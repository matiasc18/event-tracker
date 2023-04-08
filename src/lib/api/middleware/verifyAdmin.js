import { isAdmin } from '../../db';
import jwt from 'jsonwebtoken'
import connection from '../../db'

// API middleware for all /api/admin routes
// Verify if user is the admin for a particular RSO or event
const verifyAdmin = (value, handler) => async (req, res) => {
  try {
    // Get and verify auth token
    const { authorization } = req.headers;

    let decodedToken;
    try {
      decodedToken = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);

      // User must be an admin
      if (decodedToken.role !== 'admin') {
        res.status(401).json({ message: 'Unauthorized access' });
        return await handler(req, res);
      }
    } catch (error) {
      res.status(401).json({ message: 'Auth token error', error: error?.response?.message || error?.message });
      return await handler(req, res);
    }

    const userId = decodedToken.user_id;
    let isUserAdmin;

    switch (value) {
      case 'eventAdmin':
        const { eventId } = req.query;

        // Verify if user is the event's RSO's admin 
        isUserAdmin = await isAdmin(true, eventId, userId, connection);
        if (!isUserAdmin.isAdmin) {
          res.status(isUserAdmin.status).json({ message: isUserAdmin.message });
          return await handler(req, res);
        }

        req.adminId = userId;
        return await handler(req, res);
      case 'rsoAdmin':
        const { rsoId } = req.query;

        // Verify if the user is the RSO's admin
        isUserAdmin = await isAdmin(false, rsoId, userId, connection);
        if (!isUserAdmin.isAdmin) {
          res.status(isUserAdmin.status).json({ message: isUserAdmin.message });
          return await handler(req, res);
        }

        req.adminId = userId;
        return await handler(req, res);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while authorizing', error: error?.response?.message || error?.message });
    return await handler(req, res);
  }
};

export default verifyAdmin;