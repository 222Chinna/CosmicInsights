import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ExoplanetOrbits3D from "../components/ExoplanetOrbits3D";
import "./Home.css";
import "./ExoplanetDetailsPage.css";
import AdaptiveGraph from "../components/AdaptiveGraph";

const ExoplanetDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const [planet, setPlanet] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [xAxis, setXAxis] = useState("pl_orbsmax");
  const [yAxis, setYAxis] = useState("pl_bmassj");
  const [topN, setTopN] = useState(20);

  const [selected3DPlanets, setSelected3DPlanets] = useState([]);

  const handlePlanetClick = (clickedPlanet) => {
    setSelected3DPlanets((prev) =>
      prev.find((p) => p.pl_name === clickedPlanet.pl_name)
        ? prev
        : [
            ...prev,
            {
              ...clickedPlanet,
              pl_orbsmax: Number(clickedPlanet.pl_orbsmax) || 1,
              pl_orbeccen: Number(clickedPlanet.pl_orbeccen) || 0,
              pl_orbincl: Math.floor(Math.random() * 45) + 10,
            },
          ]
    );
  };

  useEffect(() => {
    if (!params.name || !yAxis) return;

    const fetchPlanetAndSimilar = async () => {
      try {
        const query =
          xAxis && xAxis !== yAxis
            ? `?x=${xAxis}&y=${yAxis}&n=${topN}`
            : `?oned=true&y=${yAxis}&n=${topN}`;

        const res = await fetch(
          `http://localhost:3001/exoplanets/${encodeURIComponent(params.name)}${query}`
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Fetch failed: ${text}`);
        }

        const json = await res.json();
        setPlanet(json.planet);
        setGraphData(json.similar_planets || []);
        setSelected3DPlanets([]);
      } catch (e) {
        console.error("Failed to load planet or similar planets:", e);
      }
    };

    fetchPlanetAndSimilar();
  }, [params.name, xAxis, yAxis, topN]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        fetch(`http://localhost:3001/exoplanets/search/${encodeURIComponent(searchQuery)}?n=10`)
          .then((res) => res.json())
          .then((data) => setSearchResults(data))
          .catch((err) => console.error("Search error:", err));
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  if (!planet) return <div className="exoplanet-page">Loading planet...</div>;

  const normalizedMainPlanet = {
    ...planet,
    pl_orbsmax: Number(planet.pl_orbsmax ?? planet.pl_orbsma ?? 1) || 1,
    pl_orbeccen: Number(planet.pl_orbeccen ?? 0),
    pl_orbincl: Number(planet.pl_orbincl ?? 15),
    pl_mass: Number(planet.pl_bmassj ?? planet.pl_mass ?? 1),
    pl_temp: Number(planet.pl_eqt ?? planet.pl_temp ?? 300),
  };

  return (
    <div className="exoplanet-page">
      <div className="header">
        <h1 className="star-name">{planet.pl_name}</h1>
        <div className="button-group">
          <button className="home-button" onClick={() => navigate(-1)}>Back</button>
          <button className="home-button" onClick={() => navigate("/")}>Home</button>
        </div>
      </div>

      <div className="details-grid">
        <div className="planet-info">
          <p>Discovery Year: {planet.disc_year}</p>
          <p>Discovery Method: {planet.discoverymethod}</p>
          <p>Orbital Period: {planet.pl_orbper} days</p>
          <p>Orbital Distance: {planet.pl_orbsmax} AU</p>
          <p>Eccentricity: {planet.pl_orbeccen}</p>
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
            <ExoplanetOrbits3D planets={[normalizedMainPlanet, ...selected3DPlanets]} />
          </div>
        </div>

        <div className="similar-planets" style={{ position: "relative" }}>
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
                <label htmlFor="y-axis" style={{ display: "block", marginBottom: "0.5rem" }}>
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

            <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ flexGrow: 1 }}>
                <AdaptiveGraph
                  data={graphData}
                  xKey={xAxis}
                  yKey={yAxis}
                  onPlanetClick={handlePlanetClick}
                />
              </div>

              <div style={{
                marginTop: "1rem",
                alignSelf: "center",
                fontSize: "1.1rem",
                fontWeight: "500",
              }}>
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

          <div style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "0.95rem"
          }}>
            <label htmlFor="top-n">Top N:</label>
            <input
              id="top-n"
              type="number"
              value={topN}
              min={1}
              max={100}
              onChange={(e) => setTopN(Number(e.target.value))}
              style={{
                padding: "4px 8px",
                width: "60px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExoplanetDetailsPage;
