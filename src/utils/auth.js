import Cookies from 'js-cookie'

// Create auth jwtToken (signin/register)
const setAuthToken = (token) => {
  Cookies.set('authToken', token, { expires: 7 }); // Set the cookie to expire in 7 days
};

// Delete auth jwtToken (logout)
const deleteAuthToken = () => {
  Cookies.remove('authToken');
}

// Get user's role
const getRole = () => {
  const authToken = Cookies.get('authToken');
  const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
  return decodedToken.role;
}

// Checks login status
const isLoggedIn = () => {
  const authToken = Cookies.get('authToken');
  return !!authToken;
};

export { setAuthToken, deleteAuthToken, isLoggedIn, getRole }