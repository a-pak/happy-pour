import axios from 'axios'
const baseUrl = 'http://localhost:8080/api/bars'

interface Bar {
    id: number;
    name: string;
    coordinates: { lat: number; lng: number };
    address: string;
    beer05Price: number;
    wine075Price: number;
    coffeePrice: number;
    entryFee: number;
    cloakroomFee: number;
}

const getAll = async (): Promise<Bar[]> => {
    const response = await axios.get(baseUrl)
    return response.data
}

const create = async (newBar: Bar): Promise<Bar> => {
    const response = await axios.post<Bar>(baseUrl, newBar)
    return response.data
}

export default {
    getAll,
    create,
}