// const express = require("express");
// const Joi = require("joi");
// const bcrypt = require("bcrypt");
// const multer = require("multer");
// const generationsAI = require("../models/generationsAIContent.js");

import express from "express";
import Joi from "joi";
// import bcrypt from "bcrypt";
import multer from "multer";
import { createWorker } from "tesseract.js";
import { createCanvas, loadImage } from "canvas";

import * as OpenAI from "openai";
// import translate from "google-translate-api-x";
// import { HttpProxyAgent } from "http-proxy-agent";
// import { translate } from "@vitalets/google-translate-api";

import generationsai from "../models/generationsAIContent.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.array("files"), async (req, res) => {
  const schema = Joi.object({
    orderNumber: Joi.string().required(),
    date: Joi.string(),
    textArray: Joi.array(),
  });

  try {
    const { error } = await schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { orderNumber, date, textArray } = await req.body;
    const outputData = [];

    for (const inputData of textArray) {
      const worker = await createWorker();

      const { data } = await worker.recognize(inputData.file);
      const lines = data.lines || [];
      const textArray = [];

      for (const textItem of lines) {
        const { bbox, text } = textItem;
        const x = bbox.x0;
        const y = bbox.y0 + bbox.height;
        const z = inputData.tranto;
        const e = inputData.tranfrom;
        textArray.push({ text, x, y, z, e });
      }

      await worker.terminate();

      const translateTextArray = await authenticateImplicitWithAdc(textArray);

      // const overlayedImage = await overlayTranslatedText(
      //   inputData.file,
      //   translateTextArray
      // );

      // outputData.push({
      //   file: overlayedImage,
      //   tranfrom: inputData.tranfrom,
      //   tranto: inputData.tranto,
      // });
    }

    // let user = await User.findOne({ name: req.body.Customer_name });

    // console.log("req.body", req.body);
    // const generationsAi = await new generationsai({
    //   orderNumber: orderNumber,
    //   date: date,
    //   data: textArray,
    // }).save();

    // await generationsAi.save();
    await res.status(200).json();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
// const languagePairs = {
//   English: {
//     Thai: "th",
//     German: "de",
//   },
//   Thai: {
//     English: "en",
//     German: "de",
//   },
//   German: {
//     Thai: "th",
//     English: "en",
//   },
// };

const languagePairs = {
  English: {
    English: "en",
  },
  Thai: {
    Thai: "th",
  },
  German: {
    German: "de",
  },
};
async function translateWithMyMemory(text, targetLanguage, sourceLanguage) {
  // const myMemoryApiUrl = "https://api.mymemory.translated.net/get";
  console.log("text:", text);

  try {
    // const langpair = languagePairs[sourceLanguage][targetLanguage];
    // const langpair1 = languagePairs[sourceLanguage][sourceLanguage];
    const langpair2 = languagePairs[targetLanguage][targetLanguage];
    // const { response } = await translate(text, { to: langpair });
    // const agent = new HttpProxyAgent("http://182.232.122.95:3001");
    const apikey = "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";
    const client = new OpenAI({ apiKey: apikey });

    const response = await client.translate({
      text: text,
      target_language: langpair2,
    });

    const translatedText = response.data.translations[0].text;
    console.log("translateTextArray:", translatedText);
    // return translatedText;
    // const translation = await translate(text, {
    //   from: langpair1,
    //   to: langpair2,
    //   autoCorrect: false,
    // });
    // const { response } = await translate(text, {
    //   to: langpair,
    //   fetchOptions: { agent },
    // });

    // const response = await axios.get(myMemoryApiUrl, {
    //   params: {
    //     q: text,
    //     langpair,
    //   },
    // });

    // const translatedText = response.data.responseData.translatedText;
    // const translatedText = translation;
    // console.log("translateTextArray:", translatedText);

    return translatedText;
  } catch (error) {
    console.error("Translation Error:", error);
    throw error;
  }
}

async function authenticateImplicitWithAdc(textArray) {
  const translateTextArray = [];

  for (let i = 0; i < textArray.length; i++) {
    const { text, z, e } = textArray[i];

    const translation = await translateWithMyMemory(text, z, e);
    translateTextArray.push({
      ...textArray[i],
      translatedText: translation,
    });
  }
  // console.log("translateTextArray:", translateTextArray);
  return translateTextArray;
}

async function overlayTranslatedText(imagePath, translateTextArray) {
  const image = await loadImage(imagePath);
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(image, 0, 0);

  const textColor = "#FFFFFE";
  const boxColor = "#FF5733";
  const padding = 10;

  for (let i = 0; i < translateTextArray.length; i++) {
    const { translatedText, x, y } = translateTextArray[i];

    const textMetrics = ctx.measureText(translatedText);
    const textWidth = textMetrics.width;
    const textHeight =
      textMetrics.actualBoundingBoxAscent +
      textMetrics.actualBoundingBoxDescent;

    const boxX = x;
    const boxY = y - padding;
    const fontSize = 18;
    const boxWidth = textWidth + 2 * padding;
    const boxHeight = textHeight;

    ctx.fillStyle = boxColor;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = textColor;
    ctx.fillText(translatedText, x, y);
  }
  // console.log("Font settings:", ctx.fillStyle);
  // console.log("translateTextArray:", translateTextArray);
  // console.log("Canvas dimensions:", canvas.width, canvas.height);
  // console.log("Image dimensions:", image.width, image.height);

  console.log("canvas:", canvas.toDataURL("image/jpeg", 0.95));
  return canvas.toDataURL("image/jpeg", 0.95);
}

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
