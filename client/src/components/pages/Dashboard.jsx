import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Navbar from "../Navbar";
import ChartDisplay from "../ChartDisplay";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [file, setFile] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/csv`)
      .then((res) => {
        const latest = Array.isArray(res.data)
          ? res.data[res.data.length - 1]?.data || []
          : [];

        const cleaned = latest.filter(
          (row) =>
            row &&
            typeof row === "object" &&
            !Array.isArray(row) &&
            Object.keys(row).length >= 2
        );

        setData(cleaned);
        setFilteredData(cleaned);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data", err);
      });
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/csv/upload`,
        formData
      );
      alert("CSV uploaded successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload CSV.");
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setFilteredData(data);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = data.filter((row) =>
        Object.values(row).some((val) =>
          val?.toString().toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredData(filtered);
    }
  }, [search, data]);

  const getSummary = () => {
    const sample = filteredData.find(
      (row) =>
        row &&
        typeof row === "object" &&
        Object.keys(row).length >= 2
    );

    if (!sample) return { total: 0, average: 0, key: "" };

    const keys = Object.keys(sample);
    const valueKey = keys[1];

    const values = filteredData
      .map((item) => parseFloat(item?.[valueKey]))
      .filter(Number.isFinite);

    const total = values.reduce((acc, curr) => acc + curr, 0);
    const average = values.length ? total / values.length : 0;

    return {
      total: total.toFixed(2),
      average: average.toFixed(2),
      key: valueKey,
    };
  };

  const exportPDF = async () => {
    const doc = new jsPDF("p", "pt", "a4");

    const addElementToPDF = async (selector, yOffset = 40) => {
      const element = document.querySelector(selector);
      if (!element) return yOffset;

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdfWidth = doc.internal.pageSize.getWidth() - 80;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      doc.addImage(imgData, "PNG", 40, yOffset, pdfWidth, imgHeight);
      return yOffset + imgHeight + 30;
    };

    let y = 40;
    y = await addElementToPDF(".summary-panel", y);
    y = await addElementToPDF(".data-table", y);
    y = await addElementToPDF(".chart-container", y);

    doc.save("insightboard_dashboard.pdf");
  };

  try {
    const headers =
      Array.isArray(filteredData) &&
      filteredData.length > 0 &&
      typeof filteredData[0] === "object"
        ? Object.keys(filteredData[0])
        : [];

    const { total, average, key } = getSummary();

    return (
      <>
        <Navbar />
        <div className="dashboard-wrapper">
          <div className="csv-upload-row">
            <div className="csv-upload-container">
              <input
                type="file"
                accept=".csv, .xlsx, .xls, .xlsm, .xlsb"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button onClick={handleUpload}>Upload CSV</button>
            </div>

            <div className="summary-panel">
              <h3>Summary</h3>
              {key ? (
                <>
                  <p>
                    <strong>Total {key}:</strong> {total}
                  </p>
                  <p>
                    <strong>Average {key}:</strong> {average}
                  </p>
                </>
              ) : (
                <p>No numeric column available for summary.</p>
              )}
            </div>
          </div>

          {filteredData.length > 0 ? (
            <>
              <div className="filter-bar">
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Search in data..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <h2>Data Table</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    {headers.map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, idx) => (
                    <tr key={idx}>
                      {headers.map((h) => (
                        <td key={h}>{row[h]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2>Chart</h2>
              <div className="chart-container">
                <ChartDisplay />
              </div>

              <div className="export-buttons">
                <button onClick={exportPDF}>Export as PDF</button>
              </div>
            </>
          ) : (
            <p className="no-data-msg">
              No valid data found. Please upload a clean CSV file with at least 2 columns.
            </p>
          )}
        </div>
      </>
    );
  } catch (err) {
    console.error("❌ Rendering failed:", err);
    return <p style={{ color: "red", padding: "2rem" }}>Something went wrong while rendering the dashboard.</p>;
  }
}

export default Dashboard;
