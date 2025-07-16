import React from "react";
import Navbar from "../Navbar";

const About = () => {
  return (
    <>
     <Navbar />
    <div style={styles.container}>
      <h1 style={styles.heading}>About Us</h1>
      <p style={styles.text}>
        We are <strong>Team 22</strong>, building this project as part of an internship for <strong>Tata Motors</strong>.
      </p>

      <h2 style={styles.subheading}>Our Team</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>College</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>Harsh Kumar</td>
            <td style={styles.td}>Siksha O Anusandhan</td>
          </tr>
          <tr>
            <td style={styles.td}>Ansh Chauhan</td>
            <td style={styles.td}>Siksha O Anusandhan</td>
          </tr>
          <tr>
             <td style={styles.td}>Harsh Kumar</td>
            <td style={styles.td}>Siksha O Anusandhan</td>
          </tr>
          <tr>
            <td style={styles.td}>Souvik Ghosh</td>
            <td style={styles.td}>Arka Jain University</td>
          </tr>
          <tr>
            <td style={styles.td}>Aaradhya Prasad</td>
            <td style={styles.td}>Siksha O Anusandhan</td>
          </tr>
          <tr>
            <td style={styles.td}>Bishakha Sharma</td>
            <td style={styles.td}>Haldia Institute of Technology</td>
          </tr>
          <tr>
            <td style={styles.td}>Anikesh</td>
            <td style={styles.td}>NIT Jamshedpur</td>
          </tr>
          <tr>
            <td style={styles.td}>Ayush Yadav</td>
            <td style={styles.td}>Kalinga University</td>
          </tr>
        </tbody>
      </table>
    </div>
    </>
  );
};

const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "900px",
    margin: "0 auto",
    color: "#f8fafc",
    fontFamily: "'Segoe UI', sans-serif"
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    borderBottom: "2px solid #38bdf8",
    paddingBottom: "10px"
  },
  subheading: {
    fontSize: "1.5rem",
    marginTop: "30px",
    marginBottom: "16px",
    color: "#38bdf8"
  },
  text: {
    fontSize: "1.2rem",
    lineHeight: "1.7",
    marginBottom: "20px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#1e293b",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)"
  },
  th: {
    padding: "12px 16px",
    borderBottom: "1px solid #334155",
    backgroundColor: "#334155",
    textAlign: "left",
    color: "#f8fafc",
    fontWeight: "600"
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #334155",
    color: "#e2e8f0"
  }
};

export default About;
