import { Point, PointRange, originPolar, randPoint } from "../math";
import Tree, { forEachParticle as forEach, updateTree } from "./tree";
import Particle from "./particle";
import Color from "../color";

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

export function generateWorld(numParticles: number, neighborThreshold: number): World {
  const bounds = {
    x: { min: -100, max: 100 },
    y: { min: -100, max: 100 },
  };

  const particles: Particle[] = [];
  for (let i = 0; i < numParticles; i++) {
    const particle: Particle = {
      position: randPoint(bounds),
      velocity: originPolar(),
      color: Color.RED,
    };
    particles.push(particle);
  }

  const tree: Tree = {
    particles,
    threshold: neighborThreshold,
  };

  return {
    tree,
    bounds,
  };
}
