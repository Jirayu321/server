import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: false },
  mobilePhone: { type: String, required: false },
  address: { type: String, required: false },
  district: { type: String, required: false },
  province: { type: String, required: false },
  country: { type: String, required: false },
  postalCode: { type: String, required: false },
  bankname: { type: String, required: false },
  branchname: { type: String, required: false },
  accountname: { type: String, required: false },
  accountnumber: { type: String, required: false },
  watermark: { type: String, required: false },
  certificate: { type: String, required: false },
  languages: { type: Array, required: false },
  idcard: { type: String, required: false },
  education: { type: String, required: false },
  portfolio: { type: String, required: false },
  documents: { type: String, required: false },
  answer: { type: String, required: false },
  question: { type: String, required: false },
  type: { type: String, required: true },
});

export default mongoose.model("User", UserSchema);
