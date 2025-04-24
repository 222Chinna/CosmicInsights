import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AsteroidOrbits3D from "../components/AsteroidOrbits3D";
import AdaptiveGraph from "../components/AdaptiveGraph";
import "./ExoplanetDetailsPage.css";

const defaultAsteroid = {
  name: "Asteroid 1",
  semi_major_axis: 2.213,
  eccentricity: 0.423,
  inclination: 30.06,
  perihelion_distance: 1.276,
  aphelion_distance: 3.151,
  orbital_period: 1202.7,
};

const asteroidData = [
  {
    name: "Asteroid 1",
    semi_major_axis: 2.213,
    eccentricity: 0.423,
    inclination: 30.06,
    perihelion_distance: 1.276,
    aphelion_distance: 3.151,
    orbital_period: 1202.7,
  },
  {
    name: "Asteroid 2",
    semi_major_axis: 0.809,
    eccentricity: 0.536,
    inclination: 28.18,
    perihelion_distance: 0.375,
    aphelion_distance: 1.243,
    orbital_period: 265.7,
  },
  {
    name: "Asteroid 3",
    semi_major_axis: 1.081,
    eccentricity: 0.298,
    inclination: 11.02,
    perihelion_distance: 0.759,
    aphelion_distance: 1.403,
    orbital_period: 410.4,
  },
];

const AsteroidDetailsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [xAxis, setXAxis] = useState("semi_major_axis");
  const [yAxis, setYAxis] = useState("eccentricity");
  const asteroid = defaultAsteroid;

  return (
    <div className="exoplanet-page">
      <div className="header">
        <h1 className="star-name">{asteroid.name}</h1>
        <div className="button-group">
          <button onClick={() => navigate(-1)}>Back</button>
          <button onClick={() => navigate("/")}>Home</button>
        </div>
      </div>

      <div className="details-grid">
        <div className="planet-info">
          <p>Orbital Period: {asteroid.orbital_period} days</p>
          <p>Semi-Major Axis: {asteroid.semi_major_axis} AU</p>
          <p>Eccentricity: {asteroid.eccentricity}</p>
          <p>Inclination: {asteroid.inclination}°</p>
          <p>Perihelion Distance: {asteroid.perihelion_distance} AU</p>
          <p>Aphelion Distance: {asteroid.aphelion_distance} AU</p>
        </div>

        <div className="orbit-visual-wrapper">
          <div className="orbit-visual">
            <AsteroidOrbits3D asteroids={[asteroid]} />
          </div>
        </div>

        <div className="similar-planets">
          <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem" }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              fontSize: "1.1rem",
              fontWeight: "500",
              minWidth: "180px",
            }}>
              <div>
                <label htmlFor="y-axis" style={{ display: "block", marginBottom: "0.5rem" }}>Y:</label>
                <select
                  id="y-axis"
                  onChange={(e) => setYAxis(e.target.value)}
                  value={yAxis}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "1rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="eccentricity">Eccentricity</option>
                  <option value="inclination">Inclination</option>
                  <option value="perihelion_distance">Perihelion Distance</option>
                  <option value="aphelion_distance">Aphelion Distance</option>
                </select>
              </div>
            </div>

            <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ flexGrow: 1 }}>
                <AdaptiveGraph data={asteroidData} xKey={xAxis} yKey={yAxis} />
              </div>
              <div style={{
                marginTop: "1rem",
                alignSelf: "center",
                fontSize: "1.1rem",
                fontWeight: "500",
              }}>
                <label htmlFor="x-axis" style={{ marginRight: "0.5rem" }}>X:</label>
                <select
                  id="x-axis"
                  onChange={(e) => setXAxis(e.target.value)}
                  value={xAxis}
                  style={{
                    padding: "0.5rem",
                    fontSize: "1rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="name">Asteroid Name</option>
                  <option value="semi_major_axis">Semi-Major Axis</option>
                  <option value="eccentricity">Eccentricity</option>
                  <option value="inclination">Inclination</option>
                  <option value="perihelion_distance">Perihelion Distance</option>
                  <option value="aphelion_distance">Aphelion Distance</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Search for an asteroid..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AsteroidDetailsPage;
