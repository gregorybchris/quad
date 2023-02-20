import { dist } from "../math";
import Particle from "./particle";
import World from "./world";

export default interface Tree {
  threshold: number;
  particles: readonly Particle[];
}

export function findNeighbors(tree: Tree, particle: Particle): Particle[] {
  return tree.particles.filter((p) => dist(p.position, particle.position) < tree.threshold);
}

export function updateTree(
  tree: Tree,
  updateParticle: (particle: Particle, world: World, deltaTime: number) => Particle,
  prevWorld: World,
  deltaTime: number
): Tree {
  return {
    threshold: tree.threshold,
    particles: tree.particles.map((p) => updateParticle(p, prevWorld, deltaTime)),
  };
}

export function forEachParticle(tree: Tree, callback: (particle: Particle) => void): void {
  tree.particles.forEach(callback);
}
