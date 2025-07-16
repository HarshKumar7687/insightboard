import React, { useState } from "react";
import axios from "axios";
import "./CSVUploader.css";

const CSVUploader = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV or Excel file first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/csv/upload`, formData);
      alert("Uploaded Successfully!");
      window.location.reload();
    } catch (error) {
      alert("Upload failed. Please try again.");
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="csv-uploader-container">
      <div className="csv-uploader-box">
        <h2 className="csv-title">Upload CSV or Excel File</h2>
        <input
          type="file"
          accept=".csv, .xlsx, .xls, .xlsm, .xlsb, text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={(e) => setFile(e.target.files[0])}
          className="csv-input"
        />
        <button onClick={handleUpload} className="csv-upload-button">
          Upload
        </button>
      </div>
    </div>
  );
};

export default CSVUploader;
