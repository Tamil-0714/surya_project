import express from "express";
import  fetchReiviews  from "../fucntioons/functions.js";  
const reviewRoute = express.Router();

reviewRoute.post("/", async (req, res) => {
  try {
    const link = req.body?.link;

    if (!link) {
      return res.status(300).json({ message: "Invalid link" });
    }
    const { reviews, productName } = await fetchReiviews(link);
    res.status(200).json({ reviews: reviews, productName: productName });
  } catch (error) {
    console.error("from here onl",error);
  }
});

export {reviewRoute} ;
