import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExoplanetOrbits from "../components/ExoplanetOrbits3D";
import "./ExoplanetLanding.css";

const defaultData = [
  {
    pl_name: "11 Com b",
    pl_orbsmax: 1.29,
    pl_orbeccen: 0.231,
    pl_orbincl: 15,
    pl_temp: 500,
    pl_mass: 1.5,
  },
  {
    pl_name: "11 UMi b",
    pl_orbsmax: 1.53,
    pl_orbeccen: 0.08,
    pl_orbincl: 5,
    pl_temp: 300,
    pl_mass: 0.9,
  },
  {
    pl_name: "14 And b",
    pl_orbsmax: 0.83,
    pl_orbeccen: 0.0,
    pl_orbincl: 45,
    pl_temp: 700,
    pl_mass: 2.1,
  },
  {
    pl_name: "14 Her b",
    pl_orbsmax: 2.93,
    pl_orbeccen: 0.37,
    pl_orbincl: 10,
    pl_temp: 250,
    pl_mass: 3.0,
  },
  {
    pl_name: "16 Cyg B b",
    pl_orbsmax: 1.66,
    pl_orbeccen: 0.68,
    pl_orbincl: 30,
    pl_temp: 450,
    pl_mass: 1.8,
  },
  {
    pl_name: "17 Sco b",
    pl_orbsmax: 1.45,
    pl_orbeccen: 0.06,
    pl_orbincl: 8,
    pl_temp: 350,
    pl_mass: 1.3,
  },
  {
    pl_name: "18 Del b",
    pl_orbsmax: 2.476,
    pl_orbeccen: 0.024,
    pl_orbincl: 25,
    pl_temp: 550,
    pl_mass: 2.5,
  },
  {
    pl_name: "24 Sex b",
    pl_orbsmax: 1.333,
    pl_orbeccen: 0.09,
    pl_orbincl: 12,
    pl_temp: 480,
    pl_mass: 1.1,
  },
  {
    pl_name: "24 Sex c",
    pl_orbsmax: 2.08,
    pl_orbeccen: 0.29,
    pl_orbincl: 40,
    pl_temp: 600,
    pl_mass: 2.0,
  },
];

function ExoplanetLanding() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    pl_orbsmax: [0, 100],
    pl_orbeccen: [0, 1],
    pl_temp: [0, 10000],
    pl_mass: [0, 100],
  });
  const [data, setData] = useState(defaultData);
  const [filteredData, setFilteredData] = useState(defaultData);

  useEffect(() => {
    setFilteredData(
      data.filter(
        (planet) =>
          planet.pl_orbsmax >= filters.pl_orbsmax[0] &&
          planet.pl_orbsmax <= filters.pl_orbsmax[1] &&
          planet.pl_orbeccen >= filters.pl_orbeccen[0] &&
          planet.pl_orbeccen <= filters.pl_orbeccen[1] &&
          planet.pl_temp >= filters.pl_temp[0] &&
          planet.pl_temp <= filters.pl_temp[1] &&
          planet.pl_mass >= filters.pl_mass[0] &&
          planet.pl_mass <= filters.pl_mass[1]
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
        <button className="home-button" onClick={() => navigate("/")}>
          Home
        </button>
        <input
          type="text"
          className="search-input"
          placeholder="Search planets..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="filter-panel">
        {Object.keys(filters).map((key) => (
          <div key={key} className="filter-group">
            <label>{key.replace("pl_", "").toUpperCase()}</label>
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
          <ExoplanetOrbits planets={filteredData} />
        </div>
      </div>
    </div>
  );
}

export default ExoplanetLanding;
