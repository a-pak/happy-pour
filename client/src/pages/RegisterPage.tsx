import { useState } from "react";
import { registerAPI } from "../services/auth";
import RegisterPayload from "../types/IRegisterPayloadInterface";
import { Link, useNavigate } from "react-router-dom";
import { useErrorStore } from '../store/errorStore';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper
} from '@mui/material';

const RegisterPage: React.FC = () => {
    const { showNotification } = useErrorStore.getState();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
            if (response) {
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
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                        Create a new account
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 2,
                                mb: 2,
                                height: '45px'
                            }}
                        >
                            Register
                        </Button>
                    </Box>
                </Paper>
            </Box>
            <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Already have an account? Log in <u>here</u>
                </Typography>
            </Link>
        </Container>
    );
};

export default RegisterPage;