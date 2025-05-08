import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AdaptiveGraph from "../components/AdaptiveGraph";
import AsteroidOrbits3D from "../components/AsteroidOrbits3D";
import "./ExoplanetDetailsPage.css"; // reused for styling

const AsteroidDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const [asteroid, setAsteroid] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [xAxis, setXAxis] = useState("semi_major_axis");
  const [yAxis, setYAxis] = useState("eccentricity");
  const [similarCount, setSimilarCount] = useState(20);
  const [selected3D, setSelected3D] = useState([]);

  const handleAsteroidClick = (clickedAsteroid) => {
    setSelected3D((prev) =>
      prev.find((p) => p.full_name === clickedAsteroid.full_name)
        ? prev
        : [...prev, { ...clickedAsteroid }]
    );
  };

  useEffect(() => {
    if (!params.id || !yAxis) return;

    const fetchAsteroidAndSimilar = async () => {
      try {
        const query = `?x=${xAxis}&y=${yAxis}&n=${similarCount}`;

        const res = await fetch(
          `http://localhost:3001/asteroids/${encodeURIComponent(
            params.id
          )}${query}`
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Fetch failed: ${text}`);
        }

        const json = await res.json();
        setAsteroid(json.asteroid);

        // ✅ Normalize for graph rendering
        setGraphData(
          (json.similar_asteroids || []).map((a) => ({
            ...a,
            eccentricity: Number(a.eccentricity) || 0,
            semi_major_axis: Number(a.semi_major_axis) || 0,
            inclination: Number(a.inclination) || 0,
            epoch_osculation: a.epoch_osculation
              ? new Date(a.epoch_osculation).getTime()
              : 0,
          }))
        );

        setSelected3D([]);
      } catch (e) {
        console.error("Failed to load asteroid or similar asteroids:", e);
      }
    };

    fetchAsteroidAndSimilar();
  }, [params.id, xAxis, yAxis, similarCount]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        fetch(
          `http://localhost:3001/asteroids/search/${encodeURIComponent(
            searchQuery
          )}?n=10`
        )
          .then((res) => res.json())
          .then((data) => setSearchResults(data))
          .catch((err) => console.error("Search error:", err));
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  if (!asteroid)
    return <div className="exoplanet-page">Loading asteroid...</div>;

  return (
    <div className="exoplanet-page">
      <div className="header">
        <h1 className="star-name">{asteroid.full_name}</h1>
        <div className="button-group">
          <button className="home-button" onClick={() => navigate(-1)}>
            Back
          </button>
          <button className="home-button" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </div>

      <div className="details-grid">
        <div className="planet-info">
          <p>Orbit Shape (Eccentricity): {asteroid.eccentricity?.toFixed(4)}</p>
          <p>Orbital Distance (AU): {asteroid.semi_major_axis?.toFixed(4)}</p>
          <p>Inclination (°): {asteroid.inclination?.toFixed(2)}</p>
          <p>Orbital Period (days): {asteroid.orbital_period?.toFixed(2)}</p>
          <p>Orbital Speed (°/day): {asteroid.mean_motion?.toFixed(4)}</p>
          <p>
            Closest Distance to Sun (AU):{" "}
            {asteroid.perihelion_distance?.toFixed(4)}
          </p>
          <p>
            Farthest Distance from Sun (AU):{" "}
            {asteroid.aphelion_distance?.toFixed(4)}
          </p>
          <p>Epoch (Reference Date): {asteroid.epoch_osculation}</p>
        </div>

        <div className="orbit-visual-wrapper">
          <div className="orbit-visual">
            <AsteroidOrbits3D asteroids={[asteroid, ...selected3D]} />
          </div>
        </div>

        <div className="similar-planets">
          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "2rem" }}
          >
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
                  <option value="eccentricity">Eccentricity</option>
                  <option value="inclination">Inclination</option>
                  <option value="semi_major_axis">Semi-Major Axis</option>
                </select>
              </div>
              <div>
                <label htmlFor="similar-count"># Similar:</label>
                <input
                  type="number"
                  id="similar-count"
                  value={similarCount}
                  onChange={(e) => setSimilarCount(e.target.value)}
                  min={1}
                  max={50}
                  style={{
                    width: "100%",
                    padding: "0.4rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>

            <div
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <div style={{ flexGrow: 1 }}>
                <AdaptiveGraph
                  data={graphData}
                  xKey={xAxis}
                  yKey={yAxis}
                  onPlanetClick={handleAsteroidClick}
                />
              </div>

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
                  <option value="eccentricity">Eccentricity</option>
                  <option value="inclination">Inclination</option>
                  <option value="semi_major_axis">Semi-Major Axis</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsteroidDetailsPage;
