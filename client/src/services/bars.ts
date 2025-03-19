import axios from 'axios'
import Bar from '../model/IbarInterface';

const BASE_URL : string = import.meta.env.VITE_BASE_API_URL + "bars";

const getAll = async (): Promise<Bar[]> => {
    console.log(BASE_URL);
    const response = await axios.get(BASE_URL,{
        withCredentials: true,
    });
    return response.data;
}

const create = async (newBar: Bar): Promise<Bar> => {
    const response = await axios.post(BASE_URL, {"bar": newBar}, {
        withCredentials: true,
    }).then(response => response.data);
    return response.data;
}

const update = async (id: number, newBar: Bar): Promise<Bar> => {
    const response = await axios.put<Bar>(`${BASE_URL}/${id}`, {"bar": newBar}, {
        withCredentials: true,
    });
    return response.data;
}

const getById = async (id: number): Promise<Bar> => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
}
const removeById = async (id: number) => {
    const response = await axios.delete(`${BASE_URL}/${id}`)
    return response.data
}

export default {
    getAll,
    create,
    update,
    getById,
    removeById
}