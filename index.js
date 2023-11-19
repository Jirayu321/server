// import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import bodyParser from "body-parser";
import morgan from "morgan";

// import fs from "fs";
// import https from "https";

import resgister from "./routes/register.js";
import login from "./routes/login.js";
import createOrder from "./routes/createOrder.js";
// import updateOrder from "./routes/updateOrder.js";
import getOrder from "./routes/gatOrder.js";
import getEmail from "./routes/getEmail.js";
import generationsAi from "./routes/generationsAI.js";

const uri = "mongodb+srv://Ozone:Jirayu30052@cluster0.ots5oju.mongodb.net/test";
const port = 3001;

// const key = fs.readFileSync("private.key");
// const cert = fs.readFileSync("certificate.crt");

const app = express();

// const options = {
//   key,
//   cert,
// };

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "32mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "32mb", extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
  // if (req.method === "OPTIONS") {
  //   res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
  //   return res.status(200).json({});
  // }
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome Dev");
});

app.get("/:universalURL", (req, res) => {
  res.send("404 URL NOT FOUND");
});

app.use("/api/login", login);
app.use("/api/register", resgister);
app.use("/api/createOrder", createOrder);
app.use("/api/generationsAi", generationsAi);
app.use("/api/getOrder", getOrder);
// app.use("/api/updateOrder", updateOrder);
app.use("/api/getEmail", getEmail);

app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established..."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));
