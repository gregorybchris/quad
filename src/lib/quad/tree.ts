import Box, { boxContains, boxIntersects } from "./box";
import { None, Optional } from "../types";

import Item from "./item";

interface Children<T> {
  nw: Tree<T>;
  ne: Tree<T>;
  sw: Tree<T>;
  se: Tree<T>;
}

export default interface Tree<T> {
  size: number;
  capacity: number;
  box: Box;
  items: Item<T>[];
  children: Optional<Children<T>>;
}

export function newTree<T>(box: Box, capacity: number): Tree<T> {
  return {
    size: 0,
    capacity,
    box,
    items: [],
    children: None,
  };
}

// Insert an item into a quadtree, dividing if necessary.
export function insertItem<T>(tree: Tree<T>, item: Item<T>): Tree<T> {
  if (!boxContains(tree.box, item.point)) {
    return tree;
  }

  if (tree.children === None && tree.items.length < tree.capacity) {
    return {
      ...tree,
      size: tree.size + 1,
      items: [...tree.items, item],
    };
  }

  if (tree.children === None) {
    tree = divideTree(tree);
  }

  if (tree.children === None) {
    // This should never happen
    console.error("Divide failed");
    return tree;
  }

  return {
    ...tree,
    size: tree.size + 1,
    children: {
      nw: insertItem(tree.children.nw, item),
      ne: insertItem(tree.children.ne, item),
      sw: insertItem(tree.children.sw, item),
      se: insertItem(tree.children.se, item),
    },
  };
}

// Create four children, dividing a tree into four of equal area.
export function divideTree<T>(tree: Tree<T>): Tree<T> {
  const capacity = tree.capacity;
  const x = tree.box.c.x;
  const y = tree.box.c.y;
  const hhs = tree.box.hs / 2;
  return {
    ...tree,
    children: {
      nw: newTree({ c: { x: x - hhs, y: y + hhs }, hs: hhs }, capacity),
      ne: newTree({ c: { x: x + hhs, y: y + hhs }, hs: hhs }, capacity),
      sw: newTree({ c: { x: x - hhs, y: y - hhs }, hs: hhs }, capacity),
      se: newTree({ c: { x: x + hhs, y: y - hhs }, hs: hhs }, capacity),
    },
  };
}

// Find all items contained within a given box.
export function queryTree<T>(tree: Tree<T>, box: Box): Item<T>[] {
  if (!boxIntersects(tree.box, box)) {
    return [];
  }

  const items: Item<T>[] = [];
  for (let i = 0; i < tree.items.length; i++) {
    if (boxContains(box, tree.items[i].point)) {
      items.push(tree.items[i]);
    }
  }

  if (tree.children === None) {
    return items;
  }

  Array.prototype.push.apply(items, queryTree(tree.children.nw, box));
  Array.prototype.push.apply(items, queryTree(tree.children.ne, box));
  Array.prototype.push.apply(items, queryTree(tree.children.sw, box));
  Array.prototype.push.apply(items, queryTree(tree.children.se, box));

  return items;
}
