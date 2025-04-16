import React, {createContext, useContext, useState} from "react";
import User, {UserContextType, UserProviderProps} from "../model/IUserContext.ts";


const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider :React.FC<UserProviderProps>= ({ children }) => {
    const userFromLocalStorage = localStorage.getItem('user');
    const parsedUser : User = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;
    const [user, setUser] = useState<User | null>(parsedUser);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};



