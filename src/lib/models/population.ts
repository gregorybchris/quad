import Box, { fromPointRange, fromRadius } from "../quad/box";
import { PointRange, dist } from "../math";
import Tree, { insertItem, newTree, queryTree } from "../quad/tree";

import Agent from "./agent";
import Item from "../quad/item";
import World from "./world";

export default interface Population {
  agents: Agent[];
  tree: Tree<Agent>;
}

export function newPopulation(agents: Agent[], treeCapacity: number, bounds: PointRange): Population {
  const box = fromPointRange(bounds);
  const tree = newAgentTree(agents, box, treeCapacity);
  return {
    agents,
    tree,
  };
}

function newAgentTree(agents: Agent[], box: Box, treeCapacity: number): Tree<Agent> {
  let tree = newTree<Agent>(box, treeCapacity);
  agents.forEach((agent) => {
    const item: Item<Agent> = {
      data: agent,
      point: agent.position,
    };
    tree = insertItem(tree, item);
  });
  return tree;
}

export function findNeighbors(population: Population, agent: Agent, neighborThreshold: number): Agent[] {
  const box = fromRadius(agent.position, neighborThreshold);
  return queryTree(population.tree, box)
    .map((item) => item.data)
    .filter((p) => dist(p.position, agent.position) < neighborThreshold);
}

export function updatePopulation(
  population: Population,
  updateAgent: (agent: Agent, world: World, deltaTime: number) => Agent,
  prevWorld: World,
  deltaTime: number
): Population {
  const newAgents = population.agents.map((p) => updateAgent(p, prevWorld, deltaTime));
  return {
    agents: newAgents,
    tree: newAgentTree(newAgents, population.tree.box, population.tree.capacity),
  };
}

export function forEachAgent(population: Population, callback: (agent: Agent) => void): void {
  population.agents.forEach(callback);
}
