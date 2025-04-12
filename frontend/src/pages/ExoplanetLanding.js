import React from "react";
import ExoplanetOrbits from "../components/ExoplanetOrbits3D";
import "../App.css";
import { useNavigate } from "react-router-dom";

function ExoplanetLanding() {
  const navigate = useNavigate();
  return (
    <div>
      <button className="home-button" onClick={() => navigate("/")}>Home</button>
      <ExoplanetOrbits /> 
    </div>
  );
}

export default ExoplanetLanding;
