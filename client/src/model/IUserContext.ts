import React from "react";

export default interface User {
    id: number;
    email: string;
    username: string;
}

export interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;

}

export interface UserProviderProps {
    children: React.ReactNode;
}