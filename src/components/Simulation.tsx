import World, { generateWorld, updateWorld } from "../../src/lib/models/world";
import {
  addPolarToPoint,
  addPolars,
  clipPolar,
  multPolar,
  polarMean,
  randPolarFromMagnitude,
  wrapPoint,
} from "../../src/lib/math";

import Agent from "../../src/lib/models/agent";
import Graphics from "./Graphics";
import SimulationConfig from "../lib/configs/simulationConfig";
import { findNeighbors } from "../lib/models/population";
import { useState } from "react";

interface SimulationProps {
  running: boolean;
  setRunning: (running: boolean) => void;
}

const CONFIG: SimulationConfig = {
  numAgents: 1000,
  neighborThreshold: 5,
  treeCapacity: 4,
  timeMultiplier: 0.01,
  inertia: 0.65,
  velocityRange: { min: 2, max: 8 },
  noiseRange: { min: 0, max: 4 },
};

export default function Simulation(props: SimulationProps) {
  const [world, setWorld] = useState<World>(generateWorld(CONFIG.numAgents, CONFIG.treeCapacity));

  function onUpdate(deltaTime: number) {
    setWorld((prevWorld) => updateWorld(prevWorld, updateAgent, deltaTime));
  }

  function updateAgent(agent: Agent, world: World, deltaTime: number): Agent {
    const neighbors = findNeighbors(world.population, agent, CONFIG.neighborThreshold);
    let targetVelocity;
    if (neighbors.length > 0) {
      const neighborsVelocity = polarMean(neighbors.map((n) => n.velocity));
      const noise = randPolarFromMagnitude(CONFIG.noiseRange);
      targetVelocity = addPolars(neighborsVelocity, noise);
    } else {
      const noise = randPolarFromMagnitude(CONFIG.noiseRange);
      targetVelocity = addPolars(agent.velocity, noise);
    }
    const velocity = clipPolar(
      addPolars(multPolar(agent.velocity, CONFIG.inertia), multPolar(targetVelocity, 1 - CONFIG.inertia)),
      CONFIG.velocityRange
    );
    const position = wrapPoint(
      addPolarToPoint(agent.position, multPolar(velocity, deltaTime * CONFIG.timeMultiplier)),
      world.bounds
    );

    return {
      color: agent.color,
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
