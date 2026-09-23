import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { AccountsPage } from "./pages/AccountsPage";

export const App = () => {
  return (
    <Box
      sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}
    >
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <AccountBalanceWalletIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Global Payment Service
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <AccountsPage />
      </Container>
    </Box>
  );
};

export default App;
