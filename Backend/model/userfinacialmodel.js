const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  invoiceDate: { type: Date, required: true },
  invoiceNumber: { type: Number, required: true },
  invoiceAmount: { type: Number, required: true },
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);

module.exports = {
  Invoice,
};
