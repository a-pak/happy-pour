import axios from 'axios'
const baseUrl = 'http://localhost:8080/api/bars'
import Bar from '../model/IbarInterface';


const getAll = async (): Promise<Bar[]> => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getById = async (id: number): Promise<Bar> => {
    const response = await axios.get(baseUrl + '/get-by-id?id=' + id)
    return response.data
}

const create = async (newBar: Bar): Promise<Bar> => {
    const response = await axios.post<Bar>(baseUrl, newBar)
    return response.data
}

const update = async (updatedBar: Bar): Promise<Bar> => {
    const response = await axios.put<Bar>(baseUrl, updatedBar)
    return response.data
}

export default {
    getAll,
    getById,
    create,
    update
}