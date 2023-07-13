const express = require("express");
const Router = express.Router();
const { Invoice } = require("../model/userfinacialmodel.js");

Router.post("/invoices", async (req, res) => {
  let { invoiceDate, invoiceNumber, invoiceAmount } = req.body;
  if (invoiceDate) {
    invoiceDate = new Date(invoiceDate);
  }

  try {
    const existingInvoice = await Invoice.findOne({ invoiceNumber });
    if (existingInvoice) {
      return res.status(409).json({ error: "Invoice number already exists" });
    }

    const previousInvoice = await Invoice.findOne({
      invoiceDate: { $lt: invoiceDate },
    }).sort({ invoiceDate: -1 });
    const nextInvoice = await Invoice.findOne({
      invoiceDate: { $gt: invoiceDate },
    }).sort({ invoiceDate: 1 });
    if (
      (previousInvoice && invoiceDate < previousInvoice.invoiceDate) ||
      (nextInvoice && invoiceDate > nextInvoice.invoiceDate)
    ) {
      return res.status(400).json({ error: "Invalid invoice date" });
    }

    // Create a new invoice instance
    const newInvoice = new Invoice({
      invoiceDate: invoiceDate,
      invoiceNumber: invoiceNumber,
      invoiceAmount: invoiceAmount,
    });

    // Save the new invoice to the database
    const savedInvoice = await newInvoice.save();

    res.status(201).json(savedInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
  //madhu
});

Router.put("/invoices/:invoiceNumber", async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    let { invoiceDate, invoiceAmount } = req.body;
    if (invoiceDate) {
      invoiceDate = new Date(invoiceDate);
    }
    // Find the invoice to update
    const invoiceToUpdate = await Invoice.findOne({ invoiceNumber });
    if (!invoiceToUpdate) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Validate the invoice date against previous and next invoices
    const previousInvoice = await Invoice.findOne({
      invoiceDate: { $lt: invoiceDate },
    }).sort({ invoiceDate: -1 });
    const nextInvoice = await Invoice.findOne({
      invoiceDate: { $gt: invoiceDate },
    }).sort({ invoiceDate: 1 });

    if (
      (previousInvoice && invoiceDate < previousInvoice.invoiceDate) ||
      (nextInvoice && invoiceDate > nextInvoice.invoiceDate)
    ) {
      return res.status(400).json({ error: "Invalid invoice date" });
    }

    // Update the invoice details
    invoiceToUpdate.invoiceDate = invoiceDate;
    invoiceToUpdate.invoiceAmount = invoiceAmount;

    // Save the updated invoice to the database
    const updatedInvoice = await invoiceToUpdate.save();

    res.json(updatedInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a specific invoice
Router.delete("/invoices/:invoiceNumber", async (req, res) => {
  try {
    const { invoiceNumber } = req.params;

    // Find and delete the invoice
    const deletedInvoice = await Invoice.findOneAndDelete({ invoiceNumber });
    if (!deletedInvoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json(deletedInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /invoices - Get all invoices
Router.get("/invoices", async (req, res) => {
  try {
    // Retrieve all invoices from the database
    let invoices = await Invoice.find();

    res.json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
Router.get("/invoices/filter", async (req, res) => {
  try {
    const { financialYear, invoiceNumber, startDate, endDate } = req.query;

    // Create the filter object
    const filter = {};

    if (invoiceNumber) {
      filter.invoiceNumber = invoiceNumber;
    }

    if (startDate && endDate) {
      filter.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Find invoices matching the filter
    const filteredInvoices = await Invoice.find(filter);

    res.json(filteredInvoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  Router,
};
