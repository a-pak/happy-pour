import axios from 'axios';
import { DrinkDTO } from '../types/IdrinkInterface';
import api from './axios/axiosInstance';

const DRINKS_URL : string = "/drinks";

export const getAllDrinks = async (): Promise<DrinkDTO[]> => {
    const response = await api.get(DRINKS_URL);
    return response.data;
}

export const createDrink = async (drinks : DrinkDTO[]) : Promise<DrinkDTO[]> => {
    try {
        const response = await api.post(DRINKS_URL, drinks);
        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error posting drink:', error.response?.data);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}