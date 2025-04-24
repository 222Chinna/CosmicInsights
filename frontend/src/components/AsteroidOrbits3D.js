import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "../App.css";
import { useNavigate } from "react-router-dom";

const asteroidData = [
  { name: "Asteroid 1", semi_major_axis: 1.29, eccentricity: 0.231, inclination: 15 },
  { name: "Asteroid 2", semi_major_axis: 1.53, eccentricity: 0.08, inclination: 5 },
  { name: "Asteroid 3", semi_major_axis: 0.83, eccentricity: 0.0, inclination: 45 },
  { name: "Asteroid 4", semi_major_axis: 2.93, eccentricity: 0.37, inclination: 10 },
  { name: "Asteroid 5", semi_major_axis: 1.66, eccentricity: 0.68, inclination: 30 },
];

const AsteroidTrajectory = ({ a, e, inclination }) => {
  const curve = new THREE.EllipseCurve(
    -a * e, 0,
    a, a * Math.sqrt(1 - e * e),
    0, 2 * Math.PI,
    false,
    0
  );
  const points = curve.getPoints(100).map(p => new THREE.Vector3(p.x, 0, p.y));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  geometry.rotateX(THREE.MathUtils.degToRad(inclination));

  return (
    <line>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial attach="material" color="white" linewidth={1} />
    </line>
  );
};

const AsteroidOrbits3D = () => {
  const [filteredAsteroids, setFilteredAsteroids] = useState(asteroidData);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  return (
    <div className="exoplanet-container">
      <div className="exoplanet-graph">
        <Canvas style={{ width: '100%', height: '100%' }} camera={{ position: [0, 10, 20] }}>

          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={1.5} />
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.05, 32, 32]} />
            <meshBasicMaterial color="orange" />
          </mesh>
          {filteredAsteroids.map((asteroid, index) => (
            <AsteroidTrajectory key={index} a={asteroid.semi_major_axis} e={asteroid.eccentricity} inclination={asteroid.inclination} />
          ))}
          <OrbitControls />
        </Canvas>
      </div>
      <div className="filter-fields">
        
      </div>
    </div>
  );
};

export default AsteroidOrbits3D;
