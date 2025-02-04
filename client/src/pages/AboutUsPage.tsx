import { Box, Grid, IconButton, Paper, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import theme from '../Theme';

export const AboutUsPage = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Box sx={{ padding: 2 }}>
                <Paper sx={{ padding: 2, backgroundColor:theme.palette.secondary.main }}>
                    <Grid container spacing={1}>
                        <Grid item xs={10}>
                        
                        <Typography variant="h4" gutterBottom>
                            About Us
                        </Typography>
                        </Grid>
                        <Grid item xs={2}>
                        <IconButton  aria-label="delete" size="large" sx={{ color:'text.primary', position:'relative', left:'20px', }} onClick={() => navigate(-1)}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                        </Grid>
                    </Grid>
                    <Typography variant="subtitle1" gutterBottom>
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae aspernatur beatae neque autem suscipit fuga, cum doloribus optio possimus dolor magni itaque? Quidem, voluptas. Aut corporis exercitationem id totam qui.
                    </Typography>
                </Paper>
            </Box>
        </div>
    )
}
