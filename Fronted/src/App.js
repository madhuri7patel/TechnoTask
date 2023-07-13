import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./App.css";
import Form from "./Components/Form";
import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";

const defaultFilterValues = {
  financialYear: "",
  invoiceNumber: "",
  startDate: "",
  endDate: "",
};
function App() {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(defaultFilterValues);

  const handleDeleteInvoice = async ({ invoiceNumber }) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/invoices/${invoiceNumber}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      console.log("data", data);
      if (data && !data.error) {
        getData();
      }
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleResetFilter = () => {
    setFilters({ ...defaultFilterValues });
    getData();
  };
  const handleOnChangeFilter = (e) => {
    const { value = "", name = "" } = e.target;
    setFilters((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleOnApplyFilter = async (e) => {
    e.preventDefault();
    const { financialYear, invoiceNumber, startDate, endDate } = filters;
    let filter = `${financialYear ? `financialYear=${financialYear}&` : ""}${
      invoiceNumber ? `invoiceNumber=${invoiceNumber}&` : ""
    }${startDate ? `startDate=${startDate}&` : ""}${
      endDate ? `endDate=${endDate}` : ""
    }`;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/invoices/filter?${filter}`
      );
      let data = await response.json();
      console.log("getData", data);
      if (data && Array.isArray(data)) {
        data = data.map((invoice) => {
          if (invoice.invoiceDate) {
            let date = new Date(invoice.invoiceDate);
            invoice.invoiceDate = `${date.getFullYear()}-${
              date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()
            }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
          }
          return invoice;
        });

        setInvoiceData([...data]);
      }
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/invoices`);
      let data = await response.json();
      console.log("getData", data);
      if (data && Array.isArray(data)) {
        data = data.map((invoice) => {
          if (invoice.invoiceDate) {
            let date = new Date(invoice.invoiceDate);
            invoice.invoiceDate = `${date.getFullYear()}-${
              date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()
            }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
          }
          return invoice;
        });
        setInvoiceData([...data]);
      } else if (data?.error) {
        alert(`${data.error}`);
      }
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="App">
      <Container maxWidth="md" sx={{ marginTop: "20px" }}>
        <Typography variant="h1" mb={1} fontSize={"32px"} fontWeight={"bold"}>
          Invoice Dashboard
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Form getData={getData} />
        </Box>

        <Box>
          <form
            onSubmit={handleOnApplyFilter}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                display: "inline-flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <label>
                <Typography textAlign={"left"} mb={1} fontWeight={"bold"}>
                  Search By Invoice Number
                </Typography>
                <TextField
                  type="number"
                  id={"invoiceNumber"}
                  name={"invoiceNumber"}
                  value={filters.invoiceNumber}
                  onChange={handleOnChangeFilter}
                  disabled={loading}
                  readOnly={loading}
                  size="small"
                />
              </label>
              <Box>
                <Typography textAlign={"left"} fontWeight={"bold"}>
                  Filter between invoice dates
                </Typography>
                <Box style={{ display: "flex", gap: 5 }}>
                  <label style={{ display: "flex", flexDirection: "column" }}>
                    <Typography textAlign={"left"} mb={1}>
                      Start Date
                    </Typography>
                    <input
                      required={filters.endDate ? true : false}
                      type="date"
                      id={"startDate"}
                      name={"startDate"}
                      value={filters.startDate}
                      onChange={handleOnChangeFilter}
                      style={{
                        height: "23px",
                        minWidth: "195px",
                        padding: "8px 14px",
                        border: "0.5px solid grey",
                        borderRadius: "4px",
                      }}
                    />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column" }}>
                    <Typography textAlign={"left"} mb={1}>
                      End Date
                    </Typography>
                    <input
                      required={filters.startDate ? true : false}
                      type="date"
                      id={"endDate"}
                      name={"endDate"}
                      value={filters.endDate}
                      onChange={handleOnChangeFilter}
                      style={{
                        height: "23px",
                        minWidth: "195px",
                        padding: "8px 14px",
                        border: "0.5px solid grey",
                        borderRadius: "4px",
                      }}
                    />
                  </label>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  disabled={loading}
                  onClick={handleResetFilter}
                >
                  Reset Filter
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={loading}
                  disabled={loading}
                >
                  Apply Filter
                </LoadingButton>
              </Box>
            </Box>
          </form>
        </Box>
        <Box mt={4}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Sr. No.</TableCell>
                  <TableCell align="center">Invoice Number</TableCell>
                  <TableCell align="center">Invoice Amount</TableCell>
                  <TableCell align="center">Invoice Date</TableCell>
                  <TableCell align="center">Edit</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceData && Array.isArray(invoiceData)
                  ? invoiceData.map((invoiceItem, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="center">
                          {invoiceItem.invoiceNumber}
                        </TableCell>
                        <TableCell align="center">
                          {invoiceItem.invoiceAmount}
                        </TableCell>
                        <TableCell align="center">
                          {invoiceItem.invoiceDate}
                        </TableCell>
                        <TableCell align="center">
                          <Form
                            getData={getData}
                            initialFormData={invoiceItem}
                            method="edit"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteInvoice({
                                invoiceNumber: invoiceItem.invoiceNumber,
                              });
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  : null}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </div>
  );
}

export default App;
