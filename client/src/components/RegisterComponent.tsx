import { useState } from "react";
import { registerAPI } from "../services/auth";
import RegisterPayload from "../model/IRegisterPayloadInterface";
import {useNavigate} from "react-router-dom";
import { useErrorStore } from '../store/errorStore.ts';

const RegisterComponent = () => {
    const { showNotification } = useErrorStore.getState();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // 1. Add state for confirm password
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // 3. Update Validation
        if (!username || !email || !password || !confirmPassword) { // Check confirmPassword
            showNotification('All fields, including username, email, password, and confirm password, are required.', "warning");
            return;
        }

        if (password !== confirmPassword) { // Check if passwords match
            showNotification("Passwords do not match!", "error");
            return;
        }

        try {
            // Prepare register payload
            const registerData: RegisterPayload = {
                username,
                email,
                password,
            };
            console.log("Before register!")
            // Call the register API
            const response = await registerAPI(registerData);
            if(response) {
                console.log("Response: " + response.data);
                if (response.status === 201) {
                    navigate('/login?message=register-success'); // Change to /login?message=check-email if email verification is implemented
                } else {
                    // Assuming response.data.message contains the error from the API
                    showNotification(response.data.message, "error");
                    console.error('Registration failed:', response.data.message);
                }
            } else {
                showNotification('Sorry. Service is not reachable. Please try again later.'); // Handle no response case
            }

        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                showNotification(error.response.data.message, "error");
            } else {
                showNotification("Something went wrong. Please try again.", "error");
            }
            console.error('Register failed:', error);
        }
    }

    return (
        <div className="wrapper margin-top">
            <h2>Create a new account</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="wrapper">
                    <input
                        className="form-item"
                        type="text"
                        id="username"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="wrapper">
                    <input
                        className="form-item"
                        type="email"
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="wrapper">
                    <input
                        className="form-item"
                        type="password"
                        id="password"
                        value={password}
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {/* 2. Add Input Field for Confirm Password */}
                <div className="wrapper">
                    <input
                        className="form-item"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        placeholder="Confirm password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="wrapper">
                    <button className="form-item" type="submit">Register</button>
                </div>
            </form>
        </div>
    );
};
export default RegisterComponent;