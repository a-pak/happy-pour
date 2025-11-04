import { useUserStore } from "../store/userStore.ts";
import { useNavigate } from "react-router-dom";
import { useErrorStore } from "../store/errorStore.ts";
import { Box, Typography, Button, Container } from '@mui/material';

export const ProfilePage = () => {
    const { user, setUser } = useUserStore();
    const navigate = useNavigate();
    const { showNotification } = useErrorStore.getState();
    
    function handleLogout() {
        setUser(null);
        showNotification("You have logged out successfully.", "success");

        setTimeout(() => {
            navigate('/');
        }, 0);
    }
    
    return (
        <Container maxWidth="sm">
            <Box sx={{ 
                mt: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3
            }}>
                <Typography variant="h4" component="h1">
                    Profile Settings
                </Typography>
                
                {user === null ? (
                    <>
                        <Typography variant="body1">
                            No user is logged in. Please Login to access profile settings!
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/login')}
                            size="large"
                        >
                            Log in
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="body1">
                            This is where {user.username}'s profile settings are going to be.
                        </Typography>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleLogout}
                            size="large"
                        >
                            Log out
                        </Button>
                    </>
                )}
            </Box>
        </Container>
    );
};