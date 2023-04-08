import connection from '@/lib/db'
import { sign } from 'jsonwebtoken'
import { compare } from 'bcrypt'
import Cookies from 'js-cookie'

// /api/auth/login
export default async function handler(req, res) {
  // Authenticate user login
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Email and password are not provided
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' })

    try {
      const [result] = await connection.execute('SELECT user_id, password, role FROM user WHERE email = ?', [email]);

      // No user associated with provided email
      if (result.length === 0)
        return res.status(401).json({ message: 'Invalid email or password' });
      
      // Password does not match user record
      const passwordMatch = await compare(password, result[0].password);
      if (!passwordMatch)
        return res.status(401).json({ message: 'Invalid email or password' });

      // Create and sign JWT token with user id, set it as a cookie in response header
      const token = sign({ user_id: result[0].user_id, role: result[0].role }, process.env.JWT_SECRET);
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
      return res.status(401).json({ message: 'Login failed', error: error?.response?.message || error?.message });
    }
  }
}