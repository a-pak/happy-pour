import axios from 'axios'
import Bar from '../model/IbarInterface';

const BASE_URL : string = import.meta.env.VITE_BASE_API_URL + "bars";

const getAll = async (): Promise<Bar[]> => {
    console.log(BASE_URL);
    const response = await axios.get(BASE_URL);
    return response.data;
}

const create = async (newBar: Bar): Promise<Bar> => {
    const response = await axios.post<Bar>(BASE_URL, newBar);
    return response.data;
}

const update = async (id: Number, newBar: Bar): Promise<Bar> => {
    const response = await axios.put<Bar>(`${BASE_URL}/${id}`, newBar);
    return response.data;
}

const getById = async (id: Number): Promise<Bar> => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
}

export default {
    getAll,
    create,
    update,
    getById
}