import axios from 'axios';

import api from './axios/axiosInstance';
import { PriceDTO } from '../types/IPriceInterface';

const PRICES_URL : string = "/prices";

const getByBarId = async (barId: number): Promise<PriceDTO[]> => {
    const response = await api.get(`${PRICES_URL}/by-bar/${barId}`);
    return response.data;
}

const createPrice = async (priceData: PriceDTO[]): Promise<void> => {
    try {
        const response = await api.post(PRICES_URL, priceData);
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

const updatePrices = async (priceData: PriceDTO[]): Promise<void> => {
    try {
        const response = await api.put(PRICES_URL, priceData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error posting price:', error.response?.data);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}


export {
    getByBarId,
    createPrice,
    updatePrices
};