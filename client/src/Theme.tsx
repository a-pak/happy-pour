import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1F1F1F',
      light: '#3F4045'
    },
    secondary: {
      main: '#322c60',
      light: '#7c6cf1',
      dark: "{linear-gradient(#c69afb,#4233b3)}",
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