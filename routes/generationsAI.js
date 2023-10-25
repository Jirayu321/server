// const express = require("express");
// const Joi = require("joi");
// const bcrypt = require("bcrypt");
// const multer = require("multer");
// const generationsAI = require("../models/generationsAIContent.js");

import express from "express";
import Joi from "joi";
// import bcrypt from "bcrypt";
import multer from "multer";
import generationsai from "../models/generationsAIContent.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.array("files"), async (req, res) => {
  const schema = Joi.object({
    orderNumber: Joi.string().required(),
    date: Joi.string(),
    textArray: Joi.array(),
  });

  console.log("req.body:", req.body);

  try {
    const { error } = await schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // let user = await User.findOne({ name: req.body.Customer_name });
    const { orderNumber, date, textArray } = await req.body;
    console.log("req.body", req.body);
    const generationsAi = await new generationsai({
      orderNumber: orderNumber,
      date: date,
      data: textArray,
    }).save();

    await generationsAi.save();
    await res.status(200).json();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// (async () => {
//   try {
//

//     // Step 1: Extract text from the image using OCR
//     const worker = await createWorker();
//     // await worker.loadLanguage("eng");
//     // await worker.initialize("eng");
//     await worker.loadLanguage("tha");
//     await worker.initialize("tha");
//     // await worker.loadLanguage("deu");
//     // await worker.initialize("deu");
//     const { data } = await worker.recognize(imagePath);
//     const lines = data.lines || [];
//     const textArray = [];
//     const translateTextArray = [];
//     const projectId = "caramel-binder-386706";
//     const keyFilename = "../caramel-binder-386706-91b7feeeba2f.json";

//     for (let i = 0; i < lines.length; i++) {
//       const { bbox, text } = lines[i];
//       const x = bbox.x0;
//       const y = bbox.y0;
//       const width = bbox.x1 - bbox.x0;
//       const height = bbox.y1 - bbox.y0;
//       const z = { text: text, x: x, y: y, width: width, height: height };
//       textArray.push(z);
//     }

//     await worker.terminate();

//     // Step 2: Translate the text using @google-cloud/translate translation API

//     async function authenticateImplicitWithAdc() {
//       const translate = new Translate({ projectId, keyFilename });
//       for (let i = 0; i < textArray.length; i++) {
//         const { text } = textArray[i];
//         console.log("text:", text);
//         // const target = "th";
//         const target = "en";
//         // const target = "de";
//         const [translation] = await translate.translate(text, target);
//         // console.log(translation);
//         translateTextArray.push({
//           ...textArray[i],
//           translatedText: translation,
//         });
//       }
//     }

//     await authenticateImplicitWithAdc();

//     // Step 3: Overlay translated text onto the image
//     const image = await loadImage(imagePath);
//     const canvas = createCanvas(image.width, image.height);
//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(image, 0, 0);

//     // const fontSize = 25;
//     // const fontWeight= 500;
//     const textColor = "black";
//     const boxColor = "#ffff";
//     const padding = 10; // adjust this value as needed

//     for (let i = 0; i < translateTextArray.length; i++) {
//       const { translatedText, x, y, width, height } = translateTextArray[i];

//       // Measure the dimensions of the translated text
//       const textMetrics = ctx.measureText(translatedText);

//       const textWidth = textMetrics.width;
//       const textHeight =
//         textMetrics.actualBoundingBoxAscent +
//         textMetrics.actualBoundingBoxDescent;

//       // Set the position and size of the white box overlay
//       const boxX = x;
//       const boxY = y;
//       const fontSize = 18;
//       const boxWidth = textWidth;
//       const boxHeight = textHeight;

//       // Fill the white box overlay
//       ctx.fillStyle = boxColor;
//       ctx.fillRect(boxX, boxY, 2 * boxWidth, boxHeight);

//       // Draw the translated text on top of the white box
//       ctx.font = `${fontSize}px ${fontPath}`;
//       ctx.fillStyle = textColor;
//       ctx.fillText(translatedText, x, y);
//     }

//     const outputStream = fs.createWriteStream(outputImagePath);
//     const stream = canvas.createJPEGStream({ quality: 0.95 }); // Adjust the quality as needed

//     stream.pipe(outputStream);

//     outputStream.on("finish", () => {
//       console.log("Image with overlay saved:", outputImagePath);
//     });
//   } catch (error) {
//     console.error(error);
//   }
// })();

// const oldLanguage = "eng"
//   const oldLanguage ="tha"
//   const oldLanguage ="deu"
export default router;
