import { isUnivRegistered } from '../../db'
import jwt from 'jsonwebtoken'
import connection from '../../db'

// API middleware for all /api/superadmin routes
// Verify if user is the superadmin for a particular RSO, event request, or university
export const verifySuperadmin = (value, handler) => async (req, res) => {
  try {
    // Get and verify auth token
    const { authorization } = req.headers;

    let decodedToken;
    try {
      decodedToken = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);

      // User must be a superadmin
      if (decodedToken.role !== 'superadmin') {
        res.status(401).json({ message: 'Unauthorized access' });
        return await handler(req, res);
      }
    } catch (error) {
      res.status(401).json({ message: 'Auth token error', error: error?.response?.message || error?.message });
      return await handler(req, res);
    }

    const userId = decodedToken.user_id;
    let isUserSuperadmin;

    switch (value) {
      case 'rsoSuperadmin':
        const { rsoId } = req.query;

        // Verify if the user is the RSO's superadmin
        isUserSuperadmin = await isSuperadmin(false, rsoId, userId, connection);

        if (!isUserSuperadmin.isSuperadmin) {
          res.status(isUserSuperadmin.status).json({ message: isUserSuperadmin.message });
          return await handler(req, res);
        }

        req.superadminId = userId;
        return await handler(req, res);
      case 'requestSuperadmin':
        const { eventId } = req.query;

        // Verify if the user is the event's superadmin
        isUserSuperadmin = await isSuperadmin(true, eventId, userId, connection);

        if (!isUserSuperadmin.isSuperadmin) {
          res.status(isUserSuperadmin.status).json({ message: isUserSuperadmin.message });
          return await handler(req, res);
        }

        req.superadminId = userId;
        return await handler(req, res);
      case 'createUniversity':
        // Determine if this superadmin has already created a university profile
        isUserSuperadmin = await isUnivRegistered(userId, connection);
        if (isUserSuperadmin.univExists) {
          res.status(isUserSuperadmin.status).json({ message: isUserSuperadmin.message });
          return await handler(res, res);
        }

        req.superadminId = userId;
        return await handler(req, res);
      case 'editUniversity':
        // Return result of verificaiton
        req.superadminId = userId;
        return await handler(req, res);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while authorizing', error: error?.response?.message || error?.message });
    return await handler(req, res);
  }
};

export default verifySuperadmin;