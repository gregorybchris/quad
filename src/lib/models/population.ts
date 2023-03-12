import Agent from "./agent";
import World from "./world";
import { dist } from "../math";

export default interface Population {
  threshold: number;
  agents: readonly Agent[];
}

export function findNeighbors(population: Population, agent: Agent): Agent[] {
  return population.agents.filter((p) => dist(p.position, agent.position) < population.threshold);
}

export function updatePopulation(
  population: Population,
  updateAgent: (agent: Agent, world: World, deltaTime: number) => Agent,
  prevWorld: World,
  deltaTime: number
): Population {
  return {
    threshold: population.threshold,
    agents: population.agents.map((p) => updateAgent(p, prevWorld, deltaTime)),
  };
}

export function forEachAgent(population: Population, callback: (agent: Agent) => void): void {
  population.agents.forEach(callback);
}
