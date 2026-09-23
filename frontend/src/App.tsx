import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { AccountsPage } from "./pages/AccountsPage";
import { TransferPage } from "./pages/TransferPage";
import { useAccounts } from "./api/features/account/hooks/useAccounts";

export const App = () => {
  const [activeTab, setActiveTab] = useState(0);

  const accountController = useAccounts();

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);

    if (newValue === 0) {
      accountController.refreshAccounts();
    }
  };

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

        <Container maxWidth="lg">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab
              icon={<AccountBalanceIcon />}
              iconPosition="start"
              label="Számlák"
            />
            <Tab
              icon={<CompareArrowsIcon />}
              iconPosition="start"
              label="Pénzutalás"
            />
          </Tabs>
        </Container>
      </AppBar>

      <Container maxWidth="lg">
        {activeTab === 0 && (
          <AccountsPage accountController={accountController} />
        )}
        {activeTab === 1 && (
          <TransferPage
            onTransferSuccess={() => {
              setActiveTab(0);
              accountController.refreshAccounts();
            }}
          />
        )}
      </Container>
    </Box>
  );
};

export default App;
