import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AsteroidOrbits3D from "../components/AsteroidOrbits3D";
import "./ExoplanetLanding.css";

const defaultAsteroidData = [
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

function AsteroidLanding() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    semi_major_axis: [0, 3],
    eccentricity: [0, 1],
    inclination: [0, 90],
  });
  const [data, setData] = useState(defaultAsteroidData);
  const [filteredData, setFilteredData] = useState(defaultAsteroidData);

  useEffect(() => {
    setFilteredData(
      data.filter(
        (a) =>
          a.semi_major_axis >= filters.semi_major_axis[0] &&
          a.semi_major_axis <= filters.semi_major_axis[1] &&
          a.eccentricity >= filters.eccentricity[0] &&
          a.eccentricity <= filters.eccentricity[1] &&
          a.inclination >= filters.inclination[0] &&
          a.inclination <= filters.inclination[1]
      )
    );
  }, [filters, data]);

  const handleFilterChange = (key, index, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      newFilters[key][index] = Number(value);
      return newFilters;
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    console.log("Searching:", value);
  };

  return (
    <div className="exoplanet-landing">
      <div className="top-bar">
        <button className="home-button" onClick={() => navigate("/")}>Home</button>
        <input
          type="text"
          className="search-input"
          placeholder="Search asteroids..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="filter-panel">
        {Object.keys(filters).map((key) => (
          <div key={key} className="filter-group">
            <label>{key.replace(/_/g, " ").toUpperCase()}</label>
            <input
              type="number"
              value={filters[key][0]}
              onChange={(e) => handleFilterChange(key, 0, e.target.value)}
            />
            -
            <input
              type="number"
              value={filters[key][1]}
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
}

export default AsteroidLanding;
