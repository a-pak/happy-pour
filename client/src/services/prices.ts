import axios from 'axios';

import api from '../utils/axiosInstance';
import { PriceDTO } from '../model/IPriceInterface';

const PRICES_URL : string = "/prices";

const getByBarId = async (barId: number): Promise<PriceDTO[]> => {
    try {
    const response = await api.get(`${PRICES_URL}/by-bar/${barId}`);
    return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching prices:', error.response?.data);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

const createPrice = async (priceData: PriceDTO[]): Promise<void> => {
    try {
        console.log("Creating prices with data:", priceData);
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