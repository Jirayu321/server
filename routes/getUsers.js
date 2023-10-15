import express from "express";
import Joi from "joi";
// import bcrypt from "bcrypt";
import userContenet from "../models/userContenet.js";

// import generateAuthToken from "../utils/generateAuthToken.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const dbConnect = await userContenet.find({});
    await res.status(200).json(dbConnect);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
