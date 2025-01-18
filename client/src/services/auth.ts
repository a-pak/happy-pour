import axios from 'axios'
import LoginPayload from '../model/ILoginPayloadInterface';
import RegisterPayload from '../model/IRegisterPayloadInterface';

const baseUrl = 'http://localhost:8080/api/auth'

export const loginAPI = async (loginPayload: LoginPayload) => {
  // Send POST request to the backend for authentication
  const response = await axios.post(baseUrl + "/login", loginPayload);
  if (response.status === 200) {
    
    const jwtToken = response.data;
    if (jwtToken) {
      // Store the JWT token in localStorage
      localStorage.setItem('jwtToken', jwtToken);

      // Redirect to the main page
      window.location.href = '/';
    } else {
      alert('Login failed, token not there!');
    }
  }
};
export const registerAPI = async (registerPayload: RegisterPayload) => {

  const response = await axios.post(baseUrl + "/register", registerPayload)
  if (response.status === 200) {
    // Redirect to login page
    window.location.href = '/login';
  }
}
