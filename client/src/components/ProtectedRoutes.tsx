import { Outlet, Navigate} from "react-router-dom";
import {useUserStore} from "../store/userStore.ts";

const ProtectedRoutes = () => {
    const {user} = useUserStore();

    if (user === undefined) {
        return null; // Loading or splash
    }

    return user != null ? <Outlet/> : <Navigate to="/login?message=unauthorized"/>
} 
export default ProtectedRoutes;