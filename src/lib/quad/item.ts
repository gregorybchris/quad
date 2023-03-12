import { Point } from "../math";

export default interface Item<T> {
  point: Point;
  data: T;
}
