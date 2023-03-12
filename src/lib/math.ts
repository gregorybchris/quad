import random from "random";

export interface Range {
  min: number;
  max: number;
}

export interface PointRange {
  x: Range;
  y: Range;
}

export interface Point {
  x: number;
  y: number;
}

export interface PolarRange {
  r: Range;
  a: Range;
}

export interface Polar {
  r: number;
  a: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Box {
  width: number;
  height: number;
}

export function originPoint(): Point {
  return { x: 0, y: 0 };
}

export function originPolar(): Polar {
  return { r: 0, a: 0 };
}

export function polarToRect(polar: Polar): Point {
  return {
    x: polar.r * Math.cos(polar.a),
    y: polar.r * Math.sin(polar.a),
  };
}

export function rectToPolar(point: Point): Polar {
  return {
    r: Math.sqrt(point.x * point.x + point.y * point.y),
    a: Math.atan2(point.y, point.x),
  };
}

export function polarMean(polars: Polar[]): Polar {
  if (polars.length === 0) console.error("Cannot take polar mean of array of length zero");

  return rectToPolar(pointMean(polars.map(polarToRect)));
}

function mean(values: number[]): number {
  if (values.length === 0) console.error("Cannot take mean of array of length zero");

  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
  }
  return sum / values.length;
}

export function pointMean(points: Point[]): Point {
  if (points.length === 0) console.error("Cannot take point mean of array of length zero");

  return {
    x: mean(points.map((p) => p.x)),
    y: mean(points.map((p) => p.y)),
  };
}

export function addPoints(pointA: Point, pointB: Point): Point {
  return {
    x: pointA.x + pointB.x,
    y: pointA.y + pointB.y,
  };
}

export function addPolars(polarA: Polar, polarB: Polar): Polar {
  return rectToPolar(addPoints(polarToRect(polarA), polarToRect(polarB)));
}

export function addPolarToPoint(point: Point, polar: Polar): Point {
  return addPoints(point, polarToRect(polar));
}

export function addPointToPolar(polar: Polar, point: Point): Polar {
  return addPolars(polar, rectToPolar(point));
}

export function multPoint(point: Point, scaler: number): Point {
  return {
    x: point.x * scaler,
    y: point.y * scaler,
  };
}

export function multPolar(polar: Polar, scaler: number): Polar {
  return {
    r: polar.r * scaler,
    a: polar.a,
  };
}

export function clipPolar(polar: Polar, range: Range): Polar {
  return {
    r: clipValue(polar.r, range),
    a: polar.a,
  };
}

export function scaleValue(value: number, rangeA: Range, rangeB: Range): number {
  if (rangeA.max === rangeA.min) console.error("Cannot scale using range with zero width");
  return ((value - rangeA.min) / (rangeA.max - rangeA.min)) * (rangeB.max - rangeB.min) + rangeB.min;
}

export function scalePoint(point: Point, rangeA: PointRange, rangeB: PointRange): Point {
  return {
    x: scaleValue(point.x, rangeA.x, rangeB.x),
    y: scaleValue(point.y, rangeA.y, rangeB.y),
  };
}

export function randValue(range: Range): number {
  return random.float(range.min, range.max);
}

export function randPoint(range: PointRange): Point {
  return {
    x: randValue(range.x),
    y: randValue(range.y),
  };
}

export function randPolar(range: PolarRange): Polar {
  return {
    r: randValue(range.r),
    a: randValue(range.a),
  };
}

export function randPolarFromMagnitude(range: Range): Polar {
  return randPolar({
    r: range,
    a: { min: 0, max: 2 * Math.PI },
  });
}
randPolar;

export function clipValue(value: number, range: Range): number {
  if (value < range.min) return range.min;
  if (value > range.max) return range.max;
  return value;
}

export function wrapValue(value: number, range: Range): number {
  return mod(value - range.min, range.max - range.min) + range.min;
}

export function clipPoint(point: Point, range: PointRange): Point {
  return {
    x: clipValue(point.x, range.x),
    y: clipValue(point.y, range.y),
  };
}

export function wrapPoint(point: Point, range: PointRange): Point {
  return {
    x: wrapValue(point.x, range.x),
    y: wrapValue(point.y, range.y),
  };
}

export function mod(a: number, b: number) {
  return ((a % b) + b) % b;
}

export function dist(pointA: Point, pointB: Point): number {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function pointInRange(range: PointRange, point: Point): boolean {
  return point.x > range.x.min && point.x <= range.x.max && point.y > range.y.min && point.y <= range.y.max;
}
