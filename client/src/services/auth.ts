import axios from 'axios'
import LoginPayload from '../model/ILoginPayloadInterface';
import RegisterPayload from '../model/IRegisterPayloadInterface';

const BASE_URL = 'http://localhost:8080/api/auth'

export const loginAPI = async (loginPayload : LoginPayload) => {
  try {
    const response = await axios.post(
        BASE_URL + '/login',
        loginPayload,
        {withCredentials: true}
    );

    if (response.status === 200) {
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

  const response = await axios.post(BASE_URL + "/register", registerPayload)
  if (response.status === 200) {
    // Redirect to login page
    window.location.href = '/login';
  }
}
