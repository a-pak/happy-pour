import { Simulate } from "react-dom/test-utils";
import submit = Simulate.submit;
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
            history.go(2);

        } catch (error) {

        }
    }

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};
export default LoginComponent;