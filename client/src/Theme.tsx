import { createTheme } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: '#1F1F1F',
    },
    secondary: {
      main: '#4c3862',
      light: '#494758'
    },
    info: {
      main: '#fcf8ff'
    },
    text: {
      primary: '#fcf8ff',
      secondary: '#4c3862'
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            color: '#ffffff', // Tekstin väri sisällä
          },
          '& .MuiInputLabel-root': {
            color: '#ffffff', // Labelin väri
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#ffffff', // Typografian väri
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff', // Painikkeen tekstin väri
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff', // Ulkoreunan väri
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff', // Ulkoreunan hover-tilan väri
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff', // Ulkoreunan väri fokusoituna
          },
        },
      },
    },
  },
});

export default theme