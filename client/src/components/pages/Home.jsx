import React from "react";
import "./Home.css";
import Navbar from "../Navbar";
import { Link } from "react-router-dom";

const Home = () => {
  return (

    <div className="home-container">
      <Navbar />
      <video className="background-video" autoPlay muted loop playsInline>
        <source src="https://cdn.pixabay.com/video/2021/03/08/67358-521707474_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="overlay"></div>

      <div className="home-content">
        <h1 className="home-heading">Welcome to InsightBoard</h1>
        <p className="home-subtext">Transform CSV data into interactive dashboards with ease.</p>
        <Link to="/dashboard" className="home-button">Get Started</Link>
      </div>
    </div>

  );
};

export default Home;
