import {create} from 'zustand';
//import {persist} from 'zustand/middleware';
import UserDetails from "../model/IUserDetails.ts";

type UserStore = {
    id: number;
    username: string;
    email: string;
    login: (userDetails : UserDetails) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    id: 0,
    username: "",
    email: "",
    login: (userDetails : UserDetails) => {
        set(() => ({
            id: userDetails.id,
            username: userDetails.username,
            email: userDetails.email
        }));
    },
    logout: () => {
        set(() => ({
        id: 0,
        username: "",
        email: "",
    }));
    }
}))