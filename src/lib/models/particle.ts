import { Color } from "../color";
import { Point, Polar } from "../math";

export default interface Particle {
  position: Point;
  velocity: Polar;
  color: Color;
}
