import axiosInstance from '../../axiosInstance'
import { setAuthToken, deleteAuthToken } from '@/utils/auth'

// Register user into db
async function registerUser(data) {
  try {
    const response = await axiosInstance.post('/auth/register', data);

    // If registration is successful, set the JWT token in a cookie
    setAuthToken(response.data.authToken);

    return response.data;
  } catch (error) {
    return { error: error };
  }
}

// Log user in
async function loginUser(data) {
  try {
    const response = await axiosInstance.post('/auth/login', data);

    // If registration is successful, set the JWT token in a cookie
    setAuthToken(response.data.authToken);

    return response.data;
  } catch (error) {
    return { error: error };
  }
}

// Log user out
async function logoutUser() {
  try {
    deleteAuthToken();

  } catch (error) {
    return { error: error };
  }
}

export { registerUser, loginUser, logoutUser };