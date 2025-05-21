import Button from "@mui/material/Button";
import {useUser} from "../store/UserContext.tsx";
import { useNavigate } from "react-router-dom";
import { useErrorStore } from "../store/errorStore.ts";
import "./styles/Auth.css";

export const ProfilePage = () => {
    const {user, setUser} = useUser();
    const navigate = useNavigate();
    const {showNotification} = useErrorStore.getState();
    
    function handleLogout() {
        localStorage.removeItem('user');
        setUser(null);
        showNotification("You have logged out successfully.", "success");

        // Give React a moment to unmount the protected route
        setTimeout(() => {
                navigate('/');
        }, 0); // or 10–50ms if needed
    }

    
    return user === null ? (
        <div className="wrapper">
            <h1>Profile Settings</h1>
            <p>No user is logged in. Please Login to access profile settings!</p>
            <div className="wrapper">
              <button className="form-item" onClick={() => navigate('/login')}>Log in</button>
          </div>
        </div>
      ) : (
        <div className="wrapper">
            <h1>Profile Settings</h1>
            <p>This is where {user!==null ? user.username : 'user'}`s profile settings are going to be.</p>
            <div className="wrapper">
                <button className="form-item" onClick={handleLogout}>Log out</button>
            </div>
        </div>
      );
}