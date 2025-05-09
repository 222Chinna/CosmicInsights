import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import "./ExoplanetOrbits3D.css";

const getOrbitalPeriod = (a) => Math.sqrt(a ** 3);

const OrbitSystem = ({ asteroid, onClick }) => {
  const a = asteroid.semi_major_axis;
  const e = asteroid.eccentricity;
  const inclination = THREE.MathUtils.degToRad(asteroid.inclination);
  const period = getOrbitalPeriod(a);
  const speed = (2 * Math.PI) / (period * 60);
  const b = a * Math.sqrt(1 - e * e);
  const radius = 0.05 + 0.015;
  const [isHovered, setIsHovered] = useState(false);

  const asteroidRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = (t * speed) % (2 * Math.PI);
    const x = a * Math.cos(angle);
    const z = b * Math.sin(angle);
    if (asteroidRef.current) {
      asteroidRef.current.position.set(x, 0, z);
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
      <mesh
        ref={asteroidRef}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setIsHovered(false);
        }}
      >
        <sphereGeometry args={[radius, 16, 16]} />
        {isHovered && (
          <Html center distanceFactor={10} position={[0, 0.2, 0]}>
            <div className="tooltip">{asteroid.name}</div>
          </Html> 
        )}
        <meshStandardMaterial color="#ffa500" />
      </mesh>
    </group>
  );
};

const AsteroidOrbits3D = ({ asteroids = [] }) => {
  const navigate = useNavigate();
  return (
    <div className="exoplanet-container">
      <div className="exoplanet-graph">
        <Canvas camera={{ position: [0, 2.5, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={1.5} />
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshBasicMaterial color="yellow" />
          </mesh>
          {asteroids.map((asteroid, index) => (
            <OrbitSystem
              key={index}
              asteroid={asteroid}
              onClick={() =>
                navigate(`/asteroid/${encodeURIComponent(asteroid.id)}`, {

                  state: { asteroid },
                })
              }
            />
          ))}
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default AsteroidOrbits3D;
