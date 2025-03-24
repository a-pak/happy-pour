import axios from 'axios'
import LoginPayload from '../model/ILoginPayloadInterface';
import RegisterPayload from '../model/IRegisterPayloadInterface';
import UserDetails from "../model/IUserDetails.ts";
import {useUserStore} from "../store/UserContext.ts";

const BASE_URL = 'http://localhost:8080/api/auth'
export const loginAPI = async (loginPayload : LoginPayload) => {
  try {
    const response = await axios.post(
        BASE_URL + '/login',
        loginPayload, {
          withCredentials: true
        });

    if (response.status === 200) {
      const newUser : UserDetails = response.data;
      console.log(newUser);
      setUserDetails(newUser); // <-- invalid hook call
      window.location.href = '/'; // <- May not be secure? Use Router?

    } else {
      // Handle error (invalid credentials)
      console.error('Login failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const registerAPI = async (registerPayload: RegisterPayload) => {
  try {
    const response = await axios.post(
        BASE_URL + "/register",
        registerPayload
    )

    if (response.status === 200) {
      // Redirect to login page
      window.location.href = '/login';

    } else {
      console.error('Register failed');
    }
  } catch (e) {
      console.error('Error:', e);
  }
};

// TODO: Invalid Hook Call
function setUserDetails (newUser : UserDetails)  {
  const login = useUserStore(newUser); // <-- TODO: fix invalid hook call
}
