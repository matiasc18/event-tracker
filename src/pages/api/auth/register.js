import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import createConnection from '@/lib/db'
import Cookies from 'js-cookie'

// Register user into database
export default async function handler(req, res) {
  const connection = await createConnection();

  if (req.method === 'POST') {
    try {
      const { univ_id, first_name, last_name, email, password, role } = req.body;

      // Hash user's password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create SQL query
      const query = "INSERT INTO user (univ_id, first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [univ_id, first_name, last_name, email, hashedPassword, role];

      // Execute query
      const [rows] = await connection.execute(query, values);
      const createdUser = {
        first_name,
        last_name,
        email,
        role
      };

      // Create and sign JWT token with user id
      const token = sign({ user_id: rows.insertId }, process.env.JWT_SECRET);

      // Set token as a cookie in the response header
      Cookies.set('authToken', token, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })

      return res.status(200)
        .setHeader('Set-Cookie', Cookies.get('authToken'))
        .json({ message: 'User created', user: createdUser, authToken: token });
    } catch (error) {
      return res.status(400).json({ message: 'Registration failed', error: error.message });
    }
  }
}