import { Outlet, Navigate} from "react-router-dom";
import {useUser} from "../store/UserContext.tsx";

const ProtectedRoutes = () => {
    const {user} = useUser();
    return user != null ? <Outlet/> : <Navigate to="/login"/> // Outlet = User's intended destination i.e add Bar.
} 
export default ProtectedRoutes;