const mongoose = require("mongoose");

const DatasetSchema = new mongoose.Schema({
  name: String,
  data: [Object],
});

module.exports = mongoose.model("Dataset", DatasetSchema);
