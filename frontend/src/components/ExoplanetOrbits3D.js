import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrbitControls, Html } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./ExoplanetOrbits3D.css";
const getOrbitalPeriod = (a) => Math.sqrt(Math.pow(a, 3));
const getGoldilocksColor = (planet) => {
  const st_rad = Number(planet.st_rad) || 1;
  const st_teff = Number(planet.st_teff) || 5778;
  const distance = Number(planet.pl_orbsmax) || 1;

  const L = Math.pow(st_rad, 2) * Math.pow(st_teff / 5778, 4);
  const inner = Math.sqrt(L / 1.1);
  const outer = Math.sqrt(L / 0.53);

  let score = 0;
  if (distance < inner) {
    score = (inner - distance) / inner;
  } else if (distance > outer) {
    score = (distance - outer) / outer;
  } else {
    score = 0;
  }

  const clamped = Math.min(1, Math.max(0, score));
  const r = Math.round(255 * clamped);
  const g = Math.round(255 * (1 - clamped));
  return `rgb(${r},${g},0)`;
};

const OrbitSystem = ({ planet, onClick }) => {
  const a = planet.pl_orbsmax;
  const e = planet.pl_orbeccen;
  const inclination = THREE.MathUtils.degToRad(planet.pl_orbincl);
  const period = getOrbitalPeriod(a);
  const speed = (2 * Math.PI) / (period * 60);
  const b = a * Math.sqrt(1 - e * e);
  const radius = 0.05 + (planet.pl_mass || 1) * 0.02;
  const [isHovered, setIsHovered] = useState(false);

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
        <sphereGeometry args={[radius * 0.5, 16, 16]} />
        {isHovered && (
          <Html center distanceFactor={10} transform pointerEvents="none">
            <div className="tooltip">{planet.pl_name}</div>
          </Html>
        )}
        <meshStandardMaterial color={getGoldilocksColor(planet)} />
      </mesh>
    </group>
  );
};

const GoldilocksZone = ({ star }) => {
  const st_rad = Number(star.st_rad) || 1;
  const st_teff = Number(star.st_teff) || 5778;

  const L = Math.pow(st_rad, 2) * Math.pow(st_teff / 5778, 4);
  const inner = Math.sqrt(L / 1.1);
  const outer = Math.sqrt(L / 0.53);

  const segments = 128;
  const geometry = new THREE.RingGeometry(inner, outer, segments);
  const material = new THREE.MeshBasicMaterial({
    color: "green",
    opacity: 0.25,
    transparent: true,
    side: THREE.DoubleSide,
  });

  return <mesh rotation={[105/180 * Math.PI, 0, 0]} geometry={geometry} material={material} />;
};

const ExoplanetOrbits3D = ({ planets, showGoldilocks = false, disableNavigation = false }) => {
  const navigate = useNavigate();

  return (
    <div className="exoplanet-container">
      <div className="exoplanet-graph">
        <Canvas camera={{ position: [0, 2.5, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={1.5} />

          {/* Sun */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.025, 32, 32]} />
            <meshBasicMaterial color="yellow" />
          </mesh>

          {/* 🌿 Optional Goldilocks zone */}
          {showGoldilocks && planets.length > 0 && (
            <GoldilocksZone star={planets[0]} />
          )}

          {/* Planet systems */}
          {planets.map((planet, index) => (
            <OrbitSystem
              key={index}
              planet={planet}
              onClick={
                disableNavigation
                  ? undefined
                  : () => navigate(`/exoplanet/${encodeURIComponent(planet.pl_name)}`)
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
