const express = require("express");
const { fetchReiviews } = require("../fucntioons/functions");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const link = req.body?.link;

    if (!link) {
      return res.status(300).json({ message: "Invalid link" });
    }
    const { reviews, productName } = await fetchReiviews(link);
    res.status(200).json({ reviews: reviews, productName: productName });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
