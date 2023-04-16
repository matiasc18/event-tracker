import jwt from 'jsonwebtoken'
import connection from '../../db'

// API middleware for all RSO-related routes
// Verify if user is member of a particular RSO
const commentAuthorization = (action, handler) => async (req, res) => {
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
    const userId = decodedToken.user_id;
    const { eventId, commentId } = req.query;
    const { type } = req.body;

    req.userId = userId;
    
    // If user wants to create a comment
    if (action === 'create') {
      switch (type) {
        case 'public':
          return await handler(req, res);
        case 'rso':
          try {
            const query = 'SELECT member_id FROM rso_member WHERE rso_id = (SELECT rso_id FROM event WHERE event_id = ?);';
            const values = [eventId];
            const [result] = await connection.execute(query, values);

            // This event does not exist
            if (result.length === 0) {
              res.status(401).json({ message: 'This event does not exist' });
              return await handler(req, res);
            }

            // User is not a member of this RSO
            if (!result.some(member => member.member_id === userId)) {
              res.status(401).json({ message: 'Unauthorized to comment on this RSO\'s event' });
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
        case 'private':
          try {
            const query = 'SELECT U.univ_id, E.univ_id AS event_univ_id FROM user U, event E WHERE E.event_id = ? AND U.user_id = ?;';
            const values = [eventId, userId];
            const [result] = await connection.execute(query, values);

            // This event does not exist
            if (result.length === 0) {
              res.status(401).json({ message: 'This event does not exist' });
              return await handler(req, res);
            }

            if (result[0].univ_id !== result[0].event_univ_id) {
              res.status(401).json({ message: 'Unauthorized to add a comment to this University\'s event' });
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
      }
    }
    // User wants to edit an event
    else if (action === 'edit' || action === 'delete') {
      try {
        const query = 'SELECT user_id FROM event_comment WHERE comment_id = ?;';
        const values = [commentId];
        const [result] = await connection.execute(query, values);

        // This event does not exist
        if (result.length === 0) {
          res.status(401).json({ message: 'This event does not exist' });
          return await handler(req, res);
        }

        // User is not a member of this RSO
        if (result[0].user_id !== userId) {
          res.status(401).json({ message: `Unauthorized to ${action} this comment` });
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
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while authorizing', error: error?.response?.message || error?.message });
    return await handler(req, res);
  }
};

export default commentAuthorization;