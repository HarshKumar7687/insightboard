const express = require("express");
const multer = require("multer");
const { uploadCSV, getDatasets } = require("../controllers/csvController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadCSV);
router.get("/", getDatasets);

module.exports = router;
