import bcrypt from 'bcrypt'
import { sign } from 'jsonwebtoken'
import connection from '@/lib/db'
import Cookies from 'js-cookie'

// /api/auth/register
export default async function handler(req, res) {
  // Register user into database
  if (req.method === 'POST') {
    try {
      const { univId, firstName, lastName, email, password, role } = req.body;

      // Sanitize role input
      if (role != 'student' && role != 'admin' && role != 'superadmin') {
        return res.status(400).json({ message: 'Registration failed', error: 'Invalid role'});
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = (role == 'student') ? 'INSERT INTO USER (univ_id, first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?, ?);' : 'INSERT INTO USER (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?);';
      const values = [firstName, lastName, email, hashedPassword, role];
      const finalValues = (role == 'student') ? [univId, ...values] : [...values];

      const result = await connection.execute(query, finalValues);
      const createdUser = (role == 'student') ? {
        univId,
        name: `${firstName} ${lastName}`,
        email
      } : {
        name: `${firstName} ${lastName}`,
        email
      };
      // Create and sign JWT token with user id, set it as a cookie in response header
      const token = sign({ user_id: result[0].insertId, role: role }, process.env.JWT_SECRET);
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
      console.log(error);
      return res.status(400).json({ message: 'Registration failed', error: error?.response?.message || error?.message });
    }
  }
}