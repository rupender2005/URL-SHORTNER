const express = require("express");
const crypto = require("crypto");
const Url = require("../models/Url");

const router = express.Router();

function generateShortCode() {
  return crypto.randomBytes(4).toString("hex").slice(0, 6);
}

// POST /shorten
router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        message: "URL is required",
      });
    }

    const shortCode = generateShortCode();

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
    });

    res.status(201).json({
      shortCode: newUrl.shortCode,
      clicks: newUrl.clicks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// GET /:code
router.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({
      shortCode: req.params.code,
    });

    if (!url) {
      return res.status(404).send("URL not found");
    }

    url.clicks += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// GET /stats/:code
router.get("/stats/:code", async (req, res) => {
  try {
    const url = await Url.findOne({
      shortCode: req.params.code,
    });

    if (!url) {
      return res.status(404).json({
        message: "URL not found",
      });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
