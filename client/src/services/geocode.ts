import { AxiosResponse } from 'axios'
import api from './axiosInstance';

/**
 * Gets address from latitude and longitude using the nominatim backend proxy.
 * @param lat latitude
 * @param lon longitude
 * @returns Nominatim response or null if an error occurred.
 */
export const getAddress = async (lat: number, lon: number): Promise<AxiosResponse | null> => {
    try {
        const response = await api.get(`/reverse-geocode?lat=${lat}&lon=${lon}`);
        return response;
    } catch (error) {
        console.error("Error fetching address:", error);
        return null;
    }
}

