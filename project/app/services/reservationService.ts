import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reservations';

export const reservationService = {
  checkAvailability: async (checkIn: string, checkOut: string) => {
    const response = await axios.post(`${API_URL}/availability`, { checkIn, checkOut });
    return response.data;
  },

  // Used by reception component
  createReservation: async (roomNumber: string, customerData: any, reservationData: any) => {
    const response = await axios.post(API_URL, { roomNumber, customerData, reservationData });
    return response.data;
  },

  // New method for web bookings
  createWebReservation: async (roomNumber: string, customerData: any, reservationData: any) => {
    const response = await axios.post(`${API_URL}/web`, { 
      roomNumber, 
      customerData, 
      reservationData 
    });
    return response.data;
  },

  getActiveReservations: async () => {
    const response = await axios.get(`${API_URL}/active`);
    return response.data;
  },

  completeCheckout: async (id: string) => {
    const response = await axios.put(`${API_URL}/checkout/${id}`);
    return response.data;
  },

  getAllRoomsStatus: async () => {
    const response = await axios.get(`${API_URL}/room-status`);
    return response.data;
  }
};