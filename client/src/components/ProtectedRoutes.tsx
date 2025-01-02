import { Outlet, Navigate} from "react-router-dom";

const ProtectedRoutes = () => {
    const userLoggedIn = true;
    return userLoggedIn ? <Outlet/> : <Navigate to="/login"/> // Outlet = User's intended destination i.e add Bar.
} 
export default ProtectedRoutes;