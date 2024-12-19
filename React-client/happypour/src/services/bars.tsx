import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/bars'

interface Bar {
    id: number;
    name: string;
    coordinates: { lat: number; lng: number };
    address: string;
    beerPrice: number;
    winePrice: number;
    coffeePrice: number;
    entryFee: number;
    cloakroomFee: number;
}

const getAll = async (): Promise<Bar[]> => {
    const response = await axios.get(baseUrl)
    return response.data
}

export default {
    getAll,
}