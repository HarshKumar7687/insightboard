import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DataTable.css";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/csv`)
      .then(res => {
        const latestData = res.data[res.data.length - 1]?.data || [];
        setData(latestData);
        setFilteredData(latestData);
      })
      .catch((err) => console.error("Failed to fetch CSV data", err));
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredData(data);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = data.filter(row =>
        Object.values(row).some(val =>
          val?.toString().toLowerCase().includes(lowerSearch)
        )
      );
      setFilteredData(filtered);
    }
  }, [search, data]);

  if (!filteredData || filteredData.length === 0) {
    return <p className="no-data-msg">No data available to display.</p>;
  }

  const headers = Object.keys(filteredData[0]);

  return (
    <div className="table-container">
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input"
        />
      </div>

      <table className="data-table">
        <thead>
          <tr>
            {headers.map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, idx) => (
            <tr key={idx}>
              {headers.map(h => (
                <td key={h}>{row[h]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
