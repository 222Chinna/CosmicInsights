import React from "react";
import { useNavigate } from "react-router-dom";
import ExoplanetOrbits3D from "../components/ExoplanetOrbits3D";
import "./ExoplanetLanding.css";

const StarLanding = () => {
  const navigate = useNavigate();

  const rawPlanets = [
    { pl_name: "Mercury", pl_orbsmax: 0.39, pl_eqt: 440, pl_orbper: 88 },
    { pl_name: "Venus", pl_orbsmax: 0.72, pl_eqt: 737, pl_orbper: 225 },
    { pl_name: "Earth", pl_orbsmax: 1.0, pl_eqt: 288, pl_orbper: 365.25 },
    { pl_name: "Mars", pl_orbsmax: 1.52, pl_eqt: 210, pl_orbper: 687 },
    { pl_name: "Jupiter", pl_orbsmax: 5.2, pl_eqt: 165, pl_orbper: 4333 },
    { pl_name: "Saturn", pl_orbsmax: 9.58, pl_eqt: 134, pl_orbper: 10759 },
    { pl_name: "Uranus", pl_orbsmax: 19.2, pl_eqt: 76, pl_orbper: 30687 },
    { pl_name: "Neptune", pl_orbsmax: 30.05, pl_eqt: 72, pl_orbper: 60190 },
  ];

  const normalizedPlanets = rawPlanets.map((p, i) => ({
    ...p,
    pl_orbsmax: p.pl_orbsmax || 1,
    pl_orbeccen: 0,
    pl_orbincl: 15,
    pl_mass: 1,
    pl_temp: p.pl_eqt || 300,
  }));

  return (
    <div className="exoplanet-landing">
      <div className="top-bar">
        <div className="top-left">
          <button className="home-button" onClick={() => navigate("/")}>
            Home
          </button>
          <button
            className="home-button"
            style={{ marginLeft: "1rem" }}
            onClick={() => navigate("/solar/compare")}
          >
            Explore Solar Systems
          </button>
        </div>
        <div className="top-center">
          <h2 style={{ color: "white" }}>Our Solar System</h2>
        </div>
      </div>

      <div className="exoplanet-wrapper">
        <div className="exoplanet-visual">
          <ExoplanetOrbits3D
            planets={normalizedPlanets}
            showGoldilocks={true}
            disableNavigation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default StarLanding;
