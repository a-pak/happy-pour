import axios from 'axios'
import LoginPayload from '../model/ILoginPayloadInterface.ts';
import RegisterPayload from '../model/IRegisterPayloadInterface.ts';
import User from "../model/IUserContext.ts";

const BASE_URL = import.meta.env.VITE_BASE_API_URL + 'auth';

export const loginAPI = async (loginPayload : LoginPayload) => {
  try {
    const response = await axios.post(
        BASE_URL + '/login',
        loginPayload, {
          withCredentials: true
        });

    if (response.status === 200) {
      const newUser : User = response.data;
      console.log(newUser);
      return newUser;
    } else {
      // Handle error (invalid credentials)
      console.error('Login failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

export const registerAPI = async (registerPayload: RegisterPayload) => {

    return await axios.post(
        BASE_URL + "/register",
        registerPayload
    );

};
