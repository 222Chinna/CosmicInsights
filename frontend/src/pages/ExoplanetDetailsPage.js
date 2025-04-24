import React from "react";
import ExoplanetOrbits3D from "../components/ExoplanetOrbits3D";
import "../App.css";

const ExoplanetDetailsPage = () => {
  return (
    <div className="exoplanet-page">
      <div className="header">
        <h1>11 Comae Berenices b</h1>
        <div className="button-group">
          <button className="home-button">Back</button>
          <button className="home-button">Home</button>
        </div>
      </div>

      <div className="details-grid">
        <div className="planet-info">
          <p>Discovery Year: 2007</p>
          <p>Discovery Method: Radial Velocity</p>
          <p>Temp: 803 K</p>
          <p>Mass: 15.46 Jupiters</p>
          <p>Radius: 1.09 Jupiters</p>
        </div>

        <div className="orbit-visual">
          <ExoplanetOrbits3D />
        </div>

        <div className="similar-planets">
          <h3>Similar Planets</h3>
          <div className="scatter-plot-placeholder">
            {/* Replace this with a chart later */}
            <p>[Scatter Plot Here]</p>
          </div>
        </div>

        <div className="search-box">
          <p>Search</p>
          <ul>
            <li>55 Cancri e</li>
            <li>Gliese 581g</li>
            <li>Kepler-22b</li>
            <li>Kepler-452b</li>
            <li>Proxima Centauri</li>
            <li>GJ 357 d</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExoplanetDetailsPage;
