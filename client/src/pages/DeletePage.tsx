import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BarService from "../services/bars";
import { BarData } from "../model/IbarInterface";
import { useErrorStore } from "../store/errorStore";
import { Typography, Box, Button, List, ListItemText, ListItem, Grid, IconButton, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // 👈 Add this line


const DeletePage : React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { showNotification } = useErrorStore.getState();
    const navigate = useNavigate();
    const [barData, setBarData] = useState<BarData | null>(null); // Korjaa bars.ts get -pyynnön return tyyppi.

    useEffect(() => {
        const fetchBar = async () => {
            BarService
            .getById(Number(id))
            .then((data) => setBarData(data))
            .catch((err) => {
                console.error('Failed to fetch bar:', err)
                showNotification("Failed to fetch bar. Please try again.", "error")
                navigate("/");
            });
        };

    fetchBar();
  }, [id]);

    const handleDelete = async () => {
        try {
            await BarService.deleteById(Number(id));
            navigate("/");
            showNotification("Bar deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting bar:", error);
            showNotification("Error deleting bar. Please try again.", "error");
        }
    }

    const handleCancel = () => {
        navigate(-1);
    }
    const getDrinkPrice = (drinkName: string) => {
      if (!barData) return 'N/A';
      const normalDrink = barData.drinks.find((d: any) => d.name === drinkName);
      return normalDrink ? `${normalDrink.normalPrice} €` : 'N/A';
    };
    if (!barData) {
        return (
          <Box sx={{ color: '#b57edc', textAlign: 'center', mt: 4 }}>
            <Typography>Loading...</Typography>
          </Box>
        );
      }
    return (
    
    <Box sx={{ padding: 3, backgroundColor: '#121212', minHeight: '100vh' }}>
      <Paper
        elevation={4}
        sx={{
          padding: 3,
          backgroundColor: '#1e1e1e',
          color: '#b57edc',
          borderRadius: '12px',
          maxWidth: 600,
          margin: '0 auto',
        }}
      >
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={10}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d1b3ff' }}>
              {barData.bar.name}
            </Typography>
          </Grid>
          <Grid item xs={2} sx={{ textAlign: 'right' }}>
            <IconButton onClick={() => navigate('/')} sx={{ color: '#b57edc' }}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ color: '#d1b3ff', mt: 1 }}>
          {barData.bar.address}
        </Typography>
        <List>
          {barData.drinks.map((drink: any) => (
            <ListItem key={drink.id} disablePadding sx={{ color: '#e0cfff' }}>
              <ListItemText
                primary={drink.name}
                secondary={getDrinkPrice(drink.name)}
                primaryTypographyProps={{ sx: { fontWeight: 'bold' } }}
              />
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemText primary="Entry Fee" secondary={`${barData.bar.entryFee} €`} />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText primary="Cloakroom Fee" secondary={`${barData.bar.cloakroomFee} €`} />
          </ListItem>
          {barData.happyHour && (
            <ListItem disablePadding>
              <ListItemText
                primary="Happy Hour"
                secondary={`${barData.happyHour.startTime} - ${barData.happyHour.endTime}`}
              />
            </ListItem>
          )}
        </List>

       <Box
  sx={{
    mt: 3,
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
    alignItems: 'stretch',
  }}
>
  {/* Delete Button - Red background, white text, no border */}
  <Button
    onClick={handleDelete}
    variant="contained"
    sx={{
      width: { xs: '100%', sm: 'auto' },
      paddingY: 1.5,
      paddingX: 3,
      fontSize: '1rem',
      fontWeight: 'bold',
      backgroundColor: '#ff5252',
      color: '#ffffff',
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: '#ff1744',
      },
    }}
  >
    Delete
  </Button>

  {/* Cancel Button - Light purple outline */}
  <Button
    onClick={handleCancel}
    variant="outlined"
    sx={{
      width: { xs: '100%', sm: 'auto' },
      paddingY: 1.5,
      paddingX: 3,
      fontSize: '1rem',
      fontWeight: 'bold',
      borderColor: '#b57edc',
      color: '#b57edc',
      '&:hover': {
        backgroundColor: '#b57edc22',
        borderColor: '#b57edc',
      },
    }}
  >
    Cancel
  </Button>
</Box>


      </Paper>
    </Box>
  );
}
export default DeletePage;
