import jwt from 'jsonwebtoken'
import connection from '../../db'

// API middleware for all RSO-related routes
// Verify if user is member of a particular RSO
const verifyRsoMember = (handler) => async (req, res) => {
  try {
    // Get and verify auth token
    const { authorization } = req.headers;

    let decodedToken;
    try {
      decodedToken = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
    } catch (error) {
      res.status(401).json({ message: 'Auth token error', error: error?.response?.message || error?.message });
      return await handler(req, res);
    }

    // Determine if user is a member in the RSO
    try {
      const userId = decodedToken.user_id;
      const query = 'SELECT member_id, rso_id FROM rso_member WHERE rso_id = ?;';
      const values = [req.query.rsoId];
      const [result] = await connection.execute(query, values);

      // This RSO does not exist
      if (result.length === 0) {
        res.status(401).json({ message: 'This RSO does not exist' });
        return await handler(req, res);
      }
      
      // User is not a member of this RSO
      if (!result.some(member => member.member_id === userId)) {
        res.status(401).json({ message: 'Unauthorized to view this RSO\'s events' });
        return await handler(req, res);
      }

      return await handler(req, res);
    } catch (error) {
      if (error.code === 'ER_PARSE_ERROR') {
        res.status(400).json({ message: 'Bad request: malformed query' });
        return await handler(req, res);
      } else if (error.code === 'ER_BAD_DB_ERROR') {
        res.status(500).json({ message: 'Internal server error: could not connect to database' });
        return await handler(req, res);
      } else {
        res.status(500).json({ message: 'Internal server error while authorizing' });
        return await handler(req, res);
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while authorizing', error: error?.response?.message || error?.message });
    return await handler(req, res);
  }
};

export default verifyRsoMember;