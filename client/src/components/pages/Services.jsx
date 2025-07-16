import React from "react";
import Navbar from "../Navbar";
import "./Services.css";

const services = [
  {
    title: "Upload CSV Files",
    description: "Upload your data securely and easily using our custom file uploader.",
    emoji: "📤",
  },
  {
    title: "Data Table",
    description: "View your uploaded data in a well-formatted interactive table.",
    emoji: "📊",
  },
  {
    title: "Interactive Graphs",
    description: "Visualize CSV data using dynamic bar charts for quick insights.",
    emoji: "📈",
  },
  {
    title: "Grouped Insights",
    description: "Automatically compute and display total and average values.",
    emoji: "🧮",
  },
  {
    title: "Export as PDF",
    description: "Download a neat PDF of your table, summary, and graph section.",
    emoji: "📑",
  },
  {
    title: "Filter Data",
    description: "Filters Required Data from complete data to ease work.",
    emoji: "🔎",
  },
  
];

const Services = () => {
  return (
    <>
      <Navbar />
      <div className="services-container">
        <h1 className="services-heading">Our Services</h1>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.emoji}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Services;
