import express from 'express';
import Joi from "joi";
import bcrypt from "bcrypt";
import User from "../models/userContenet.js";
import generateAuthToken from "../utils/generateAuthToken.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().min(6).required(),
    mobilePhone: Joi.string().max(10).required(),
    address: Joi.string().allow(""),
    district: Joi.string().allow(""),
    province: Joi.string().allow(""),
    country: Joi.string().allow(""),
    postalCode: Joi.string(),
    bankname: Joi.string().allow(""),
    branchname: Joi.string().allow(""),
    accountname: Joi.string().allow(""),
    accountnumber: Joi.string().allow(""),
    watermark: Joi.string().allow(""),
    certificate: Joi.string().allow(""),
    languages: Joi.array(),
    idcard: Joi.string().allow(""),
    education: Joi.string().allow(""),
    portfolio: Joi.string().allow(""),
    documents: Joi.string().allow(""),
    answer: Joi.string().allow(""),
    question: Joi.string().allow(""),
    type: Joi.string().required(),
  });

  try {
    const { error } = await schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exists...");

    const {
      name,
      email,
      password,
      confirmPassword,
      mobilePhone,
      address,
      district,
      province,
      country,
      postalCode,
      bankname,
      branchname,
      accountname,
      accountnumber,
      watermark,
      certificate,
      languages,
      idcard,
      education,
      portfolio,
      documents,
      answer,
      question,
      type,
    } = await req.body;
    user = await new User({
      name,
      email,
      password,
      confirmPassword,
      mobilePhone,

      // imageURLs,
      address,
      district,
      province,
      country,
      postalCode,
      bankname,
      branchname,
      accountname,
      accountnumber,
      watermark,
      certificate,
      languages,
      idcard,
      education,
      portfolio,
      documents,
      answer,
      question,
      type,
    });
    const salt = await bcrypt.genSalt(10);
    let token = await generateAuthToken(user);
    // console.log("token:", token);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    await res.send(token);
    await res.status(200).json();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
