import { useState } from "react";
import { registerAPI } from "../services/auth";
import RegisterPayload from "../model/IRegisterPayloadInterface";

const RegisterComponent = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!username || !password || !email) {
            alert('Username, email and password are required.');
            return;
        }

        try {
            // Prepare login payload
            const registerData: RegisterPayload = {
                username,
                email,
                password,
            };
            // Call the login API
            await registerAPI(registerData);

        } catch (error) {
            alert('Register failed. Please try again.');
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
                <div className="wrapper">
                    <button className="form-item" type="submit">Register</button>
                </div>
            </form>
        </div>

    );
}; export default RegisterComponent;