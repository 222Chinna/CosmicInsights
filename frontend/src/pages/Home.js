import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div>
      <div className="title">Cosmic Insights</div>
      <div className="button-container">
        <Link to="/solar" className="nav-button">
          <img src="/images/solar.png" alt="Solar" />
          <span>Solar</span>
        </Link>
        <Link to="/asteroid" className="nav-button">
          <img src="/images/asteroid.png" alt="Asteroids" />
          <span>Asteroids</span>
        </Link>
        <Link to="/exoplanet" className="nav-button">
          <img src="/images/exoplanet.png" alt="Exoplanets" />
          <span>Exoplanets</span>
        </Link>
      </div>
    </div>
  );
}

export default Home;
