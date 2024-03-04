import express from "express";
import Joi from "joi";
// import bcrypt from "bcrypt";
import multer from "multer";
import Order from "../models/orderContent.js";

// import generateAuthToken from "../utils/generateAuthToken.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.array("files"), async (req, res) => {
  const schema = Joi.object({
    // Date: Joi.string().required(),
    // Customer_name: Joi.string().required(),
    // Job_description: Joi.string().allow(""),
    // Customers_will_get: Joi.string().allow(""),
    // Deadline: Joi.string().allow(""),
    // Number_of_edits: Joi.string().allow(""),
    // Order_type: Joi.string().allow(""),
    // Price: Joi.string().allow(""),
    // Status: Joi.string().allow(""),
    // Send_to: Joi.string().allow(""),
    // Review: Joi.string().allow(""),

    orderNumber: Joi.string().required(),
    Status: Joi.string().required(),
    Translator_name: Joi.string().required(),
    document_Type: Joi.string().required(),
    translation_Type: Joi.string().required(),
    tranfrom: Joi.string().required(),
    tranto: Joi.string().required(),
    Deadline: Joi.string().required(),
    Additional_explanation: Joi.string().allow(""),
    type: Joi.string().required(),
    Price: Joi.string().required(),
    file: Joi.string().required(),
    data: Joi.array(),
  });

  try {
    const { error } = await schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // let user = await User.findOne({ name: req.body.Customer_name });
    const { orderNumber, Price, data, Translator_name,Status } =
      await req.body;
    const order = await new Order({
      orderNumber,
      Price,
      Status,
      Translator_name,
      data,
    }).save();

    await order.save();
    await res.status(200).json();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
