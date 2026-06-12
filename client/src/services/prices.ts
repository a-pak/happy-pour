import api from './axios/axiosInstance';
import { PriceDTO } from '../types/IPriceInterface';

const PRICES_URL: string = "/prices";

const getByBarId = async (barId: number): Promise<PriceDTO[]> => {
    const response = await api.get(`${PRICES_URL}/by-bar/${barId}`);
    return response.data;
}

const createPrice = async (priceData: PriceDTO[]): Promise<void> => {
    const response = await api.post(PRICES_URL, priceData);
    return response.data;
}

export {
    getByBarId,
    createPrice
};