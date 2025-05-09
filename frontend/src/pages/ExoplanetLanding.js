import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import ExoplanetOrbits from "../components/ExoplanetOrbits3D";
import "./ExoplanetLanding.css";

function ExoplanetLanding() {
  const [solarSystems, setSolarSystems] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState("HD 10180");
  const [inclinationMode, setInclinationMode] = useState("same");

  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    pl_orbsmax: [0, 100],
    pl_orbeccen: [0, 1],
    pl_temp: [0, 1000],
    pl_mass: [0, 10],
  });
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

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
        const res = await fetch("http://localhost:3001/solarsystems");
        const systems = await res.json();
        setSolarSystems(systems.map((s) => s.hostname));
        if (!selectedSystem && systems.some((s) => s.hostname === "HD 10180")) {
          setSelectedSystem("HD 10180");
        }
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
          p.pl_orbsmax = Number(p.pl_orbsmax) || 1;
          p.pl_orbeccen = Number(p.pl_orbeccen) || 0;
          if (inclinationMode === "same") {
            p.pl_orbincl = 15;
          } else if (inclinationMode === "even") {
            const maxInclination = 30;
            const count = planets.length;
            p.pl_orbincl =
              count === 1
                ? 15
                : -maxInclination / 2 + (maxInclination / (count - 1)) * idx;
          } else {
            p.pl_orbincl = Math.floor(Math.random() * 360);
          }

          p.pl_mass = p.pl_bmassj || 0;
          p.pl_temp = p.pl_eqt || 0;
          return p;
        });

        setData(planets);

        setFilteredData(
          planets.filter(
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
              value={
                selectedSystem
                  ? { label: selectedSystem, value: selectedSystem }
                  : null
              }
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
            <label>
              {
                {
                  pl_orbsmax: "Orbital Distance (AU)",
                  pl_orbeccen: "Orbit Shape (Eccentricity)",
                  pl_temp: "Temperature (K)",
                  pl_mass: "Mass (Jupiters)",
                }[key]
              }
            </label>
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
          {filteredData.length > 0 && (
            <ExoplanetOrbits
              key={selectedSystem + inclinationMode + filteredData.length}
              planets={filteredData}
              showGoldilocks={inclinationMode === "same"}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ExoplanetLanding;
