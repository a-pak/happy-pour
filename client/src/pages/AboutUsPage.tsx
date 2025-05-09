import { Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

export const AboutUsPage = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ padding: 2 }}>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          backgroundColor: '#1e1e1e',
          color: '#b57edc',
          borderRadius: '12px',
        }}
      >
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={10}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#d1b3ff',
              }}
              gutterBottom
            >
              About Us
            </Typography>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: 'right' }}>
            <IconButton
              aria-label="close"
              size="large"
              onClick={() => navigate('/')}
              sx={{ color: '#b57edc' }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        </Grid>

        <Typography
          variant="body1"
          sx={{ color: '#d1b3ff', marginTop: 2, lineHeight: 1.6 }}
        >
          Happy Pour is an app that helps you discover and compare drink prices at local bars and cafés in your area. 
          All prices are crowdsourced and updated by users, so you’ll always know where to find the happiest pours in town. 
          🍻 Cheers to smarter sipping!
        </Typography>
      </Paper>
    </Box>
  );
};
