import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrbitControls, Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./ExoplanetOrbits3D.css";

const getOrbitalPeriod = (a) => Math.sqrt(Math.pow(a, 3)); // in Earth years

const OrbitSystem = ({ planet, onClick }) => {
  const a = planet.pl_orbsmax;
  const e = planet.pl_orbeccen;
  const inclination = THREE.MathUtils.degToRad(planet.pl_orbincl);
  const period = getOrbitalPeriod(a);
  const speed = (2 * Math.PI) / (period * 60);
  const b = a * Math.sqrt(1 - e * e);
  const radius = 0.05 + planet.pl_mass * 0.02;
  const [isHovered, setIsHovered] = useState(false);

  const planetRef = React.useRef();

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
      <mesh
        ref={planetRef}
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
          <Html
            center
            distanceFactor={10}
            transform
            pointerEvents="none"
          > 
            <div className="tooltip">{planet.pl_name}</div>
          </Html>
        )}

        <meshStandardMaterial color="cyan" />
      </mesh>
    </group>
  );
};

const ExoplanetOrbits3D = ({ planets }) => {
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
          {planets.map((planet, index) => (
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
  );
};

export default ExoplanetOrbits3D;
