import { Point, PointRange, pointInRange } from "../math";

// Square bounding box with center and half-size
export default interface Box {
  c: Point;
  hs: number;
}

export function boxContains(box: Box, point: Point): boolean {
  return pointInRange(toPointRange(box), point);
}

export function boxIntersects(self: Box, other: Box): boolean {
  const combinedHalfSize = self.hs + other.hs;
  return Math.abs(self.c.x - other.c.x) < combinedHalfSize && Math.abs(self.c.y - other.c.y) < combinedHalfSize;
}

export function toPointRange(box: Box): PointRange {
  return {
    x: { min: box.c.x - box.hs, max: box.c.x + box.hs },
    y: { min: box.c.y - box.hs, max: box.c.y + box.hs },
  };
}

export function fromPointRange(range: PointRange): Box {
  const size = Math.max(range.x.max - range.x.min, range.y.max - range.y.min);
  const hs = size / 2;
  return {
    c: { x: range.x.min + hs, y: range.y.min + hs },
    hs: hs,
  };
}

export function fromRadius(point: Point, radius: number): Box {
  return {
    c: point,
    hs: radius,
  };
}
