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
async function getUniversityAdmin() {
  try {
    const response = await axiosInstance.get(`/universities/${data}/getAdmin`);

    return response.data;
  } catch (error) {
    return { error: error };
  }
}

// Create new university
async function createUniversity(data) {
  try {
    const response = await axiosInstance.post('/universities/admin/createUniversity', data)

    return response.data;
  } catch (error) {
    return { error: error };
  }
}

export { getUniversities, getUniversityAdmin, createUniversity };