import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

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

const getOrbitalPeriod = (a) => Math.sqrt(Math.pow(a, 3));

const OrbitSystem = ({ planet }) => {
  const a = planet.pl_orbsmax;
  const period = getOrbitalPeriod(a);
  const speed = (2 * Math.PI) / (period * 60);
  const radius = 0.05 + (planet.pl_mass || 1) * 0.01;

  const planetRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = (t * speed) % (2 * Math.PI);
    const x = a * Math.cos(angle);
    const z = a * Math.sin(angle);
    if (planetRef.current) {
      planetRef.current.position.set(x, 0, z);
    }
  });

  return (
    <group>
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(
              new THREE.EllipseCurve(0, 0, a, a, 0, 2 * Math.PI).getPoints(100).flatMap(p => [p.x, 0, p.y])
            )}
            count={100}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="white" />
      </line>
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial color="cyan" />
      </mesh>
    </group>
  );
};

const SolarFlare = ({ time }) => {
  const flareRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (flareRef.current) {
      const visible = Math.abs((t % 10) - time) < 0.5;
      flareRef.current.visible = visible;
      flareRef.current.scale.setScalar(visible ? 1 : 0.01);
    }
  });

  return (
    <mesh ref={flareRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshBasicMaterial color="orange" emissive="orange" emissiveIntensity={2} />
    </mesh>
  );
};

const SolarSystemWithFlares = ({ planets }) => {
  return (
    <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={2} />

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="yellow" />
      </mesh>

      {[0, 3, 6, 9].map((flareTime, index) => (
        <SolarFlare key={index} time={flareTime} />
      ))}

      {planets.map((planet, index) => (
        <OrbitSystem key={index} planet={planet} />
      ))}

      <OrbitControls />
    </Canvas>
  );
};

export default SolarSystemWithFlares;
