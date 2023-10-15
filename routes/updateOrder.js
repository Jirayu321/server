import express from "express";
import Joi from "joi";
// import bcrypt from "bcrypt";
import Order from "../models/orderContent.js";

// import generateAuthToken from "../utils/generateAuthToken.js";

const router = express.Router();

router.patch("/:id", async (req, res) => {
  const schema = Joi.object({
    Date: Joi.string().required(),
    Job_description: Joi.string().allow(""),
    Customer_name: Joi.string().required(),
    Translator_name: Joi.string().required(),
    Customers_will_get: Joi.string().allow(""),
    Deadline: Joi.string().allow(""),
    Number_of_edits: Joi.string().allow(""),
    Order_type: Joi.string().allow(""),
    Price: Joi.string().allow(""),
    Status: Joi.string().allow(""),
    Send_to: Joi.string().allow(""),
    Review: Joi.string().allow(""),
  });
  // console.log("req:id",req.params.id)

  let user = await Order.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send("not found...");
  // console.log("req:data",req.body);
  try {
    const { error } = await schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const {
      Date,
      Job_description,
      Customers_will_get,
      Deadline,
      Number_of_edits,
      Price,
      Status,
      Send_to,
      Review,
    } = await req.body;
   
    const updatedata = await Order.findByIdAndUpdate(req.params.id, {
      Date: Date,
      Job_description: Job_description,
      Customers_will_get: Customers_will_get,
      Deadline: Deadline,
      Number_of_edits: Number_of_edits,
      Price: Price,
      Status: Status,
      Send_to: Send_to,
      Review: Review,
    });
    // await order.update();
    await res.send(updatedata);
    await res.status(200);
    // const salt = await bcrypt.genSalt(10);
    // let token = await generateAuthToken(order);
    // console.log("token:", token);
    // user.password = await bcrypt.hash(user.password, salt);
    // await res.send(token);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

export default router;
