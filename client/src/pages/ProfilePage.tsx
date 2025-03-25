import Button from "@mui/material/Button";
import {useUser} from "../store/UserContext.tsx";

export const ProfilePage = () => {
    const {user, setUser} = useUser();
    function handleLogout() {
       setUser(null);
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