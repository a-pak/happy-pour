import {createContext, useState} from "react";
import UserDetails from "../model/IUserDetails.ts";
import {defaultUserDetails} from "../model/IUserDetails.ts";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState<UserDetails>(defaultUserDetails);

    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    );
}



