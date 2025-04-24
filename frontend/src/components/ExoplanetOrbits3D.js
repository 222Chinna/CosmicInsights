import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./ExoplanetOrbits3D.css";

const exoplanetData = [
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
    pl_name: "24 Boo b",
    pl_orbsmax: 0.19,
    pl_orbeccen: 0.042,
    pl_orbincl: 50,
    pl_temp: 800,
    pl_mass: 0.7,
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
const getOrbitalPeriod = (a) => Math.sqrt(Math.pow(a, 3)); // in Earth years
const OrbitSystem = ({ planet, onClick }) => {
  const a = planet.pl_orbsmax;
  const e = planet.pl_orbeccen;
  const inclination = THREE.MathUtils.degToRad(planet.pl_orbincl);
  const period = getOrbitalPeriod(a);
  const speed = (2 * Math.PI) / (period * 60); // arbitrary visible speed
  const b = a * Math.sqrt(1 - e * e);
  const radius = 0.05 + planet.pl_mass * 0.02;

  const planetRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = (t * speed) % (2 * Math.PI);

    const x = a * Math.cos(angle);
    const z = b * Math.sin(angle);

    if (planetRef.current) {
      planetRef.current.position.set(x, 0, z);
    }
  });

  const curve = new THREE.EllipseCurve(0, 0, a, b, 0, 2 * Math.PI, false, 0);
  const points = curve.getPoints(100).map((p) => [p.x, 0, p.y]);

  return (
    <group rotation={[inclination, 0, 0]}>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(points.flat())}
            count={points.length}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="white" />
      </line>
      <mesh ref={planetRef} onClick={onClick}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial color="cyan" />
      </mesh>
    </group>
  );
};

const Orbit = ({ a, e, inclination }) => {
  const curve = new THREE.EllipseCurve(
    0,
    0,
    a,
    a * Math.sqrt(1 - e * e),
    0,
    2 * Math.PI,
    false,
    0
  );
  const points = curve.getPoints(100).map((p) => [p.x, 0, p.y]);

  return (
    <group>
      <line rotation={[THREE.MathUtils.degToRad(inclination), 0, 0]}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(points.flat())}
            count={points.length}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="white" />
      </line>
    </group>
  );
};

const Planet = ({
  a,
  e,
  inclination,
  radius,
  orbitalSpeed,
  color,
  onClick,
}) => {
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = (t * orbitalSpeed) % (2 * Math.PI);

    const b = a * Math.sqrt(1 - e * e);
    const x = a * Math.cos(angle);
    const z = b * Math.sin(angle);

    ref.current.position.set(x, 0, z);
    ref.current.rotation.set(THREE.MathUtils.degToRad(inclination), 0, 0);
  });

  return (
    <mesh ref={ref} onClick={onClick}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const ExoplanetOrbits3D = () => {
  const [filteredPlanets, setFilteredPlanets] = useState(exoplanetData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    pl_orbsmax: [
      Math.min(...exoplanetData.map((p) => p.pl_orbsmax)),
      Math.max(...exoplanetData.map((p) => p.pl_orbsmax)),
    ],
    pl_orbeccen: [
      Math.min(...exoplanetData.map((p) => p.pl_orbeccen)),
      Math.max(...exoplanetData.map((p) => p.pl_orbeccen)),
    ],
    pl_temp: [
      Math.min(...exoplanetData.map((p) => p.pl_temp)),
      Math.max(...exoplanetData.map((p) => p.pl_temp)),
    ],
    pl_mass: [
      Math.min(...exoplanetData.map((p) => p.pl_mass)),
      Math.max(...exoplanetData.map((p) => p.pl_mass)),
    ],
  });

  const navigate = useNavigate();

  const applyFilters = () => {
    setFilteredPlanets(
      exoplanetData.filter(
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
  };

  const handleFilterChange = (key, index, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      newFilters[key][index] = Number(value);
      return newFilters;
    });
  };

  return (
    <div>
      <div className="exoplanet-container">
        <div className="exoplanet-graph">
          <Canvas camera={{ position: [0, 2.5, 5] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 0, 0]} intensity={1.5} />
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshBasicMaterial color="yellow" />
            </mesh>
            {filteredPlanets.map((planet, index) => (
              <OrbitSystem
                key={index}
                planet={planet}
                onClick={() =>
                  navigate(`/exoplanet/${encodeURIComponent(planet.pl_name)}`)
                }
              />
            ))}
            <OrbitControls />
          </Canvas>
        </div>
      </div>
      <div className="filter-fields">
        {Object.keys(filters).map((key) => (
          <div key={key} className="filter-group">
            <label>{key.replace("pl_", "").toUpperCase()}</label>
            <input
              type="number"
              value={filters[key][0]}
              min={Math.min(...exoplanetData.map((p) => p[key]))}
              max={Math.max(...exoplanetData.map((p) => p[key]))}
              onChange={(e) => handleFilterChange(key, 0, e.target.value)}
            />
            -
            <input
              type="number"
              value={filters[key][1]}
              min={Math.min(...exoplanetData.map((p) => p[key]))}
              max={Math.max(...exoplanetData.map((p) => p[key]))}
              onChange={(e) => handleFilterChange(key, 1, e.target.value)}
            />
          </div>
        ))}
        <button onClick={applyFilters}>Apply Filters</button>
      </div>
    </div>
  );
};

export default ExoplanetOrbits3D;
