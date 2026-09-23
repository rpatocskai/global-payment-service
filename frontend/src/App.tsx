import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export const App = () => {
  return (
    <Box
      sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}
    >
      {/* Alap Navigációs Sáv */}
      <AppBar position="static">
        <Toolbar>
          <AccountBalanceWalletIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Global Payment Service
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Központi tartalomhely */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Epic 1 sikeresen felállítva! 🎉
          </Typography>
          <Typography variant="body1" color="text.secondary">
            A React + TypeScript + Material UI környezet kész a fejlesztésre. Az
            Axios kliens be van állítva a http://localhost:8080/api címre.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default App;
