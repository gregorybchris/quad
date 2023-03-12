import { Point, PointRange, originPolar, randPoint } from "../math";
import Population, { forEachAgent as forEach, newPopulation, updatePopulation } from "./population";

import Agent from "./agent";
import Color from "../color";

export default interface World {
  population: Population;
  bounds: PointRange;
}

export function inWorldBounds(position: Point, world: World): boolean {
  if (position.x < world.bounds.x.min) return false;
  else if (position.x > world.bounds.x.max) return false;
  else if (position.y < world.bounds.y.min) return false;
  else if (position.y > world.bounds.y.max) return false;
  return true;
}

export function updateWorld(
  world: World,
  updateAgent: (agent: Agent, world: World, deltaTime: number) => Agent,
  deltaTime: number
): World {
  return {
    bounds: world.bounds,
    population: updatePopulation(world.population, updateAgent, world, deltaTime),
  };
}

export function forEachAgent(world: World, callback: (agent: Agent) => void): void {
  forEach(world.population, callback);
}

export function generateWorld(numAgents: number, neighborThreshold: number, treeCapacity: number): World {
  const bounds = {
    x: { min: -100, max: 100 },
    y: { min: -100, max: 100 },
  };

  const agents: Agent[] = [];
  for (let i = 0; i < numAgents; i++) {
    const agent: Agent = {
      position: randPoint(bounds),
      velocity: originPolar(),
      color: Color.RED,
    };
    agents.push(agent);
  }

  const population = newPopulation(agents, treeCapacity, bounds);

  return {
    population,
    bounds,
  };
}
