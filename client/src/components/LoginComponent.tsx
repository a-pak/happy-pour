import { loginAPI } from "../services/auth.ts";
import LoginPayload from "../model/ILoginPayloadInterface";
import { useState } from "react";


// Login form component for LoginPage
const LoginComponent: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!email || !password) {
            setErrorMessage('Username and password are required.');
            return;
        }

        try {
            // Prepare login payload
            const loginData: LoginPayload = {
                email,
                password,
            };
            // Call the login API
            await loginAPI(loginData);

        } catch (error) {
            alert('Login failed. Please try again.');
            console.error('Login failed:', error);
        }
    }

    return (
        <div className="wrapper">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    className="input"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className=" input button" type="submit">Login</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};
export default LoginComponent;