import mongoose from "mongoose";

const orderContent = mongoose.Schema({
  // Date: { type: String, required: true },
  // Customer_name: { type: String, required: true },
  // Job_description: { type: String, required: false },
  // Customers_will_get: { type: String, required: false },
  // Deadline: { type: String, required: false },
  // Number_of_edits: { type: String, required: false },
  // Price: { type: String, required: false },
  // Order_type: { type: String, required: false },
  // Status: { type: String, required: false },
  // Send_to: { type: String, required: false },
  // Review: { type: String, required: false },
  orderNumber: { type: String, required: true },
  Translator_name: { type: String, required: true },
  Price: { type: String, required: true },
  data: { type: Array, required: true },
  // file: { type: String, required: false },
  // document_Type: { type: String, required: false },
  // translation_Type: { type: String, required: false },
  // tranfrom: { type: String, required: false },
  // tranto: { type: String, required: false },
  // Deadline: { type: String, required: false },
  // type: { type: String, required: false },
  // Translator_name: { type: String, required: false },
  // Additional_explanation: { type: String, required: false },
});

export default mongoose.model("Order", orderContent);
