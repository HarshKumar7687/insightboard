import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./ChartDisplay.css";

ChartJS.register(
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

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/csv`)
      .then((res) => {
        const latest = res.data[res.data.length - 1]?.data || [];
        if (!Array.isArray(latest) || latest.length === 0) {
          setChartData(null);
          return;
        }

        const validRow = latest.find(
          (row) =>
            row &&
            typeof row === "object" &&
            Object.keys(row).length >= 2
        );

        if (!validRow) {
          setChartData(null);
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
            label !== undefined &&
            value !== undefined &&
            !isNaN(value)
          ) {
            labels.push(label);
            values.push(value);
          }
        }

        if (labels.length === 0 || values.length === 0) {
          setChartData(null);
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
        console.error("Chart data fetch failed:", err);
        setChartData(null);
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
        text: valueKey ? `Bar + Line Chart for ${valueKey}` : "",
        color: "#ffffff",
        font: { size: 18 },
      },
    },
  };

  try {
    return (
      <div className="chart-wrapper">
        <div className="chart-card">
          {chartData ? (
            <div style={{ height: "400px", overflowX: "auto" }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p className="loading">No chart data available.</p>
          )}
        </div>
      </div>
    );
  } catch (err) {
    console.error("Chart render error:", err);
    return (
      <p className="loading" style={{ color: "red" }}>
        Chart rendering failed. Check data format.
      </p>
    );
  }
};

export default ChartDisplay;
