import { Point, PointRange } from "../math";
import Tree, { forEachParticle as forEach, updateTree } from "../tree";
import Particle from "./particle";

export default interface World {
  tree: Tree;
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
  updateParticle: (particle: Particle, world: World, deltaTime: number) => Particle,
  deltaTime: number
): World {
  return {
    bounds: world.bounds,
    tree: updateTree(world.tree, updateParticle, world, deltaTime),
  };
}

export function forEachParticle(world: World, callback: (particle: Particle) => void): void {
  forEach(world.tree, callback);
}
