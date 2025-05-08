import { loginAPI } from "../services/auth.ts";
import LoginPayload from "../model/ILoginPayloadInterface.ts";
import { useState } from "react";
import User from "../model/IUserContext.ts";
import {useUser} from "../store/UserContext.tsx";
import {useNavigate} from "react-router-dom";
import { useErrorStore } from '../store/errorStore.ts';


// Login form component for LoginPage
const LoginComponent: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const {setUser} = useUser();
    const navigate = useNavigate();
    const { showNotification } = useErrorStore.getState();

    function setUserContext(user : User | undefined) {
        if(user) {
            setUser(user);
            navigate("/");
            showNotification("Welcome back, " + user.username + "!", "success");
        } else {
            showNotification("Sorry! Error encountered. Please try again.", "error");
            throw new Error("User is undefined or missing");
        }
    }

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!email || !password) {
            showNotification("Email and password required. Please fill out both fields", "warning");
            return;
        }

        try {
            // Prepare login payload
            const loginData: LoginPayload = {
                email,
                password,
            };
            // Call the login API
            const newUser : User | undefined = await loginAPI(loginData);
            setUserContext(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));

        } catch (error) {
            showNotification("Login failed. Please check credentials.", "error");
            console.error('Login failed:', error);
        }
    }

    return (
        <div className="wrapper margin-top">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="form">
                <div className="wrapper">
                <input
                    className="form-item"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>
                <div className="wrapper">
                <input
                    className="form-item"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <div className="wrapper">
                <button className="form-item" type="submit">Login</button>
                </div>
            </form>
        </div>
    );
};
export default LoginComponent;