import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0a3d62", // Elegáns sötétkék (pénzügyi hangulat)
      dark: "#072a46",
      light: "#3b6381",
    },
    secondary: {
      main: "#3c6382", // Kiegészítő kék
    },
    background: {
      default: "#f8f9fa", // Halvány szürke háttér a kártyáknak
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none", // Kikapcsoljuk a csupa nagybetűs gombokat a modernebb hatásért
    },
  },
});

export default theme;
