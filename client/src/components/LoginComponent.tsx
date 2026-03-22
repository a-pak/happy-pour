import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box,
  TextField,
  Button,
  Typography,
  Container,
} from '@mui/material';
import { loginAPI } from "../services/auth.ts";
import LoginPayload from "../types/ILoginPayloadInterface.ts";
import { useUserStore, User } from "../store/userStore.ts";
import { useErrorStore } from '../store/errorStore.ts';

const LoginComponent: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { setUser } = useUserStore();
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
            const loginData: LoginPayload = {
                email,
                password,
            };
            const newUser : User | undefined = await loginAPI(loginData);
            setUserContext(newUser);

        } catch (error) {
            showNotification("Login failed. Please check credentials.", "error");
            console.error('Login failed:', error);
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
                <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
                    Log in
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
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
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 2,
                            bgcolor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.dark',
                            },
                            height: '45px'
                        }}
                    >
                        Login
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginComponent;