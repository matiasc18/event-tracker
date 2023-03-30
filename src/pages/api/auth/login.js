import createConnection from '@/lib/db'
import { sign } from 'jsonwebtoken'
import { compare } from 'bcrypt'
import Cookies from 'js-cookie'

// Authenticate user login
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Email and password must be provided
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' })

    try {
      // Create connection and execute query
      const connection = await createConnection();
      const [rows] = await connection.execute('SELECT * FROM user WHERE email = ?', [email]);

      // No user associated with provided email
      if (rows.length === 0)
        return res.status(401).json({ message: 'Invalid email or password' });

      const passwordMatch = await compare(password, rows[0].password);

      // Password does not match user record
      if (!passwordMatch)
        return res.status(401).json({ message: 'Invalid email or password' });

      // Create and sign JWT token with user id
      const token = sign({ user_id: rows[0].user_id }, process.env.JWT_SECRET);

      // Set token as a cookie in the response header
      Cookies.set('authToken', token, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      return res.status(200)
        .setHeader('Set-Cookie', Cookies.get('authToken'))
        .json({ message: 'User logged in', authToken: token });
    } catch (error) {
      return res.status(401).json({ message: 'Login failed', error: error });
    }
  }
}