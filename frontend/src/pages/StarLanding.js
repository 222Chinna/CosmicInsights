import React from "react";
import SolarSystemWithFlares from "../components/SolarSystemWithFlares";
function StarLanding() {
  const solarSystemPlanets = [
    {
      pl_name: "Mercury",
      pl_orbsmax: 0.39,
      pl_eqt: 440,
      pl_orbper: 88,
      st_teff: 5778,
      st_rad: 1.0,
      st_mass: 1.0,
      st_met: 0.0,
      st_logg: 4.44,
      sy_dist: 0.0,
    },
    {
      pl_name: "Venus",
      pl_orbsmax: 0.72,
      pl_eqt: 737,
      pl_orbper: 225,
      st_teff: 5778,
      st_rad: 1.0,
      st_mass: 1.0,
      st_met: 0.0,
      st_logg: 4.44,
      sy_dist: 0.0,
    },
    {
      pl_name: "Earth",
      pl_orbsmax: 1.0,
      pl_eqt: 288,
      pl_orbper: 365.25,
      st_teff: 5778,
      st_rad: 1.0,
      st_mass: 1.0,
      st_met: 0.0,
      st_logg: 4.44,
      sy_dist: 0.0,
    },
    {
      pl_name: "Mars",
      pl_orbsmax: 1.52,
      pl_eqt: 210,
      pl_orbper: 687,
      st_teff: 5778,
      st_rad: 1.0,
      st_mass: 1.0,
      st_met: 0.0,
      st_logg: 4.44,
      sy_dist: 0.0,
    },
    {
      pl_name: "Jupiter",
      pl_orbsmax: 5.2,
      pl_eqt: 165,
      pl_orbper: 4333,
      st_teff: 5778,
      st_rad: 1.0,
      st_mass: 1.0,
      st_met: 0.0,
      st_logg: 4.44,
      sy_dist: 0.0,
    },
    {
      pl_name: "Saturn",
      pl_orbsmax: 9.58,
      pl_eqt: 134,
      pl_orbper: 10759,
      st_teff: 5778,
      st_rad: 1.0,
      st_mass: 1.0,
      st_met: 0.0,
      st_logg: 4.44,
      sy_dist: 0.0,
    },
    {
      pl_name: "Uranus",
      pl_orbsmax: 19.2,
      pl_eqt: 76,
      pl_orbper: 30687,
      st_teff: 5778,
      st_rad: 1.0,
      st_mass: 1.0,
      st_met: 0.0,
      st_logg: 4.44,
      sy_dist: 0.0,
    },
    {
      pl_name: "Neptune",
      pl_orbsmax: 30.05,
      pl_eqt: 72,
      pl_orbper: 60190,
      st_teff: 5778,
      st_rad: 1.0,
      st_mass: 1.0,
      st_met: 0.0,
      st_logg: 4.44,
      sy_dist: 0.0,
    },
  ];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Stars</h1>
      <SolarSystemWithFlares></SolarSystemWithFlares>
    </div>
  );
}

export default StarLanding;
