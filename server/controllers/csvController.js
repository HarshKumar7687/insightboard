const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const XLSX = require("xlsx");
const Dataset = require("../models/Dataset");

exports.uploadCSV = async (req, res) => {
  const ext = path.extname(req.file.originalname).toLowerCase();
  const results = [];

  if (ext === ".csv") {
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const dataset = new Dataset({
          name: req.file.originalname,
          data: results,
        });
        await dataset.save();
        fs.unlinkSync(req.file.path); // cleanup
        res.json(dataset);
      });
  } else if (ext === ".xlsx") {
    try {
      const workbook = XLSX.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const dataset = new Dataset({
        name: req.file.originalname,
        data: jsonData,
      });
      await dataset.save();
      fs.unlinkSync(req.file.path); // cleanup
      res.json(dataset);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to parse Excel file" });
    }
  } else {
    return res.status(400).json({ message: "Unsupported file type" });
  }
};

exports.getDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find();
    if (!Array.isArray(datasets) || datasets.length === 0) {
      return res.status(200).json([{ data: [] }]); // ✅ SAFE default
    }
    res.status(200).json(datasets);
  } catch (err) {
    console.error("Error fetching datasets:", err);
    res.status(500).json({ message: "Server error" });
  }
};
