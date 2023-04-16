import axiosInstance from '../../axiosInstance'

// Create new university
async function createLocation(data) {
  try {
    const response = await axiosInstance.post('/locations/create', data);

    return response;
  } catch (error) {
    return error?.response;
  }
}

export { createLocation };