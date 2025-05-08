import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdaptiveGraph from "../components/AdaptiveGraph";
import AsteroidOrbits3D from "../components/AsteroidOrbits3D";
import "./ExoplanetLanding.css"; // reused

const AsteroidLanding = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [inclinationMode, setInclinationMode] = useState("same");

  const [filters, setFilters] = useState({
    eccentricity: [0, 1],
    semi_major_axis: [0, 5],
  });

  const [xAxis, setXAxis] = useState("eccentricity");
  const [yAxis, setYAxis] = useState("semi_major_axis");

  useEffect(() => {
    const fetchAsteroids = async () => {
      try {
        const res = await fetch("http://localhost:3001/asteroids/?limit=20");
        let asteroids = await res.json();

        asteroids = asteroids.map((a, idx) => {
          const base = {
            ...a,
            eccentricity: Number(a.eccentricity) || 0,
            semi_major_axis: Number(a.semi_major_axis) || 1,
            diameter: Number(a.diameter) || 1,
            inclination: Number(a.inclination) || 0,
          };
          console.log(asteroids);
          return base;
        });

        setData(asteroids);
        setFilteredData(asteroids);
      } catch (err) {
        console.error("Failed to fetch asteroid data:", err);
      }
    };

    fetchAsteroids();
  }, [inclinationMode]);

  useEffect(() => {
    setFilteredData(
      data.filter(
        (a) =>
          a.eccentricity >= filters.eccentricity[0] &&
          a.eccentricity <= filters.eccentricity[1] &&
          a.semi_major_axis >= filters.semi_major_axis[0] &&
          a.semi_major_axis <= filters.semi_major_axis[1]
      )
    );
  }, [filters, data]);

  const handleFilterChange = (key, index, value) => {
    setFilters((prev) => {
      const updated = { ...prev };
      updated[key][index] = Number(value);
      return updated;
    });
  };

  return (
    <div className="exoplanet-landing">
      <div className="top-bar">
        <div className="top-left">
          <button className="home-button" onClick={() => navigate("/")}>
            Home
          </button>
        </div>

        <div className="top-center">
          <h2 style={{ color: "white" }}>Asteroid Field</h2>
        </div>

        <div className="top-right">
          <select
            className="search-input"
            value={inclinationMode}
            onChange={(e) => setInclinationMode(e.target.value)}
          >
            <option value="same">Same Inclination</option>
            <option value="even">Equally Spaced</option>
            <option value="random">Random Inclination</option>
          </select>
        </div>
      </div>

      <div className="filter-panel">
        {Object.entries(filters).map(([key, range]) => (
          <div key={key} className="filter-group">
            <label>
              {
                {
                  eccentricity: "Eccentricity",
                  semi_major_axis: "Semi-Major Axis (AU)",
                }[key]
              }
            </label>
            <input
              type="number"
              value={range[0]}
              onChange={(e) => handleFilterChange(key, 0, e.target.value)}
            />
            -
            <input
              type="number"
              value={range[1]}
              onChange={(e) => handleFilterChange(key, 1, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="exoplanet-wrapper">
        <div className="exoplanet-visual">
          <AsteroidOrbits3D asteroids={filteredData} />
        </div>
      </div>
    </div>
  );
};

export default AsteroidLanding;
