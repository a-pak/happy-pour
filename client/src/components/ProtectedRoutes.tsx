import { Outlet, Navigate} from "react-router-dom";
import {UserProvider} from "../store/UserContext.tsx";
const ProtectedRoutes = () => {
    const userLoggedIn = UserProvider.;
    return userLoggedIn ? <Outlet/> : <Navigate to="/login"/> // Outlet = User's intended destination i.e add Bar.
} 
export default ProtectedRoutes;