import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1F1F1F',
      light: '#3F4045',
    },
    secondary: {
      main: '#322c60',
      light: '#7c6cf1',
    },
    info: {
      main: '#fcf8ff',
    },
    text: {
      primary: '#fcf8ff',
      secondary: '#cab1e4ff',
    },
    background: {
      default: '#121212', // tumma tausta
      paper: '#1e1e1e',   // Paper-komponentin tumma tausta
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            color: '#ffffff', // Text color
          },
          '& .MuiInputLabel-root': {
            color: '#ffffff', // Label Color
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#ffffff', // Typography
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff', // Button Text Color
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff', // Outer border
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff', // Outer border: hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff', // Outer border: focused
          },
        },
      },
    },
  },
});

export default theme