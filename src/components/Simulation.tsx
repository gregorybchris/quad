import { useState } from "react";
import Particle from "../../src/lib/models/particle";
import World, { generateWorld, updateWorld } from "../../src/lib/models/world";
import {
  wrapPoint,
  polarMean,
  addPolars,
  multPolar,
  addPolarToPoint,
  clipPolar,
  randPolarFromMagnitude,
} from "../../src/lib/math";
import Graphics from "./Graphics";
import { findNeighbors } from "../lib/models/tree";

interface SimulationProps {
  running: boolean;
  setRunning: (running: boolean) => void;
}

const NUM_PARTICLES = 1000;

export default function Simulation(props: SimulationProps) {
  const [world, setWorld] = useState<World>(generateWorld(NUM_PARTICLES));

  function onUpdate(deltaTime: number) {
    setWorld((prevWorld) => updateWorld(prevWorld, updateParticle, deltaTime));
  }

  function updateParticle(particle: Particle, world: World, deltaTime: number): Particle {
    const timeMultiplier = 0.01;
    const inertia = 0.65;
    const velocityRange = { min: 2, max: 8 };
    const noiseRange = { min: 0, max: 4 };

    const neighbors = findNeighbors(world.tree, particle);
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
      color: particle.color,
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
