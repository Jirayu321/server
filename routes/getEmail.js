// import bcrypt from "bcrypt";
import User from "../models/userContenet.js";
import Joi from "joi";
import express from "express";
import generateAuthToken from "../utils/generateAuthToken.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
  });

  try {
    const { error } = await schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(200).send("User already exists...");
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
