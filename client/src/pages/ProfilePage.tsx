import Button from "@mui/material/Button";
import {useUser} from "../store/UserContext.tsx";
import { useNavigate } from "react-router-dom";
import { useErrorStore } from "../store/errorStore.ts";

export const ProfilePage = () => {
    const {user, setUser} = useUser();
    const navigate = useNavigate();
    const {showNotification} = useErrorStore.getState();
    
    function handleLogout() {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
        showNotification("You have logged out successfully.", "success");
    }
    
    return (
      <div className="wrapper">
          <h1>Profile Settings</h1>
          <p>This is where {user!==null ? user.username : 'user'}`s profile settings are going to be.</p>
          <div className="wrapper">
              <Button onClick={handleLogout}>Log out</Button>
          </div>
      </div>
    );
}