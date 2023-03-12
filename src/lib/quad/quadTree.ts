import Box, { boxContains, boxIntersects } from "./box";
import { None, Optional } from "../types";

import Item from "./item";

interface Children<T> {
  nw: QuadTree<T>;
  ne: QuadTree<T>;
  sw: QuadTree<T>;
  se: QuadTree<T>;
}

export default interface QuadTree<T> {
  capacity: number;
  box: Box;
  items: Item<T>[];
  children: Optional<Children<T>>;
}

export function newQuadTree<T>(box: Box, capacity: number): QuadTree<T> {
  return {
    capacity,
    box,
    items: [],
    children: None,
  };
}

// Insert an item into a quadtree, splitting if necessary.
export function insertItem<T>(quadTree: QuadTree<T>, item: Item<T>): QuadTree<T> {
  if (!boxContains(quadTree.box, item.point)) {
    return quadTree;
  }

  if (quadTree.children === None && quadTree.items.length < quadTree.capacity) {
    return {
      ...quadTree,
      items: [...quadTree.items, item],
    };
  }

  if (quadTree.children === None) {
    quadTree = divideTree(quadTree);
  }

  if (quadTree.children === None) {
    // This should never happen
    console.error("Divide failed");
    return quadTree;
  }

  return {
    ...quadTree,
    children: {
      nw: insertItem(quadTree.children.nw, item),
      ne: insertItem(quadTree.children.ne, item),
      sw: insertItem(quadTree.children.sw, item),
      se: insertItem(quadTree.children.se, item),
    },
  };
}

// Create four children, dividing a tree into four of equal area.
export function divideTree<T>(quadTree: QuadTree<T>): QuadTree<T> {
  const capacity = quadTree.capacity;
  const x = quadTree.box.c.x;
  const y = quadTree.box.c.y;
  const hhs = quadTree.box.hs / 2;
  return {
    ...quadTree,
    children: {
      nw: newQuadTree({ c: { x: x - hhs, y: y + hhs }, hs: hhs }, capacity),
      ne: newQuadTree({ c: { x: x + hhs, y: y + hhs }, hs: hhs }, capacity),
      sw: newQuadTree({ c: { x: x - hhs, y: y - hhs }, hs: hhs }, capacity),
      se: newQuadTree({ c: { x: x + hhs, y: y - hhs }, hs: hhs }, capacity),
    },
  };
}

// Find all items contained within a given box.
export function queryTree<T>(quadTree: QuadTree<T>, box: Box): Item<T>[] {
  if (!boxIntersects(quadTree.box, box)) return [];

  const items: Item<T>[] = [];
  for (let i = 0; i < quadTree.items.length; i++) {
    if (boxContains(box, quadTree.items[i].point)) {
      items.push(quadTree.items[i]);
    }
  }

  if (quadTree.children === None) {
    return items;
  }

  items.push.apply(queryTree(quadTree.children.nw, box));
  items.push.apply(queryTree(quadTree.children.ne, box));
  items.push.apply(queryTree(quadTree.children.sw, box));
  items.push.apply(queryTree(quadTree.children.se, box));

  return items;
}
