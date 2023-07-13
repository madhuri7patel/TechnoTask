import React, { useState } from "react";
import {
  TextField,
  Box,
  Button,
  Typography,
  Modal,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import EditIcon from "@mui/icons-material/Edit";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "400px",
  bgcolor: "background.paper",
  border: "2px solid gray",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const Form = ({ getData, initialFormData, method = "create" }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(
    initialFormData
      ? {
          ...initialFormData,
          invoiceNumber: `${initialFormData.invoiceNumber}`,
          invoiceDate: `${initialFormData.invoiceDate}`,
          invoiceAmount: `${initialFormData.invoiceAmount}`,
        }
      : {
          invoiceNumber: "",
          invoiceDate: "",
          invoiceAmount: "",
        }
  );
  // console.log("formData", method, formData);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOnChangeForm = (e) => {
    const { value = "", name = "" } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleOnSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Form submitted", formData);
    let payload = {
      ...formData,
      invoiceAmount: Number(formData.invoiceAmount),
      invoiceNumber: Number(formData.invoiceNumber),
    };

    try {
      const response = await fetch(
        `http://localhost:8000/invoices${
          method === "create" ? "" : `/${payload.invoiceNumber}`
        }`,
        {
          method: method === "create" ? "POST" : "PUT",
          body: JSON.stringify(payload),
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("data", data);
      if (data && !data.error) {
        getData();
        handleClose();
      }
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {method === "create" ? (
        <Button variant="contained" onClick={handleOpen}>
          Add Invoice
        </Button>
      ) : (
        <IconButton aria-label="edit" size="small" onClick={handleOpen}>
          <EditIcon />
        </IconButton>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h5" mb={1} fontWeight={"bold"} align="center">
            {method === "create"
              ? "Add New Invoice Details"
              : "Update Invoice Details"}
          </Typography>
          <form onSubmit={handleOnSubmitForm}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={2}
              sx={{ maxWidth: "400px", margin: "auto" }}
            >
              <label style={{ display: "flex", flexDirection: "column" }}>
                <Typography textAlign={"left"} mb={1} fontWeight={"bold"}>
                  Invoice Number
                </Typography>
                <TextField
                  required
                  type="number"
                  name={"invoiceNumber"}
                  value={formData.invoiceNumber}
                  onChange={handleOnChangeForm}
                  disabled={method !== "create"}
                  readOnly={method !== "create"}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column" }}>
                <Typography textAlign={"left"} mb={1} fontWeight={"bold"}>
                  Invoice Date
                </Typography>
                <input
                  required
                  type="date"
                  name={"invoiceDate"}
                  value={formData.invoiceDate}
                  onChange={handleOnChangeForm}
                  style={{
                    height: "28px",
                    minWidth: "195px",
                    padding: "14px",
                    border: "0.5px solid grey",
                    borderRadius: "4px",
                  }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column" }}>
                <Typography textAlign={"left"} mb={1} fontWeight={"bold"}>
                  Invoice Amount
                </Typography>
                <TextField
                  required
                  type="number"
                  name={"invoiceAmount"}
                  value={formData.invoiceAmount}
                  onChange={handleOnChangeForm}
                />
              </label>

              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginTop: "10px", minWidth: "150px" }}
                loading={loading}
                disabled={loading}
              >
                {method === "create" ? "Submit" : "Update"}
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Form;
