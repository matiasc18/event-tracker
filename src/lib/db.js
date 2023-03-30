import mysql from 'mysql2/promise'

// Connect to mySQL db
async function createConnection() {
  try {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.PASSWORD,
    database: process.env.DATABASE
  })

  return connection;
  } catch (error) {
    throw new Error(error);
  }
}

export default createConnection;