import { Outlet, Navigate} from "react-router-dom";
import {useUserStore} from "../store/userStore.ts";

const ProtectedRoutes = () => {
    const {user} = useUserStore();
    // TODO: Implement token validity check through backend.
    return (user == null || user == undefined) ? <Navigate to="/login?message=unauthorized"/> : <Outlet/>
} 
export default ProtectedRoutes;