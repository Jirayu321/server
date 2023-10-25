import mongoose from "mongoose";

const generationsAIContent = mongoose.Schema({
  orderNumber: { type: String, required: true },
  date: { type: String, required: false },
  data: { type: Array, required: true },
});

export default mongoose.model("generationsAi", generationsAIContent);
