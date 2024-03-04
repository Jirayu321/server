import express from "express";
import Joi from "joi";
import Order from "../models/orderContent.js";

// import generateAuthToken from "../utils/generateAuthToken.js";

const router = express.Router();

router.put("/:orderNumber", async (req, res) => {
  const schema = Joi.object({
    Status: Joi.string().required(),
  });

  try {
    console.log("req:", req.body);
    const { error } = await schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { orderNumber } = req.params;
    // const { type } = req.body;

    const order = await Order.findOneAndUpdate(
      { orderNumber },
      { $set:  { Status: "2" } },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
