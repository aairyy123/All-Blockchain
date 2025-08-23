const express = require("express");
const multer = require("multer");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
require("dotenv").config(); // Make sure env is loaded

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file || !req.body.title) {
      return res.status(400).json({ error: "File and title are required" });
    }

    console.log("API KEY:", process.env.PINATA_API_KEY);
    console.log("API SECRET:", process.env.PINATA_API_SECRET);

    const fileStream = fs.createReadStream(req.file.path);
    const formData = new FormData();
    formData.append("file", fileStream);
    formData.append("pinataMetadata", JSON.stringify({ name: req.body.title }));
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 1 }));

    const result = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
      maxBodyLength: "Infinity",
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_API_SECRET,
      },
    });

    fs.unlinkSync(req.file.path);
    res.json({ cid: result.data.IpfsHash });

  } catch (err) {
    console.error("Pinata upload error:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
