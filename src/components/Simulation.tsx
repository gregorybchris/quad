import { useState } from "react";
import Particle from "../../src/lib/models/particle";
import World from "../../src/lib/models/world";
import {
  wrapPoint,
  randPoint,
  polarMean,
  addPolars,
  originPolar,
  multPolar,
  addPolarToPoint,
  dist,
  clipPolar,
  randPolarFromMagnitude,
} from "../../src/lib/math";
import Graphics from "./Graphics";
import { Color } from "../lib/color";

interface SimulationProps {
  running: boolean;
  setRunning: (running: boolean) => void;
}

const NUM_PARTICLES = 1000;

export default function Simulation(props: SimulationProps) {
  const [world, setWorld] = useState<World>(initWorld());

  function initWorld(): World {
    const bounds = {
      x: { min: -100, max: 100 },
      y: { min: -100, max: 100 },
    };

    const particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const particle: Particle = {
        position: randPoint(bounds),
        velocity: originPolar(),
        color: Color.RED,
      };
      particles.push(particle);
    }
    return {
      particles,
      bounds,
    };
  }

  function onUpdate(deltaTime: number) {
    setWorld((prevWorld) => ({
      ...prevWorld,
      particles: prevWorld.particles.map((p) => updateParticle(p, prevWorld, deltaTime)),
    }));
  }

  function findNeighbors(particle: Particle, world: World, threshold: number): Particle[] {
    return world.particles.filter((p) => dist(p.position, particle.position) < threshold);
  }

  function updateParticle(particle: Particle, world: World, deltaTime: number): Particle {
    const timeMultiplier = 0.01;
    const inertia = 0.65;
    const velocityRange = { min: 2, max: 8 };
    const noiseRange = { min: 0, max: 4 };
    const neighborThreshold = 5;

    const neighbors = findNeighbors(particle, world, neighborThreshold);
    const neighborsVelocity = polarMean(neighbors.map((n) => n.velocity));
    const noise = randPolarFromMagnitude(noiseRange);
    const targetVelocity = addPolars(neighborsVelocity, noise);
    const velocity = clipPolar(
      addPolars(multPolar(particle.velocity, inertia), multPolar(targetVelocity, 1 - inertia)),
      velocityRange
    );
    const position = wrapPoint(
      addPolarToPoint(particle.position, multPolar(velocity, deltaTime * timeMultiplier)),
      world.bounds
    );

    return {
      ...particle,
      position,
      velocity,
    };
  }

  return (
    <div className="flex h-full w-full flex-wrap justify-center">
      <Graphics running={props.running} onUpdate={onUpdate} world={world} />
    </div>
  );
}
