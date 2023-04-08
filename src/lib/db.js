import mysql from 'mysql2/promise'

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

// Determines if user is admin for a particular RSO or RSO of an event
export async function isAdmin(eventAdmin, entityId, userId, connection) {
  try {
    let result;

    if (eventAdmin) {
      [result] = await connection.execute('SELECT admin_id FROM rso WHERE rso_id = (SELECT rso_id FROM event WHERE event_id = ?);', [entityId]);
    } else {
      [result] = await connection.execute('SELECT admin_id FROM rso WHERE rso_id = ?;', [entityId]);
    }

    if (result.length === 0) {
      return { isAdmin: false, status: 404, message: `Error: ${eventAdmin ? 'Event not found' : 'This RSO does not exist'}` };
    } else if (result[0].admin_id !== userId) {
      return { isAdmin: false, status: 401, message: 'Unauthorized: you are not this RSO\'s admin' };
    }

    return { isAdmin: true };
  } catch (error) {
    if (error.code === 'ER_PARSE_ERROR') {
      return { isAdmin: false, status: 400, message: 'Bad request: malformed query' };
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      return { isAdmin: false, status: 500, message: 'Internal server error: could not connect to database' };
    } else {
      return { isAdmin: false, status: 500, message: 'Internal server error while authorizing' };
    }
  }
}

// Determines if user is superadmin for a particular RSO or public event request
export async function isSuperadmin(eventRequest, entityId, userId, connection) {
  try {
    let result;

    // Verify if user is the superadmin for a public event request
    if (eventRequest) {
      [result] = await connection.execute('SELECT superadmin_id FROM public_event_request WHERE event_id = ?;', [entityId]);
      // Verify if user is a superadmin for a particular RSO
    } else {
      [result] = await connection.execute('SELECT superadmin_id FROM university WHERE univ_id = (SELECT univ_id FROM user WHERE user_id = (SELECT admin_id FROM rso WHERE rso_id = ?))', [entityId]);
    }

    // RSO/request not found
    if (result.length === 0) {
      return { isSuperadmin: false, status: 404, message: `Error: ${eventRequest ? 'Event request not found' : 'This RSO does not exist'}` };
      // Rso/request found, but user is not the superadmin
    } else if (result[0].superadmin_id !== userId) {
      return { isSuperadmin: false, status: 401, message: 'Unauthorized: you are not this RSO\'s superadmin' };
    }

    return { isSuperadmin: true };
  } catch (error) {
    if (error.code === 'ER_PARSE_ERROR') {
      return { isSuperadmin: false, status: 400, message: 'Bad request: malformed query' };
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      return { isSuperadmin: false, status: 500, message: 'Internal server error: could not connect to database' };
    } else {
      return { isSuperadmin: false, status: 500, message: 'Internal server error while authorizing' };
    }
  }
}

// Check if superadmin has already created a university
export async function isUnivRegistered(superadminId, connection) {
  try {
    const [result] = await connection.execute('SELECT univ_id FROM university WHERE superadmin_id = ?;', [superadminId]);

    if (result.length > 0) {
      return { univExists: true, status: 409, message: 'You cannot create more than one university' };
    }
    else return { univExists: false };
  } catch (error) {
    if (error.code === 'ER_PARSE_ERROR') {
      return { univExists: false, status: 400, message: 'Bad request: malformed query' };
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      return { univExists: false, status: 500, message: 'Internal server error: could not connect to database' };
    } else {
      return { univExists: false, status: 500, message: 'Internal server error while authorizing' };
    }
  }
}

export default connection;