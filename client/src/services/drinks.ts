import axios from 'axios';
import { IDrink } from '../model/IdrinkInterface';

const API_URL : string = import.meta.env.VITE_BASE_API_URL + "drinks";


const DrinkService = {
    getByBarId: async (barId: number): Promise<IDrink[]> => {
        const response = await axios.get<IDrink[]>(`${API_URL}/${barId}`);
        return response.data;
    },

    createDrink: async (drinkData: IDrink[]): Promise<void> => {
        await axios.post(API_URL, drinkData);
    },

    updateDrinks: async (drinkData: IDrink[]): Promise<void> => {
        await axios.put(API_URL, drinkData);
    }
};

export default DrinkService;