import axiosInstance from '../../axiosInstance'

// Get all universities
async function getUniversities() {
  try {
    const response = await axiosInstance.get('/universities/getAll');

    return response.data;
  } catch (error) {
    return { error: error };
  }
}

// Get unversity superadmin name
async function getUniversityAdmin(data) {
  try {
    const response = await axiosInstance.get(`/universities/${data}/getAdmin`);

    return response.data;
  } catch (error) {
    return { error: error };
  }
}

// Create new university
async function createUniversity(data, authToken) {
  try {
    const response = await axiosInstance.post('/superadmin/university/create', data, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    return response;
  } catch (error) {
    return error?.response;
  }
}

export { getUniversities, getUniversityAdmin, createUniversity };