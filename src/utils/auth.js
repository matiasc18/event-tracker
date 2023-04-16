import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'

// Create auth jwtToken (signin/register)
const setAuthToken = (token) => {
  Cookies.set('authToken', token, { expires: 7 }); // Set the cookie to expire in 7 days
};

// Delete auth jwtToken (logout)
const deleteAuthToken = () => {
  Cookies.remove('authToken');
}

const getAuthToken = () => {
  const authToken = Cookies.get('authToken');
  return authToken;
}

// Get user's role
const getRole = (context) => {
  const { req } = context;
  const authToken = req.headers.cookie?.split('; ').find(row => row.startsWith('authToken='))?.split('=')[1];
  if (!!authToken) {
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    return decodedToken.role;
  }
  return null;
}

// Checks login status
const isLoggedIn = () => {
  const authToken = Cookies.get('authToken');
  return !!authToken;
};

export { setAuthToken, deleteAuthToken, isLoggedIn, getRole, getAuthToken }