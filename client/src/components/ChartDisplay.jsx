import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  LineController,
  BarController,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./ChartDisplay.css";

// ✅ Register all required Chart.js elements and controllers
ChartJS.register(
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const ChartDisplay = () => {
  const [chartData, setChartData] = useState(null);
  const [valueKey, setValueKey] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/csv`)
      .then((res) => {
        const latest = res.data?.[res.data.length - 1]?.data || [];

        const validRow = latest.find(
          (row) =>
            row &&
            typeof row === "object" &&
            Object.keys(row).length >= 2
        );

        if (!validRow) {
          setError("No valid data found for chart.");
          return;
        }

        const keys = Object.keys(validRow);
        const labelKey = keys[0];
        const valueKey = keys[1];
        setValueKey(valueKey);

        const labels = [];
        const values = [];

        for (const row of latest) {
          const label = row[labelKey];
          const value = parseFloat(row[valueKey]);

          if (
            typeof label === "string" &&
            !isNaN(value) &&
            value !== null &&
            value !== ""
          ) {
            labels.push(label);
            values.push(value);
          }
        }

        if (labels.length === 0 || values.length === 0) {
          setError("Chart data is empty or invalid.");
          return;
        }

        setChartData({
          labels,
          datasets: [
            {
              label: `${valueKey} (Bar)`,
              data: values,
              backgroundColor: "#38bdf8",
              borderRadius: 4,
              borderSkipped: false,
              yAxisID: "y",
              type: "bar",
            },
            {
              label: `${valueKey} (Line)`,
              data: values,
              borderColor: "#f87171",
              backgroundColor: "rgba(248, 113, 113, 0.4)",
              tension: 0.4,
              fill: true,
              yAxisID: "y",
              type: "line",
            },
          ],
        });
      })
      .catch((err) => {
        console.error("❌ Chart fetch failed:", err);
        setError("Failed to load chart data.");
      });
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
          font: { size: 10 },
          maxRotation: 90,
          minRotation: 45,
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
      y: {
        ticks: {
          color: "#ffffff",
          font: { size: 10 },
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: valueKey ? `Bar + Line Chart for ${valueKey}` : "Chart",
        color: "#ffffff",
        font: { size: 18 },
      },
    },
  };

  try {
    return (
      <div className="chart-wrapper">
        <div className="chart-card">
          {error ? (
            <p className="loading" style={{ color: "red" }}>{error}</p>
          ) : chartData ? (
            <div style={{ height: "400px", overflowX: "auto" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p className="loading">Loading chart...</p>
          )}
        </div>
      </div>
    );
  } catch (err) {
    console.error("❌ Chart render error:", err);
    return (
      <p className="loading" style={{ color: "red" }}>
        Chart failed to render.
      </p>
    );
  }
};

export default ChartDisplay;
