import { Point, Polar } from "../math";

import Color from "../color";

export default interface Agent {
  position: Point;
  velocity: Polar;
  color: Color;
}
