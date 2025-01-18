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
                        const registerData : RegisterPayload = {
                            username,
                            email,
                            password,
                        };
                        // Call the login API
                        await registerAPI(registerData);
            
                    } catch (error) {
            
                    }
                }
    
        return (
            <div>
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        );
    }; export default RegisterComponent;