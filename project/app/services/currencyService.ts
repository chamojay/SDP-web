import axios from 'axios';

const API_KEY = 'd46d62b08eb9229e97a8cf52';

export const currencyService = {
  getUSDToLKRRate: async (): Promise<number> => {
    try {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`
      );
      return response.data.conversion_rates.LKR;
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
      throw error;
    }
  }
};