import axios from 'axios';
import { IDrink , IDrinkPayload} from '../model/IdrinkInterface';

const API_URL : string = import.meta.env.VITE_BASE_API_URL + "drinks";


const DrinkService = {
    getByBarId: async (barId: number): Promise<IDrink[]> => {
        const response = await axios.get<IDrink[]>(`${API_URL}/${barId}`);
        return response.data;
    },

    createDrink: async (drinkData: IDrinkPayload): Promise<void> => {
        const response = await axios.post(API_URL, drinkData, {
            withCredentials: true,
        });
        if(response.status === 401 || response.status === 403) {
            throw new Error("Unauthorized");
        }
    },

    updateDrinks: async (drinkData: IDrink[]): Promise<void> => {
        const response = await axios.put(API_URL, drinkData, {
            withCredentials: true,
        });
        if(response.status === 401 || response.status === 403) {
            throw new Error("Unauthorized");
        }
    }
};

export default DrinkService;