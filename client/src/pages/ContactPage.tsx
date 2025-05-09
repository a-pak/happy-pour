import { Box, Grid, IconButton, Paper, Typography, Link as MuiLink } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

export const ContactPage = () => {
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
              Contact Us
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
          Have feedback, questions, or partnership ideas?
          <br /><br />
          📧 Email us at:{' '}
          <MuiLink href="mailto:hello@happypour.app" underline="hover" sx={{ color: '#b57edc' }}>
            hello@happypour.app
          </MuiLink>
          <br /><br />
          📍 Based in Helsinki, Finland.
          <br /><br />
          Follow us on Instagram:{' '}
          <MuiLink href="https://instagram.com/happypour" target="_blank" underline="hover" sx={{ color: '#b57edc' }}>
            @happypour
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
};