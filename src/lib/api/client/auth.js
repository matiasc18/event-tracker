import axiosInstance from '../../axiosInstance'
import { setAuthToken, deleteAuthToken } from '@/utils/auth'

// Register user into db
async function registerUser(data) {
  try {
    const response = await axiosInstance.post('/auth/register', data);

    // If registration is successful, set the JWT token in a cookie
    if (response.status === 200)
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

// Get user's details
async function getUser(authToken) {
  try {
    const response = await axiosInstance.get(`/auth/user`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    return response.data.user;
  } catch (error) {
    return { message: error?.response?.data?.message || error?.message };
  }
}

// Gets user's university
async function getUserUniversity(authToken) {
  try {
    const response = await axiosInstance.get(`/auth/user/university`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    return response.data.university;
  } catch (error) {
    return { message: error?.response?.data?.message || error?.message };
  }
}

export { registerUser, loginUser, logoutUser, getUser, getUserUniversity };