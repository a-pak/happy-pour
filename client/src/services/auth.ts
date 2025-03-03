import axios from 'axios'
import LoginPayload from '../model/ILoginPayloadInterface';
import RegisterPayload from '../model/IRegisterPayloadInterface';

const baseUrl = 'http://localhost:8080/api/auth'

export const loginAPI = async (loginPayload : LoginPayload) => {
  try {
    const response = await fetch('https://your-backend.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginPayload),
      credentials: 'include', // Important: this ensures cookies are sent with the request
    });

    if (response.ok) {

      //TODO: Extract userDTO and store in UserContext, Implement UserContext(?)




      window.location.href = '/';
    } else {
      // Handle error (invalid credentials)
      console.error('Login failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
export const registerAPI = async (registerPayload: RegisterPayload) => {

  const response = await axios.post(baseUrl + "/register", registerPayload)
  if (response.status === 200) {
    // Redirect to login page
    window.location.href = '/login';
  }
}
