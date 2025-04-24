import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Home() {
  return (
    <div>
      <div className="title">Cosmic Insights</div>
      <div className="button-container">
        <Link to="/star" className="nav-button">
          <img src="/star.jpg" alt="Star" />
          <span>Solar</span>
        </Link>
        <Link to="/asteroid" className="nav-button">
          <img src="/asteroid.jpg" alt="Asteroids" />
          <span>Asteroids</span>
        </Link>
        <Link to="/exoplanet" className="nav-button">
          <img src="/exoplanet.jpg" alt="Exoplanets" />
          <span>Exoplanets</span>
        </Link>
      </div>
    </div>
  );
}

export default Home;
