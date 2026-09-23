import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TablePagination,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import type { Account, Currency } from "../types/account.types";

interface AccountTableProps {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

export const AccountTable = ({
  accounts,
  loading,
  error,
}: AccountTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const previousLengthRef = useRef(accounts.length);

  useEffect(() => {
    if (accounts.length > previousLengthRef.current) {
      const lastPage = Math.floor((accounts.length - 1) / rowsPerPage);

      const timer = setTimeout(() => {
        setPage(lastPage);
      }, 0);

      return () => clearTimeout(timer);
    }

    previousLengthRef.current = accounts.length;
  }, [accounts.length, rowsPerPage]);

  const formatBalance = (amount: number, curr: Currency) => {
    return new Intl.NumberFormat("hu-HU", {
      style: "currency",
      currency: curr,
    }).format(amount);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const maxPage =
    accounts.length > 0 ? Math.floor((accounts.length - 1) / rowsPerPage) : 0;
  const safePage = page > maxPage ? maxPage : page;

  const paginatedAccounts = accounts.slice(
    safePage * rowsPerPage,
    safePage * rowsPerPage + rowsPerPage,
  );

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6">Meglévő számlák</Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : accounts.length === 0 ? (
        <Alert severity="info">Még nincsenek létrehozott számlák.</Alert>
      ) : (
        <Paper elevation={3}>
          <TableContainer sx={{ overflowX: "auto", width: "100%" }}>
            <Table sx={{ minWidth: 400 }}>
              <TableHead sx={{ bgcolor: "primary.main" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Számlaszám (ID)
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Devizanem
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    Egyenleg
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAccounts.map((account) => (
                  <TableRow key={account.id} hover>
                    <TableCell sx={{ fontWeight: "medium" }}>
                      #{account.id}
                    </TableCell>
                    <TableCell>{account.currency}</TableCell>
                    <TableCell sx={{ textAlign: "right", fontWeight: "bold" }}>
                      {formatBalance(account.balance, account.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={accounts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Sorok száma:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} / ${count}`
            }
          />
        </Paper>
      )}
    </Box>
  );
};
