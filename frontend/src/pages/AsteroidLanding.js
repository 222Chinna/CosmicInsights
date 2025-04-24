import React from "react";
import AsteroidOrbits from "../components/AsteroidOrbits3D";
import "../App.css";
import { useNavigate } from "react-router-dom";

function AsteroidLanding() {
  const navigate = useNavigate();
  return (
    <div>
      <button className="home-button" onClick={() => navigate("/")}>Home</button>
      <AsteroidOrbits /> 
    </div>
  );
}

export default AsteroidLanding;
