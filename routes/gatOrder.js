import express from "express";
import Joi from "joi";
// import bcrypt from "bcrypt";
import Order from "../models/orderContent.js";

// import generateAuthToken from "../utils/generateAuthToken.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("req.query", req?.query);
    if (
      req.query.Customer_name !== null &&
      req.query.Customer_name !== undefined
    ) {
      console.log("Customer_name");
      const data = await Order.find({
        Customer_name: req.query.Customer_name,
      });
      await res.status(200).json(data);
    } else {
      console.log("Translator_name");
      const data = await Order.find({
        Translator_name: req.query.Translator_name,
      });
      await res.status(200).json(data);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
