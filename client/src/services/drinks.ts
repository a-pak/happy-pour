import axios from 'axios';
import { IDrink , IDrinkPayload} from '../model/IdrinkInterface';
import api from './axiosInstance';

const DRINKS_URL : string = "/drinks";

const getByBarId = async (barId: number): Promise<IDrink[]> => {
    try {
    const response = await api.get(`${DRINKS_URL}/${barId}`);
    return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching drinks:', error.response?.data);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

const createDrink = async (drinkData: IDrinkPayload): Promise<void> => {
    try {
        console.log("drinkkkdataa", drinkData)

        const response = await api.post(DRINKS_URL, drinkData);
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

const updateDrinks = async (drinkData: IDrinkPayload): Promise<void> => {
    try {
        console.log("drinkkkdataa", drinkData)
        const response = await api.put(DRINKS_URL, drinkData);
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


export {
    getByBarId,
    createDrink,
    updateDrinks
};