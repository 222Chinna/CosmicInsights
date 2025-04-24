import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ExoplanetOrbits3D from "../components/ExoplanetOrbits3D";
import "./Home.css";
import "./ExoplanetDetailsPage.css";
import AdaptiveGraph from "../components/AdaptiveGraph";

const defaultPlanet = {
  pl_name: "11 Com b",
  pl_orbsmax: 1.29,
  pl_orbeccen: 0.231,
  pl_orbincl: 15,
  pl_temp: 477,
  pl_mass: 1.5,
  discovery_year: 2007,
  discoverymethod: "Radial Velocity",
  pl_orbper: 326.03,
  hostname: "11 Com",
  st_spectype: "G8 III",
  st_teff: 4742,
  st_rad: 19.0,
  st_mass: 2.7,
  st_met: -0.35,
};

const ExoplanetDetailsPage = () => {
  const graphData = [
    {
      pl_name: "24 Sex c",
      pl_orbsmax: 2.08,
      pl_bmassj: 0.86,
      pl_eqt: 273.32,
      pl_orbper: 883.0,
      st_teff: 5098.0,
      st_rad: 4.9,
      st_mass: 1.54,
      st_met: -0.03,
      st_logg: 3.5,
      sy_dist: 72.07,
    },
    {
      pl_name: "11 Com b",
      pl_orbsmax: 1.29,
      pl_bmassj: 1.5,
      pl_eqt: 477,
      pl_orbper: 326.03,
      st_teff: 4742,
      st_rad: 19.0,
      st_mass: 2.7,
      st_met: -0.35,
      st_logg: 2.31,
      sy_dist: 93.18,
    },
    {
      pl_name: "11 UMi b",
      pl_orbsmax: 1.51,
      pl_bmassj: 10.8,
      pl_eqt: 3432.4,
      st_rad: 1.7,
      sy_dist: 125.32,
    },
    {
      pl_name: "14 Her b",
      pl_orbsmax: 2.83,
      pl_bmassj: 4.85,
      pl_eqt: 1541.47,
      pl_orbper: 1766.41,
      st_teff: 5314.94,
      st_rad: 1.0,
      st_mass: 0.97,
      st_met: 0.405,
      st_logg: 4.43,
      sy_dist: 17.93,
    },
    {
      pl_name: "51 Peg b",
      pl_orbsmax: 0.052,
      pl_bmassj: 0.46,
      pl_eqt: 146.2,
      pl_orbper: 4.231,
      st_rad: 1.04,
      sy_dist: 15.46,
    },
    {
      pl_name: "55 Cnc f",
      pl_orbsmax: 0.77,
      pl_bmassj: 0.172,
      pl_eqt: 54.664,
      pl_orbper: 261.2,
      st_teff: 5250,
      st_rad: 0.96,
      st_mass: 0.9,
      st_met: 0.35,
      st_logg: 4.42,
      sy_dist: 12.58,
    },
    {
      pl_name: "61 Vir d",
      pl_orbsmax: 0.476,
      pl_bmassj: 0.072,
      pl_eqt: 22.9,
      pl_orbper: 123.01,
      st_teff: 5577,
      st_rad: 0.96,
      st_mass: 0.94,
      st_met: -0.01,
      st_logg: 4.34,
      sy_dist: 8.5,
    },
  ];

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [xAxis, setXAxis] = useState("pl_orbsmax");
  const [yAxis, setYAxis] = useState("pl_bmassj");

  // const graphData = graphData.map((p) => ({
  //   pl_name: p.pl_name,
  //   pl_orbsmax: p.pl_orbsmax,
  //   pl_bmassj: p.pl_bmassj,
  //   pl_eqt: p.pl_eqt,
  // }));

  const planet = location.state?.planet || defaultPlanet;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        // Simulated backend call
        fetch(`/api/search-planets?q=${encodeURIComponent(searchQuery)}`)
          .then((res) => res.json())
          .then((data) => setSearchResults(data))
          .catch((err) => console.error("Search error:", err));
      } else {
        setSearchResults([]);
      }
    }, 300); // debounce typing

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <div className="exoplanet-page">
      <div className="header">
        <h1 className="star-name">{planet.pl_name}</h1>
        <div className="button-group">
          <button onClick={() => navigate(-1)}>Back</button>
          <button onClick={() => navigate("/")}>Home</button>
        </div>
      </div>

      <div className="details-grid">
        <div className="planet-info">
          <p>Discovery Year: {planet.discovery_year}</p>
          <p>Discovery Method: {planet.discoverymethod}</p>
          <p>Orbital Period: {planet.pl_orbper} days</p>
          <p>Orbital Distance: {planet.pl_orbsmax} AU</p>
          <p>Eccentricity: {planet.pl_orbeccen}</p>
          <p>Inclination: {planet.pl_orbincl}°</p>
          <p>Temperature: {planet.pl_temp} K</p>
          <p>Mass: {planet.pl_mass} MJ</p>
          <p>Spectral Type: {planet.st_spectype}</p>
          <p>Stellar Temp: {planet.st_teff} K</p>
          <p>Stellar Radius: {planet.st_rad} R☉</p>
          <p>Stellar Mass: {planet.st_mass} M☉</p>
          <p>Metallicity: {planet.st_met} [Fe/H]</p>
        </div>

        <div className="orbit-visual-wrapper">
          <div className="orbit-visual">
            <ExoplanetOrbits3D planets={[planet]} />
          </div>
        </div>

        <div className="similar-planets">
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "2rem" }}
          >
            {/* Y selector column stays on the left */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                fontSize: "1.1rem",
                fontWeight: "500",
                minWidth: "180px",
              }}
            >
              <div>
                <label
                  htmlFor="y-axis"
                  style={{ display: "block", marginBottom: "0.5rem" }}
                >
                  Y:
                </label>
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
                  <option value="pl_bmassj">Mass (Jupiter)</option>
                  <option value="pl_eqt">Temperature</option>
                  <option value="pl_orbsmax">Orbital Distance</option>
                  <option value="pl_orbper">Orbital Period</option>
                  <option value="st_teff">Stellar Temperature</option>
                  <option value="st_rad">Stellar Radius</option>
                  <option value="st_mass">Stellar Mass</option>
                  <option value="st_met">Stellar Metallicity</option>
                  <option value="st_logg">Stellar Gravity</option>
                  <option value="sy_dist">System Distance</option>
                </select>
              </div>
            </div>

            {/* Graph + X selector below it */}
            <div
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <div style={{ flexGrow: 1 }}>
                <AdaptiveGraph data={graphData} xKey={xAxis} yKey={yAxis} />
              </div>

              {/* X selector goes below the graph */}
              <div
                style={{
                  marginTop: "1rem",
                  alignSelf: "center",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                }}
              >
                <label htmlFor="x-axis" style={{ marginRight: "0.5rem" }}>
                  X:
                </label>
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
                  <option value="pl_name">Planet Name</option>
                  <option value="pl_orbsmax">Orbital Distance</option>
                  <option value="pl_eqt">Temperature</option>
                  <option value="pl_orbper">Orbital Period</option>
                  <option value="st_teff">Stellar Temperature</option>
                  <option value="st_rad">Stellar Radius</option>
                  <option value="st_mass">Stellar Mass</option>
                  <option value="st_met">Stellar Metallicity</option>
                  <option value="st_logg">Stellar Gravity</option>
                  <option value="sy_dist">System Distance</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="search-box">
          <input
            type="text"
            className="search-input"
            placeholder="Search for a planet..."
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

export default ExoplanetDetailsPage;
