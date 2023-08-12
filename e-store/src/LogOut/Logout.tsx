import axios from 'axios';

const logout = async (accessToken: string) => {
  try {
    const response = await axios.post('/api/logout', { access_token: accessToken });

    if (response.status === 200) {
      // Handle successful logout, e.g., redirect to login page
      window.location.href = '/login'; // You might need to adjust the URL
    } else {
      // Handle error, e.g., display an error message
      console.error(response.data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
