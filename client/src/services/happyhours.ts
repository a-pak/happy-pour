import {HappyHourDTO} from '../model/IHappyHourInterface'
import axios, { AxiosError } from 'axios';
import api from './axios/axiosInstance';

const HAPPY_HOUR_URL : string = "/happyhours";

export const getHappyHoursByBar = async (barId: number) => {
    try {
        const response = await api.get(HAPPY_HOUR_URL + `/by-bar/${barId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;            
            if (axiosError.response?.status === 404) {
                console.log(`No happy hours found for bar ${barId}. Returning empty array.`);
                return []; 
            }
        }

        throw error;
    }
}

export const getHappyHour = async (id : number) => {
    const response = await api.get(HAPPY_HOUR_URL + `/${id}`);
    return response.data;
}

export const createHappyHour = async (happyHour: HappyHourDTO) => {
    console.log(happyHour);
    const response = await api.post(HAPPY_HOUR_URL, happyHour);
    return response.data;
}

export const updateHappyHour = async ( happyHour: HappyHourDTO) => {
    console.log(happyHour);
    const response = await api.put(`${HAPPY_HOUR_URL}/${happyHour.id}`, happyHour);
    return response.data;
}

export const deleteHappyHour = async (id: number) => {
    await api.delete(`${HAPPY_HOUR_URL}/${id}`);
}