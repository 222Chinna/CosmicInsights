import React, { useEffect, useState } from "react";
import ExoplanetOrbits3D from "../components/ExoplanetOrbits3D";
import "./ExoplanetDetailsPage.css";

const interestingSystems = [
  "HD 10180",
  "Kepler-90",
  "Kepler-62",
  "TRAPPIST-1",
  "Kepler-11",
  "HD 40307",
  "Kepler-20",
  "Kepler-33",
  "Gliese 581",
  "55 Cancri",
  "GJ 667 C",
  "HD 37124",
  "HD 69830",
  "Kepler-18",
  "Kepler-9",
  "Kepler-30",
  "Kepler-31",
  "Kepler-32",
  "Kepler-37",
  "Kepler-48",
  "Kepler-444",
  "Kepler-186",
  "Kepler-24",
  "Kepler-80",
  "Kepler-154",
  "Kepler-292",
  "Kepler-296",
  "Kepler-223",
  "Kepler-102",
  "Kepler-305",
  "Kepler-106",
  "HD 21693",
  "HD 82943",
  "Gliese 876",
  "HD 31527",
  "GJ 163",
  "HD 160691",
  "HD 134606",
  "Kepler-100",
  "Kepler-444",
];

const SolarSystemComparisonPage = () => {
  const [planetMap, setPlanetMap] = useState({});
  const [leftHost, setLeftHost] = useState("");
  const [rightHost, setRightHost] = useState("");
  const [view3D, setView3D] = useState({ left: false, right: false });
  const [filters, setFilters] = useState({
    minOrbit: "",
    maxOrbit: "",
    minTemp: "",
    maxTemp: "",
    minMass: "",
    maxMass: "",
    minEcc: "",
    maxEcc: "",
    minCount: "",
  });

  useEffect(() => {
    const loadSystems = async () => {
      const map = {};
      for (const name of interestingSystems) {
        try {
          const res = await fetch(
            `http://localhost:3001/exoplanets?hostname=${name}`
          );
          const planets = await res.json();
          map[name] = planets.map((p, i) => ({
            ...p,
            hostname: p.hostname?.trim(),
            pl_orbsmax: Number(p.pl_orbsmax) || 1,
            pl_orbeccen: Number(p.pl_orbeccen) || 0,
            pl_orbincl: Number(p.pl_orbincl) || 15 + i,
            pl_mass: Number(p.pl_bmassj || p.pl_bmasse || 1),
            pl_temp: Number(p.pl_eqt || 300),
          }));
        } catch {
          map[name] = [];
        }
      }
      setPlanetMap(map);
    };

    loadSystems();
  }, []);

  const getPlanets = (hostname) => planetMap[hostname] || [];
  const leftPlanets = getPlanets(leftHost);
  const rightPlanets = getPlanets(rightHost);

  const renderPanel = (planets, hostname, side) => {
    if (!hostname)
      return <div style={{ color: "gray" }}>No system selected</div>;
    if (!planets.length)
      return (
        <div style={{ color: "gray" }}>No data available for {hostname}</div>
      );

    const avgOrbit = (
      planets.reduce((sum, p) => sum + (p.pl_orbsmax || 0), 0) / planets.length
    ).toFixed(2);
    const maxEcc = Math.max(...planets.map((p) => p.pl_orbeccen || 0)).toFixed(
      2
    );
    const avgMass = (
      planets.reduce((sum, p) => sum + (p.pl_mass || 0), 0) / planets.length
    ).toFixed(2);

    return (
      <div className="planet-info" style={{ flex: 1 }}>
        <h3 style={{ gridColumn: "span 7" }}>{hostname}</h3>
        {view3D[side] ? (
          <div style={{ gridColumn: "span 7", height: "30vh" }}>
            <ExoplanetOrbits3D planets={planets} showGoldilocks={false} />
          </div>
        ) : (
          <>
            <p>Number of Planets: {planets.length}</p>
            <p>Star Temp: {planets[0]?.st_teff || "?"} K</p>
            <p>Star Mass: {planets[0]?.st_mass || "?"} M☉</p>
            <p>Star Radius: {planets[0]?.st_rad || "?"} R☉</p>
            <p>Metallicity: {planets[0]?.st_met ?? "?"}</p>
            <p>Avg Orbit: {avgOrbit} AU</p>
            <p>Avg Planet Mass: {avgMass} MJ</p>
            <p>Max Eccentricity: {maxEcc}</p>
          </>
        )}
        <button
          onClick={() =>
            setView3D((prev) => ({ ...prev, [side]: !prev[side] }))
          }
          className="home-button"
          style={{ gridColumn: "span 7", marginTop: "1rem" }}
        >
          Toggle {view3D[side] ? "Info View" : "3D View"}
        </button>
      </div>
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredPlanets = Object.entries(planetMap)
    .flatMap(([host, planets]) => planets.map((p) => ({ ...p, system: host })))
    .filter(
      (p) =>
        (!filters.minOrbit || p.pl_orbsmax >= Number(filters.minOrbit)) &&
        (!filters.maxOrbit || p.pl_orbsmax <= Number(filters.maxOrbit)) &&
        (!filters.minTemp || p.pl_temp >= Number(filters.minTemp)) &&
        (!filters.maxTemp || p.pl_temp <= Number(filters.maxTemp)) &&
        (!filters.minMass || p.pl_mass >= Number(filters.minMass)) &&
        (!filters.maxMass || p.pl_mass <= Number(filters.maxMass)) &&
        (!filters.minEcc || p.pl_orbeccen >= Number(filters.minEcc)) &&
        (!filters.maxEcc || p.pl_orbeccen <= Number(filters.maxEcc)) &&
        (!filters.minCount ||
          planetMap[p.system]?.length >= Number(filters.minCount))
    );

  return (
    <div className="exoplanet-page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            backgroundColor: "#ddd",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Home
        </button>
        <h1 className="star-name" style={{ margin: 0 }}>
          Compare Solar Systems
        </h1>
        <div style={{ width: "80px" }} />
      </div>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1 }}>
          <label>Select Left System:</label>
          <select
            value={leftHost}
            onChange={(e) => setLeftHost(e.target.value)}
          >
            <option value="">-- Choose --</option>
            {interestingSystems.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          {renderPanel(leftPlanets, leftHost, "left")}
        </div>

        <div style={{ flex: 1, textAlign: "center", paddingTop: "3rem" }}>
          <h2 style={{ color: "white", marginBottom: "1rem" }}>Comparison</h2>
          {leftPlanets.length && rightPlanets.length ? (
            <>
              <p>
                Planet Count Difference:{" "}
                {Math.abs(leftPlanets.length - rightPlanets.length)}
              </p>
              <p>
                Avg Temp Difference:{" "}
                {Math.abs(
                  (leftPlanets[0]?.st_teff || 0) -
                    (rightPlanets[0]?.st_teff || 0)
                ).toFixed(1)}{" "}
                K
              </p>
              <p>
                Metallicity Difference:{" "}
                {Math.abs(
                  (leftPlanets[0]?.st_met || 0) - (rightPlanets[0]?.st_met || 0)
                ).toFixed(2)}
              </p>
              <p>
                Avg Mass Difference:{" "}
                {Math.abs(
                  leftPlanets.reduce((a, b) => a + b.pl_mass, 0) /
                    leftPlanets.length -
                    rightPlanets.reduce((a, b) => a + b.pl_mass, 0) /
                      rightPlanets.length
                ).toFixed(2)}{" "}
                MJ
              </p>
              <p>
                Max Eccentricity Difference:{" "}
                {Math.abs(
                  Math.max(...leftPlanets.map((p) => p.pl_orbeccen)) -
                    Math.max(...rightPlanets.map((p) => p.pl_orbeccen))
                ).toFixed(2)}
              </p>
            </>
          ) : (
            <p>Select both systems to see comparisons</p>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <label>Select Right System:</label>
          <select
            value={rightHost}
            onChange={(e) => setRightHost(e.target.value)}
          >
            <option value="">-- Choose --</option>
            {interestingSystems.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          {renderPanel(rightPlanets, rightHost, "right")}
        </div>
      </div>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          backgroundColor: "#aaa",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ textAlign: "center", color: "white" }}>
          Filter Planets
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {[
            "minOrbit",
            "maxOrbit",
            "minTemp",
            "maxTemp",
            "minMass",
            "maxMass",
            "minEcc",
            "maxEcc",
            "minCount",
          ].map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={filters[field]}
              onChange={handleFilterChange}
            />
          ))}
        </div>
        <div
          style={{
            maxHeight: "250px",
            overflowY: "scroll",
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {filteredPlanets.map((p) => (
            <div
              key={`${p.pl_name}-${p.system}`}
              style={{
                background: "#17162D",
                color: "white",
                padding: "0.5rem",
                borderRadius: "6px",
              }}
            >
              {p.pl_name} ({p.system})<br />
              AU: {p.pl_orbsmax}, Temp: {p.pl_temp}, Mass: {p.pl_mass}, Ecc:{" "}
              {p.pl_orbeccen}
              <br />
              <button onClick={() => setLeftHost(p.system)}>Set Left</button>
              <button onClick={() => setRightHost(p.system)}>Set Right</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SolarSystemComparisonPage;
