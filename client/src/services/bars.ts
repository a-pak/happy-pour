import axios from 'axios'
import Bar, { BarData } from '../model/IbarInterface';
import api from './axiosInstance';

const BARS_URL : string = "/bars";

const getAll = async (): Promise<BarData[]> => {
    console.log(BARS_URL);
    const response = await api.get(BARS_URL);
    return response.data;
}

const create = async (newBar: Bar): Promise<Bar> => {
    try {
        const response = await api.post(BARS_URL, newBar);
        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating bar:', error.response?.data);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

const update = async (id: number, newBar: Bar): Promise<Bar> => {
    try {
        const response = await api.put(`${BARS_URL}/${id}`, newBar);
        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error creating bar:', error.response?.data);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error; // Rethrow the error after logging it
    }
}

const getById = async (id: number): Promise<BarData> => {
    console.log(BARS_URL + '/' + id);
    const response = await api.get(`${BARS_URL}/${id}`);
    console.log("BAR DATA: " + response.data.name);
    return response.data;
}
const deleteById = async (id: number) => {
    const response = await api.delete(`${BARS_URL}/${id}`);
    return response.data
}

export default {
    getAll,
    create,
    update,
    getById,
    deleteById
}