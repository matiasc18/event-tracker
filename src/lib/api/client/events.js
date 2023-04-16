import { getAuthToken } from '@/utils/auth';
import axiosInstance from '../../axiosInstance'

// Register user into db
async function getAllEvents(authToken) {
  try {
    if (!(!!authToken)) {
      const response = await axiosInstance.get('/events/public');
      return response.data.events;
    } else {
      const response = await axiosInstance.get(`/events/all`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      return response.data.events;
    }
  } catch (error) {
    return { message: error?.response?.data?.message || error?.message };
  }
}

async function getEvent(authToken, eventId, type, ownerId) {
  try {
    if (type === 'public') {
      const response = await axiosInstance.get(`/events/${eventId}`);
      return { status: response.status, event: response.data.event };
    }
    else if (type === 'rso') {
      const response = await axiosInstance.get(`/rso/${ownerId}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      return { status: response.status, event: response.data.event };
    }
    else if (type === 'private') {
      const response = await axiosInstance.get(`/universities/${ownerId}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      return { status: response.status, event: response.data.event };
    }
    else return { status: 400, message: 'Invalid event type' };
  } catch (error) {
    return { status: error.response.status, message: error?.response?.data?.message || error?.message };
  }
}

export { getAllEvents, getEvent };