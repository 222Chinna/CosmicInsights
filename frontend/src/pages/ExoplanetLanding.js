import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import ExoplanetOrbits from "../components/ExoplanetOrbits3D";
import "./ExoplanetLanding.css";

let defaultData = [
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
  const [solarSystems, setSolarSystems] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [inclinationMode, setInclinationMode] = useState("same");

  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    pl_orbsmax: [0, 100],
    pl_orbeccen: [0, 1],
    pl_temp: [0, 10000],
    pl_mass: [0, 100],
  });
  const [data, setData] = useState(defaultData);
  const [filteredData, setFilteredData] = useState(defaultData);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const res = await fetch("http://localhost:3001/exoplanets?limit=1000");
        const data = await res.json();
        const planets = data.map((obj) => ({
          ...obj,
          pl_orbincl: 15,
          pl_mass: obj.st_mass ?? 1.0,
        }));
        setData(planets);
        setFilteredData(planets);
      } catch (err) {
        console.error("Error fetching default exoplanets:", err);
      }
    };
    loadInitialData();
  }, []);

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

  useEffect(() => {
    const fetchSolarSystems = async () => {
      try {
        const res = await fetch(
          "http://localhost:3001/solarsystems"
        );
        const systems = await res.json();
        setSolarSystems(systems.map((s) => s.hostname));
      } catch (err) {
        console.error("Error fetching systems:", err);
      }
    };
    fetchSolarSystems();
  }, []);

  useEffect(() => {
    const fetchPlanets = async () => {
      if (!selectedSystem) return;
      try {
        const res = await fetch(
          `http://localhost:3001/exoplanets?hostname=${selectedSystem}`
        );
        let planets = await res.json();

        planets = planets.map((p, idx) => {
          p.pl_orbincl =
            inclinationMode === "same"
              ? 15
              : inclinationMode === "even"
              ? (360 / planets.length) * idx
              : Math.floor(Math.random() * 360);
          p.pl_mass = p.st_mass ?? 1.0;
          // XXX: What's this?
          p.pl_temp = 300 + Math.floor(Math.random() * 300);
          return p;
        });

        setData(planets);
        setFilteredData(planets);
        console.log("Selected system:", selectedSystem);
        console.log("Fetched planets:", planets);
        console.log(filteredData);
      } catch (err) {
        console.error("Error fetching exoplanets:", err);
      }
    };
    fetchPlanets();
  }, [selectedSystem, inclinationMode]);

  const handleFilterChange = (key, index, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      newFilters[key][index] = Number(value);
      return newFilters;
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
          <div style={{ width: "250px" }}>
            <Select
              options={solarSystems.map((sys) => ({ label: sys, value: sys }))}
              onChange={(selected) => setSelectedSystem(selected.value)}
              placeholder="Select a solar system..."
              isSearchable
              styles={{
                menuList: (base) => ({ ...base, maxHeight: 200 }),
                control: (base) => ({
                  ...base,
                  backgroundColor: "white",
                  color: "black",
                }),
                singleValue: (base) => ({ ...base, color: "black" }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#ddd" : "white",
                  color: "black",
                }),
              }}
            />
          </div>

          <select
            className="search-input"
            value={inclinationMode}
            onChange={(e) => setInclinationMode(e.target.value)}
          >
            <option value="same">Same Inclination</option>
            <option value="even">Equally Spaced</option>
            <option value="random">Random</option>
          </select>
        </div>
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
          <ExoplanetOrbits
            key={selectedSystem + inclinationMode}
            planets={filteredData}
          />
        </div>
      </div>
    </div>
  );
}

export default ExoplanetLanding;
